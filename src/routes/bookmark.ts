import * as express from "express"
const router = express.Router();
import { logInOnly } from "../middlewares/passport-auth"
import BookmarkProcess from "../controllers/bookmarkProcess"

router.post("/bookmarks/:postId", logInOnly, BookmarkProcess.createbookmark);
router.delete("/bookmarks/:postId", logInOnly, BookmarkProcess.deleteBookmark);

export default router;

