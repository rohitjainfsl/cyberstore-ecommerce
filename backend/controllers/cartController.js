import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Add a product to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const itemIndex = user.cart.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            // If product exists in cart, update the quantity
            user.cart[itemIndex].quantity += (quantity || 1);
        } else {
            // Otherwise, add new item to cart
            user.cart.push({ product: productId, quantity: quantity || 1 });
        }

        await user.save();
        res.status(200).json(user.cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('cart.product', 'name price description');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove product from cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeFromCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.cart = user.cart.filter(item => item.product.toString() !== req.params.productId);
        await user.save();

        res.status(200).json(user.cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
