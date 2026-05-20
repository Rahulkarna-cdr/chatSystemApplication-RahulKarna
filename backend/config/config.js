import dotenv from "dotenv";
dotenv.config();

const validateEnvVariables = (varName) => {
    const value = process.env[varName]
    if (!value) {
        throw new Error(`Environment variable ${varName} is not set`)
    }
    return value
}

const config = {
    PORT: validateEnvVariables("PORT"),
    MONGODB_URI: validateEnvVariables("MONGODB_URI"),
    ACCESS_TOKEN_SECRET: validateEnvVariables("ACCESS_TOKEN_SECRET"),
    ACCESS_TOKEN_EXPIRY: validateEnvVariables("ACCESS_TOKEN_EXPIRY"),
    REFRESH_TOKEN_SECRET: validateEnvVariables("REFRESH_TOKEN_SECRET"),
    REFRESH_TOKEN_EXPIRY: validateEnvVariables("REFRESH_TOKEN_EXPIRY"),
}

export default config
