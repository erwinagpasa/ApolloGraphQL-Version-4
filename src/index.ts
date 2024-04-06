import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import allResolvers from './resolvers/index.js';
import allTypeDefs from './typedefs/index.js';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
// import context from './context'



dotenv.config();

const server = new ApolloServer({
  typeDefs: allTypeDefs,
  resolvers: allResolvers,
  introspection: true
});


startStandaloneServer(server, {
  listen: { port: 4000 },
  // context: context,
})
  .then(({ url }) => {
    console.log(`🚀  Server ready at: ${url}`);

    const AppDataSource = new DataSource({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
    });

    AppDataSource.initialize()
      .then(() => {
        console.log('Data Source has been initialized!');
      })
      .catch((err) => {
        console.error('Error during Data Source initialization', err);
      });

  })
  .catch((error) => {
    console.error('Error starting server:', error);
  });


