const express = require("express");
const { graphqlHTTP } = require("express-graphql");
require("dotenv").config();

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { buildSchema } = require("graphql");

const app = express();
app.use(bodyParser.json());

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
  })
);
mongoose
  .connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(8000, (req, res) => {
      console.log("Server listening on port 8000");
    });
  })
  .catch((err) => console.log(err));
