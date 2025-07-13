-- Table: public.emergencycontacts

-- DROP TABLE IF EXISTS public.emergencycontacts;

CREATE TABLE IF NOT EXISTS public.emergencycontacts
(
    id integer NOT NULL DEFAULT nextval('emergencycontacts_id_seq'::regclass),
    hn character varying(50) COLLATE pg_catalog."default" NOT NULL,
    prefix character varying(10) COLLATE pg_catalog."default" NOT NULL,
    nameemergency character varying(100) COLLATE pg_catalog."default" NOT NULL,
    surnameemergency character varying(100) COLLATE pg_catalog."default" NOT NULL,
    phone character varying(20) COLLATE pg_catalog."default" NOT NULL,
    relation character varying(50) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT emergencycontacts_pkey PRIMARY KEY (id),
    CONSTRAINT emergencycontacts_hn_fkey FOREIGN KEY (hn)
        REFERENCES public.patients (hn) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.emergencycontacts
    OWNER to postgres;