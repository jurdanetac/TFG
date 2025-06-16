import os
from datetime import datetime as dt


class QueriesDocumentos:
    SELECCIONAR_TODOS_DOCS = """--sql
        SELECT * FROM public.documentos;
    """

    SELECCIONAR_DOCS_USUARIO = """--sql
        SELECT
            docs.*,
            tipos.nombre AS tipo_de_documento
        FROM
            public.documentos docs
        LEFT JOIN
            public.tipos_de_documentos tipos on docs.tipo_de_documento_id = tipos.id
        WHERE
            usuario_id = %s;
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
