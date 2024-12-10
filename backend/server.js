import express from "express";
import {ApolloServer} from "apollo-server-express";
import {typeDefs} from "./graphql/typeDefs.js";
import resolvers from "./graphql/resolvers.js";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db/dbConnection.js";
import userRoutes from "./routes/userRoutes.js";
import characterRoutes from "./routes/characterRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import authMiddleware from "./graphql/authMiddleware.js";
import spellRoutes from "./routes/spellRoutes.js";
import { populateSpells } from "./db/spellSeeder.js";
import { populateSkills } from "./db/skillSeeder.js";
import skillRoutes from "./routes/skillRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({

  origin: ["https://fullstack-project-1-yz4i.onrender.com" , "https://fullstack-project-psi.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

  credentials: true,
}));
app.use(express.json());

app.options("*", cors());
connectDB(); 

populateSpells();
populateSkills();
 
app.use("/api/users", userRoutes);
app.use("/api/characters", characterRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/campaigns", sessionRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/spells', spellRoutes);
app.use('/api/skills', skillRoutes);

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const auth = authMiddleware(req);
      return { ...auth };
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}${server.graphqlPath}`);
  });
} 

startServer();