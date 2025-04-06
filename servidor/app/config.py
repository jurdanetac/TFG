class Config:
    PORT = 5000

    HOST = "localhost"
    DB = "tfg"
    USUARIO = "postgres"
    CONTRASENA = "postgres"

    DB_URI = f"postgresql://{USUARIO}:{CONTRASENA}@{HOST}/{DB}"
