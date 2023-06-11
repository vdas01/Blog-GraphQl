import {connect} from "mongoose";


export const connectToDatabase = async()=>{
    try{
          await connect(process.env.MONGO);
          console.log("Connected to database");
    }
    catch(err){
        // console.log(err);
        throw new Error(err);
    }
}