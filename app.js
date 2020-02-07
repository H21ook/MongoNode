const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const {buildSchema} = require('graphql');
const mongoose = require('mongoose');
const UserModel = require('./models/user');

const app = express();
app.use(bodyParser.json());

//My array database
const users = [];


app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type User {
            _id: ID!
            name: String
            age: Int
        }
        input UserInput {
            name: String!
            age: Int!
        }

        type Post {
            _id: ID!
            text: String!
            createdAt: String!
            authorID: ID!
        }

        type RootQuery {
            users: [User!]
        }

        type RootMutation {
            createUser(data: UserInput!): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }`
    ),
    rootValue: {
        users: () => {
            return UserModel.find().then(userDocs => {
                return userDocs.map(userDoc => {
                    return {
                        ...userDoc._doc
                    }
                })
            }).catch(err => {
                throw err;
            })
            return users
        },
        createUser: (args) => {
            var newUser =  new UserModel({
                name: args.data.name,
                age: args.data.age
            })
            newUser.save().then(result => {
                return {
                    ...result._doc
                };
            }).catch(err => {
                throw err;
            });
            return newUser
        }
    },
    graphiql: true
}))

mongoose.connect(`mongodb+srv://${
    process.env.MONGO_USER
}:${
    process.env.MONGO_PASSWORD
}@cluster0-espuo.mongodb.net/${
    process.env.MONGO_DB
}?retryWrites=true&w=majority`).then(() => {
    app.listen(3003);
})
