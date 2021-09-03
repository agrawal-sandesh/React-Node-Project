const express = require('express');
const routing = express.Router();
const db = require('../../dbConnection.js');

routing.post("/login", async(req, res, next) => {
    try {
        const { email, password } = req.body;
        if (email && password) {
            db.all(`SELECT * FROM customer_table WHERE Email='${email}' AND Password='${password}'`, (err, row) => {
                if (err) res.send({ status: 'failed', msg: err.message })
                if (row.length > 0) {
                    res.send({ status: 'success', msg: 'Login Successfully' })
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


routing.get("/categories", async(req, res, next) => {
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

routing.post("/products", async(req, res, next) => {
    try {
        const { CategoryID } = req.body;
        if (CategoryID) {
            db.all(`SELECT * FROM product_table WHERE CategoryID='${CategoryID}' and Isavailable=1`, (err, row) => {
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

routing.post("/productdetails", async(req, res, next) => {
    try {
        const { ProductId } = req.body;
        if (ProductId) {
            db.all(`SELECT * FROM product_table WHERE ProdID='${ProductId}'`, (err, row) => {
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


module.exports = routing;