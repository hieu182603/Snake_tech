import mongoose from "mongoose";

/**
 * Kết nối MongoDB database
 * @returns {Promise<void>}
 */
export async function connectDatabase(): Promise<void> {
    try {
        // Validate MONGO_URI is provided
        const MONGO_URI = process.env.MONGO_URI?.trim();
        if (!MONGO_URI) {
            throw new Error('MONGO_URI environment variable is required');
        }

        // Validate connection string format
        if (!MONGO_URI.startsWith("mongodb://") && !MONGO_URI.startsWith("mongodb+srv://")) {
            throw new Error(`Invalid MONGO_URI format. Must start with "mongodb://" or "mongodb+srv://". Current value: "${MONGO_URI}"`);
        }

        // Log connection info (ẩn password)
        const maskedUri = MONGO_URI.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, (match, srv, user, pass) => {
            return `mongodb${srv || ''}://${user}:****@`;
        });

        console.log("🔄 Connecting to database...");
        await mongoose.connect(MONGO_URI);

        console.log("✅ Database connected successfully");

    } catch (error) {
        console.error("❌ Database connection failed:", error);
        throw error;
    }
}

/**
 * Đóng kết nối database
 * @returns {Promise<void>}
 */
export async function disconnectDatabase(): Promise<void> {
    try {
        await mongoose.disconnect();
        console.log("✅ Database disconnected successfully");
    } catch (error) {
        console.error("❌ Database disconnection failed:", error);
        throw error;
    }
}
