const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const {buildSchema} = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserModel = require('./models/user');
const PostModel = require('./models/post');

const app = express();
app.use(bodyParser.json());

const user = (userId) => {
    return UserModel.findById(userId).then(userDoc => {
        return {
            ...userDoc._doc,
            _id: userDoc.id,
            password: null,
            publishedPosts: posts.bind(this, userDoc._doc.publishedPosts)
        }
    }).catch(err => {
        throw err
    })
} 

const posts = postIds => {
    return PostModel.find({_id: {$in: postIds}}).then(postDocs => {
        return postDocs.map(postDoc => {
            return {
                ...postDoc._doc,
                _id: postDoc.id,
                createdAt: new Date(postDoc._doc.createdAt).toISOString(),
                creator: user.bind(this, postDoc._doc.creator)
            }
        })
    }).catch(err => {
        throw err
    })
}

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type User {
            _id: ID!
            name: String
            age: Int
            password: String
            username: String!
            publishedPosts: [Post!]
        }
        input UserInput {
            name: String!
            age: Int!
            username: String!
            password: String!
        }

        type Post {
            _id: ID!
            text: String!
            createdAt: String!
            creator: User!
        }
        input PostInput {
            text: String!
            creator: ID!
        }

        type RootQuery {
            users: [User!]
            posts: [Post!]
        }

        type RootMutation {
            createUser(data: UserInput!): User
            publishPost(data: PostInput!): Post
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
                        ...userDoc._doc,
                        _id: userDoc.id,
                        password: null,
                        publishedPosts: posts.bind(this, userDoc._doc.publishedPosts)
                    }
                })
            }).catch(err => {
                throw err;
            })
        },
        posts: () => {
            return PostModel.find().then(postDocs => {
                return postDocs.map(postDoc => {
                    return {
                        ...postDoc._doc,
                        _id: postDoc.id,
                        createdAt: new Date(postDoc._doc.createdAt).toISOString(),
                        creator: user.bind(this, postDoc._doc.creator)
                    }
                })
            }).catch(err => {
                throw err;
            })
        },
        createUser: (args) => {
            return UserModel.findOne({username: args.data.username}).then(user => {
                if(user) {
                    throw new Error("User exists already!")
                }
                return bcrypt.hash(args.data.password, 12)
            }).then(hashedPassword => {
                const newUser = new UserModel({
                    name: args.data.name,
                    age: args.data.age,
                    password: hashedPassword,
                    username: args.data.username
                });

                return newUser.save()
            }).then(result => {
                return {
                    ...result._doc,
                    password: null,
                    _id: result.id,
                    publishedPosts: posts.bind(this, result._doc.publishedPosts)
                };
            }).catch(err => {
                throw err
            })
        },
        publishPost: (args) => {
            var now = new Date();
            const newPost =  new PostModel({
                text: args.data.text,
                createdAt: now,
                creator: args.data.creator,
            });
            var publishedPost;
            return newPost.save().then(result => {
                publishedPost = {
                    ...result._doc, 
                    _id: result.id,
                    createdAt: now.toISOString(),
                    creator: user.bind(this, result._doc.creator)
                }
                return UserModel.findById(args.data.creator)
            }).then(user => {
                if(!user) {
                    throw new Error('User not found!')
                }
                user.publishedPosts.push(newPost);
                return user.save()
            }).then(result => {
                return publishedPost
            }).catch(err => {
                throw err
            })
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
