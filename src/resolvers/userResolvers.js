const UserModel = require('./../../models/user');
const bcrypt = require('bcrypt');

module.exports.users = () => {
    return UserModel.find().then(userDocs => {
        return userDocs.map(userDoc => {
            return {
                ...userDoc._doc,
                _id: userDoc.id
            }
        })
    }).catch(err => {
        throw err;
    })
}

module.exports.creator = (post) => {
    return UserModel.findById(post.creator).then(userDoc => {
        return {
            ...userDoc._doc,
            _id: userDoc.id
        }
    }).catch(err => {
        throw err
    })
}

module.exports.createUser = (parent, args) => {
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
            _id: result.id
        };
    }).catch(err => {
        throw err
    })
}