import { getUserByUsername } from "./db/users"
import {sendError} from "h3"
import { userTransformer } from "./transformers/user"
import bcrypt from "bcrypt"
import { generateTokens, sendRefreshToken } from "~~/server/utils/jwt"
import { createRefreshToken } from "./db/refreshTokens"

export default defineEventHandler(async (event) =>{

    const body = await useBody(event)

    const {username, password } = body
    console.log(username,password)
    if (!username || !password){
        return sendError(event, createError({
            statusCode : 400,
            statusMessage : "Invalid params to login"
        }))
    }

    const user = await getUserByUsername(username)

    if(!user){
        return sendError(event, createError({
            statusCode : 400,
            statusMessage : "Username or password invalid"
        }))
    }

    //compare password
    const doesThePasswordMatch = await bcrypt.compare(password, user.password)

    if(!doesThePasswordMatch){
        return sendError(event, createError({
            statusCode : 400,
            statusMessage : "Username or password invalid"
        }))
    }

    // Generate token
    // Access token
    // Refresh token
    const {accessToken, refreshToken} = generateTokens(user)

    // Save in database
    await createRefreshToken({
        token : refreshToken,
        userId : user.id
    })

    // Add http only cookie
    sendRefreshToken(event, refreshToken)

    return {
        access_token : accessToken,
        user : userTransformer(user)
    }

})