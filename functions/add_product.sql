-- FUNCTION: public.add_product(character varying, text, numeric, integer, sex_type, character varying, integer, character varying, character varying)

-- DROP FUNCTION IF EXISTS public.add_product(character varying, text, numeric, integer, sex_type, character varying, integer, character varying, character varying);

CREATE OR REPLACE FUNCTION public.add_product(
	new_name character varying,
	new_description text,
	new_price numeric,
	new_stock_quantity integer,
	new_gender sex_type,
	new_size character varying,
	new_discount integer,
	new_brand character varying,
	new_category character varying)
    RETURNS products
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    added_product products;
BEGIN
    INSERT INTO products (
        name, description, price, stock_quantity,
        gender, size, discount, brand_id, category_id
    ) VALUES (
        new_name, new_description, new_price, new_stock_quantity,
        new_gender, new_size, new_discount,
        (SELECT id FROM brands WHERE name = new_brand),
        (SELECT id FROM categories WHERE name = new_category)
    )
    RETURNING * INTO added_product;

    RETURN added_product;
END;
$BODY$;

ALTER FUNCTION public.add_product(character varying, text, numeric, integer, sex_type, character varying, integer, character varying, character varying)
    OWNER TO postgres;
