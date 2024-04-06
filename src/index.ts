import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { DataSource } from 'typeorm';
import http from 'http';
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';

// Import GraphQL schema, resolvers, and models
import allTypeDefs from './typedefs/index.js';
import allResolvers from './resolvers/index.js';
import allEntities from './models/index.js';

dotenv.config(); // Load environment variables from .env file

// Define the context interface
interface MyContext {
  token?: string;
}

// Create an Express app
const app = express();
const httpServer = http.createServer(app);

// Create an Apollo Server instance
const server = new ApolloServer<MyContext>({
  typeDefs: allTypeDefs,
  resolvers: allResolvers,
  introspection: true, // Enable introspection for GraphQL Playground
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })], // Enable graceful shutdown
});

// Function to start the server
async function startServer() {
  try {
    // Start the Apollo Server
    await server.start();

    // Initialize data source
    const AppDataSource = new DataSource({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: allEntities,
      synchronize: true, // Synchronize schema with database
    });

    // Initialize data source
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');

    // Setup middleware for Apollo Server
    app.use(
      '/graphql',
      cors(), // Enable CORS
      express.json(), // Parse JSON bodies
      expressMiddleware(server, {
        context: async ({ req }) => ({ token: req.headers.token }), // Set context with token from request header
      }),
    );

    // Start the HTTP server
    await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));

    app.use((req: any, res: any) => {
      res.send("🚀 Server ready at http://localhost:4000/graphql")
    })
    console.log(`🚀 Server ready at http://localhost:4000/graphql`);

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1); // Exit with error code 1
  }
}

// Call the function to start the server
startServer();
