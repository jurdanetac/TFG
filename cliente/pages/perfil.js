import { useContext } from 'react';
import RutaProtegida from './componentes/_RutaProtegida';
import { AuthContexto } from './contexto/_auth';

export default function Perfil() {
    // obtener el usuario logueado del contexto
    const { usuario, token } = useContext(AuthContexto);

    console.log("PERFIL: Usuario logueado:", usuario);

    return (
        <RutaProtegida>
            <h1>{token}</h1>
        </RutaProtegida>
    )
}
