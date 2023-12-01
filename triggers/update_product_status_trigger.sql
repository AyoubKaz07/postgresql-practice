-- FUNCTION: public.update_product_status()

-- DROP FUNCTION IF EXISTS public.update_product_status();

CREATE OR REPLACE FUNCTION public.update_product_status()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
begin 
	IF NEW.stock_quantity = 0 THEN 
		NEW.status = 'Out of stock';
	ELSE 
		NEW.status = 'Available';
	END IF;
	RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.update_product_status()
    OWNER TO postgres;
