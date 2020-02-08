const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQLInputObjectType
} = require('graphql');

const { publishedPosts } = require('../resolvers/postResolvers');
const { creator } = require('../resolvers/userResolvers');

module.exports.UserType = new GraphQLObjectType({
    name: 'User',
    description: 'Хэрэглэгч',
    fields: () => ({
        _id: {type: GraphQLNonNull(GraphQLID)},
        name: {type: GraphQLNonNull(GraphQLString)},
        username: {type: GraphQLNonNull(GraphQLString)},
        age: {type: GraphQLInt},
        publishedPosts: {
            type: GraphQLList(this.PostType),
            resolve: publishedPosts
        }
    })
})

module.exports.PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'Нийтлэл',
    fields: () => ({
        _id: {type: GraphQLNonNull(GraphQLID)},
        text: {type: GraphQLNonNull(GraphQLString)},
        creator: {
            type: this.UserType,
            resolve: creator
        },
        createdAt: {type: GraphQLNonNull(GraphQLString)}
    })
});

module.exports.InputUserType = new GraphQLInputObjectType({
    name: 'InputUser',
    description: 'Хэрэглэгч үүсгэх model',
    fields: () => ({
        name: {type: GraphQLNonNull(GraphQLString)},
        age: {type: GraphQLNonNull(GraphQLInt)},
        username: {type: GraphQLNonNull(GraphQLString)},
        password: {type: GraphQLNonNull(GraphQLString)}
    })
});

module.exports.InputPostType = new GraphQLInputObjectType({
    name: 'InputPost',
    description: 'Нийтлэл үүсгэх model',
    fields: () => ({
        text: {type: GraphQLNonNull(GraphQLString)},
        creator: {type: GraphQLNonNull(GraphQLID)}
    })
});