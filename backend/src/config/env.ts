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
        console.error('Please create a .env file based on env.example');
        process.exit(1);
    }

    // Validate JWT_SECRET length
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
        console.error('❌ JWT_SECRET must be at least 32 characters long for security');
        process.exit(1);
    }
}

// Export validated environment variables
export const config = {
    // Database
    MONGO_URI: process.env.MONGO_URI,

    // Server Configuration
    PORT: parseInt(process.env.PORT || '5000'),
    NODE_ENV: process.env.NODE_ENV || 'development',

    // JWT Configuration
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

    // Email Configuration
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: parseInt(process.env.EMAIL_PORT || '587'),
    EMAIL_SECURE: process.env.EMAIL_SECURE === 'true',
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,

    // Frontend URL for CORS
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
};
