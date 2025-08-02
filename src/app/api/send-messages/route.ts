import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { Message } from "@/model/User";


export async function POST(request:Request) {
    await dbConnect()

    const {username, content} = await request.json()
    try {
      const user =   await userModel.findOne({username})
      if(!user){
        return Response.json({
                success:false,
                message: "User not found"
            }, {status:500})
      }

      if(!user.isAcceptingMessage){
        return Response.json({
                success:false,
                message: "User is not accepting messages"
            }, {status:500})
      }

      const newMessage = {content, createdAt:new Date()}
      user.message.push(newMessage as Message)
      await user.save()


      return Response.json({
                success:true,
                message: "message sent successfully"
            }, {status:500})
    } catch (error) {
        console.log("Adding new Messages ", error);
            
            return Response.json({
                success:false,
                message: "Internal Server Error"
            }, {status:404})
    }
}
