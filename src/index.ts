import { ApolloServer } from 'apollo-server';
import {
  DateTimeMock,
  EmailAddressMock,
  PhoneNumberMock,
  CurrencyMock,
  PositiveIntMock,
} from 'graphql-scalars';

import { getUserFromToken } from './auth';
import { Authentication } from './directives';
import { environment } from './environment';
import { resolvers } from './resolvers';
import typeDefs from './type-defs';

import scheduleFactory from './scheduler';
scheduleFactory().start();

const server = new ApolloServer({
  resolvers,
  typeDefs,
  schemaDirectives: {
    authentication: Authentication,
  },
  async context({ req }) {
    const token = req.headers.authorization;
    const user = await getUserFromToken(token);
    return { user };
  },
  introspection: environment.apollo.introspection,
  playground: environment.apollo.playground,
});

server
  .listen(environment.port)
  .then(({ url }) => console.log(`Server ready at ${url}.`));
