import mongoose from "mongoose";

/**
 * Kết nối MongoDB database
 * @returns {Promise<void>}
 */
export async function connectDatabase(): Promise<void> {
    try {
        // Sử dụng giá trị từ env, nếu trống hoặc undefined thì dùng default
        const MONGO_URI = process.env.MONGO_URI?.trim() || "mongodb+srv://hieunguyenn1501_db_user:WrKBtW8f8fUHxRpo@cluster0.9ig0eyd.mongodb.net/?appName=Cluster0";

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
