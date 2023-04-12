const { GraphQLString} = require('graphql')
const { User } = require('../models')

const bcrypt = require('bcrypt')
const { createJWT } = require('../util/auth')



const register = {
    type: GraphQLString,
    args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString }
           },
    async resolve(parent, args){
        const checkUser = await User.findOne({ email: args.email }).exec();
        if (checkUser){
            throw new Error('User with email already exists')
        }
        const { username, email, password } = args;
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({ username, email, password: passwordHash });

        await user.save();

        const token = createJWT(user);

        return token
    }
}

const login = {
    type: GraphQLString,
    args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString }
           },
    async resolve(parent, args){
        const checkPass = await User.findOne({ passowrd: args.password }).exec();
        if (checkPass){
            throw new Error('Password is incorrect')
        }
        const { username, email, password } = args;
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({ username, email, password: passwordHash });

        await user.login();

        const token = createJWT(user);

        return token
    }
}

//export the object created
module.exports = {
    register,
    login
}

