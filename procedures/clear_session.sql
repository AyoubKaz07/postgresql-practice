-- PROCEDURE: public.clear_session(integer)

-- DROP PROCEDURE IF EXISTS public.clear_session(integer);

CREATE OR REPLACE PROCEDURE public.clear_session(
	IN shopping_session_id integer)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
	-- Delete cart items for the finalized session
  	DELETE FROM cart_item 
  	WHERE session_id = shopping_session_id;

  	-- Delete shopping session after the order is finalized
  	DELETE FROM shopping_session
  	WHERE id = shopping_session_id;
END
$BODY$;
ALTER PROCEDURE public.clear_session(integer)
    OWNER TO postgres;
