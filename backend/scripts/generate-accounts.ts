#!/usr/bin/env tsx

/**
 * Script to generate additional customer and shipper accounts for Snake_tech
 */

const firstNames = [
  "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Võ", "Đặng", "Bùi", "Đỗ",
  "Ngô", "Dương", "Lý", "Đinh", "Mai", "Trương", " Phan", "Vũ", "Vương", "Tô"
];

const middleNames = [
  "Văn", "Thị", "Minh", "Thành", "Đức", "Quốc", "Huy", "Tuấn", "Tùng", "Dương",
  "Quang", "Hải", "Nam", "Anh", "Hoàng", "Hà", "Phương", "Linh", "Lan", "Mai"
];

const lastNames = [
  "An", "Bảo", "Chi", "Dũng", "Em", "Giang", "Hào", "Hương", "Khanh", "Lam",
  "Long", "Mai", "Nam", "Oanh", "Phong", "Quân", "Sang", "Tâm", "Uyên", "Vinh",
  "An", "Bình", "Châu", "Dương", "Giang", "Hòa", "Hương", "Khoa", "Lan", "Linh"
];

const domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"];

function generateFullName(): string {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const middleName = middleNames[Math.floor(Math.random() * middleNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${middleName} ${lastName}`;
}

function generateEmail(fullName: string): string {
  const cleanName = fullName.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const randomNum = Math.floor(Math.random() * 999) + 1;
  return `${cleanName}${randomNum}@${domain}`;
}

function generatePhone(): string {
  const prefixes = ["09", "08", "07", "05", "03"];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  return `${prefix}${number}`;
}

function generateAccountId(index: number): string {
  return `507f1f77bcf86cd799439${(111 + index).toString().padStart(3, '0')}`;
}

function generateAccounts(count: number = 100, role: string = 'CUSTOMER'): any[] {
  const accounts: any[] = [];

  for (let i = 0; i < count; i++) {
    const fullName = generateFullName();
    const account = {
      _id: generateAccountId(i),
      email: generateEmail(fullName),
      passwordHash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // bcrypt hash of "password123"
      fullName: fullName,
      phone: generatePhone(),
      role: role,
      isActive: true,
      isVerified: Math.random() > 0.3, // 70% verified
      avatarUrl: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000000)}?w=200`
    };

    accounts.push(account);
  }

  return accounts;
}

// Generate and save to file
import fs from 'fs';
import path from 'path';

const customers = generateAccounts(96, 'CUSTOMER'); // 96 more customers
const shippers = generateAccounts(5, 'SHIPPER'); // 5 more shippers

const customersPath = path.join(__dirname, '../seed/data/customers-mass-generated.json');
const shippersPath = path.join(__dirname, '../seed/data/shippers-mass-generated.json');

fs.writeFileSync(customersPath, JSON.stringify(customers, null, 2));
fs.writeFileSync(shippersPath, JSON.stringify(shippers, null, 2));

console.log(`✅ Generated ${customers.length} customers and saved to ${customersPath}`);
console.log(`✅ Generated ${shippers.length} shippers and saved to ${shippersPath}`);










