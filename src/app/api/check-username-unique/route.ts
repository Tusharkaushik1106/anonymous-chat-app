import dbConnect from "@/lib/dbConnect";
import { z} from "zod"
import userModel from "@/model/User";
import { usernameValidation } from "@/schemas/signupSchema";

const UsernameQuerySchema = z.object({
    username:usernameValidation
})

export async function GET(request : Request) {
    await dbConnect()

    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username:searchParams.get("username")
        }

        // validation with zod

        const result = UsernameQuerySchema.safeParse(queryParam)

        if(!result.success){
            const usernameError = result.error.format().username?._errors|| []
            return Response.json(
                {
                    success: false,
                    message:usernameError?.length>0 ? usernameError.join(', '): 'Invalid query paramaters',
                }, {status:400}
            )
        }

        const {username} = result.data

         const existingVerifiedUser = await userModel.findOne({username,isVerified:true})

         if (existingVerifiedUser) {
            return Response.json({
                success:false,
                message: "Username is already taken"
            }, {status:400})
         }

         return Response.json({
                success:true,
                message: "Username is unique"
            }, {status:400})

    } catch (error) {
        console.error("error checking username",error);
        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },
            {status:500}
        )
        
    }

}