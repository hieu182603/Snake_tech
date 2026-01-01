import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { config } from '../src/config/env.js';
import { Category, Brand, Product, Account } from '../src/models/index.js';

/**
 * Seed brands into database
 */
async function seedBrands() {
  try {
    console.log('🌱 Seeding brands...');

    const brandsPath = path.join(__dirname, 'data', 'brands.json');

    if (!fs.existsSync(brandsPath)) {
      console.log('⚠️  Brands file not found, skipping...');
      return [];
    }

    const brandsData = JSON.parse(fs.readFileSync(brandsPath, 'utf-8'));

    // Clear existing brands
    await Brand.deleteMany({});
    console.log('🗑️  Cleared existing brands');

    // Insert new brands
    const brands = await Brand.insertMany(brandsData);
    console.log(`✅ Inserted ${brands.length} brands`);

    return brands;
  } catch (error) {
    console.error('❌ Error seeding brands:', error);
    throw error;
  }
}

/**
 * Seed categories into database
 */
async function seedCategories() {
  try {
    console.log('🌱 Seeding categories...');

    const categoriesPath = path.join(__dirname, 'data', 'categories-extended.json');
    const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));

    // Clear existing categories
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing categories');

    // Insert new categories
    const categories = await Category.insertMany(categoriesData);
    console.log(`✅ Inserted ${categories.length} categories`);

    return categories;
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  }
}

/**
 * Seed accounts into database
 */
async function seedAccounts() {
  try {
    console.log('👥 Seeding accounts...');

    let allAccountsData: any[] = [];

    // Load manual accounts
    const accountsPath = path.join(__dirname, 'data', 'accounts.json');
    if (fs.existsSync(accountsPath)) {
      const accountsData = JSON.parse(fs.readFileSync(accountsPath, 'utf-8'));
      allAccountsData = allAccountsData.concat(accountsData);
    }

    // Load mass generated customers
    const customersPath = path.join(__dirname, 'data', 'customers-mass-generated.json');
    if (fs.existsSync(customersPath)) {
      const customersData = JSON.parse(fs.readFileSync(customersPath, 'utf-8'));
      allAccountsData = allAccountsData.concat(customersData);
    }

    // Load mass generated shippers
    const shippersPath = path.join(__dirname, 'data', 'shippers-mass-generated.json');
    if (fs.existsSync(shippersPath)) {
      const shippersData = JSON.parse(fs.readFileSync(shippersPath, 'utf-8'));
      allAccountsData = allAccountsData.concat(shippersData);
    }

    // Clear existing accounts (be careful in production!)
    await Account.deleteMany({});
    console.log('🗑️  Cleared existing accounts');

    // Insert new accounts
    const accounts = await Account.insertMany(allAccountsData);
    console.log(`✅ Inserted ${accounts.length} accounts`);

    return accounts;
  } catch (error) {
    console.error('❌ Error seeding accounts:', error);
    throw error;
  }
}

/**
 * Seed products into database
 */
async function seedProducts() {
  try {
    console.log('🌱 Seeding products...');

    // Load products from multiple files
    const productsExtendedPath = path.join(__dirname, 'data', 'products-extended.json');
    const productsMassPath = path.join(__dirname, 'data', 'products-mass-generated.json');

    let allProductsData: any[] = [];

    // Load extended products (manual)
    if (fs.existsSync(productsExtendedPath)) {
      const extendedData = JSON.parse(fs.readFileSync(productsExtendedPath, 'utf-8'));
      allProductsData = allProductsData.concat(extendedData);
    }

    // Load mass generated products
    if (fs.existsSync(productsMassPath)) {
      const massData = JSON.parse(fs.readFileSync(productsMassPath, 'utf-8'));
      allProductsData = allProductsData.concat(massData);
    }

    // Map brand names to brand IDs
    const brandMap: { [key: string]: string } = {
      'Apple': '507f1f77bcf86cd799439001',
      'NVIDIA': '507f1f77bcf86cd799439002',
      'Razer': '507f1f77bcf86cd799439003',
      'Samsung': '507f1f77bcf86cd799439004',
      'Intel': '507f1f77bcf86cd799439005',
      'AMD': '507f1f77bcf86cd799439006',
      'Corsair': '507f1f77bcf86cd799439007',
      'ASUS': '507f1f77bcf86cd799439008',
      'Logitech': '507f1f77bcf86cd799439009',
      'SteelSeries': '507f1f77bcf86cd799439010',
      'HyperX': '507f1f77bcf86cd799439011',
      'Kingston': '507f1f77bcf86cd799439012',
      'Western Digital': '507f1f77bcf86cd799439013',
      'Seasonic': '507f1f77bcf86cd799439014',
      'Fractal Design': '507f1f77bcf86cd799439015',
      'be quiet!': '507f1f77bcf86cd799439016',
      'ASRock': '507f1f77bcf86cd799439017',
      'TeamGroup': '507f1f77bcf86cd799439018',
      'Crucial': '507f1f77bcf86cd799439019',
      'Seagate': '507f1f77bcf86cd799439020',
      'LG': '507f1f77bcf86cd799439021',
      'Acer': '507f1f77bcf86cd799439022',
      'Redragon': '507f1f77bcf86cd799439023'
    };

    // Update products data with correct brandId and categoryId
    const updatedProductsData = allProductsData.map((product: any) => ({
      ...product,
      brandId: brandMap[product.brand] || '507f1f77bcf86cd799439001', // fallback to Apple
      categoryId: product.categoryId,
      // Remove brand field as it's not needed in final data
      brand: undefined
    }));

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert new products
    const products = await Product.insertMany(updatedProductsData);
    console.log(`✅ Inserted ${products.length} products`);

    return products;
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
}

/**
 * Main seed function
 */
async function seedDatabase() {
  try {
    console.log('🚀 Starting database seeding...');

    // Connect to database
    await mongoose.connect(config.MONGO_URI);
    console.log('✅ Connected to database');

    // Seed data in order (brands first, then categories, then accounts, then products)
    await seedBrands();
    await seedCategories();
    await seedAccounts();
    await seedProducts();

    // Generate feedback/reviews for products
    console.log('\n💬 Generating feedback data...');
    const { generateFeedback } = await import('../scripts/generate-feedback.js');
    await generateFeedback(200); // Generate 200 reviews

    console.log('🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase().catch(console.error);
}

export { seedDatabase, seedBrands, seedCategories, seedAccounts, seedProducts };
