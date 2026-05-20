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
}

export default config
