import { Request, Response } from 'express';
import { ImageService } from './image.service.js';

export class ImageController {
    static async getImage(req: Request, res: Response) {
        try {
            const { filename } = req.params;
            const imagePath = await ImageService.getImage(filename);
            return res.sendFile(imagePath);
        } catch (error: any) {
            return res.status(404).json({ message: 'Image not found' });
        }
    }

    static async uploadImage(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;
            const file = req.file;
            const image = await ImageService.uploadImage(userId, file);
            return res.status(201).json(image);
        } catch (error: any) {
            return res.status(500).json({ message: 'Upload failed' });
        }
    }

    static async deleteImage(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req as any).user.userId;
            await ImageService.deleteImage(id, userId);
            return res.status(200).json({ message: 'Image deleted' });
        } catch (error: any) {
            return res.status(500).json({ message: 'Delete failed' });
        }
    }
}
