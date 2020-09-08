const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const debugStartup = require("debug")("startup");

const schema = require("./schema");

// Init the express server
const app = express();
const PORT = process.env.PORT || 4000;

// Setup GraphQL Route on Express Server
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

// Listen on the specified port for HTTP traffic
app.listen(PORT, () => {
  debugStartup(`Server is running on port: ${PORT}`);
});
