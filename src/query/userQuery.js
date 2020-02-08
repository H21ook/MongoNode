const { users } = require('./../resolvers/userResolvers');
const { GraphQLList } = require('graphql');
const { UserType } = require('./../types/types');

module.exports = {
    users: {
        type: new GraphQLList(UserType),
        description: "Бүх хэрэглэгчийн жагсаалт",
        resolve: users
    }
}