-- PROCEDURE: public.check_stock(integer)

-- DROP PROCEDURE IF EXISTS public.check_stock(integer);

CREATE OR REPLACE PROCEDURE public.check_stock(
	IN shopping_session_id integer)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    product_name varchar;

BEGIN
    -- Check if any product's quantity exceeds the available stock
    SELECT p.name INTO product_name
    FROM cart_item ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.session_id = shopping_session_id
    AND ci.quantity > p.stock_quantity
    LIMIT 1;

    -- Raise an error if any product quantity exceeds the stock
    IF product_name IS NOT NULL THEN
        RAISE EXCEPTION '% has insufficient stock', product_name;
    END IF;
END;
$BODY$;
ALTER PROCEDURE public.check_stock(integer)
    OWNER TO postgres;
