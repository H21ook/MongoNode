const PostMutations = require('./postMutations');
const UserMutations = require('./userMutations');

module.exports = {
    ...PostMutations,
    ...UserMutations
}