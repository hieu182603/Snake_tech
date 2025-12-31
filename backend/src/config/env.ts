import dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * Environment configuration validation
 */
export function validateEnvironment(): void {
    const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
        process.exit(1);
    }
}

// Export validated environment variables
export const config = {
    // Database
    MONGO_URI: process.env.MONGO_URI || "mongodb+srv://hieunguyenn1501_db_user:WrKBtW8f8fUHxRpo@cluster0.9ig0eyd.mongodb.net/?appName=Cluster0",

    // Server Configuration
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    // JWT Configuration
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

    // Email Configuration
    EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
    EMAIL_PORT: parseInt(process.env.EMAIL_PORT || '587'),
    EMAIL_SECURE: process.env.EMAIL_SECURE === 'true',
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,

    // Frontend URL for CORS
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
};
