/* eslint-disable camelcase */
/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();

const productDAO = require('./../models/productDAO');

router.post('/checkProduct', async (req, res, next) => {
  const data = req.body.name;

  productDAO.checkProduct(data, (resp) => {
    res.json(resp);
  });
});

router.post('/addProduct', async (req, res, next) => {
  const data = req.body;

  productDAO.addProduct(data, (resp) => {
    res.json(resp);
  });
});

router.delete('/deleteProduct/:product_id', async (req, res, next) => {
  const params = req.params.product_id;

  productDAO.deleteProduct(params, (resp) => {
    res.json(resp);
  });
});

router.get('/getProductList', async (req, res, next) => {
  const data = req.query;

  productDAO.getProductList(data, (resp) => {
    res.json(resp);
  });
});

router.put('/updateState', async (req, res, next) => {
  const data = req.body;

  productDAO.updateState(data, (resp) => {
    res.json(resp);
  });
});

router.put('/likeCount', async (req, res, next) => {
  const data = req.body;

  productDAO.likeCount(data, (resp) => {
    res.json(resp);
  });
});

module.exports = router;