// server/src/resolvers.ts
interface Todo {
  id: string;
  title: string;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
}

// In-memory database for demo app
let todos: Todo[] = [
  { id: '1', title: 'Learn Angular', completed: true, completedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: '2', title: 'Learn GraphQL', completed: false, completedAt: null, createdAt: new Date().toISOString() },
  { id: '3', title: 'Build Todo App', completed: false, completedAt: null, createdAt: new Date().toISOString() },
];

let idCounter = 4;

const resolvers = {
  Query: {
    todos: () => todos,
  },

  Mutation: {
    createTodo: (_: any, { input }: { input: { title: string } }) => {
      const newTodo: Todo = {
        id: String(idCounter++),
        title: input.title,
        completed: false,
        completedAt: null,
        createdAt: new Date().toISOString(),
      };
      todos.push(newTodo);
      return newTodo;
    },

    updateTodo: (_: any, { input }: { input: { id: string; title?: string; completed?: boolean } }) => {
      const todo = todos.find(t => t.id === input.id);
      if (!todo) throw new Error('Todo not found');
      
      if (input.title !== undefined) todo.title = input.title;
      if (input.completed !== undefined) {
        todo.completed = input.completed;
        todo.completedAt = input.completed ? new Date().toISOString() : null;
      }
      
      return todo;
    },

    deleteTodo: (_: any, { id }: { id: string }) => {
      const index = todos.findIndex(t => t.id === id);
      if (index === -1) return false;
      
      todos.splice(index, 1);
      return true;
    },

    toggleTodo: (_: any, { id }: { id: string }) => {
      const todo = todos.find(t => t.id === id);
      if (!todo) throw new Error('Todo not found');
      
      todo.completed = !todo.completed;
      todo.completedAt = todo.completed ? new Date().toISOString() : null;
      return todo;
    },
  },
};

export default resolvers;