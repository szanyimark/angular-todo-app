// server/src/resolvers.ts
import { db } from './db';
import { todos } from './db/schema';
import { eq, asc, desc } from 'drizzle-orm';

const resolvers = {
  Query: {
    todos: async () => {
      return await db.select().from(todos).orderBy(
        asc(todos.completed),
        desc(todos.completedAt),
        asc(todos.createdAt),
      );
    },
  },

  Mutation: {
    createTodo: async (_: any, { input }: { input: { title: string } }) => {
      const [newTodo] = await db.insert(todos).values({
        title: input.title,
        completed: false,
      }).returning();
      return newTodo;
    },

    updateTodo: async (_: any, { input }: { input: { id: string; title?: string; completed?: boolean } }) => {
      const updateData: any = { updatedAt: new Date() };
      if (input.title !== undefined) updateData.title = input.title;
      if (input.completed !== undefined) {
        updateData.completed = input.completed;
        updateData.completedAt = input.completed ? new Date() : null;
      }

      const [updatedTodo] = await db.update(todos)
        .set(updateData)
        .where(eq(todos.id, input.id))
        .returning();
      return updatedTodo;
    },

    deleteTodo: async (_: any, { id }: { id: string }) => {
      await db.delete(todos).where(eq(todos.id, id));
      return true;
    },

    toggleTodo: async (_: any, { id }: { id: string }) => {
      const [currentTodo] = await db.select().from(todos).where(eq(todos.id, id));
      if (!currentTodo) throw new Error('Todo not found');

      const newCompleted = !currentTodo.completed;
      const [updatedTodo] = await db.update(todos)
        .set({
          completed: newCompleted,
          completedAt: newCompleted ? new Date() : null,
          updatedAt: new Date()
        })
        .where(eq(todos.id, id))
        .returning();
      
      return updatedTodo;
    },
  },
};

export default resolvers;