import express from "express";
import {ApolloServer} from "apollo-server-express";
import {typeDefs} from "./graphql/typeDefs.js";
import {resolvers} from "./graphql/resolvers.js";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db/dbConnection.js";
import userRoutes from "./routes/userRoutes.js";
import characterRoutes from "./routes/characterRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/characters", characterRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/campaigns", sessionRoutes);

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  server.applyMiddleware({ app });

  app.get("/api", (req, res) => {
    res.send({ message: "Hello from the backend!" });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();