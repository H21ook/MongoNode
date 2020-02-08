const { posts } = require('./../resolvers/postResolvers');
const { GraphQLList } = require('graphql');
const { PostType } = require('./../types/types');

module.exports = {
    posts: {
        type:  new GraphQLList(PostType),
        description: "Бүх нийтлэлийн жагсаалт",
        resolve: posts
    }
}