import { decodeRefreshToken, generateTokens } from "~/server/utils/jwt"
import { getRefreshTokenByToken } from "./db/refreshTokens"
import { getUserById } from "./db/users"

export default defineEventHandler(async (event) =>{

    const cookies = useCookies(event)

    const refreshToken = cookies.refresh_token

    if(!refreshToken){
        return sendError(event, createError({
            statusMessage : "refresh token is invalid",
            statusCode : 401
        }))
    }

    const rTokenFromDB = await getRefreshTokenByToken(refreshToken)

    if(!rTokenFromDB){
        return sendError(event, createError({
            statusMessage : "refresh token is invalid",
            statusCode : 401
        }))
    }

    const token = decodeRefreshToken(refreshToken)

    try {
        const user = await  getUserById(token.userId)
        const {accessToken} = generateTokens(user) 
        return {
            access_token : accessToken
        }
    } catch (error) {
        return sendError(event, createError({
            statusMessage : "something went wrong",
            statusCode : 500
        }))
    }

    return {
        hello: token
    }
})