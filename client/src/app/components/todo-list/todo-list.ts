import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
})
export class TodoList {
  todoService = inject(TodoService);

  ngOnInit() {
    this.todoService.fetchTodos();
  }

  completedCount = computed(() => 
    this.todoService.todos().filter(t => t.completed).length
  );

  newTodoTitle = '';
  addTodo() {
    if (this.newTodoTitle.trim()) {
      this.todoService.createTodo(this.newTodoTitle.trim());
      this.newTodoTitle = '';
    }
  }

  toggleTodo(id: string) {
    this.todoService.toggleTodo(id);
  }

  deleteTodo(id: string) {
    this.todoService.deleteTodo(id);
  }

  editingId = signal<string | null>(null);
  startEdit(todo: Todo) {
    this.editingId.set(todo.id);
  }

  saveEdit(id: string, event: Event) {
    const input = event.target as HTMLInputElement;
    const newTitle = input.value.trim();
    
    if (newTitle) {
      this.todoService.updateTodo(id, newTitle);
    }
    this.cancelEdit();
  }

  cancelEdit() {
    this.editingId.set(null);
  }
}
