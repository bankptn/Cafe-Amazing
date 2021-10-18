DROP TABLE invoice_line_item;

CREATE TABLE invoice_line_item
(
    id integer,
    lineitem integer NOT NULL,
    invoice_no character varying(10) NOT NULL,
    product_code character varying(10) NOT NULL,
    quantity integer,
    unit_price numeric(18,2),
    extended_price numeric(18,2),
    CONSTRAINT invoice_line_item_pkey PRIMARY KEY (invoice_no, lineitem),
    CONSTRAINT invoice_line_item_product_product_code_fkey FOREIGN KEY (product_code)
        REFERENCES product (code) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);


CREATE TABLE receipt_line_item
(
    id integer,
    lineitem integer NOT NULL,
    receipt_no character varying(10) NOT NULL,
    invoice_no character varying(10) NOT NULL,
    amount_paid_here numeric(18,2),
    CONSTRAINT receipt_line_item_pkey PRIMARY KEY (receipt_no, invoice_no, lineitem),
    CONSTRAINT receipt_line_item_invoice_invoice_no_fkey FOREIGN KEY (invoice_no)
        REFERENCES invoice (invoice_no) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)