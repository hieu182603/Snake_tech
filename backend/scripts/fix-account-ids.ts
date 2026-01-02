#!/usr/bin/env tsx

/**
 * Fix duplicate account IDs
 */

import fs from 'fs';
import path from 'path';

// Fix customers-mass-generated.json IDs
const customersPath = path.join(__dirname, '../seed/data/customers-mass-generated.json');
if (fs.existsSync(customersPath)) {
  const customers = JSON.parse(fs.readFileSync(customersPath, 'utf-8'));
  const fixedCustomers = customers.map((customer: any, index: number) => ({
    ...customer,
    _id: `507f1f77bcf86cd799439${(111 + index).toString().padStart(3, '0')}`
  }));
  fs.writeFileSync(customersPath, JSON.stringify(fixedCustomers, null, 2));
  console.log(`✅ Fixed ${fixedCustomers.length} customer IDs`);
}

// Fix shippers-mass-generated.json IDs
const shippersPath = path.join(__dirname, '../seed/data/shippers-mass-generated.json');
if (fs.existsSync(shippersPath)) {
  const shippers = JSON.parse(fs.readFileSync(shippersPath, 'utf-8'));
  const fixedShippers = shippers.map((shipper: any, index: number) => ({
    ...shipper,
    _id: `507f1f77bcf86cd799439${(211 + index).toString().padStart(3, '0')}`
  }));
  fs.writeFileSync(shippersPath, JSON.stringify(fixedShippers, null, 2));
  console.log(`✅ Fixed ${fixedShippers.length} shipper IDs`);
}

console.log('🎉 Account ID fixes completed!');












