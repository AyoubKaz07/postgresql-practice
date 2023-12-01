-- PROCEDURE: public.finalize_order(integer, jsonb, integer, character varying, character varying)

-- DROP PROCEDURE IF EXISTS public.finalize_order(integer, jsonb, integer, character varying, character varying);

CREATE OR REPLACE PROCEDURE public.finalize_order(
	IN shopping_session_id integer,
	IN shipping_details_ jsonb,
	IN amount_ integer,
	IN method_ character varying,
	IN status_ character varying)
LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
    last_order_id INTEGER;
    new_payment_id INTEGER;
BEGIN
    -- Insert order details and get the last inserted order_id
    INSERT INTO order_details (customer_id, shipping_details, total) VALUES(
    	(SELECT customer_id
   		FROM shopping_session
    	WHERE id = shopping_session_id),
		shipping_details_,
		amount_
	)
    RETURNING id INTO last_order_id;

    -- Move cart items to order_items
    INSERT INTO order_items (order_id, product_id, quantity, options, subtotal, medical_prescription)
    SELECT
        last_order_id,
        ci.product_id,
        ci.quantity,
        ci.options,
        (COALESCE((ci.options->>'costs')::INTEGER, 0) + p.price) * ci.quantity AS subtotal,
        ci.medical_prescription
    FROM cart_item ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.session_id = shopping_session_id;

    -- Update product stock quantities based on cart_item data
    UPDATE products p
    SET stock_quantity = p.stock_quantity - ci.quantity
    FROM cart_item ci
    WHERE p.id = ci.product_id
        AND ci.session_id = shopping_session_id;

    -- Insert payment details
    INSERT INTO payment_details(amount, method, status)
    VALUES (amount_, method_, status_)
    RETURNING id INTO new_payment_id;

    -- Update order_details with payment_id
    UPDATE order_details
    SET payment_id = new_payment_id
    WHERE id = last_order_id;

    -- Clear shopping session
    CALL clear_session(shopping_session_id);
END;
$BODY$;
ALTER PROCEDURE public.finalize_order(integer, jsonb, integer, character varying, character varying)
    OWNER TO postgres;
