-- FUNCTION: public.update_product(integer, character varying, text, numeric, integer, sex_type, character varying, integer, character varying, character varying, character varying)

-- DROP FUNCTION IF EXISTS public.update_product(integer, character varying, text, numeric, integer, sex_type, character varying, integer, character varying, character varying, character varying);

CREATE OR REPLACE FUNCTION public.update_product(
	product_id integer,
	new_name character varying,
	new_description text,
	new_price numeric,
	new_stock_quantity integer,
	new_gender sex_type,
	new_size character varying,
	new_discount integer,
	new_brand character varying,
	new_category character varying,
	new_status character varying)
    RETURNS products
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    updated_product products;
BEGIN
    UPDATE products
    SET
        name = new_name,
        stock_quantity = new_stock_quantity,
        discount = new_discount,
        price = new_price,
        description = new_description,
        gender = new_gender,
        size = new_size,
        status = new_status,
        brand_id = (SELECT id FROM brands WHERE name = new_brand),
        category_id = (SELECT id FROM categories WHERE name = new_category)
    WHERE id = product_id
    RETURNING * INTO updated_product;

    RETURN updated_product;
END;
$BODY$;

ALTER FUNCTION public.update_product(integer, character varying, text, numeric, integer, sex_type, character varying, integer, character varying, character varying, character varying)
    OWNER TO postgres;
