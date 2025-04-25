# TFG

- Clonación del repositorio: `\> git clone https://github.com/jurdanetac/TFG tfg`

## Instalación del cliente
- Instalar paquetes externos: `\tfg\cliente> npm i`
- Construir el proyecto: `\tfg\cliente> npm run build`
- Puesta en marcha de desarrollo: `\tfg\cliente> npm run dev` o Puesta en marcha de producción: `\tfg\cliente> npm run build; npm run start`
- El servidor de la aplicación escuchará en `http://localhost:3000` 

## Instalación del servidor
- Acceder a PostgreSQL: `C:\Program Files\PostgreSQL\17\bin\bin>.\psql.exe -U postgres`
- Creación de la base de datos: `postgres=# CREATE DATABASE tfg;`
- Importar el esquema de la base de datos: `C:\Program Files\PostgreSQL\17\bin\bin>.\psql.exe -U postgres tfg < C:\Users\W10\Documents\GitHub\TFG\servidor\bdd.sql`
- Instalar paquetes externos: `\tfg\servidor> pip install -r requirements.txt`
- Puesta en marcha: `\tfg\servidor> py app\app.py`
- El servidor de la aplicación escuchará en `http://localhost:5000`
