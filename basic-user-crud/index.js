const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLSchema } = require('graphql');

const app = express();

let usersList = [
    {id:"1",name:"Vishal",email:"vdas5307@gmail.com"},
    {id:"2", name:"Ajay",email:"aj12@gmail.com"},
    {id:"3",name:"Sub",email:"sub@gmail.com"}
]

const UserType = new GraphQLObjectType({
    //everytime name should be unique and of usertype
    name:"UserType",
    fields:()=>({
        id: {type: GraphQLID},
        name:{type: GraphQLString},
        email: {type:GraphQLString}
    }),
})

const RootQuery = new GraphQLObjectType({
    name:"RootQuery",
    fields:{
        //to get all users
        users: {
            type:new GraphQLList(UserType),
             //function which resolves the query or send you data
             // resolve(parent,args){}
              resolve(){
                   return usersList;
               }
           },
        //to get single user by id
        user:{
           type: UserType,
           args: {id: {type: GraphQLID}},
           resolve(parent,args){
               return usersList.find((user)=> user.id === args.id)
           },

        }
    }
})

const mutations = new GraphQLObjectType({
    name:"mutations",
    fields: {
        //adding user
        addUser :{
             type: UserType,
             args:{name: {type: GraphQLString}, email:{type: GraphQLString}},
             resolve(parent,{name,email}){
                const newUser = {name,email,id: Date.now().toString()};
                usersList.push(newUser);
                return newUser;
             }
        },
        //update user
        updateUser: {
            type: UserType,
            args: {id: {type:GraphQLID}, email:{type:GraphQLString},name:{type:GraphQLString}},
            resolve(parent,{id,name,email}){
                const user = usersList.find((u) => u.id === id);
                user.email = email;
                user.name = name;
                return user;
            }
        },
        //delete user
        deleteUser: {
            type: UserType,
            args: {id: {type:GraphQLID}},
            resolve(parent,{id}){
                const user = usersList.find((u) => u.id === id);
                usersList = usersList.filter((u)=> u.id !== id);
                return user;
            }
        },
    }
})

const schema = new GraphQLSchema({ query: RootQuery,mutation: mutations})

app.use('/graphql',graphqlHTTP({schema,graphiql:true}))




app.listen(5000,()=>{
    console.log("Server Running");
})