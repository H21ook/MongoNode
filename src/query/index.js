const UserQuery = require('./userQuery');
const postQuery = require('./postQuery');

module.exports = {
    ...postQuery,
    ...UserQuery
}