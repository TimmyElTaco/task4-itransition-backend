import express from "express"
import { blockUsers, deleteUsers, getUsers, unblockUsers } from "../controllers/userController.ts";
import { checkAuth } from "../middleware/checkAuth.ts";

const router = express.Router();

router.get('/', checkAuth, getUsers);

router.post('/block', checkAuth, blockUsers);
router.post('/unblock', checkAuth, unblockUsers);
router.post('/delete', checkAuth, deleteUsers);

export default router;