import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";

const retryLink = new RetryLink({
  attempts: (count, operation, error) => {
    console.log(`Retry attempt #${count} for ${operation.operationName}`);
    return !!error && count < 3; // Retries 3 times
  },
  delay: (count: number) => Math.pow(2, count) * 1000, //Retries after 2, 4, 8 seconds
});

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT,
});

const client = new ApolloClient({
  link: ApolloLink.from([retryLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
