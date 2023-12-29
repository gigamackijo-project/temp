/* eslint-disable camelcase */
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_USER_URL,
  port: process.env.DB_USER_PORT,
  user: process.env.DB_USER_USER,
  password: process.env.DB_USER_PASSWORD,
  database: process.env.DB_USER_DATABASE,
  connectionLimit: 10,
});
if (pool) console.log(`database connected...`);

const sql = {
  checkProduct: 'SELECT * FROM product WHERE name = ?',
  addProduct: 'INSERT INTO product(name, cost_price, sale_price, ex_date, barcode, info, user_id) VALUES(?, ?, ?, ?, ?, ?, ?)',
  getProductList: 'SELECT * FROM product ORDER BY created_at DESC LIMIT ?, ?',
  deleteProduct: 'DELETE FROM product WHERE product_id = ?',
  updateState: `UPDATE product SET state = '판매완료' WHERE product_id = ?`,
  likeCount: `UPDATE product SET like_count = like_count + 1 WHERE product_id = ?`
};

const productDAO = {
  checkProduct: async (name, callback) => {
    let conn = null;
    try {
      conn = await pool.getConnection();

      const [resp] = await conn.query(sql.checkProduct, name);

      if (resp[0]) {
        callback({ status: 200, message: 'OK', data: resp[0] });
      } else {
        callback({ status: 404, message: '상품을 찾을 수 없습니다' });
      }
    } catch (error) {
      callback({ status: 500, message: '상품 찾기 실패', error });
    } finally {
      if (conn !== null) conn.release();
    }
  },

addProduct: async (item, callback) => {
  const { name, cost_price, sale_price, ex_date, barcode, info, user_id } = item;

  let conn = null;
  try {
    conn = await pool.getConnection();

    const [resp] = await conn.query(sql.addProduct, [name, cost_price, sale_price, ex_date, barcode, info, user_id]);

    callback({ status: 200, message: 'OK', data: resp });
  } catch (error) {
    callback({ status: 500, message: '상품 추가 실패', error });
  } finally {
    if (conn !== null) conn.release();
  }
},

deleteProduct: async (product_id, callback) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [resp] = await conn.query(sql.deleteProduct, product_id);
    conn.commit();    

    callback({ status: 200, message: 'OK', data: resp });
  } catch (error) {
    conn.rollback();
    callback({ status: 500, message: '상품 삭제 실패', error });
  } finally {
    if (conn !== null) conn.release();
  }
},

getProductList: async (product_id, callback) => {
  const pageNo = Number(product_id.pageNo) - 1 || 0;
  const pageSize = Number(product_id.pageSize) || 10;

  let conn = null;
  try {
    conn = await pool.getConnection();

    const [resp] = await conn.query(sql.getProductList, [pageNo * pageSize, pageSize]);

    callback({ status: 200, message: 'OK', pageNo: pageNo + 1, pageSize, resp });
  } catch (error) {
    callback({ status: 500, message: '상품 목록 조회 실패', error });
  } finally {
    if (conn !== null) conn.release();
  }
},

updateState: async (item, callback) => {
  let conn = null;
  try {
      conn = await pool.getConnection();
      conn.beginTransaction();

      const [resp] = await conn.query(sql.updateState, [item.product_id]);
      conn.commit();    

    callback({ status: 200, message: 'OK', data: resp });
  } catch (error) {
    conn.rollback();
    callback({ status: 500, message: '판매상태 업데이트 실패', error });
  } finally {
    if (conn !== null) conn.release();
  }
},

likeCount: async (item, callback) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    conn.beginTransaction();

    const [resp] = await conn.query(sql.likeCount, [item.product_id]);
    conn.commit();

    callback({ status: 200, message: 'OK', data: resp });
  } catch (error) {
    conn.rollback();
    callback({ status: 500, message: '좋아요 수 증가 실패', error });
  } finally {
    if (conn !== null) conn.release();
  }
},

};


module.exports = productDAO;