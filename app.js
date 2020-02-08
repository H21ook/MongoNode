const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

//GraphQLDataTypes
const {
    GraphQLSchema,
    GraphQLObjectType
} = require('graphql');

//Mutations
const Mutuations = require('./src/mutations/index');
//Query
const Query = require('./src/query/index');

const app = express();
app.use(bodyParser.json());

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Үндсэн query',
    fields: Query
});

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Үндсэн mutation',
    fields: () => (Mutuations)
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

app.use('/', graphqlHttp({
    schema: schema,
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${
    process.env.MONGO_USER
}:${
    process.env.MONGO_PASSWORD
}@cluster0-espuo.mongodb.net/${
    process.env.MONGO_DB
}?retryWrites=true&w=majority`).then(() => {
    app.listen(3003);
})
