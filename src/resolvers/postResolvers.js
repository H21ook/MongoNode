const PostModel = require('./../../models/post');
const UserModel = require('./../../models/user');

module.exports.posts = () => {
    return PostModel.find().then(postDocs => {
        return postDocs.map(postDoc => {
            return {
                ...postDoc._doc,
                _id: postDoc.id,
                createdAt: new Date(postDoc._doc.createdAt).toISOString()
            }
        })
    }).catch(err => {
        throw err;
    })
}

module.exports.publishedPosts = (user) => {
    return PostModel.find({_id: {$in: user.publishedPosts}}).then(postDocs => {
        return postDocs.map(postDoc => {
            return {
                ...postDoc._doc,
                _id: postDoc.id,
                createdAt: new Date(postDoc._doc.createdAt).toISOString()
            }
        })
    }).catch(err => {
        throw err
    })
}

module.exports.publishPost = (parent, args) => {
    var now = new Date();
    const newPost =  new PostModel({
        text: args.data.text,
        createdAt: now,
        creator: args.data.creator,
    });
    var publishedPost;
    var creatorUser;
    return UserModel.findById(args.data.creator).then(user => {
        if(!user) {
            throw new Error('User not found!')
        }
        
        creatorUser = user;
        return newPost.save()
    }).then(result => {
        publishedPost = {
            ...result._doc, 
            _id: result.id,
            createdAt: now.toISOString()
        }
        creatorUser.publishedPosts.push(newPost);
        return creatorUser.save()
    }).then(() => {
        return publishedPost
    }).catch(err => {
        throw err
    })
}