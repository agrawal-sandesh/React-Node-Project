const express = require('express');
const routing = express.Router();
const db = require('../../dbConnection.js');
const Razorpay = require("razorpay");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const SECRET = '123456789892983u2djhfsghfrg'

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
                    const token = jwt.sign(final_res, SECRET, { expiresIn: 60 * 60 });
                    final_res.jwtToken = token;
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

const auth = (req, res, next) => {
    if (req && req.headers && req.headers.authorization) {
        let token = req.headers.authorization
        jwt.verify(token, SECRET, function(err, decoded) {
            if (err) {
                res.send({ status: 'failed', msg: err.message })
            } else {
                let currentUnixTime = Math.floor(new Date().getTime() / 1000);
                if (currentUnixTime > decoded.exp) {
                    res.send({ status: 'failed', msg: 'Token Expired' })
                } else {
                    next()
                }
            }
        });
    } else {
        res.send({ status: 'failed', msg: 'Token Missing' })
    }
}

routing.get("/categories", auth, async(req, res) => {
    try {
        db.all(`SELECT ct.category_id, ct.name as category_name, pt.product_id, pt.name as product_name, pt.is_available, pt.image FROM category_table ct
        INNER JOIN product_table pt on ct.category_id = pt.category_id ORDER BY ct.category_id;`, (err, row) => {
            if (err) {
                res.send({ status: 'failed', msg: err.message })
            }
            let finalRow = [];
            if (row.length > 0) {
                let uniqueCategoryId = '';
                let categoryObject = {};
                for (let i = 0; i <= row.length; i++) {
                    if (i === row.length) {
                        finalRow.push(categoryObject);
                        categoryObject = {};
                        uniqueCategoryId = '';
                    } else {
                        let categoryProduct = row[i];
                        let productObject = {
                            product_id: categoryProduct.product_id,
                            product_img: categoryProduct.image,
                            product_name: categoryProduct.product_name,
                            is_available: categoryProduct.is_available
                        }
                        if (uniqueCategoryId !== categoryProduct.category_id) {
                            if (Object.keys(categoryObject).length > 0) {
                                finalRow.push(categoryObject)
                                categoryObject = {}
                            }
                            categoryObject = {
                                category_id: categoryProduct.category_id,
                                category_name: categoryProduct.category_name,
                                products: [productObject]
                            }
                            uniqueCategoryId = categoryProduct.category_id
                        } else {
                            categoryObject.products.push(productObject);
                        }
                    }
                }
                res.send({ status: 'success', res: finalRow });
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
                    res.send({ status: 'failed', msg: "Cart Empty Shop Now ?" })
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
                WHERE ad.customer_id =${customerId} order by address_id desc`, (err, row) => {
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
            db.all(`UPDATE address_table SET is_default=0 WHERE customer_id=${customerId}`)
            db.all(`INSERT INTO address_table (address, customer_id, is_default)
                    VALUES('${address}', '${customerId}', '1')`, (err, row) => {
                if (err) {
                    res.send({ status: 'failed', msg: err.message })
                }
                if (!err) {
                    res.send({ status: 'success', msg: "New Address Inserted successfully" })
                } else {
                    res.send({ status: 'failed', msg: "Can not update the address" })
                }
            })
        } else {
            res.send({ status: 'failed', msg: 'Could not get customer ID' })
        }
    } catch (err) {
        res.send({ status: 'failed', msg: 'Something went wrong' })
    }
})

routing.post("/updateDefaultAddress", async(req, res) => {
    try {
        const { customerId } = req.body;
        const { addressId } = req.body;
        if (customerId) {
            db.all(`UPDATE address_table SET is_default=0 WHERE customer_id=${customerId}`)
            db.all(`UPDATE address_table SET is_default=1 WHERE address_id=${addressId}`, (err, row) => {
                if (err) {
                    res.send({ status: 'failed', msg: err.message })
                }
                if (!err) {
                    res.send({ status: 'success', msg: "New Address updated successfully" })
                } else {
                    res.send({ status: 'failed', msg: "Can not update the address" })
                }
            })
        } else {
            res.send({ status: 'failed', msg: 'Could not get customer ID' })
        }
    } catch (err) {
        res.send({ status: 'failed', msg: 'Something went wrong' })
    }
})

routing.post("/removeaddress", async(req, res) => {
    try {
        const { customerId } = req.body;
        const { addressId } = req.body;
        if (addressId) {
            db.all(`DELETE FROM address_table WHERE address_id='${addressId}' AND customer_id='${customerId}'`,
                (err, row) => {
                    if (err) {
                        res.send({ status: 'failed', msg: err.message })
                    }
                    if (!err) {
                        res.send({ status: 'success', msg: "Removed Address from Table" })
                    } else {
                        res.send({ status: 'failed', msg: "Can not Remove Address from the table" })
                    }
                })
        } else {
            res.send({ status: 'failed', msg: 'Could not get addressId' })
        }
    } catch (err) {
        res.send({ status: 'failed', msg: 'Something went wrong' })
    }
})

routing.post("/signup", async(req, res) => {
    try {
        let { name } = req.body;
        let { email } = req.body;
        let { contact } = req.body;
        let { password } = req.body;
        let { address } = req.body;
        if (name && email && contact && password && address) {
            db.all(`SELECT email, contact FROM customer_table WHERE email='${email}' 
            OR contact='${contact}' `, (err, row) => {
                if (err) {
                    res.send({ status: 'failed', msg: err.message })
                }
                if (row.length > 0) {
                    res.send({ status: 'failed', msg: "User already registered" })
                } else {
                    db.all(`INSERT INTO customer_table (name, email, contact, password)
                    VALUES('${name}', '${email}', '${contact}', '${password}')`, (err, row) => {
                        if (err) {
                            res.send({ status: 'failed', msg: err.message })
                        }
                        if (!err) {
                            db.all(`SELECT customer_id FROM customer_table WHERE email='${email}'`, (err, row) => {
                                if (err) {
                                    res.send({ status: 'failed', msg: err.message })
                                }
                                if (row) {
                                    const customerId = row[0].customer_id
                                    if (customerId) {
                                        db.all(`INSERT INTO address_table (address, customer_id,is_default)
                                        VALUES('${address}', '${customerId}',1)`, (err, row) => {
                                            if (err) {
                                                res.send({ status: 'failed', msg: err.message })
                                            }
                                            if (!err) {
                                                res.send({ status: 'success', msg: "Customer Details Added Successfully!" })
                                            } else {
                                                res.send({ status: 'failed', msg: "Can not Insert the address" })
                                            }
                                        })
                                    } else {
                                        res.send({ status: 'failed', msg: 'Could not get customer Id' })
                                    }
                                }
                            })
                        } else {
                            res.send({ status: 'failed', msg: "Can't find customer_id" })
                        }
                    })
                }

            })

        } else {
            res.send({ status: 'failed', msg: 'Could not get Form input' })
        }
    } catch (err) {
        res.send({ status: 'failed', msg: 'Something went wrong' })
    }
})

routing.post("/orders", async(req, res) => {
    try {
        const options = {
            amount: parseInt(req.body.amount) * 100,
            currency: "INR",
            receipt: "order_" + Math.floor((Math.random() * 10000000000000) + 1),
        };
        const order = await new Razorpay({
            key_id: 'rzp_test_rZ6Kw7FRxiZRsU',
            key_secret: 'KUoEbctKHoLQDoAeOlnbBH7v',
        }).orders.create(options);
        if (!order) return res.status(500).send("Some error occured");
        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
});

routing.post("/success", async(req, res) => {
    try {
        let {
            orderCreationId,
            razorpayPaymentId,
            razorpaySignature,
            customerId,
            addressId,
            totalAmount
        } = req.body;

        const shasum = crypto.createHmac("sha256", "KUoEbctKHoLQDoAeOlnbBH7v");
        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
        const digest = shasum.digest("hex");

        if (digest !== razorpaySignature)
            return res.status(400).json({ msg: "Transaction not legit!" });

        if (customerId && addressId && totalAmount && razorpayPaymentId) {
            db.all(`INSERT INTO order_table (payment_id, address_id, total_amount, payment_medium,
                     delivery_status, customer_id)
                        VALUES('${razorpayPaymentId}', '${addressId}','${totalAmount}', 'UPI',
                         'Delivery Pending','${customerId}')`, (err) => {
                if (err) res.send({ status: 'failed', msg: err.message })
                db.all(`SELECT order_id FROM order_table WHERE payment_id='${razorpayPaymentId}' order by order_id desc`, (err, row) => {
                    if (err) res.send({ status: 'failed', msg: err.message })
                    if (row) {
                        const orderId = row[0].order_id;
                        db.all(`SELECT ct.cart_id, ct.product_id, ct.quantity, pt.rate FROM cart_table ct INNER
                                                    JOIN product_table pt ON ct.product_id  = pt.product_id WHERE customer_id = '${customerId}'`,
                            (err, row) => {
                                if (err) res.send({ status: 'failed', msg: err.message })
                                if (row) {
                                    row.forEach(element => {
                                        db.all(`INSERT INTO order_product_table (order_id, product_id, quantity, rate, total_amount) 
                                                                    VALUES('${orderId}','${element.product_id}','${element.quantity}',
                                                                    '${element.rate}',
                                                                    '${(parseInt(element.rate)*parseInt(element.quantity))
                                                                        +(parseInt(element.rate)*parseInt(element.quantity))*8/100}')`,
                                            (err) => {
                                                if (err) {
                                                    res.send({ status: 'failed', msg: err.message })
                                                }
                                                db.all(`DELETE FROM cart_table WHERE cart_id='${element.cart_id}'`,
                                                    (err) => {
                                                        if (err) {
                                                            res.send({ status: 'failed', msg: err.message })
                                                        }
                                                    })
                                            });
                                    })
                                    res.send({ status: 'success', msg: "Operation Successful!" })
                                } else {
                                    res.send({ status: 'failed', msg: "Couldn't find the data" })
                                }
                            })
                    } else res.send({ status: 'failed', msg: 'Could not find order Id' })
                })
            })
        } else {
            res.send({ status: 'failed', msg: 'Could not get the required input to proceed' })
        }
    } catch (err) {
        res.send({ status: 'failed', msg: 'Something went wrong' })

    }
});

routing.post("/orderitems", async(req, res) => {
    try {
        const { customerId } = req.body;
        if (customerId) {
            db.all(`SELECT pt.name,pt.details,pt.image,ot.delivery_status, opt.quantity,opt.rate, opt.total_amount FROM order_table ot
            INNER JOIN order_product_table opt on ot.order_id = opt.order_id
            INNER JOIN product_table pt ON pt.product_id = opt.product_id 
            WHERE ot.customer_id ='${customerId}'`, (err, row) => {
                if (err) {
                    res.send({ status: 'failed', msg: err.message })
                }
                if (row.length > 0) {
                    res.send({ status: 'success', res: row })
                } else {
                    res.send({ status: 'failed', msg: "No orders Yet!" })
                }
            })
        } else {
            res.send({ status: 'failed', msg: 'Could not get customer ID' })
        }
    } catch (err) {
        res.send({ status: 'failed', msg: 'Something went wrong' })
    }
})

routing.post("/pushdata", (req, res) => {
    try {
        const name = req.body.title;
        const details = req.body.description;
        const rate = req.body.price;
        const image = req.body.image;
        const category_id = req.body.category;
        console.log(name)
        if (name && details && rate && image) {
            db.all(`INSERT INTO product_table (name, details, rate, is_available, category_id, image)
             VALUES('${name}', '${details}', '${rate}','1','${category_id}','${image}')`, (err) => {
                if (err) {
                    res.send({ status: 'failed', msg: err.message })
                }
                if (!err) {
                    res.send({ status: 'success', msg: "data pushed" })
                } else {
                    res.send({ status: 'failed', msg: "unable to push data" })
                }
            })
        } else {
            res.send({ status: 'failed', msg: 'can not read json data' })
        }
    } catch (err) {
        res.send({ status: 'failed', msg: 'Something went wrong' })
    }
})

module.exports = routing;
module.exports = routing;