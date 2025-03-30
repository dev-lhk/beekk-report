DROP TABLE IF EXISTS ONLINE_SALE;

CREATE TABLE ONLINE_SALE (
  ONLINE_SALE_ID INTEGER PRIMARY KEY,
  USER_ID INTEGER NOT NULL,
  PRODUCT_ID INTEGER NOT NULL,
  SALES_AMOUNT INTEGER NOT NULL,
  SALES_DATE TEXT NOT NULL -- YYYY-MM-DD
);

INSERT INTO ONLINE_SALE VALUES
(1, 1, 3, 2, '2022-02-25'),
(2, 1, 4, 1, '2022-03-01'),
(3, 1, 3, 3, '2022-03-31'),
(4, 2, 4, 2, '2022-03-12'),
(5, 3, 5, 1, '2022-04-03'),
(6, 2, 4, 1, '2022-04-06'),
(7, 1, 4, 2, '2022-05-11');

-- 재구매 회원 리스트를 구하는 SQL 쿼리입니다.
-- 특정 회원(USER_ID)이 같은 상품(PRODUCT_ID)을 두 번 이상 구매한 경우를 찾습니다.

SELECT
  USER_ID,       -- 회원 ID
  PRODUCT_ID     -- 상품 ID
FROM ONLINE_SALE
-- ONLINE_SALE 테이블을 기준으로 아래 조건을 적용합니다.
GROUP BY USER_ID, PRODUCT_ID
-- 같은 회원이 같은 상품을 여러 번 구매했는지 확인하기 위해
-- USER_ID와 PRODUCT_ID 조합으로 그룹을 묶습니다.

HAVING COUNT(*) > 1
-- 그룹으로 묶은 결과 중, 구매 기록이 2건 이상인 경우만 필터링합니다.
-- 즉, 동일한 회원이 동일한 상품을 '재구매'한 경우만 추립니다.

ORDER BY USER_ID ASC, PRODUCT_ID DESC;
-- 결과를 회원 ID 기준으로 오름차순 정렬하고,
-- 회원 ID가 같은 경우에는 상품 ID를 기준으로 내림차순 정렬합니다.
