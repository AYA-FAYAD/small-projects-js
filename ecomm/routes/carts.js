const express = require('express');
const cartsRsepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate =require('../views/carts/show')

const router = express.Router();

// Receive a post req to add an item to a cart

router.post('/cart/products', async (req, res) => {
    //  Figure out  the cart
    // to make cart use out if 
    let cart;
    if (!req.session.cartId) {
        // we dont have cart ,we need create one and store it
        cart = await cartsRsepo.create({ items: [] });
        req.session.cartId = cart.id
    } else {
        // we have cart lets get from the repository
        cart = await cartsRsepo.getOne(req.session.cartId);
    }

    // console.log(cart);
    const existingItem = cart.items.find(item => item.id === req.body.productId);
    if (existingItem) {
        // increment new product and save cart
        existingItem.quantity++;
    } else {
        // add new product id to items array
        cart.items.push({ id: req.body.productId, quantity: 1 });
    }

    await cartsRsepo.update(cart.id, {
        items : cart.items
    })


    // Either increment quantity for existing peoduct 
    // OR add new product to items arrat

    res.redirect('/cart')
})

// Receive a Get req to show all items in cart
router.get('/cart', async (req, res) => {
    if (!req.session.cartId) {
        return res.redirect('/')
    }

    const cart = await cartsRsepo.getOne(req.session.cartId);

    for (let item of cart.items) {
        // item === {id, qun: num}
        const product = await productsRepo.getOne(item.id);

        item.product = product;
    }
    
    res.send(cartShowTemplate({ items: cart.items }));
});

// Receive post req to delete an item from a cart

router.post('/cart/products/delete', async (req, res) => {
    const { itemId } = req.body;
    const cart = await cartsRsepo.getOne(req.session.cartId);
    
    const items = cart.items.filter(item => item.id !== itemId);

    await cartsRsepo.update(req.session.cartId, { items });

    res.redirect('/cart')



});

module.exports = router;