-- FUNCTION: public.get_cart(integer)

-- DROP FUNCTION IF EXISTS public.get_cart(integer);

CREATE OR REPLACE FUNCTION public.get_cart(
	session_id_ integer)
    RETURNS TABLE(cart_item_id integer, prodcut_id integer, product_name character varying, quantity integer, unit_price integer, options_cost integer, subtotal integer) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
  RETURN QUERY
  SELECT
    cart_item.id as cart_item_id,
    products.id as product_id,
    products.name as product_name,
    cart_item.quantity as quantity,
    products.price as unit_price,
	COALESCE((cart_item.options->>'costs')::INTEGER, 0) as options_cost,
    cart_item.subtotal as subtotal
  FROM cart_item
  JOIN products ON cart_item.product_id = products.id
  WHERE cart_item.session_id = session_id_;
END;
$BODY$;

ALTER FUNCTION public.get_cart(integer)
    OWNER TO postgres;
