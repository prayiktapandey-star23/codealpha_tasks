const products = [
  {
    name: 'Wireless Headphones',
    description: 'Premium sound quality with noise cancellation and 30hr battery life',
    price: 2999,
    image: 'https://picsum.photos/seed/headphones/400/300',
    category: 'Electronics',
    stock: 15
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight and comfortable shoes perfect for daily running',
    price: 1999,
    image: 'https://picsum.photos/seed/shoes/400/300',
    category: 'Footwear',
    stock: 20
  },
  {
    name: 'Smart Watch',
    description: 'Track fitness, notifications and more with this stylish smartwatch',
    price: 4999,
    image: 'https://picsum.photos/seed/watch/400/300',
    category: 'Electronics',
    stock: 10
  },
  {
    name: 'Backpack',
    description: 'Durable 30L backpack with laptop compartment, perfect for travel',
    price: 1499,
    image: 'https://picsum.photos/seed/backpack/400/300',
    category: 'Bags',
    stock: 25
  },
  {
    name: 'Sunglasses',
    description: 'UV400 protection polarized sunglasses with stylish frame',
    price: 899,
    image: 'https://picsum.photos/seed/sunglasses/400/300',
    category: 'Accessories',
    stock: 30
  },
  {
    name: 'Coffee Mug',
    description: 'Insulated stainless steel mug keeps drinks hot for 12 hours',
    price: 499,
    image: 'https://picsum.photos/seed/mug/400/300',
    category: 'Kitchen',
    stock: 50
  },
  {
    name: 'Gaming Keyboard',
    description: 'Mechanical gaming keyboard with RGB lighting',
    price: 2499,
    image: 'https://picsum.photos/seed/keyboard/400/300',
    category: 'Electronics',
    stock: 15
  },
  {
    name: 'Water Bottle',
    description: 'Insulated stainless steel water bottle 1L',
    price: 599,
    image: 'https://picsum.photos/seed/bottle/400/300',
    category: 'Fitness',
    stock: 40
  }
];
module.exports = { products };

const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Products seeded successfully!');
    process.exit();
  })
  .catch(err => {
    console.log('Error:', err);
    process.exit(1);
  });
  