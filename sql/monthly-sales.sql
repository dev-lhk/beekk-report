
DROP TABLE IF EXISTS FOOD_PRODUCT;
DROP TABLE IF EXISTS FOOD_ORDER;

CREATE TABLE FOOD_PRODUCT (
  PRODUCT_ID TEXT PRIMARY KEY,
  PRODUCT_NAME TEXT,
  PRODUCT_CD TEXT,
  CATEGORY TEXT,
  PRICE INTEGER
);

CREATE TABLE FOOD_ORDER (
  ORDER_ID TEXT PRIMARY KEY,
  PRODUCT_ID TEXT,
  AMOUNT INTEGER,
  PRODUCE_DATE TEXT, -- YYYY-MM-DD
  IN_DATE TEXT,
  OUT_DATE TEXT,
  FACTORY_ID TEXT,
  WAREHOUSE_ID TEXT
);

-- 전체 식품 데이터 삽입
INSERT INTO FOOD_PRODUCT (PRODUCT_ID, PRODUCT_NAME, PRODUCT_CD, CATEGORY, PRICE) VALUES
('P0011', '맛있는콩기름', 'CD_OL00001', '식용유', 4880),
('P0012', '맛있는올리브유', 'CD_OL00002', '식용유', 7200),
('P0013', '맛있는포도씨유', 'CD_OL00003', '식용유', 5950),
('P0014', '맛있는마조유', 'CD_OL00004', '식용유', 8950),
('P0015', '맛있는화조유', 'CD_OL00005', '식용유', 8800),
('P0016', '맛있는참기름', 'CD_OL00006', '식용유', 7100),
('P0017', '맛있는들기름', 'CD_OL00007', '식용유', 7900),
('P0018', '맛있는고추기름', 'CD_OL00008', '식용유', 6100),
('P0019', '맛있는카놀라유', 'CD_OL00009', '식용유', 5100),
('P0020', '맛있는산초유', 'CD_OL00010', '식용유', 6500);

-- 주문 데이터 삽입
INSERT INTO FOOD_ORDER VALUES
('OD00000056', 'P0012', 1000, '2022-04-04', '2022-04-21', '2022-04-25', 'FT19980002', 'WH003'),
('OD00000057', 'P0014', 2500, '2022-04-14', '2022-04-27', '2022-05-01', 'FT19980002', 'WH003'),
('OD00000058', 'P0017', 1200, '2022-05-19', '2022-05-28', '2022-05-28', 'FT20070002', 'WH003'),
('OD00000059', 'P0017', 1000, '2022-05-24', '2022-05-30', '2022-05-30', 'FT20070002', 'WH003'),
('OD00000060', 'P0019', 2000, '2022-05-29', '2022-06-08', '2022-06-08', 'FT20070002', 'WH003');

-- 월 총매출 조회 쿼리
SELECT
  p.PRODUCT_ID,
  p.PRODUCT_NAME,
  SUM(p.PRICE * o.AMOUNT) AS TOTAL_SALES
FROM FOOD_ORDER o
JOIN FOOD_PRODUCT p ON o.PRODUCT_ID = p.PRODUCT_ID
WHERE strftime('%Y', o.PRODUCE_DATE) = '2022'
  AND strftime('%m', o.PRODUCE_DATE) = '05'
GROUP BY p.PRODUCT_ID
ORDER BY TOTAL_SALES DESC, p.PRODUCT_ID ASC;