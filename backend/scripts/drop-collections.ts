import mongoose from 'mongoose';
import { config } from '../src/config/env.js';

/**
 * Script để xóa tất cả collections trong database
 * Chạy lệnh: npm run drop-collections
 */

// Danh sách tất cả collections cần xóa
const COLLECTIONS_TO_DROP = [
  'accounts',
  'categories',
  'brands',
  'products',
  'carts',
  'orders',
  'payments',
  'refreshtokens',
  'otps',
  'reviews',
  'banners',
  'shipperprofiles',
  'assignments',
  'notifications',
  'images',
  'rfqs'
];

async function dropAllCollections() {
  try {
    console.log('🔄 Kết nối đến database...');

    // Kết nối đến MongoDB
    await mongoose.connect(config.MONGO_URI);

    console.log('✅ Đã kết nối đến database');

    // Lấy danh sách collections hiện tại
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Không thể kết nối đến database');
    }

    const collections = await db.listCollections().toArray();
    const existingCollections = collections.map(col => col.name);

    console.log(`📊 Tìm thấy ${existingCollections.length} collections:`);
    existingCollections.forEach(name => console.log(`  - ${name}`));

    // Xóa từng collection
    let droppedCount = 0;
    for (const collectionName of COLLECTIONS_TO_DROP) {
      if (existingCollections.includes(collectionName)) {
        await db.dropCollection(collectionName);
        console.log(`🗑️  Đã xóa collection: ${collectionName}`);
        droppedCount++;
      } else {
        console.log(`⚠️  Collection không tồn tại: ${collectionName}`);
      }
    }

    // Kiểm tra và xóa các collections khác không mong muốn
    const remainingCollections = existingCollections.filter(
      name => !COLLECTIONS_TO_DROP.includes(name)
    );

    if (remainingCollections.length > 0) {
      console.log('\n🧹 Xóa các collections không mong muốn:');
      for (const collectionName of remainingCollections) {
        // Bỏ qua các collections hệ thống của MongoDB
        if (!collectionName.startsWith('system.')) {
          try {
            await db.dropCollection(collectionName);
            console.log(`🗑️  Đã xóa collection không mong muốn: ${collectionName}`);
            droppedCount++;
          } catch (error) {
            console.log(`⚠️  Không thể xóa collection: ${collectionName} - ${error}`);
          }
        }
      }
    }

    console.log(`\n✅ Hoàn thành! Đã xóa ${droppedCount} collections`);
    console.log('🎯 Database đã được làm sạch, sẵn sàng tạo lại schema mới');

  } catch (error) {
    console.error('❌ Lỗi khi xóa collections:', error);
    process.exit(1);
  } finally {
    // Đóng kết nối
    await mongoose.connection.close();
    console.log('🔌 Đã đóng kết nối database');
  }
}

// Chạy script
dropAllCollections().catch(console.error);
