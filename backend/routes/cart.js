const express = require('express');
const router = express.Router();

// Cart is handled on frontend (localStorage), this is a placeholder
router.get('/', (req, res) => {
  res.json({ message: 'Cart is managed on frontend' });
});

module.exports = router;