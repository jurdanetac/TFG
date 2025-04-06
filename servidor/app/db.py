import psycopg as pg
from flask import current_app, g


def conectar():
    if "db" not in g:
        g.db = pg.connect(
            current_app.config["DB_URI"],
        )


def desconectar(e=None):
    db = g.pop("db", None)

    if db is not None:
        db.close()
