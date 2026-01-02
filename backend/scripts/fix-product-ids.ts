#!/usr/bin/env tsx

/**
 * Fix duplicate product IDs between files
 */

import fs from 'fs';
import path from 'path';

// Fix products-mass-generated.json IDs to start from higher number
const massProductsPath = path.join(__dirname, '../seed/data/products-mass-generated.json');
if (fs.existsSync(massProductsPath)) {
  const products = JSON.parse(fs.readFileSync(massProductsPath, 'utf-8'));
  const fixedProducts = products.map((product: any, index: number) => ({
    ...product,
    _id: `507f1f77bcf86cd799439${(125 + index).toString().padStart(3, '0')}`
  }));
  fs.writeFileSync(massProductsPath, JSON.stringify(fixedProducts, null, 2));
  console.log(`✅ Fixed ${fixedProducts.length} mass generated product IDs`);
}

console.log('🎉 Product ID fixes completed!');












