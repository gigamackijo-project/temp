/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();

const wishlistDAO = require('./../models/wishlistDAO'); // Adjust the path as needed


// id로 위시리스트 검색
router.get('/checkWishlist/:wishId', async (req, res, next) => {
  const params = req.params.wishId;

  wishlistDAO.checkWishlist(params, (resp) => {
    res.json(resp);
  });
});


// 위시 리스트
router.get('/getWishlist', async (req, res, next) => {
  wishlistDAO.getWishlist((resp) => {
    res.json(resp);
  });
});

// Add a product to the wishlist
router.post('/addWishlist', async (req, res, next) => {
  const data = req.body; 

  wishlistDAO.addWishlist(data, (resp) => {
    res.json(resp);
  });
});

// Remove a product from the wishlist
router.delete('/deleteWishlist/:wishId', async (req, res, next) => {
  const params = req.params.wishId;

  wishlistDAO.deleteWishlist(params, (resp) => {
    res.json(resp);
  });
});


module.exports = router;