import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { cloudinary, uploadToCloudinary, deleteFromCloudinary } from '../../config/cloudinary.js';

// Configure multer for memory storage (for Cloudinary)
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file types
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

export class ImageService {
  static async uploadImage(
    userId: string,
    file: Express.Multer.File,
    folder: string = 'snake-tech/products'
  ): Promise<{
    publicId: string;
    url: string;
    secureUrl: string;
    format: string;
    width: number;
    height: number;
  }> {
    try {
      if (!file) {
        throw new Error('No file provided');
      }

      // Upload to Cloudinary
      const result = await uploadToCloudinary(file.buffer, folder, {
        public_id: `${userId}_${Date.now()}`,
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto' }
        ]
      });

      return {
        publicId: result.public_id,
        url: result.url,
        secureUrl: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
      };
    } catch (error) {
      console.error('Upload image error:', error);
      throw new Error('Failed to upload image');
    }
  }

  static async uploadMultipleImages(
    userId: string,
    files: Express.Multer.File[],
    folder: string = 'snake-tech/products'
  ): Promise<Array<{
    publicId: string;
    url: string;
    secureUrl: string;
    format: string;
    width: number;
    height: number;
  }>> {
    try {
      const uploadPromises = files.map(file =>
        this.uploadImage(userId, file, folder)
      );

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Upload multiple images error:', error);
      throw new Error('Failed to upload images');
    }
  }

  static async deleteImage(publicId: string): Promise<boolean> {
    try {
      await deleteFromCloudinary(publicId);
      return true;
    } catch (error) {
      console.error('Delete image error:', error);
      return false;
    }
  }

  static async deleteMultipleImages(publicIds: string[]): Promise<boolean> {
    try {
      const deletePromises = publicIds.map(publicId =>
        deleteFromCloudinary(publicId)
      );

      await Promise.all(deletePromises);
      return true;
    } catch (error) {
      console.error('Delete multiple images error:', error);
      return false;
    }
  }

  static getImageUrl(publicId: string, options: any = {}): string {
    return cloudinary.url(publicId, {
      secure: true,
      ...options,
    });
  }

  static getOptimizedImageUrl(publicId: string, width: number = 400, height: number = 400): string {
    return cloudinary.url(publicId, {
      secure: true,
      width,
      height,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto',
    });
  }

  static getThumbnailUrl(publicId: string, width: number = 150, height: number = 150): string {
    return cloudinary.url(publicId, {
      secure: true,
      width,
      height,
      crop: 'thumb',
      quality: 'auto',
    });
  }
}
