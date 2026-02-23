// client/src/app/services/todo.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, tap } from 'rxjs/operators';
import { Todo } from '../models/todo.model';
import { GET_TODOS } from '../graphql/queries';
import { CREATE_TODO, TOGGLE_TODO, DELETE_TODO, UPDATE_TODO } from '../graphql/mutations';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private apollo = inject(Apollo);
  
  // Signal for todos
  todos = signal<Todo[]>([]);
  
  // Loading state
  loading = signal<boolean>(false);
  
  // Error state
  error = signal<string | null>(null);

  fetchTodos() {
    this.loading.set(true);
    this.error.set(null);
    
    this.apollo.watchQuery<{ todos: Todo[] }>({
      query: GET_TODOS,
    }).valueChanges.pipe(
      map(result => (result.data?.todos ?? []) as Todo[]),
      tap({
        next: (todos) => {
          this.todos.set(todos as Todo[]);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.message);
          this.loading.set(false);
        }
      })
    ).subscribe();
  }

  createTodo(title: string) {
    this.apollo.mutate<{ createTodo: Todo }>({
      mutation: CREATE_TODO,
      variables: { title },
    }).pipe(
      map(result => result.data?.createTodo)
    ).subscribe(newTodo => {
      if (newTodo) {
        this.todos.update(todos => [...todos, newTodo]);
      }
    });
  }

  toggleTodo(id: string) {
    // Optimistic update - update UI immediately
    this.todos.update(todos => 
      todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );

    this.apollo.mutate<{ toggleTodo: Todo }>({
      mutation: TOGGLE_TODO,
      variables: { id },
    }).subscribe({
      error: () => {
        // Rollback on error
        this.todos.update(todos => 
          todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
        );
      }
    });
  }

  deleteTodo(id: string) {
    this.apollo.mutate<{ deleteTodo: boolean }>({
      mutation: DELETE_TODO,
      variables: { id },
    }).subscribe(result => {
      if (result.data?.deleteTodo) {
        this.todos.update(todos => todos.filter(t => t.id !== id));
      }
    });
  }

  updateTodo(id: string, title: string) {
    const previousTodos = this.todos();
    
    // Optimistic update
    this.todos.update(todos => 
      todos.map(t => t.id === id ? { ...t, title } : t)
    );

    this.apollo.mutate<{ updateTodo: Todo }>({
      mutation: UPDATE_TODO,
      variables: { id, title },
    }).subscribe({
      error: () => {
        // Rollback on error
        this.todos.set(previousTodos);
      }
    });
  }
}