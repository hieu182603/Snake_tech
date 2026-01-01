import { Router } from 'express';
import { RFQController } from './rfq.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

// All RFQ routes require authentication
router.use(authMiddleware);

router.post('/', RFQController.createRFQ);
router.get('/my', RFQController.getMyRFQs);
router.get('/:id', RFQController.getRFQById);

export default router;
