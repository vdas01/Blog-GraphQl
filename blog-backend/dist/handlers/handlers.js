"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const schema_1 = require("../schema/schema");
const User_1 = __importDefault(require("../models/User"));
const Blog_1 = __importDefault(require("../models/Blog"));
const Comment_1 = __importDefault(require("../models/Comment"));
const mongoose_1 = require("mongoose");
const bcryptjs_1 = require("bcryptjs");
//to define fields:-
//for schema:- define as callback
//for query structure define as object
const RootQuery = new graphql_1.GraphQLObjectType({
    name: "RootQuery",
    fields: {
        //get all users
        users: {
            type: new graphql_1.GraphQLList(schema_1.UserType),
            async resolve() {
                return await User_1.default.find();
            }
        },
        //get all blogs
        blogs: {
            type: new graphql_1.GraphQLList(schema_1.BlogType),
            async resolve() {
                return await Blog_1.default.find();
            }
        },
        //get all comments
        comments: {
            type: new graphql_1.GraphQLList(schema_1.CommentType),
            async resolve() {
                return await Comment_1.default.find();
            }
        }
    }
});
const mutations = new graphql_1.GraphQLObjectType({
    name: "mutations",
    fields: {
        //user signup
        signup: {
            type: schema_1.UserType,
            args: {
                name: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                email: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                password: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) }
            },
            async resolve(parent, { name, email, password }) {
                let existingUser;
                try {
                    existingUser = await User_1.default.findOne({ email });
                    if (existingUser)
                        return new Error("User already exists");
                    const encryptedPassword = (0, bcryptjs_1.hashSync)(password);
                    const user = new User_1.default({ name, email, password: encryptedPassword });
                    return await user.save();
                }
                catch (err) {
                    return new Error("Signup failed");
                }
            }
        },
        //user login
        login: {
            type: schema_1.UserType,
            args: {
                email: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                password: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            },
            async resolve(parent, { email, password }) {
                let existingUser;
                try {
                    existingUser = await User_1.default.findOne({ email });
                    if (!existingUser)
                        return new Error("No user found");
                    const comparedPassword = (0, bcryptjs_1.compareSync)(password, 
                    //to ignore type check
                    // @ts-ignore
                    existingUser.password);
                    if (!comparedPassword)
                        return new Error("Invalid Credentials");
                    return existingUser;
                }
                catch (err) {
                    return new Error(err);
                }
            }
        },
        //create blog
        addBlog: {
            type: schema_1.BlogType,
            args: {
                title: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                content: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                date: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                user: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) }
            },
            async resolve(parent, { title, content, date, user }) {
                let blog;
                const session = await (0, mongoose_1.startSession)();
                try {
                    //in one single session we have to do all. session is like time
                    session.startTransaction({ session });
                    blog = new Blog_1.default({ title, content, date, user });
                    const existingUser = await User_1.default.findById(user);
                    if (!existingUser)
                        return new Error("User not found");
                    existingUser.blogs.push(blog);
                    await existingUser.save({ session });
                    return await blog.save({ session });
                }
                catch (err) {
                    return new Error(err);
                }
                finally {
                    await session.commitTransaction();
                }
            }
        },
        //update blog
        updateBlog: {
            type: schema_1.BlogType,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                title: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                content: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) }
            },
            async resolve(parent, { id, title, content }) {
                let existingBlog;
                try {
                    existingBlog = await Blog_1.default.findById(id);
                    if (!existingBlog)
                        return new Error("Blog doesn't exist");
                    return await Blog_1.default.findByIdAndUpdate(id, {
                        title,
                        content
                    }, { new: true });
                }
                catch (err) {
                    return new Error(err);
                }
            }
        },
        //delete blog
        deleteBlog: {
            type: schema_1.BlogType,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) }
            },
            async resolve(parent, { id }) {
                let existingBlog;
                const session = await (0, mongoose_1.startSession)();
                try {
                    session.startTransaction();
                    // @ts-ignore
                    existingBlog = await Blog_1.default.findById(id).populate('user');
                    // @ts-ignore
                    const existingUser = existingBlog?.user;
                    if (!existingUser)
                        return new Error("No user found on this blog");
                    if (!existingBlog)
                        return new Error("No Blog Found");
                    existingUser.blogs.pull(existingBlog);
                    await existingUser.save({ session });
                    return await existingBlog.deleteOne({ id: existingBlog.id });
                }
                catch (err) {
                    return new Error(err);
                }
                finally {
                    session.commitTransaction();
                }
            }
        },
        //add comment
        addCommentToBlog: {
            type: schema_1.CommentType,
            args: {
                blog: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                user: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                text: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                date: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) }
            },
            async resolve(parent, { user, blog, text, date }) {
                const session = await (0, mongoose_1.startSession)();
                let comment;
                try {
                    session.startTransaction({ session });
                    const existingUser = await User_1.default.findById(user);
                    const existingBlog = await Blog_1.default.findById(blog);
                    if (!existingBlog || !existingUser)
                        return new Error("User or Blog does not exist");
                    comment = new Comment_1.default({ text, date, blog, user });
                    existingUser.comments.push(comment);
                    existingBlog.comments.push(comment);
                    await existingBlog.save({ session });
                    await existingUser.save({ session });
                    return await comment.save({ session });
                }
                catch (err) {
                    return new Error(err);
                }
                finally {
                    await session.commitTransaction();
                }
            }
        },
        //delete Comment
        deleteComment: {
            type: schema_1.CommentType,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) }
            },
            async resolve(parent, { id }) {
                let comment;
                const session = await (0, mongoose_1.startSession)();
                try {
                    session.startTransaction();
                    comment = await Comment_1.default.findById(id);
                    if (!comment)
                        return new Error("No comment found");
                    //@ts-ignore
                    const existingUser = await User_1.default.findById(comment?.user);
                    if (!existingUser)
                        return new Error("No user with this comment found");
                    //@ts-ignore
                    const existingBlog = await Blog_1.default.findById(comment?.blog);
                    if (!existingBlog)
                        return new Error("No blog with this comment found");
                    existingUser.comments.pull(comment);
                    existingBlog.comments.pull(comment);
                    await existingUser.save({ session });
                    await existingBlog.save({ session });
                    return await comment.deleteOne({ id: comment.id });
                }
                catch (err) {
                    return new Error(err);
                }
                finally {
                    await session.commitTransaction();
                }
            }
        }
    }
});
exports.default = new graphql_1.GraphQLSchema({ query: RootQuery, mutation: mutations });
//# sourceMappingURL=handlers.js.map