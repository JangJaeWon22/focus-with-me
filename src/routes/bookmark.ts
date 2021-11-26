import * as express from "express"
const router = express.Router();
import { logInOnly } from "../middlewares/passport-auth"
import bookmarkProcess from "../controllers/bookmarkProcess"

router.post("/bookmarks/:postId", logInOnly, bookmarkProcess.createbookmark);
router.delete("/bookmarks/:postId", logInOnly, bookmarkProcess.deleteBookmark);

module.exports = router;
