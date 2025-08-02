import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import {User} from 'next-auth'
import mongoose from "mongoose";

export async function GET(request:Request) {

    await dbConnect()
    
        const sessions = await getServerSession(authOptions)
        const user: User  = sessions?.user
    
    
         if(!sessions|| !sessions.user){
            return Response.json({
                    success:false,
                    message: "Not Authenticated"
                }, {status:500})
         }

         const userId = new mongoose.Types.ObjectId(user._id);

         try {
            const user = await userModel.aggregate([
                { $match :{id:userId}},
                {$unwind: '$messages'},
                {$sort: {'messages.createdAt': -1}},
                {$group: {_id: '$_id', messages: {$push: '$messages '}}}
            ])
            if (!user || user.length === 0) {
                return Response.json({
                success:false,
                message: "user not found"
            }, {status:500})
            }return Response.json({
                success:true,
                messages: user[0].messages
            }, {status:500})
         } catch (error) {
            console.log("An Unexpected error occoured");
            
            return Response.json({
                success:false,
                message: "not authenticated"
            }, {status:500})
         }   
}