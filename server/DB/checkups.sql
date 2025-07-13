-- Table: public.checkups

-- DROP TABLE IF EXISTS public.checkups;

CREATE TABLE IF NOT EXISTS public.checkups
(
    id integer NOT NULL DEFAULT nextval('checkups_id_seq'::regclass),
    datepresent date NOT NULL,
    systolic integer,
    diastolic integer,
    symptoms text COLLATE pg_catalog."default",
    disease text COLLATE pg_catalog."default",
    initialresult text COLLATE pg_catalog."default",
    hn character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT checkups_pkey PRIMARY KEY (id),
    CONSTRAINT fk_checkups_patients FOREIGN KEY (hn)
        REFERENCES public.patients (hn) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.checkups
    OWNER to postgres;