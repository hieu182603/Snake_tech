import { Request, Response } from 'express';
import { ShipperService } from './shipper.service.js';

export class ShipperController {
    /**
     * Register shipper
     */
    static async registerShipper(req: Request, res: Response) {
        try {
            const shipper = await ShipperService.registerShipper(req.body);
            return res.status(201).json(shipper);
        } catch (error: any) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Login shipper
     */
    static async loginShipper(req: Request, res: Response) {
        try {
            const result = await ShipperService.loginShipper(req.body);
            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(401).json({ message: error.message });
        }
    }

    /**
     * Update profile
     */
    static async updateProfile(req: Request, res: Response) {
        try {
            const shipperId = (req as any).user.userId;
            const profile = await ShipperService.updateProfile(shipperId, req.body);
            return res.status(200).json(profile);
        } catch (error: any) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get assignments
     */
    static async getAssignments(req: Request, res: Response) {
        try {
            const userId = (req as any).user.userId;
            const assignments = await ShipperService.getAssignments(userId);
            return res.status(200).json(assignments);
        } catch (error: any) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Update assignment status
     */
    static async updateAssignmentStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const shipperId = (req as any).user.userId;

            const assignment = await ShipperService.updateAssignmentStatus(id, shipperId, status);
            return res.status(200).json(assignment);
        } catch (error: any) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
