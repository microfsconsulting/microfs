import jwt from "jsonwebtoken"

const generateAccessToken = (user) => {
    const config = useRuntimeConfig()

    return jwt.sign({userId : user.id}, config.jwtAccessSecret, {
        expiresIn: '10m'
    })
}

const generateRefreshToken = (user) => {
    const config = useRuntimeConfig()

    return jwt.sign({userId : user.id}, config.jwtRefreshSecret, {
        expiresIn: '5h'
    })
}

export const decodeRefreshToken = (token) =>{
    const config = useRuntimeConfig()
    try {
        return true//return jwt.verify(token,config.jwtRefreshSecret)
    } catch (error) {
        return null
    }
}

export const generateTokens = (user) =>{
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)


    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    }
}

export const sendRefreshToken = async (event,token) => {
    console.log(token)
    setCookie(event, "refresh_token", token, {
        httpOnly: true,
        sameSite:true
    })
    console.log(await useCookie(event,"refresh_token"))
}