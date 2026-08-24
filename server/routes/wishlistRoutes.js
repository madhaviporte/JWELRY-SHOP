const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

router.use(protect);

router.get("/", getWishlist);
router.post("/toggle", toggleWishlist);
router.delete("/:productId", removeFromWishlist);

module.exports = router;
