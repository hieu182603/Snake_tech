#!/usr/bin/env tsx

/**
 * Generate feedback/reviews for products
 */

import mongoose from 'mongoose';
import { config } from '../src/config/env.js';
import { Review, Account, Product } from '../src/models/index.js';

const reviewTitles = [
  "Tuyệt vời!",
  "Rất hài lòng",
  "Sản phẩm chất lượng",
  "Đáng đồng tiền bát gạo",
  "Khuyến khích mua",
  "Cực kỳ ưng ý",
  "Hoàn hảo",
  "Xuất sắc",
  "Rất tốt",
  "Hài lòng với sản phẩm"
];

const reviewContents = [
  "Sản phẩm chất lượng cao, đúng như mô tả. Giao hàng nhanh chóng và đóng gói cẩn thận. Sẽ ủng hộ shop thêm!",
  "Đã dùng được 1 tháng, rất ổn định. Hiệu năng mạnh mẽ, phù hợp với nhu cầu gaming của mình.",
  "Giá cả phải chăng so với chất lượng. Tư vấn nhiệt tình, hỗ trợ kỹ thuật tốt. 5 sao!",
  "Sản phẩm đẹp, bền, giao hàng đúng hẹn. Nhân viên hỗ trợ tận tình. Rất hài lòng!",
  "Mua về dùng thấy rất tốt. Build quality cao, hiệu năng ổn định. Khuyến khích mọi người mua!",
  "Giao hàng nhanh, đóng gói đẹp. Sản phẩm đúng như quảng cáo. Sẽ quay lại mua thêm.",
  "Cấu hình mạnh, chơi game mượt mà. Làm việc văn phòng cũng rất tốt. Rất đáng tiền!",
  "Hỗ trợ kỹ thuật tận tình, giải đáp thắc mắc nhanh chóng. Sản phẩm chất lượng, giá hợp lý.",
  "Đã test kỹ, mọi thứ hoạt động hoàn hảo. Build PC xong chạy mượt mà không lỗi.",
  "Màn hình sắc nét, màu đẹp. Tần số quét cao chơi game rất đã. Rất hài lòng với sản phẩm!",
  "Tai nghe âm thanh sống động, micro rõ ràng. Chơi game và nghe nhạc đều tuyệt vời.",
  "Bàn phím gõ êm, đèn RGB đẹp. Switch ổn định, dùng gaming rất thích.",
  "Chuột chính xác, DPI cao, pin trâu. Gaming gear chất lượng cao.",
  "SSD tốc độ nhanh, boot Windows chỉ vài giây. Khác biệt rõ rệt so với HDD cũ.",
  "RAM chạy mượt, đa nhiệm tốt. Giá rẻ mà chất lượng ổn định."
];

const positiveComments = [
  "Giao hàng siêu nhanh! Chỉ 2 ngày đã nhận được hàng.",
  "Đóng gói chuyên nghiệp, không bị xước xát gì.",
  "Tư vấn viên hiểu biết, tư vấn đúng sản phẩm mình cần.",
  "Bảo hành chính hãng, hỗ trợ kỹ thuật tận tình.",
  "Sản phẩm chính hãng 100%, có tem bảo hành đầy đủ.",
  "Giá cạnh tranh, có chương trình khuyến mãi hấp dẫn.",
  "Phụ kiện đi kèm đầy đủ, hướng dẫn sử dụng chi tiết.",
  "Hỗ trợ cài đặt và setup miễn phí, rất tiện lợi.",
  "Chất lượng vượt xa mong đợi, đáng đồng tiền bát gạo.",
  "Sẽ giới thiệu cho bạn bè và quay lại mua thêm."
];

function generateRandomReview(productId: string, accountId: string) {
  const rating = Math.random() < 0.1 ? Math.floor(Math.random() * 2) + 4 : Math.floor(Math.random() * 2) + 4; // 90% 4-5 sao, 10% 1-3 sao
  const title = reviewTitles[Math.floor(Math.random() * reviewTitles.length)];
  const content = reviewContents[Math.floor(Math.random() * reviewContents.length)];

  // Thêm comment phụ với rating cao
  let fullContent = content;
  if (rating >= 4) {
    const extraComment = positiveComments[Math.floor(Math.random() * positiveComments.length)];
    fullContent += " " + extraComment;
  }

  // Một số review có ảnh
  const images = Math.random() < 0.3 ? ["https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400"] : [];

  return {
    productId: new mongoose.Types.ObjectId(productId),
    accountId: new mongoose.Types.ObjectId(accountId),
    rating,
    title,
    content: fullContent,
    images,
    status: "APPROVED"
  };
}

async function generateFeedback(count: number = 200) {
  try {
    console.log('📝 Generating feedback data...\n');

    await mongoose.connect(config.MONGO_URI);
    console.log('✅ Connected to database');

    // Get all customers and products
    const customers = await Account.find({ role: 'CUSTOMER' }).select('_id');
    const products = await Product.find({ isActive: true }).select('_id');

    if (customers.length === 0 || products.length === 0) {
      console.log('⚠️  No customers or products found. Please seed them first.');
      return;
    }

    console.log(`Found ${customers.length} customers and ${products.length} products`);

    // Clear existing reviews
    await Review.deleteMany({});
    console.log('🗑️  Cleared existing reviews');

    const reviews = [];

    // Generate reviews for each product (2-5 reviews per product)
    for (const product of products) {
      const reviewCount = Math.floor(Math.random() * 4) + 2; // 2-5 reviews

      for (let i = 0; i < reviewCount; i++) {
        const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
        const review = generateRandomReview(product._id.toString(), randomCustomer._id.toString());
        reviews.push(review);
      }
    }

    // Insert reviews
    const insertedReviews = await Review.insertMany(reviews);
    console.log(`✅ Inserted ${insertedReviews.length} reviews`);

    // Update product ratings
    console.log('📊 Updating product ratings...');
    for (const product of products) {
      const productReviews = insertedReviews.filter(r => r.productId.toString() === product._id.toString());

      if (productReviews.length > 0) {
        const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;

        await Product.findByIdAndUpdate(product._id, {
          ratingAvg: Math.round(avgRating * 10) / 10, // Round to 1 decimal
          ratingCount: productReviews.length
        });
      }
    }

    console.log('✅ Updated product ratings');

    // Summary
    console.log('\n📈 Summary:');
    console.log(`   - Total reviews: ${insertedReviews.length}`);
    console.log(`   - Average reviews per product: ${(insertedReviews.length / products.length).toFixed(1)}`);
    console.log(`   - Rating distribution:`);

    const ratingCounts = [0, 0, 0, 0, 0, 0];
    insertedReviews.forEach(review => ratingCounts[review.rating]++);

    for (let i = 1; i <= 5; i++) {
      console.log(`     ${i} ⭐: ${ratingCounts[i]} reviews`);
    }

    console.log('\n🎉 Feedback generation completed!');

  } catch (error) {
    console.error('❌ Error generating feedback:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run if executed directly
if (require.main === module) {
  const count = process.argv[2] ? parseInt(process.argv[2]) : 200;
  generateFeedback(count);
}













