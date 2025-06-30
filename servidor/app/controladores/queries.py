import os
from datetime import datetime as dt


class QueriesDocumentos:
    SELECCIONAR_TODOS_DOCS = """--sql
        SELECT
            docs.*,
            tipos.nombre AS tipo_de_documento
        FROM
            public.documentos docs
        LEFT JOIN
            public.tipos_de_documentos tipos on docs.tipo_de_documento_id = tipos.id
    """

    # Igual que la consulta anterior sólo que filtra los resultados para un usuario
    SELECCIONAR_DOCS_USUARIO = (
        SELECCIONAR_TODOS_DOCS
        + """--sql
        WHERE
            usuario_id = %s;
    """
    )

    # Igual que la consulta anterior excepto que trae un solo documento por hash
    SELECCIONAR_DOC = (
        SELECCIONAR_TODOS_DOCS
        + """--sql
        WHERE
            hash = %s;
    """
    )

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
            , texto_ocr
            , nombre
            )
        VALUES (
            %s,
            %s,
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
    SELECCIONAR_TODOS_TIPOS_DE_DOC = """--sql
        SELECT 
	        tdd.nombre as tipo_doc_nombre,
	        tdd.id as tipo_doc_id,
	        a.nombre as attr_nombre,
	        a.tipo_dato as attr_tipo_dato,
	        a.requerido as attr_requerido,
	        a.tipo_de_documento_id as attr_tipo_de_documento_id
        FROM public.tipos_de_documentos tdd
        FULL JOIN
            public.atributos a on a.tipo_de_documento_id = tdd.id;
    """

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
        INSERT INTO public.bloques (id, creado_en, hash, hash_previo, relacionado_con_bloque_id, documento_id)
        VALUES(%s, %s, %s, %s, %s, %s);
    """

    SELECCIONAR_TODOS_BLOQUES = """--sql
        SELECT id, hash, creado_en, relacionado_con_bloque_id
        FROM public.bloques;
    """

    SELECCIONAR_BLOQUE_DE_DOC_ID = """--sql
        SELECT *
        FROM public.bloques
        WHERE documento_id = %s
    """


class QueriesUsuarios:
    SELECCIONAR_USUARIO = """--sql
        SELECT * FROM public.usuarios WHERE usuario = %s
    """


class QueriesEstatusCadena:
    SELECCIONAR_ESTATUS_CADENA = """--sql
        WITH bloques_con_hashes_recortados AS (
            SELECT
                creado_en,
                -- Recorta el hash_previo a los últimos 6 dígitos
                RIGHT(hash_previo, 6) AS hash_previo_recortado,
                -- Recorta el hash a los últimos 6 dígitos
                RIGHT(hash, 6) AS hash_recortado,
                -- Recorta el hash del bloque anterior (calculado con LAG) a los últimos 6 dígitos
                RIGHT(LAG(hash) OVER (ORDER BY creado_en), 6) AS hash_del_bloque_anterior_recortado
            FROM
                public.bloques
        ),
        bloques_con_integridad_inmediata AS (
            SELECT
                creado_en,
                hash_previo_recortado AS hash_previo, -- Usamos la versión recortada para la salida final
                hash_recortado AS hash,             -- Usamos la versión recortada para la salida final
                hash_del_bloque_anterior_recortado AS hash_del_bloque_anterior,
                -- Determina la integridad inmediata:
                -- VERDADERO si hash_previo_recortado coincide con el hash_del_bloque_anterior_recortado,
                -- o si es el primer bloque (ambos son NULOS).
                -- FALSO en caso contrario.
                CASE
                    WHEN hash_previo_recortado IS NOT NULL AND hash_previo_recortado = hash_del_bloque_anterior_recortado THEN TRUE
                    WHEN hash_previo_recortado IS NULL AND hash_del_bloque_anterior_recortado IS NULL THEN TRUE -- Esto maneja correctamente el bloque génesis
                    ELSE FALSE
                END AS integro_inmediato
            FROM
                bloques_con_hashes_recortados
        ),
        bloques_con_integridad_acumulada AS (
            SELECT
                creado_en,
                hash_previo,
                hash,
                hash_del_bloque_anterior,
                integro_inmediato,
                -- Calcula una suma acumulativa de fallos de integridad.
                -- Si esta suma es > 0, significa que al menos un bloque antes o en el punto actual
                -- tiene un problema de integridad.
                SUM(CASE WHEN integro_inmediato = FALSE THEN 1 ELSE 0 END) OVER (ORDER BY creado_en) AS fallos_acumulados
            FROM
                bloques_con_integridad_inmediata
        )
        SELECT
            creado_en,
            hash_previo,
            hash,
            hash_del_bloque_anterior,
            -- El estado 'integro' final es FALSO si existen fallos acumulados (es decir, fallos_acumulados > 0).
            -- De lo contrario, es VERDADERO.
            CASE
                WHEN fallos_acumulados > 0 THEN FALSE
                ELSE TRUE
            END AS integro
        FROM
            bloques_con_integridad_acumulada
        ORDER BY
            creado_en;
    """


class QueriesInfo:
    SELECCIONAR_CANTIDAD_DOCUMENTOS = """--sql
        SELECT COUNT(*) AS cantidad FROM public.documentos;
    """

    SELECCIONAR_CANTIDAD_USUARIOS = """--sql
        SELECT COUNT(*) AS cantidad FROM public.usuarios;
    """

    SELECCIONAR_CANTIDAD_TIPOS_DE_DOCUMENTOS = """--sql
        SELECT COUNT(*) AS cantidad FROM public.tipos_de_documentos;
    """
