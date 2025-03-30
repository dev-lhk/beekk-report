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

-- 가격대별 상품 개수를 조회하는 SQL 쿼리

SELECT 
  -- PRICE를 10,000으로 나눈 후 정수 부분만 취하고 다시 10,000을 곱해
  -- 해당 가격이 속하는 만 원 단위 가격대의 시작 값을 구합니다.
  -- 예: 17,000원 → (17,000 / 10,000) = 1.7 → 정수 부분 1 → 1 * 10,000 = 10,000
  -- 즉, 17,000원은 10,000원대(10,000 이상 20,000 미만)에 속합니다.
  (PRICE / 10000) * 10000 AS PRICE_GROUP,

  -- 각 가격대에 속하는 상품 개수를 셉니다.
  COUNT(*) AS PRODUCTS

FROM PRODUCT

-- PRICE_GROUP(만원 단위 가격대) 별로 그룹을 나눠서 각 그룹마다 상품 수를 셉니다.
GROUP BY PRICE_GROUP

-- 결과를 가격대 순으로 오름차순 정렬해서 출력합니다.
ORDER BY PRICE_GROUP ASC;
