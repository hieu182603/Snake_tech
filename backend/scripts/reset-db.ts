import mongoose from 'mongoose';
import { config } from '../src/config/env.js';

/**
 * Script tổng hợp để reset database hoàn toàn
 * Xóa tất cả collections cũ và tạo lại schema mới
 * Chạy lệnh: npm run reset-db
 */

async function resetDatabase() {
  try {
    console.log('🔄 Bắt đầu reset database...');
    console.log('⚠️  Script này sẽ xóa TẤT CẢ dữ liệu trong database!');
    console.log('');

    // Kết nối đến MongoDB
    await mongoose.connect(config.MONGO_URI);
    console.log('✅ Đã kết nối đến database');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Không thể kết nối đến database');
    }

    // Lấy danh sách collections hiện tại
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);

    console.log(`📊 Tìm thấy ${collectionNames.length} collections:`);
    collectionNames.forEach(name => console.log(`  - ${name}`));

    // Xóa tất cả collections (trừ system collections)
    let droppedCount = 0;
    for (const collectionName of collectionNames) {
      if (!collectionName.startsWith('system.')) {
        try {
          await db.dropCollection(collectionName);
          console.log(`🗑️  Đã xóa: ${collectionName}`);
          droppedCount++;
        } catch (error) {
          console.log(`⚠️  Không thể xóa ${collectionName}:`, error.message);
        }
      }
    }

    console.log(`\n✅ Đã xóa ${droppedCount} collections`);
    console.log('🔄 Khởi tạo schema và indexes mới...');

    // Import models để register schema
    await import('../src/models/index.js');

    // Sync indexes cho tất cả models
    const models = mongoose.modelNames();
    console.log(`📊 Syncing ${models.length} models...`);

    for (const modelName of models) {
      try {
        const Model = mongoose.model(modelName);
        await Model.syncIndexes();
        console.log(`✅ ${modelName}`);
      } catch (error) {
        console.log(`⚠️  ${modelName}:`, error.message);
      }
    }

    // Kiểm tra kết quả
    const newCollections = await db.listCollections().toArray();
    const newCollectionNames = newCollections.map(col => col.name).filter(name => !name.startsWith('system.'));

    console.log(`\n📋 Database sau khi reset (${newCollectionNames.length} collections):`);
    newCollectionNames.forEach(name => console.log(`  - ${name}`));

    console.log('\n🎉 Database reset hoàn thành!');
    console.log('✅ Tất cả collections cũ đã bị xóa');
    console.log('✅ Schema và indexes mới đã được tạo');
    console.log('🚀 Sẵn sàng sử dụng với dữ liệu mới');

  } catch (error) {
    console.error('❌ Lỗi khi reset database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Đã đóng kết nối database');
  }
}

// Chạy script
resetDatabase().catch(console.error);
