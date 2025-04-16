"use client";

import styles from "./page.module.css";
import {Container, Button} from "react-bootstrap";

const probarBackend = async () => {
    const response = await fetch("http://localhost:5000/api/");
    const data = await response.json();
    console.log(data);
}

export default function Home() {
    return (
        <>
            <header className={styles.header}>header</header>
            <Container>
                <main>
                    <h1 className="text-center mb-4">Bienvenido, Usuario Regular</h1>
                    <Button onClick={probarBackend}>Probar backend</Button>
                    <div className="d-flex justify-content-center mb-4">
                        <div className={styles.tarjeta}>
                            1
                        </div>
                        <div className={styles.tarjeta}>
                            2
                        </div>
                    </div>
                </main>
            </Container>
        </>
    );
}
