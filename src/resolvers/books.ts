
const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
  {
    title: 'erwin agpasa',
    author: 'aha!',
  },
];

const booksResolvers = {
  Query: {
    books: () => books,
  }
};

export default booksResolvers;