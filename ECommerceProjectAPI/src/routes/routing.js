const express = require('express');
const routing = express.Router();
const db = require('../../dbConnection.js');

routing.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body;
        if (email && password) {
            db.all(`SELECT * FROM customer_table WHERE email='${email}' AND password='${password}'`, (err, row) => {
                if (err) res.send({ status: 'failed', msg: err.message })
                if (row.length > 0) {
                    final_res = {}
                    final_res.customer_id = row[0].customer_id;
                    final_res.name = row[0].name;
                    res.send({ status: 'success', msg: 'Login Successfully', res: final_res })
                } else {
                    res.send({ status: 'failed', msg: 'Authentication Failed' })
                }
            });
        } else {
            res.send({ status: 'failed', msg: 'Authentication Failed' })
        }
    } catch (err) {
        res.send({ status: 'failed', msg: 'Something went wrong' })
    }
})


routing.get("/categories", async(req, res) => {
    try {
        db.all(`SELECT * FROM category_table`, (err, row) => {
            if (err) {
                res.send({ status: 'failed', msg: err.message })
            }
            if (row.length > 0) {
                res.send({ status: 'success', res: row });
            } else {
                res.send({ status: 'failed', msg: 'No Data Found' })
            }
        });
    } catch (err) {
        res.send({ status: 'failed', msg: 'Something went wrong' })
    }
})

routing.post("/products", async(req, res) => {
    try {
        const { categoryId } = req.body;
        if (categoryId) {
            db.all(`SELECT * FROM product_table WHERE category_id='${categoryId}' and is_available=1`, (err, row) => {
                if (err) {
                    res.send({ status: 'failed', msg: err.message })
                }
                if (row.length > 0) {
                    res.send({ status: 'success', res: row })
                } else {
                    res.send({ status: 'failed', msg: "Product Unavailable for this Category" })
                }
            })
        } else {
            res.send({ status: 'failed', msg: 'Please provide category id' })
        }
    } catch (err) {
        res.send({ status: 'failed', msg: 'Something went wrong' })
    }
})

routing.post("/productdetails", async(req, res) => {
    try {
        const { productId, customerId } = req.body;
        if (productId) {
            db.all(`
                SELECT 
                pt.*, 
                (
                    SELECT ct.cart_id 
                    FROM cart_table ct 
                    WHERE ct.product_id='${productId}' AND ct.customer_id='${customerId}'
                ) as cart_id 
                FROM product_table pt 
                WHERE pt.product_id='${productId}'`, (err, row) => {
                if (err) {
                    res.send({ status: 'failed', msg: err.message })
                }
                if (row.length > 0) {
                    res.send({ status: 'success', res: row })
                } else {
                    res.send({ status: 'failed', msg: "No details found" })
                }
            })
        } else {
            res.send({ status: 'failed', msg: 'Please provide Product id' })
        }
    } catch (err) {
        res.send({ status: 'failed', msg: 'Something went wrong' })
    }
})

routing.post("/addcart", async(req, res) => {
    try {
        const { productId, customerId } = req.body;
        if (productId && customerId) {
            db.all(`INSERT INTO cart_table (product_id, customer_id, quantity)
             VALUES('${productId}', '${customerId}', '1')`, (err, row) => {
                if (err) {
                    res.send({ status: 'failed', msg: err.message })
                }
                if (!err) {
                    res.send({ status: 'success', msg: "Product added into cart" })
                } else {
                    res.send({ status: 'failed', msg: "Can not Add into the cart" })
                }
            })
        } else {
            res.send({ status: 'failed', msg: 'Could not get product ID or customer ID' })
        }
    } catch (err) {
        res.send({ status: 'failed', msg: 'Something went wrong' })
    }
})

routing.post("/mycart", async(req, res) => {
    try {
        const { customerId } = req.body;
        if (customerId) {
            db.all(`SELECT pt.*, ct.cart_id, ct.quantity FROM cart_table as ct
                INNER Join product_table pt on ct.product_id=pt.product_id
                WHERE ct.customer_id ='${customerId}'`, (err, row) => {
                if (err) {
                    res.send({ status: 'failed', msg: err.message })
                }
                if (row.length > 0) {
                    res.send({ status: 'success', res: row })
                } else {
                    res.send({ status: 'failed', msg: "Cart Empty" })
                }
            })
        } else {
            res.send({ status: 'failed', msg: 'Could not get customer ID' })
        }
    } catch (err) {
        res.send({ status: 'failed', msg: 'Something went wrong' })
    }
})

routing.post("/removecartitem", async(req, res) => {
    try {
        const { cartId } = req.body;
        if (cartId) {
            db.all(`DELETE FROM cart_table WHERE cart_id='${cartId}'`, (err, row) => {
                if (err) {
                    res.send({ status: 'failed', msg: err.message })
                }
                if (!err) {
                    res.send({ status: 'success', msg: "Removed Product from Cart" })
                } else {
                    res.send({ status: 'failed', msg: "Can not Remove item from the cart" })
                }
            })
        } else {
            res.send({ status: 'failed', msg: 'Could not get cart ID' })
        }
    } catch (err) {
        res.send({ status: 'failed', msg: 'Something went wrong' })
    }
})

routing.post("/decrementcartitem", async(req, res) => {
    try {
        const { cartId } = req.body;
        if (cartId) {
            db.all(`UPDATE cart_table SET quantity=quantity-1 WHERE cart_id=${cartId}`, (err, row) => {
                if (err) {
                    res.send({ status: 'failed', msg: err.message })
                }
                if (!err) {
                    res.send({ status: 'success', msg: "Quantity Updated" })
                } else {
                    res.send({ status: 'failed', msg: "Can not update cart" })
                }
            })
        } else {
            res.send({ status: 'failed', msg: 'Could not get cart ID' })
        }
    } catch (err) {
        res.send({ status: 'failed', msg: 'Something went wrong' })
    }
})

routing.post("/incrementcartitem", async(req, res) => {
    try {
        const { cartId } = req.body;
        if (cartId) {
            db.all(`UPDATE cart_table SET quantity=quantity+1 WHERE cart_id=${cartId}`, (err, row) => {
                if (err) {
                    res.send({ status: 'failed', msg: err.message })
                }
                if (!err) {
                    res.send({ status: 'success', msg: "Quantity Updated" })
                } else {
                    res.send({ status: 'failed', msg: "Can not update cart" })
                }
            })
        } else {
            res.send({ status: 'failed', msg: 'Could not get cart ID' })
        }
    } catch (err) {
        res.send({ status: 'failed', msg: 'Something went wrong' })
    }
})

routing.post("/address", async(req, res) => {
    try {
        const { customerId } = req.body;
        if (customerId) {
            db.all(`SELECT ad.*, ct.name, ct.email , ct.contact FROM address_table ad
                Inner join customer_table ct on ad.customer_id = ct.customer_id
                WHERE ad.customer_id =${customerId}`, (err, row) => {
                if (err) {
                    res.send({ status: 'failed', msg: err.message })
                }
                if (row.length > 0) {
                    res.send({ status: 'success', res: row })
                } else {
                    res.send({ status: 'failed', msg: "No Adress for found for the Customer" })
                }
            })
        } else {
            res.send({ status: 'failed', msg: 'Could not get customer ID' })
        }
    } catch (err) {
        res.send({ status: 'failed', msg: 'Something went wrong' })
    }
})

routing.post("/addaddress", async(req, res) => {
    try {
        const { customerId } = req.body;
        const { address } = req.body;
        if (customerId) {
            db.all(`INSERT INTO address_table (address, customer_id, is_default)
                    VALUES('${address}', '${customerId}', '1')`, (err, row) => {
                if (err) {
                    res.send({ status: 'failed', msg: err.message })
                }
                if (row.length > 0) {
                    res.send({ status: 'success', res: row })
                } else {
                    res.send({ status: 'failed', msg: "No Adress for the Customer" })
                }
            })
        } else {
            res.send({ status: 'failed', msg: 'Could not get customer ID' })
        }
    } catch (err) {
        res.send({ status: 'failed', msg: 'Something went wrong' })
    }
})

module.exports = routing;