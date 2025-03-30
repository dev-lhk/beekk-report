
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

-- 1. FOOD_ORDER와 FOOD_PRODUCT 테이블을 조인해서 필요한 데이터를 함께 조회합니다.
--    조인의 기준은 FOOD_ORDER의 PRODUCT_ID와 FOOD_PRODUCT의 PRODUCT_ID가 일치하는 것입니다.
SELECT
  p.PRODUCT_ID,               -- 식품 ID
  p.PRODUCT_NAME,             -- 식품 이름
  SUM(p.PRICE * o.AMOUNT) AS TOTAL_SALES  -- 총매출 = 단가(PRICE) * 주문 수량(AMOUNT)을 모두 더한 값
FROM FOOD_ORDER o            -- FOOD_ORDER 테이블을 o라는 별칭으로 사용
JOIN FOOD_PRODUCT p          -- FOOD_PRODUCT 테이블을 p라는 별칭으로 사용
  ON o.PRODUCT_ID = p.PRODUCT_ID  -- 조인 조건: 두 테이블의 PRODUCT_ID가 같을 때만 데이터 결합

-- 2. 생산일자(PRODUCE_DATE)가 2022년 5월인 주문만 필터링합니다.
--    strftime 함수는 날짜에서 원하는 형식(연도, 월 등)을 추출할 수 있습니다.
WHERE strftime('%Y', o.PRODUCE_DATE) = '2022'  -- 연도 추출: 2022년인 데이터만
  AND strftime('%m', o.PRODUCE_DATE) = '05'    -- 월 추출: 5월인 데이터만

-- 3. PRODUCT_ID 기준으로 그룹을 묶고(식품별로),
--    같은 제품의 주문이 여러 건 있더라도 하나로 묶어 총매출을 계산합니다.
GROUP BY p.PRODUCT_ID

-- 4. 결과 정렬 기준:
--    - 먼저 총매출이 높은 순서로 정렬 (내림차순)
--    - 총매출이 같을 경우에는 PRODUCT_ID 기준으로 오름차순 정렬
ORDER BY TOTAL_SALES DESC,   -- 총매출이 높은 것부터 먼저
         p.PRODUCT_ID ASC;   -- 총매출이 같으면 식품 ID가 빠른 순으로
