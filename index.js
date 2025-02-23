import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import schema from "./schema.js";
import mongoose from "mongoose";
import resolvers from "./resolvers/index.js";
import jwt from "jsonwebtoken";
import "dotenv/config";


mongoose
  .connect("mongodb://127.0.0.1:27017/todoslist-iti")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const server = new ApolloServer({
  typeDefs: schema, 
  resolvers: resolvers, 
  formatError: (err) => {
    return { message: err.message };
  },
});

const port = 3001;

startStandaloneServer(server, {
  listen: { port },
  context: ({ req }) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return { user: null };
    } else {
      try {
        const decoded = jwt.verify(authorization, process.env.SECRET);
        return { user: decoded }; 
      } catch (err) {
        throw new Error("Invalid token");
      }
    }
  },
})
  .then(() => {
    console.log(`Server ready at ${port}`);
  })
  .catch((err) => {
    console.log(err);
  });
