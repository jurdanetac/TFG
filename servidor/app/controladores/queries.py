import os
from datetime import datetime as dt


class QueriesDocumentos:
    SELECCIONAR_TODOS_DOCS = """--sql
        SELECT * FROM public.documentos;
    """

    SELECCIONAR_DOCS_USUARIO = """--sql
        SELECT * FROM public.documentos WHERE usuario_id = %s;
    """

    SELECCIONAR_PROXIMO_DOC_ID = """--sql
        SELECT nextval('public.documentos_id_seq') as id;
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


class QueriesTiposDocumentos:
    INSERTAR_TIPO_DE_DOC = """--sql
        INSERT INTO public.tipos_de_documentos (nombre) VALUES(%s)
    """


class QueriesBloques:
    SELECCIONAR_ULTIMO_BLOQUE = """--sql
        SELECT * FROM public.bloques WHERE id = (SELECT max(id) FROM public.bloques);
    """

    INSERTAR_BLOQUE_GENESIS = f"""--sql
        INSERT INTO public.bloques (id, creado_en, hash)
        VALUES(0, '{dt.now().isoformat()}', '{os.urandom(32).hex()}');
    """

    INSERTAR_BLOQUE = """--sql
        INSERT INTO public.bloques (id, creado_en, hash, hash_previo)
        VALUES(%s, %s, %s, %s);
    """

    SELECCIONAR_TODOS_BLOQUES = """--sql
        SELECT id, hash, creado_en, relacionado_con_bloque_id
        FROM public.bloques;
    """


class QueriesUsuarios:
    SELECCIONAR_USUARIO = """--sql
        SELECT * FROM public.usuarios WHERE usuario = %s
    """
