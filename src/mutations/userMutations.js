const { createUser } = require("../resolvers/userResolvers");
const { UserType, InputUserType} = require("../types/types");

module.exports = {
    createUser: {
        type: UserType,
        description: 'Хэрэглэгч үүсгэх үйлдэл',
        args: {
            data: {type: InputUserType}
        },
        resolve: createUser
    }
}

