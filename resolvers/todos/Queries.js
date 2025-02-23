import { todosModel } from "../../models/todo.js";

const todoQueries = {
  getAllTodos: async (_, args, context) => {
    try {
      if (!context.user) throw new Error("Authentication required");
      return await todosModel.find({ userId: context.user.id });
    } catch (err) {
      console.error("Get all todos error:", err);
      throw new Error("Failed to fetch todos: " + err.message);
    }
  },

  getTodo: async (_, { id }, context) => {
    try {
      if (!context.user) throw new Error("Authentication required");
      
      const todo = await todosModel.findById(id);
      if (!todo) throw new Error("Todo not found");
      
      if (context.user.id !== todo.userId.toString() && context.role !== "admin") {
        throw new Error("Unauthorized to view this todo");
      }
      
      return todo;
    } catch (err) {
      console.error("Get todo error:", err);
      throw new Error("Failed to fetch todo: " + err.message);
    }
  },
};

export { todoQueries };