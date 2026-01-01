#!/usr/bin/env tsx

/**
 * Generate orders and related data
 */

import mongoose from 'mongoose';
import { config } from '../src/config/env.js';
import { Order, OrderItem, Cart, CartItem, Payment, Account, Product } from '../src/models/index.js';

const orderStatuses = ['PENDING', 'CONFIRMED', 'PACKING', 'SHIPPING', 'DELIVERED', 'CANCELLED'];
const paymentMethods = ['COD', 'VNPAY', 'MOCK'];
const paymentStatuses = ['UNPAID', 'PAID', 'FAILED'];

function generateRandomOrder(customerId: string, shipperId: string, products: any[]) {
  // Select 1-5 random products for this order
  const orderItemsCount = Math.floor(Math.random() * 5) + 1;
  const selectedProducts = [];
  const usedIndices = new Set();

  for (let i = 0; i < orderItemsCount; i++) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * products.length);
    } while (usedIndices.has(randomIndex));

    usedIndices.add(randomIndex);
    selectedProducts.push(products[randomIndex]);
  }

  // Create order items
  const orderItems = selectedProducts.map(product => ({
    productId: product._id,
    qty: Math.floor(Math.random() * 3) + 1, // 1-3 items
    priceSnapshot: product.price,
    nameSnapshot: product.name
  }));

  // Calculate totals
  const subtotal = orderItems.reduce((sum, item) => sum + (item.priceSnapshot * item.qty), 0);
  const shippingFee = subtotal > 500000 ? 0 : 30000; // Free shipping over 500k
  const discount = 0;
  const grandTotal = subtotal + shippingFee - discount;

  // Random status with bias towards completed orders
  const statusWeights = [0.1, 0.2, 0.3, 0.3, 0.8, 0.05]; // PENDING, CONFIRMED, PACKING, SHIPPING, DELIVERED, CANCELLED
  let statusIndex = 0;
  const random = Math.random();
  let cumulativeWeight = 0;

  for (let i = 0; i < statusWeights.length; i++) {
    cumulativeWeight += statusWeights[i];
    if (random <= cumulativeWeight) {
      statusIndex = i;
      break;
    }
  }

  const status = orderStatuses[statusIndex];

  // Generate dates (last 3 months)
  const now = new Date();
  const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const orderDate = new Date(threeMonthsAgo.getTime() + Math.random() * (now.getTime() - threeMonthsAgo.getTime()));

  // Shipping address (Vietnamese addresses)
  const cities = ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng'];
  const districts = ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8'];
  const streets = ['Đường Nguyễn Huệ', 'Đường Trần Hưng Đạo', 'Đường Lê Lợi', 'Đường Hai Bà Trưng', 'Đường Bà Triệu'];

  const shippingAddress = {
    receiverName: `Khách hàng ${Math.floor(Math.random() * 1000)}`,
    phone: `09${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
    addressLine: `${Math.floor(Math.random() * 200) + 1} ${streets[Math.floor(Math.random() * streets.length)]}`,
    ward: `Phường ${Math.floor(Math.random() * 20) + 1}`,
    district: districts[Math.floor(Math.random() * districts.length)],
    province: cities[Math.floor(Math.random() * cities.length)]
  };

  // Generate order code (will be set later to ensure uniqueness)

  // Payment method and status
  const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
  const paymentStatus = paymentMethod === 'COD' && status === 'DELIVERED' ? 'PAID' :
                       paymentMethod !== 'COD' && Math.random() > 0.1 ? 'PAID' : 'UNPAID';

  // Create timeline
  const timeline = [{
    status: 'PENDING',
    at: orderDate,
    note: 'Đơn hàng được tạo'
  }];

  // Add more timeline entries based on status
  if (status !== 'PENDING') {
    timeline.push({
      status: 'CONFIRMED',
      at: new Date(orderDate.getTime() + 1000 * 60 * 30), // 30 minutes later
      note: 'Đơn hàng đã được xác nhận'
    });
  }

  if (['PACKING', 'SHIPPING', 'DELIVERED'].includes(status)) {
    timeline.push({
      status: 'PACKING',
      at: new Date(orderDate.getTime() + 1000 * 60 * 60 * 2), // 2 hours later
      note: 'Đơn hàng đang được đóng gói'
    });
  }

  if (['SHIPPING', 'DELIVERED'].includes(status)) {
    timeline.push({
      status: 'SHIPPING',
      at: new Date(orderDate.getTime() + 1000 * 60 * 60 * 6), // 6 hours later
      note: 'Đơn hàng đang được giao'
    });
  }

  if (status === 'DELIVERED') {
    timeline.push({
      status: 'DELIVERED',
      at: new Date(orderDate.getTime() + 1000 * 60 * 60 * 24), // 1 day later
      note: 'Đơn hàng đã được giao thành công'
    });
  }

  return {
    accountId: new mongoose.Types.ObjectId(customerId),
    shipperAccountId: status !== 'PENDING' && status !== 'CANCELLED' ?
                     new mongoose.Types.ObjectId(shipperId) : undefined,
    items: orderItems,
    totals: {
      subtotal,
      shippingFee,
      discount: 0,
      grandTotal: subtotal + shippingFee
    },
    shippingAddress,
    status,
    paymentMethod,
    paymentStatus,
    timeline,
    createdAt: orderDate,
    updatedAt: orderDate
  };
}

async function generateOrders(count: number = 150) {
  try {
    console.log('📦 Generating orders data...\n');

    await mongoose.connect(config.MONGO_URI);
    console.log('✅ Connected to database');

    // Get customers, shippers, and products
    const customers = await Account.find({ role: 'CUSTOMER' }).select('_id');
    const shippers = await Account.find({ role: 'SHIPPER' }).select('_id');
    const products = await Product.find({ isActive: true }).select('_id name price sku');

    if (customers.length === 0 || shippers.length === 0 || products.length === 0) {
      console.log('⚠️  No customers, shippers or products found. Please seed them first.');
      return;
    }

    console.log(`Found ${customers.length} customers, ${shippers.length} shippers, ${products.length} products`);

    // Clear existing orders, carts, payments
    await Order.deleteMany({});
    await Cart.deleteMany({});
    await Payment.deleteMany({});
    console.log('🗑️  Cleared existing orders, carts, and payments');

    // Also clear any potential duplicate codes by ensuring uniqueness
    let codeCounter = Date.now();

    const orders = [];
    const payments = [];

    // Generate orders
    for (let i = 0; i < count; i++) {
      const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
      const randomShipper = shippers[Math.floor(Math.random() * shippers.length)];

      const order = generateRandomOrder(
        randomCustomer._id.toString(),
        randomShipper._id.toString(),
        products
      );

      // Set unique order code
      order.code = `ORD${codeCounter++}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;

      orders.push(order);
    }

    // Insert orders
    const insertedOrders = await Order.insertMany(orders);
    console.log(`✅ Inserted ${insertedOrders.length} orders`);

    // Create payments for orders
    for (const order of insertedOrders) {
      const payment = {
        orderId: order._id,
        amount: order.totals.grandTotal,
        method: order.paymentMethod,
        status: order.status === 'DELIVERED' ? 'PAID' :
                order.status === 'CANCELLED' ? 'REFUNDED' :
                'INIT', // For pending/processing orders
        currency: 'VND',
        providerTxnId: order.paymentMethod !== 'COD' ?
                      `TXN${Date.now()}${Math.floor(Math.random() * 1000000)}` : undefined
      };

      payments.push(payment);
    }

    // Insert payments
    const insertedPayments = await Payment.insertMany(payments);
    console.log(`✅ Inserted ${insertedPayments.length} payments`);

    // Create some carts for active customers
    const carts = [];

    for (let i = 0; i < Math.min(30, customers.length); i++) {
      const customer = customers[i];
      const cartItems = [];

      // Add 1-3 random items to cart
      const cartItemCount = Math.floor(Math.random() * 3) + 1;

      for (let j = 0; j < cartItemCount; j++) {
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        const qty = Math.floor(Math.random() * 3) + 1;

        const cartItem = {
          productId: randomProduct._id,
          qty,
          priceSnapshot: randomProduct.price
        };

        cartItems.push(cartItem);
      }

      const cart = {
        accountId: customer._id,
        items: cartItems
      };

      carts.push(cart);
    }

    // Insert carts
    const insertedCarts = await Cart.insertMany(carts);
    console.log(`✅ Inserted ${insertedCarts.length} carts with ${carts.reduce((sum, cart) => sum + cart.items.length, 0)} total items`);

    // Summary
    console.log('\n📈 Order Generation Summary:');
    console.log(`   - Total orders: ${insertedOrders.length}`);
    console.log(`   - Total payments: ${insertedPayments.length}`);
    console.log(`   - Total carts: ${insertedCarts.length}`);
    const totalCartItems = insertedCarts.reduce((sum, cart) => sum + cart.items.length, 0);
    console.log(`   - Total cart items: ${totalCartItems}`);

    // Status breakdown
    const statusCounts = {};
    insertedOrders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });

    console.log(`   - Order status distribution:`);
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`     ${status}: ${count} orders`);
    });

    console.log('\n🎉 Order generation completed!');

  } catch (error) {
    console.error('❌ Error generating orders:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run if executed directly
if (require.main === module) {
  const count = process.argv[2] ? parseInt(process.argv[2]) : 150;
  generateOrders(count);
}
