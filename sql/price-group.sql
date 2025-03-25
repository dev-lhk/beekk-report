DROP TABLE IF EXISTS PRODUCT;

CREATE TABLE PRODUCT (
  PRODUCT_ID INTEGER PRIMARY KEY,
  PRODUCT_CODE TEXT,
  PRICE INTEGER
);

INSERT INTO PRODUCT (PRODUCT_ID, PRODUCT_CODE, PRICE) VALUES
(1, 'A1000011', 10000),
(2, 'A1000045', 9000),
(3, 'C3000002', 22000),
(4, 'C3000006', 15000),
(5, 'C3000010', 30000),
(6, 'K1000023', 17000);

-- 가격대별 상품개수 조회 쿼리
SELECT 
  (PRICE / 10000) * 10000 AS PRICE_GROUP,
  COUNT(*) AS PRODUCTS
FROM PRODUCT
GROUP BY PRICE_GROUP
ORDER BY PRICE_GROUP ASC;