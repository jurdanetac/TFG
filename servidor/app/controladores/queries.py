class QueriesDocumentos:
    SELECCIONAR_TODOS_DOCS = """--sql
        SELECT * FROM public.documentos;
    """

    SELECCIONAR_PROXIMO_DOC_ID = """--sql
        SELECT nextval('public.documentos_id_seq');
    """

    INSERTAR_DOCUMENTO = """--sql
        INSERT INTO public.documentos (
            id
            , creado_en
            , hash
            , tipo_de_documento_id
            , usuario_id
            , valores_attrib
            , palabras_clave
            , contenido --b64
            )
        VALUES (
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            %s
               );
    """
