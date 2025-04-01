--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: atributos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.atributos (
    id integer NOT NULL,
    nombre character varying NOT NULL,
    tipo_dato character varying NOT NULL,
    requerido boolean NOT NULL,
    tipo_de_documento_id integer NOT NULL
);


ALTER TABLE public.atributos OWNER TO postgres;

--
-- Name: atributos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.atributos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.atributos_id_seq OWNER TO postgres;

--
-- Name: atributos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.atributos_id_seq OWNED BY public.atributos.id;


--
-- Name: bloques; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bloques (
    id integer NOT NULL,
    creado_en timestamp without time zone NOT NULL,
    hash_previo character varying,
    hash character varying NOT NULL,
    relacionado_con_bloque_id integer,
    documento_id integer NOT NULL
);


ALTER TABLE public.bloques OWNER TO postgres;

--
-- Name: bloques_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bloques_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bloques_id_seq OWNER TO postgres;

--
-- Name: bloques_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bloques_id_seq OWNED BY public.bloques.id;


--
-- Name: documentos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documentos (
    id integer NOT NULL,
    creado_en timestamp without time zone NOT NULL,
    hash character varying NOT NULL,
    tipo_archivo character varying NOT NULL,
    contenido character varying NOT NULL,
    tipo_de_documento_id integer NOT NULL,
    usuario_id integer NOT NULL,
    valores_attrib jsonb,
    palabras_clave character varying[]
);


ALTER TABLE public.documentos OWNER TO postgres;

--
-- Name: documentos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.documentos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.documentos_id_seq OWNER TO postgres;

--
-- Name: documentos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.documentos_id_seq OWNED BY public.documentos.id;


--
-- Name: tipos_de_documentos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipos_de_documentos (
    id integer NOT NULL,
    nombre character varying NOT NULL,
    atributos_id integer
);


ALTER TABLE public.tipos_de_documentos OWNER TO postgres;

--
-- Name: tipos_de_documentos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipos_de_documentos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipos_de_documentos_id_seq OWNER TO postgres;

--
-- Name: tipos_de_documentos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipos_de_documentos_id_seq OWNED BY public.tipos_de_documentos.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre character varying NOT NULL,
    hash_contrasena character varying NOT NULL
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: atributos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atributos ALTER COLUMN id SET DEFAULT nextval('public.atributos_id_seq'::regclass);


--
-- Name: bloques id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bloques ALTER COLUMN id SET DEFAULT nextval('public.bloques_id_seq'::regclass);


--
-- Name: documentos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos ALTER COLUMN id SET DEFAULT nextval('public.documentos_id_seq'::regclass);


--
-- Name: tipos_de_documentos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipos_de_documentos ALTER COLUMN id SET DEFAULT nextval('public.tipos_de_documentos_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Data for Name: atributos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.atributos (id, nombre, tipo_dato, requerido, tipo_de_documento_id) FROM stdin;
2	numero	int4	t	1
\.


--
-- Data for Name: bloques; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bloques (id, creado_en, hash_previo, hash, relacionado_con_bloque_id, documento_id) FROM stdin;
1	2025-03-31 22:11:55.699895	000000000000000000000000000000000000000000	e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855	\N	5
\.


--
-- Data for Name: documentos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documentos (id, creado_en, hash, tipo_archivo, contenido, tipo_de_documento_id, usuario_id, valores_attrib, palabras_clave) FROM stdin;
5	2025-03-31 22:00:01.043303	d4735e3a265e16eee03f59718b9b5d03019c30c28c259f259e273faf9554a991	jpg	\\xee\\xc9aO=\\x1fH\\xef\\xbePs}\\x01\\x87\\x8eo\\x1aZ\\x9f\\xf0\\x7f\\xc8+j\\xf3\\x12\\x00\\x04\\x90\\xf9h\\xf2	1	1	{"numero": 29877987}	{hola,a}
\.


--
-- Data for Name: tipos_de_documentos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipos_de_documentos (id, nombre, atributos_id) FROM stdin;
1	CI Venezolana	2
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, nombre, hash_contrasena) FROM stdin;
1	admin	admin
\.


--
-- Name: atributos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.atributos_id_seq', 3, true);


--
-- Name: bloques_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bloques_id_seq', 1, true);


--
-- Name: documentos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.documentos_id_seq', 5, true);


--
-- Name: tipos_de_documentos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipos_de_documentos_id_seq', 1, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 1, true);


--
-- Name: atributos atributos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atributos
    ADD CONSTRAINT atributos_pkey PRIMARY KEY (id);


--
-- Name: bloques bloques_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bloques
    ADD CONSTRAINT bloques_pkey PRIMARY KEY (id);


--
-- Name: bloques bloques_relacionado_con_bloque_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bloques
    ADD CONSTRAINT bloques_relacionado_con_bloque_id_key UNIQUE (relacionado_con_bloque_id);


--
-- Name: documentos documentos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos
    ADD CONSTRAINT documentos_pkey PRIMARY KEY (id);


--
-- Name: tipos_de_documentos tipos_de_documentos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipos_de_documentos
    ADD CONSTRAINT tipos_de_documentos_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: atributos atributos_tipo_de_documento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.atributos
    ADD CONSTRAINT atributos_tipo_de_documento_id_fkey FOREIGN KEY (tipo_de_documento_id) REFERENCES public.tipos_de_documentos(id);


--
-- Name: bloques bloques_relacionado_con_bloque_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bloques
    ADD CONSTRAINT bloques_relacionado_con_bloque_id_fkey FOREIGN KEY (relacionado_con_bloque_id) REFERENCES public.bloques(id);


--
-- Name: documentos documentos_tipo_de_documento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos
    ADD CONSTRAINT documentos_tipo_de_documento_id_fkey FOREIGN KEY (tipo_de_documento_id) REFERENCES public.tipos_de_documentos(id);


--
-- Name: documentos documentos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos
    ADD CONSTRAINT documentos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- Name: tipos_de_documentos tipos_de_documentos_atributos_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipos_de_documentos
    ADD CONSTRAINT tipos_de_documentos_atributos_fk FOREIGN KEY (atributos_id) REFERENCES public.atributos(id);


--
-- PostgreSQL database dump complete
--

