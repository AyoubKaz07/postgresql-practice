-- PROCEDURE: public.update_cart_item(integer, integer, jsonb, character varying)

-- DROP PROCEDURE IF EXISTS public.update_cart_item(integer, integer, jsonb, character varying);

CREATE OR REPLACE PROCEDURE public.update_cart_item(
	IN cart_item_id integer,
	IN new_quantity integer,
	IN new_options jsonb,
	IN med_pres character varying)
LANGUAGE 'plpgsql'
AS $BODY$

DECLARE
  product_price INTEGER;
BEGIN
  -- Update quantity and options
  UPDATE cart_item
  SET quantity = new_quantity, options = new_options, medical_prescription = med_pres
  WHERE id = cart_item_id;

  -- Retrieve the new product price
  SELECT price INTO product_price
  FROM products
  JOIN cart_item ON products.id = cart_item.product_id
  WHERE cart_item.id = cart_item_id;

  -- Update the subtotal
  UPDATE cart_item
  SET subtotal = ((product_price + COALESCE((new_options->>'costs')::INTEGER, 0)) * new_quantity)
  WHERE id = cart_item_id;
  
END;
$BODY$;
ALTER PROCEDURE public.update_cart_item(integer, integer, jsonb, character varying)
    OWNER TO postgres;
