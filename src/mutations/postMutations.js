const { publishPost } = require("../resolvers/postResolvers");
const { InputPostType, PostType } = require("../types/types");

module.exports = {
    publishPost: {
        type: PostType,
        description: 'Нийтлэл хийх үйлдэл',
        args: {
            data: {type: InputPostType}
        },
        resolve: publishPost
    }
}