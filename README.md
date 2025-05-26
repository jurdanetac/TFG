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


---


### Consideraciones adicionales
#### ¿Por qué solo manejar archivos PDF?
Puede parecer contraintiutivo solo permitir la subida de archivos PDF a la blockchain. Sin embargo, PDF es el formato ideal para sistemas blockchain de autenticación de documentos debido a su estandarización universal, capacidad de preservar la integridad visual y soporte nativo para firmas digitales y metadatos. Al combinar sus funciones de seguridad integradas (como hashing y protección contra edición) con la inmutabilidad de blockchain, se garantiza autenticidad sin sacrificar accesibilidad. Su compatibilidad generalizada y resistencia a la obsolescencia lo convierten en la opción más práctica y segura para documentos legales, certificados y contratos digitales.