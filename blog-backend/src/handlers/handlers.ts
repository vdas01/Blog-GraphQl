import {GraphQLObjectType,GraphQLList,GraphQLSchema,GraphQLNonNull,GraphQLString,GraphQLID} from "graphql";
import { BlogType, CommentType, UserType } from "../schema/schema";
import User from "../models/User";
import Blog from "../models/Blog";
import Comment from "../models/Comment";
import { Document, startSession } from "mongoose";
import { compareSync, hashSync } from "bcryptjs";



//to define fields:-
//for schema:- define as callback
//for query structure define as object
const RootQuery = new GraphQLObjectType({
    name:"RootQuery",
    fields:{
         //get all users
         users:{
            type: new GraphQLList(UserType),
            async resolve(){
                return await User.find();
            }
         },
         //get all blogs
         blogs:{
            type: new GraphQLList(BlogType),
            async resolve(){
                return await Blog.find();
            }
         },
       //get all comments
       comments:{
        type: new GraphQLList(CommentType),
        async resolve(){
            return await Comment.find();
        }
       }
    }
})

const mutations = new GraphQLObjectType({
    name:"mutations",
    fields:{
        //user signup
        signup:{
            type: UserType,
            args:{
                name:{type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
                password: {type: new GraphQLNonNull(GraphQLString)}
            },
            async resolve(parent,{name,email,password}){
                let existingUser : Document<any,any,any>;
                try{
                      existingUser = await User.findOne({email});
                      if(existingUser)
                      return new Error("User already exists");
                      const encryptedPassword = hashSync(password);
                      const user = new User({name,email,password:encryptedPassword});
                      return await user.save()
                }
                catch(err){
                        return new Error("Signup failed");

                }
            }
        },

        //user login
        login:{
            type: UserType,
            args:{
                email:{type: new GraphQLNonNull(GraphQLString)},
                password:{type:new GraphQLNonNull(GraphQLString)},
            },
            async resolve(parent,{email,password}){
                 let existingUser : Document<any,any,any>;
                 try{
                       existingUser = await User.findOne({email});
                       if(!existingUser)
                       return new Error("No user found");
                       const comparedPassword = compareSync(password, 
                        //to ignore type check
                        // @ts-ignore
                        existingUser.password)

                        if(!comparedPassword)
                        return new Error("Invalid Credentials")

                        return existingUser;
                 }
                 catch(err){
                        return new Error(err);
                 }
            }
        },
        //create blog
        addBlog:{
            type:BlogType,
            args:{
                title:{type:new GraphQLNonNull(GraphQLString)},
                content:{type: new GraphQLNonNull(GraphQLString)},
                date:{type: new GraphQLNonNull(GraphQLString)},
                user: {type:new GraphQLNonNull(GraphQLID)}
            },
            async resolve(parent,{title,content,date,user}){
                let blog: Document<any,any,any>;
                const session =await startSession();
                try{
                    //in one single session we have to do all. session is like time
                    session.startTransaction({session});
                       blog = new Blog({title,content,date,user})
                       const existingUser = await User.findById(user);
                       if(!existingUser)
                       return new Error("User not found");
                      
                       existingUser.blogs.push(blog);
                        await existingUser.save({session})
                       return  await blog.save({session});
                }
                catch(err){
                    return new Error(err);
                }
                finally{
                    await session.commitTransaction();
                }
            }
        },

        //update blog
        updateBlog:{
            type:BlogType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLID)},
                title:{type: new GraphQLNonNull(GraphQLString)},
                content:{type: new GraphQLNonNull(GraphQLString)}
            },
            async resolve(parent,{id,title,content}){
                    let existingBlog: Document<any,any,any>;
                    try{
                        existingBlog = await Blog.findById(id);
                        if(!existingBlog)
                        return new Error("Blog doesn't exist");
                        return await Blog.findByIdAndUpdate(id,{
                            title,
                            content
                        },{new:true});
                    }
                    catch(err){
                        return new Error(err);
                    }
            }
        },

        //delete blog
        deleteBlog:{
            type:BlogType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLID)}
            },
            async resolve(parent,{id}){
                let existingBlog: Document<any,any,any>
                const session = await startSession();
                try{
                    session.startTransaction();
                    // @ts-ignore
                    existingBlog =await Blog.findById(id).populate('user');
                    // @ts-ignore
                    const existingUser = existingBlog?.user;
                    if(!existingUser)
                    return new Error("No user found on this blog")
                    if(!existingBlog)
                    return new Error("No Blog Found");

                    existingUser.blogs.pull(existingBlog);
                    await existingUser.save({session})
                    return await existingBlog.deleteOne({ id: existingBlog.id });
                }
                catch(err){
                    return new Error(err);
                }
                finally {
                    session.commitTransaction();
                  }
            }
        },

        //add comment
        addCommentToBlog: {
            type: CommentType,
            args:{
                blog:{type:new GraphQLNonNull(GraphQLID)},
                user:{type: new GraphQLNonNull(GraphQLID)},
                text:{type:new GraphQLNonNull(GraphQLString)},
                date:{type: new GraphQLNonNull(GraphQLString)}
            },
            async resolve(parent,{user,blog,text,date}){
                const session = await startSession();
                let comment: Document<any,any,any>;
                try{
                      session.startTransaction({session})
                      const existingUser = await User.findById(user);
                      const existingBlog =await Blog.findById(blog);
                      if(!existingBlog || !existingUser)
                      return new Error("User or Blog does not exist");

                      comment = new Comment({text,date,blog,user});
                      existingUser.comments.push(comment)
                      existingBlog.comments.push(comment)
                      await existingBlog.save({session})
                      await existingUser.save({session})
                      return await comment.save({ session });
                }
                catch(err){
                    return new Error(err);
                }
                finally{
                    await session.commitTransaction();
                }
            }
        },

        //delete Comment
        deleteComment:{
            type:CommentType,
            args:{
                id: {type:new GraphQLNonNull(GraphQLID)}
            },
            async resolve(parent,{id}){
                let comment: Document<any,any,any>;
                const session = await startSession();
                try{
                       session.startTransaction();
                       comment = await Comment.findById(id);
                       if(!comment)
                       return new Error("No comment found");
                       //@ts-ignore
                       const existingUser = await User.findById(comment?.user)
                       if(!existingUser)
                       return new Error("No user with this comment found")
                        //@ts-ignore
                       const existingBlog = await Blog.findById(comment?.blog);
                       if(!existingBlog)
                       return new Error("No blog with this comment found");

                       existingUser.comments.pull(comment);
                       existingBlog.comments.pull(comment);
                       await existingUser.save({session})
                       await existingBlog.save({session})
                       return await comment.deleteOne({ id: comment.id });
                }
                catch(err){
                    return new Error(err);
                }
                finally{
                    await session.commitTransaction();
                }
            }
        }

    }
})


export default new GraphQLSchema({query:RootQuery,mutation:mutations})