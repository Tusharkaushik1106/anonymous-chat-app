import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
 

export async function POST(request: Request){
    await dbConnect()

    try {
        const {username , email , password}=await request.json()
        const existingUserVerifiedByUsername= await userModel.findOne({
            username,
            isVerified:true
        })
        if (existingUserVerifiedByUsername) {
            return Response.json({
                success:false,
                message :"username already taken"
            },{status:400})

        }

        const existingUserByEmail = await userModel.findOne({email})
        const verifyCode = Math.floor(100000+Math.random()*900000).toString()

        if (existingUserByEmail) {
            if(existingUserByEmail.isVerified){
                return Response.json({
                success:false,
                message:"User already exist with this email"
                } ,{status:400})
            }else{
                const hashedPassword = await bcrypt.hash(password,10)
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode= verifyCode;
                existingUserByEmail.verifyCodeExpiry= new Date(Date.now()+3600000)

                await existingUserByEmail.save()
            }
        }else{
            const hashedPassword=await bcrypt.hash(password,10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours()+1)

            const newUser = new userModel({
                username,
                email,                
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                message:[]
                
            })
            
            await newUser.save()

        }

        // send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if (!emailResponse.success) {
            return Response.json({
                success:false,
                message:"Username already taken"
            },{status:500})
            
        }

        return Response.json({
                success:true,
                message:"Username Registered successfully and please verify your email "
            },{status:201})


    } catch (error) {
        console.error("error registering user",error)
        return Response.json({
            success: false,
            message: "Error registering the user"},
            {
                status: 500
            }
        )
    }
}