import express from "express"
import { blockUsers, deleteUsers, getUsers, unblockUsers } from "../controllers/userController.ts";
import { checkAuth } from "../middleware/checkAuth.ts";

const router = express.Router();

router.get('/', checkAuth, getUsers);

router.put('/block', checkAuth, blockUsers);
router.put('/unblock', checkAuth, unblockUsers);
router.delete('/delete', checkAuth, deleteUsers);

export default router;