-- PROCEDURE: public.remove_from_cart(integer)

-- DROP PROCEDURE IF EXISTS public.remove_from_cart(integer);

CREATE OR REPLACE PROCEDURE public.remove_from_cart(
	IN cart_item_id integer)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
	DELETE FROM cart_item
	WHERE id = cart_item_id;
END;
$BODY$;
ALTER PROCEDURE public.remove_from_cart(integer)
    OWNER TO postgres;
