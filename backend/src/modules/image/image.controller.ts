import { Request, Response } from 'express';
import { ImageService, upload } from './image.service.js';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export class ImageController {
  static async uploadImage(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const file = req.file;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const result = await ImageService.uploadImage(userId, file);
      res.status(201).json({
        message: 'Image uploaded successfully',
        data: result
      });
    } catch (error: any) {
      console.error('Upload image error:', error);
      res.status(500).json({ message: error.message || 'Upload failed' });
    }
  }

  static async uploadMultipleImages(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const files = req.files as Express.Multer.File[];

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (!files || files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }

      const results = await ImageService.uploadMultipleImages(userId, files);
      res.status(201).json({
        message: `${files.length} images uploaded successfully`,
        data: results
      });
    } catch (error: any) {
      console.error('Upload multiple images error:', error);
      res.status(500).json({ message: error.message || 'Upload failed' });
    }
  }

  static async deleteImage(req: Request, res: Response) {
    try {
      const { publicId } = req.params;

      if (!publicId) {
        return res.status(400).json({ message: 'Public ID is required' });
      }

      const result = await ImageService.deleteImage(publicId);

      if (result) {
        res.json({ message: 'Image deleted successfully' });
      } else {
        res.status(404).json({ message: 'Image not found or delete failed' });
      }
    } catch (error: any) {
      console.error('Delete image error:', error);
      res.status(500).json({ message: error.message || 'Delete failed' });
    }
  }

  static async deleteMultipleImages(req: Request, res: Response) {
    try {
      const { publicIds } = req.body;

      if (!publicIds || !Array.isArray(publicIds)) {
        return res.status(400).json({ message: 'Public IDs array is required' });
      }

      const result = await ImageService.deleteMultipleImages(publicIds);

      if (result) {
        res.json({ message: `${publicIds.length} images deleted successfully` });
      } else {
        res.status(500).json({ message: 'Some images could not be deleted' });
      }
    } catch (error: any) {
      console.error('Delete multiple images error:', error);
      res.status(500).json({ message: error.message || 'Delete failed' });
    }
  }

  static async getImageUrl(req: Request, res: Response) {
    try {
      const { publicId } = req.params;
      const { width, height, type } = req.query;

      if (!publicId) {
        return res.status(400).json({ message: 'Public ID is required' });
      }

      let url: string;

      switch (type) {
        case 'thumbnail':
          url = ImageService.getThumbnailUrl(publicId, Number(width) || 150, Number(height) || 150);
          break;
        case 'optimized':
          url = ImageService.getOptimizedImageUrl(publicId, Number(width) || 400, Number(height) || 400);
          break;
        default:
          url = ImageService.getImageUrl(publicId, {
            width: width ? Number(width) : undefined,
            height: height ? Number(height) : undefined,
          });
      }

      res.json({ url });
    } catch (error: any) {
      console.error('Get image URL error:', error);
      res.status(500).json({ message: error.message || 'Failed to get image URL' });
    }
  }

  // Middleware for multer
  static getUploadMiddleware() {
    return upload.single('image');
  }

  static getUploadMultipleMiddleware() {
    return upload.array('images', 10); // Max 10 images
  }
}