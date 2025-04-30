import psycopg as pg
from flask import current_app, g
from psycopg.rows import dict_row


def conectar():
    if "db" not in g:
        g.db = pg.connect(
            # Conexión a la base de datos PostgreSQL
            current_app.config["DB_URI"],
            # Devolver los resultados como diccionarios
            row_factory=dict_row,
            # Guardar el estado de la conexión automáticamente
            autocommit=True,
        )


def desconectar(e=None):
    db = g.pop("db", None)

    if db is not None:
        db.close()
