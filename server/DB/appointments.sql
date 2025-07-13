-- Table: public.appointments

-- DROP TABLE IF EXISTS public.appointments;

CREATE TABLE IF NOT EXISTS public.appointments
(
    id integer NOT NULL DEFAULT nextval('appointments_id_seq'::regclass),
    hn character varying COLLATE pg_catalog."default" NOT NULL,
    datetimeappoint timestamp without time zone NOT NULL,
    department text COLLATE pg_catalog."default",
    doctor text COLLATE pg_catalog."default",
    beforedoc text COLLATE pg_catalog."default",
    labresult text COLLATE pg_catalog."default",
    xrayresult text COLLATE pg_catalog."default",
    CONSTRAINT appointments_pkey PRIMARY KEY (id),
    CONSTRAINT fk_appointments_patients FOREIGN KEY (hn)
        REFERENCES public.patients (hn) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.appointments
    OWNER to postgres;