-- Table: public.patients

-- DROP TABLE IF EXISTS public.patients;

CREATE TABLE IF NOT EXISTS public.patients
(
    hn character varying COLLATE pg_catalog."default" NOT NULL,
    prefix character varying(10) COLLATE pg_catalog."default",
    namepat character varying(100) COLLATE pg_catalog."default" NOT NULL,
    surnamepat character varying(100) COLLATE pg_catalog."default" NOT NULL,
    datepat timestamp with time zone NOT NULL,
    born date NOT NULL,
    gender character varying(10) COLLATE pg_catalog."default" NOT NULL,
    address text COLLATE pg_catalog."default",
    symptomspat text COLLATE pg_catalog."default",
    doctorpat character varying(255) COLLATE pg_catalog."default",
    emi character varying(50) COLLATE pg_catalog."default",
    disease text COLLATE pg_catalog."default",
    allergy text COLLATE pg_catalog."default",
    treatmenthistory text COLLATE pg_catalog."default",
    surgeryhistory text COLLATE pg_catalog."default",
    bloodgroup character varying(3) COLLATE pg_catalog."default",
    weight numeric(5,2),
    height numeric(5,1),
    phonepat character varying(10) COLLATE pg_catalog."default",
    CONSTRAINT patients_pkey PRIMARY KEY (hn)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.patients
    OWNER to postgres;