/**
 * @fileoverview Funciones para la aplicación
 */

/**
 * Utilidad para verificar y decodificar el token JWT
 * @param {string} token - Token JWT a verificar
 * @returns {Object} Objeto con el estado de validez del token y su payload
 * 
 * Esta función:
 * 1. Decodifica el payload del token JWT
 * 2. Verifica si el token ha expirado
 * 3. Retorna un objeto con la validez y el payload del token
 */
export const verificarTokenJWT = (token) => {
    try {
        // Decodifica la parte del payload del token (segunda parte del JWT)
        const tokenDecodificado = atob(token.split(".")[1]);
        const payload = JSON.parse(tokenDecodificado);
        // Verifica si el token ha expirado comparando con la fecha actual
        const tokenEstaExpirado = payload.exp < Date.now() / 1000;

        return {
            esValido: !tokenEstaExpirado,
            payload
        };
    } catch (error) {
        // Si hay algún error en el proceso, el token se considera inválido
        console.error('Error al verificar el token:', error);
        return {
            esValido: false,
            payload: null
        };
    }
};

// funcion para obtener datos de la API genericamente
export const obtenerDatos = async (url) => {
    // Obtener los documentos de la API
    return await fetch(url)
        // Parsear la respuesta como JSON
        .then((response) => response.json())
        // Extraer los datos de la respuesta
        .then((data) => {
            return data;
        });
};

// funcion para convertir archivo a base64
export const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});