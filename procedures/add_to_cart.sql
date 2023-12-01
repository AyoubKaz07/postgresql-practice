-- PROCEDURE: public.add_to_cart(integer, integer, integer, jsonb, character varying)

-- DROP PROCEDURE IF EXISTS public.add_to_cart(integer, integer, integer, jsonb, character varying);

CREATE OR REPLACE PROCEDURE public.add_to_cart(
	IN session_id_ integer,
	IN product_id_ integer,
	IN quantity_ integer,
	IN optionsjson jsonb,
	IN med_pres character varying)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
  INSERT INTO cart_item(session_id, product_id, quantity, options, subtotal, medical_prescription)
  VALUES (
    session_id_,
    product_id_,
    quantity_,
    optionsJson,
    (((select price from products where id = product_id_) + COALESCE((optionsJson->>'costs')::INTEGER, 0)) * quantity_),
	med_pres
  )
  ON CONFLICT (session_id, product_id, options, medical_prescription)
  DO UPDATE
  SET 
    quantity = cart_item.quantity + excluded.quantity,
    subtotal = cart_item.subtotal + excluded.subtotal;

END;
$BODY$;
ALTER PROCEDURE public.add_to_cart(integer, integer, integer, jsonb, character varying)
    OWNER TO postgres;
