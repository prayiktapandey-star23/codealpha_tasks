const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Place order
router.post('/', auth, async (req, res) => {
  try {
    const { items, totalPrice, shippingAddress } = req.body;
    const order = await Order.create({ user: req.user.id, items, totalPrice, shippingAddress });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my orders
router.get('/myorders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;