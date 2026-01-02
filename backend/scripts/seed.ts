#!/usr/bin/env tsx

/**
 * Seed database with initial data
 * Usage: npm run seed
 */

import { seedDatabase } from '../seed/index.js';

async function main() {
  try {
    console.log('🌱 Starting database seeding...');
    await seedDatabase();
    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

main();












