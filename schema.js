const axios = require("axios");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require("graphql");

// Debug Data For Development
// const customers = [
//   { id: "1", name: "John", email: "j@test.com", age: 35 },
//   { id: "2", name: "Bill", email: "b@test.com", age: 34 },
//   { id: "3", name: "Steve", email: "s@test.com", age: 33 },
//   { id: "4", name: "Frank", email: "f@test.com", age: 32 },
// ];

// Customer Type
const CustomerType = new GraphQLObjectType({
  name: "Customer",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLString },
      },
      resolve: async function (parentValue, args) {
        const { id } = args;
        const { data } = await axios.get(
          `http://localhost:3000/customers/${id}`
        );
        return data;
      },
    },
    customers: {
      type: GraphQLList(CustomerType),
      resolve: async function (parentValue, args) {
        const { data } = await axios.get(`http://localhost:3000/customers`);
        return data;
      },
    },
  },
});

// Mutations
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // Post Functionality
    addCustomer: {
      type: CustomerType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: async function (parentValue, args) {
        const { name, email, age } = args;
        const { data } = await axios.post("http://localhost:3000/customers", {
          name,
          email,
          age,
        });

        return data;
      },
    },
    // Delete Functionality
    deleteCustomer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parentValue, args) => {
        const { id } = args;
        const { data } = await axios.delete(
          `http://localhost:3000/customers/${id}`
        );
        return data;
      },
    },
    // Patch Functionality
    editCustomer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve: async (parentValue, args) => {
        const { id } = args;
        const { data } = await axios.patch(
          `http://localhost:3000/customers/${id}`,
          args
        );
        return data;
      },
    },
  },
});

// Export the Schema Module
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
