import mongoose from 'mongoose';
import { config } from '../src/config/env.js';
// Import tất cả models để đảm bảo schema được register
import '../src/models/index.js';

/**
 * Script để khởi tạo lại tất cả collections với schema và indexes
 * Chạy lệnh: npm run init-collections
 */

async function initCollections() {
  try {
    console.log('🔄 Kết nối đến database...');

    // Kết nối đến MongoDB
    await mongoose.connect(config.MONGO_URI);

    console.log('✅ Đã kết nối đến database');

    // Lấy database instance
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Không thể kết nối đến database');
    }

    console.log('🏗️  Khởi tạo collections và indexes...');

    // Sync indexes cho tất cả models
    const models = mongoose.modelNames();
    console.log(`📊 Tìm thấy ${models.length} models:`, models);

    for (const modelName of models) {
      try {
        const Model = mongoose.model(modelName);
        console.log(`🔧 Syncing indexes cho model: ${modelName}`);

        // Sync indexes sẽ tạo indexes mới và xóa indexes cũ không còn sử dụng
        await Model.syncIndexes();
        console.log(`✅ Đã sync indexes cho: ${modelName}`);
      } catch (error) {
        console.log(`⚠️  Lỗi khi sync indexes cho ${modelName}:`, error);
      }
    }

    // Kiểm tra collections đã được tạo
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name).filter(name => !name.startsWith('system.'));

    console.log(`\n📋 Danh sách collections hiện tại (${collectionNames.length}):`);
    collectionNames.forEach(name => console.log(`  - ${name}`));

    // Kiểm tra indexes cho từng collection
    console.log('\n🔍 Kiểm tra indexes:');
    for (const collectionName of collectionNames) {
      try {
        const indexes = await db.collection(collectionName).indexes();
        console.log(`📊 ${collectionName}: ${indexes.length} indexes`);
        indexes.forEach((index, idx) => {
          const indexName = Object.keys(index.key).join(', ');
          console.log(`    ${idx + 1}. ${indexName} (${index.name})`);
        });
      } catch (error) {
        console.log(`⚠️  Không thể kiểm tra indexes cho ${collectionName}:`, error);
      }
    }

    console.log('\n✅ Hoàn thành khởi tạo collections!');
    console.log('🎯 Database đã sẵn sàng với schema và indexes mới');

  } catch (error) {
    console.error('❌ Lỗi khi khởi tạo collections:', error);
    process.exit(1);
  } finally {
    // Đóng kết nối
    await mongoose.connection.close();
    console.log('🔌 Đã đóng kết nối database');
  }
}

// Chạy script
initCollections().catch(console.error);
