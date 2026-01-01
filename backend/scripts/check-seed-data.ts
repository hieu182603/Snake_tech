#!/usr/bin/env tsx

/**
 * Check seeded data counts
 */

import mongoose from 'mongoose';
import { config } from '../src/config/env.js';
import { Brand, Category, Product, Account, Review, Order, Payment, Cart } from '../src/models/index.js';

async function checkSeededData() {
  try {
    console.log('🔍 Checking seeded data...\n');

    // Connect to database
    await mongoose.connect(config.MONGO_URI);
    console.log('✅ Connected to database\n');

    // Check brands
    const brandCount = await Brand.countDocuments();
    console.log(`🏷️  Brands: ${brandCount}`);

    // Check categories
    const categoryCount = await Category.countDocuments();
    console.log(`📂 Categories: ${categoryCount}`);

    // Check products
    const productCount = await Product.countDocuments();
    console.log(`📦 Products: ${productCount}`);

    // Check accounts by role
    const totalAccounts = await Account.countDocuments();
    const adminCount = await Account.countDocuments({ role: 'ADMIN' });
    const staffCount = await Account.countDocuments({ role: 'STAFF' });
    const customerCount = await Account.countDocuments({ role: 'CUSTOMER' });
    const shipperCount = await Account.countDocuments({ role: 'SHIPPER' });

    console.log(`👥 Accounts: ${totalAccounts}`);
    console.log(`  - Admin: ${adminCount}`);
    console.log(`  - Staff: ${staffCount}`);
    console.log(`  - Customer: ${customerCount}`);
    console.log(`  - Shipper: ${shipperCount}`);

    // Check reviews
    const reviewCount = await Review.countDocuments();
    console.log(`💬 Reviews: ${reviewCount}`);

    // Check orders and payments
    const orderCount = await Order.countDocuments();
    const paymentCount = await Payment.countDocuments();
    const cartCount = await Cart.countDocuments();

    console.log(`📦 Orders: ${orderCount}`);
    console.log(`💳 Payments: ${paymentCount}`);
    console.log(`🛒 Carts: ${cartCount}`);

    // Sample data
    console.log('\n📋 Sample Data:');

    const sampleBrands = await Brand.find().limit(3).select('name slug');
    console.log('Brands:', sampleBrands.map(b => b.name).join(', '));

    const sampleCategories = await Category.find().limit(3).select('name slug');
    console.log('Categories:', sampleCategories.map(c => c.name).join(', '));

    const sampleProducts = await Product.find().limit(3).select('name price brand');
    console.log('Products:', sampleProducts.map(p => `${p.name} (${p.price}₫)`).join(', '));

    const sampleAccounts = await Account.find().limit(3).select('fullName email role');
    console.log('Accounts:', sampleAccounts.map(a => `${a.fullName} (${a.role})`).join(', '));

    const sampleReviews = await Review.find().limit(3).populate('productId', 'name').select('rating content');
    console.log('Reviews:', sampleReviews.map(r => `${(r.productId as any)?.name || 'Unknown'}: ${r.rating}⭐`).join(', '));

    console.log('\n🎉 Data check completed!');

  } catch (error) {
    console.error('❌ Error checking data:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

checkSeededData();
