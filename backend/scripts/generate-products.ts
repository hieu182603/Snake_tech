#!/usr/bin/env tsx

/**
 * Script to generate 100+ products for Snake_tech seed data
 */

interface ProductTemplate {
  name: string;
  basePrice: number;
  categoryId: string;
  brand: string;
  description: string;
  specs: any;
}

const productTemplates: ProductTemplate[] = [
  // CPU Products
  {
    name: "Intel Core i3-12100F",
    basePrice: 2990000,
    categoryId: "507f1f77bcf86cd799439015",
    brand: "Intel",
    description: "Intel Core i3-12100F 4-Core Processor",
    specs: {
      cores: 4,
      threads: 8,
      base_clock: "3.3 GHz",
      boost_clock: "4.3 GHz",
      socket: "LGA 1700",
      tdp: 58
    }
  },
  {
    name: "AMD Ryzen 5 7600",
    basePrice: 6990000,
    categoryId: "507f1f77bcf86cd799439015",
    brand: "AMD",
    description: "AMD Ryzen 5 7600 6-Core Processor",
    specs: {
      cores: 6,
      threads: 12,
      base_clock: "3.8 GHz",
      boost_clock: "5.1 GHz",
      socket: "AM5",
      tdp: 65
    }
  },
  {
    name: "Intel Core i9-12900K",
    basePrice: 15990000,
    categoryId: "507f1f77bcf86cd799439015",
    brand: "Intel",
    description: "Intel Core i9-12900K 16-Core Processor",
    specs: {
      cores: 16,
      threads: 24,
      base_clock: "3.2 GHz",
      boost_clock: "5.2 GHz",
      socket: "LGA 1700",
      tdp: 125
    }
  },
  // GPU Products
  {
    name: "NVIDIA GeForce RTX 4060",
    basePrice: 14990000,
    categoryId: "507f1f77bcf86cd799439016",
    brand: "NVIDIA",
    description: "NVIDIA GeForce RTX 4060 8GB GDDR6 Graphics Card",
    specs: {
      memory: "8GB GDDR6",
      base_clock: "1830 MHz",
      boost_clock: "2505 MHz",
      power: "115W"
    }
  },
  {
    name: "AMD Radeon RX 7800 XT",
    basePrice: 17990000,
    categoryId: "507f1f77bcf86cd799439016",
    brand: "AMD",
    description: "AMD Radeon RX 7800 XT 16GB GDDR6 Graphics Card",
    specs: {
      memory: "16GB GDDR6",
      base_clock: "1295 MHz",
      boost_clock: "2430 MHz",
      power: "263W"
    }
  },
  // RAM Products
  {
    name: "Kingston Fury Beast 8GB",
    basePrice: 890000,
    categoryId: "507f1f77bcf86cd799439017",
    brand: "Kingston",
    description: "Kingston Fury Beast 8GB DDR4-3200MHz",
    specs: {
      capacity: "8GB",
      type: "DDR4",
      speed: "3200MHz",
      voltage: "1.35V"
    }
  },
  {
    name: "TeamGroup T-Force Vulcan 16GB",
    basePrice: 1290000,
    categoryId: "507f1f77bcf86cd799439017",
    brand: "TeamGroup",
    description: "TeamGroup T-Force Vulcan 16GB DDR4-3200MHz",
    specs: {
      capacity: "16GB",
      type: "DDR4",
      speed: "3200MHz",
      voltage: "1.35V"
    }
  },
  // Storage Products
  {
    name: "Crucial MX500 500GB",
    basePrice: 1790000,
    categoryId: "507f1f77bcf86cd799439018",
    brand: "Crucial",
    description: "Crucial MX500 500GB SATA SSD",
    specs: {
      capacity: "500GB",
      type: "SATA SSD",
      read_speed: "Up to 560 MB/s",
      write_speed: "Up to 510 MB/s"
    }
  },
  {
    name: "Seagate Barracuda 2TB",
    basePrice: 1990000,
    categoryId: "507f1f77bcf86cd799439018",
    brand: "Seagate",
    description: "Seagate Barracuda 2TB 7200RPM HDD",
    specs: {
      capacity: "2TB",
      type: "HDD",
      speed: "7200RPM",
      cache: "256MB"
    }
  },
  // Monitor Products
  {
    name: "LG 24MP400-B 24inch",
    basePrice: 2390000,
    categoryId: "507f1f77bcf86cd799439022",
    brand: "LG",
    description: "LG 24MP400-B 24inch 1080p 75Hz IPS Monitor",
    specs: {
      size: "24 inch",
      resolution: "1920x1080",
      refresh_rate: "75Hz",
      panel_type: "IPS",
      response_time: "5ms"
    }
  },
  {
    name: "Acer Nitro VG270UP 27inch",
    basePrice: 5990000,
    categoryId: "507f1f77bcf86cd799439022",
    brand: "Acer",
    description: "Acer Nitro VG270UP 27inch 1440p 144Hz IPS Monitor",
    specs: {
      size: "27 inch",
      resolution: "2560x1440",
      refresh_rate: "144Hz",
      panel_type: "IPS",
      response_time: "1ms"
    }
  },
  // Keyboard Products
  {
    name: "Redragon K552 Yama",
    basePrice: 790000,
    categoryId: "507f1f77bcf86cd799439024",
    brand: "Redragon",
    description: "Redragon K552 Yama Mechanical Gaming Keyboard",
    specs: {
      layout: "Full Size",
      switches: "Outemu Brown",
      rgb: true,
      connectivity: "USB"
    }
  },
  // Mouse Products
  {
    name: "Redragon M686 Vampire",
    basePrice: 450000,
    categoryId: "507f1f77bcf86cd799439023",
    brand: "Redragon",
    description: "Redragon M686 Vampire Wireless Gaming Mouse",
    specs: {
      sensor: "PixArt 3335",
      dpi: "Up to 16000 DPI",
      battery: "Up to 70 hours",
      connectivity: "2.4GHz Wireless"
    }
  }
];

function generateProductId(index: number): string {
  return `507f1f77bcf86cd799439${(35 + index).toString().padStart(3, '0')}`;
}

function generateProducts(count: number = 100): any[] {
  const products: any[] = [];

  for (let i = 0; i < count; i++) {
    const template = productTemplates[i % productTemplates.length];
    const variantIndex = Math.floor(i / productTemplates.length);

    // Create variation
    const product = {
      _id: generateProductId(i),
      name: template.name + (variantIndex > 0 ? ` V${variantIndex + 1}` : ''),
      slug: template.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') +
            (variantIndex > 0 ? `-v${variantIndex + 1}` : ''),
      description: template.description,
      price: template.basePrice + (Math.random() * 1000000 - 500000), // Random price variation
      comparePrice: template.basePrice * 1.2, // 20% higher
      categoryId: template.categoryId,
      brand: template.brand,
      sku: `${template.brand.substring(0, 3).toUpperCase()}-${template.name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}-${i}`,
      stock: Math.floor(Math.random() * 50) + 5, // 5-55 stock
      isActive: true,
      isFeatured: Math.random() > 0.8, // 20% featured
      weight: 0.5 + Math.random() * 2, // 0.5-2.5kg
      dimensions: {
        length: 10 + Math.random() * 20,
        width: 5 + Math.random() * 15,
        height: 2 + Math.random() * 10
      },
      images: [
        {
          url: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800",
          alt: template.name,
          isPrimary: true
        }
      ],
      specs: template.specs,
      ratingAvg: 0,
      ratingCount: 0,
      tags: [template.brand.toLowerCase(), template.name.split(' ')[0].toLowerCase(), "tech"],
      seoTitle: `${template.name} - Mua chính hãng tại Snake Tech`,
      seoDescription: `Mua ${template.name} chính hãng giá tốt tại Snake Tech`
    };

    products.push(product);
  }

  return products;
}

// Generate and save to file
import fs from 'fs';
import path from 'path';

const products = generateProducts(90); // Generate 90 more products to reach 100 total
const filePath = path.join(__dirname, '../seed/data/products-mass-generated.json');

fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
console.log(`✅ Generated ${products.length} products and saved to ${filePath}`);










