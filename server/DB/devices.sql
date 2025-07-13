-- Table: public.devices

-- DROP TABLE IF EXISTS public.devices;

CREATE TABLE IF NOT EXISTS public.devices
(
    device_id character varying COLLATE pg_catalog."default" NOT NULL,
    measurement text COLLATE pg_catalog."default",
    CONSTRAINT devices_pkey PRIMARY KEY (device_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.devices
    OWNER to postgres;