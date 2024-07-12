import express from "express"
import { checkAuth } from "../middleware/checkAuth.ts";
import { userController } from "../controllers/userController.ts";

const router = express.Router();

router.get('/', checkAuth, userController.getUsers.bind(userController));
router.put(
    '/block', 
    checkAuth, 
    userController.checkUsersID.bind(userController),
    userController.blockUsers.bind(userController)
);
router.put(
    '/unblock', 
    checkAuth, 
    userController.checkUsersID.bind(userController),
    userController.unblockUsers.bind(userController)
);
router.delete(
    '/delete', 
    checkAuth, 
    userController.checkUsersID.bind(userController),
    userController.deleteUsers.bind(userController)
);

export default router;