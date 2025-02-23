import { todosModel } from "../../models/todo.js";

const todoMutations = {
  addTodo: async (_, { todo }, context) => {
    try {
      if (!context.user) {
        throw new Error("Authentication required");
      }


      if (todo.title.length < 3 || todo.title.length > 16) {
        throw new Error("Title must be between 3 and 16 characters");
      }

      if (todo.status && !["TODO", "IN_PROGRESS", "DONE"].includes(todo.status)) {
        throw new Error("Invalid status value");

      }

      const newTodo = await todosModel.create({
        ...todo,
        userId: context.user.id,
        time: new Date(),
      });

      return newTodo;
    } catch (err) {
      console.error("Add todo error:", err);
      throw new Error("Failed to add todo: " + err.message);
    }
  },

  updateTodo: async (_, { id, updates }, context) => {
    try {
      if (!context.user) {
        throw new Error("Authentication required");
      }

      const existingTodo = await todosModel.findById(id);
      if (!existingTodo) {
        throw new Error("Todo not found");
      }

    
      if (context.user.id !== existingTodo.userId.toString() && context.role !== "admin") {
        throw new Error("Unauthorized to update this todo");
      }


      if (updates.title && (updates.title.length < 3 || updates.title.length > 16)) {
        throw new Error("Title must be between 3 and 16 characters");
      }

    
      if (updates.status && !["TODO", "IN_PROGRESS", "DONE"].includes(updates.status)) {
        throw new Error("Invalid status value");
      }

      const updatedTodo = await todosModel.findByIdAndUpdate(
        id,
        { ...updates, time: new Date() },
        { new: true }
      );

      return updatedTodo;
    } catch (err) {
      console.error("Update todo error:", err);
      throw new Error("Failed to update todo: " + err.message);
    }
  },

  deleteTodo: async (_, { id }, context) => {
    try {
      if (!context.user) {
        throw new Error("Authentication required");
      }

      const todo = await todosModel.findById(id);
      if (!todo) {
        throw new Error("Todo not found");
      }

      if (context.user.id !== todo.userId.toString() && context.role !== "admin") {
        throw new Error("Unauthorized to delete this todo");
      }

      await todosModel.findByIdAndDelete(id);
      return "Todo deleted successfully";
    } catch (err) {
      console.error("Delete todo error:", err);
      throw new Error("Failed to delete todo: " + err.message);
    }
  },
};



export { todoMutations};