/* eslint-disable camelcase */
/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();

const sellDAO = require('./../models/sellDAO');

router.post('/createSellList', async (req, res) => {
  try {
    const { product_id, user_id, sell_date } = req.body;
    const resp = await sellDAO.createSell(product_id, user_id, sell_date);
    res.json(resp);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
});

router.get('/getSellList', (req, res, next) => {
  const data = req.body

  sellDAO.getSellList(data.user_id, (resp) => {
    res.json(resp);
  });
});

router.get('/getBuyList', (req, res, next) => {
  const data = req.body

  sellDAO.getBuyList(data.user_id, (resp) => {
    res.json(resp);
  });
});

router.delete('/deleteSell/:sell_id', async (req, res, next) => {
  const params = req.params.sell_id;

  sellDAO.deleteSell(params, (resp) => {
    res.json(resp);
  });
});

module.exports = router;
