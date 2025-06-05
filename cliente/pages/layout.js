import { Container } from "react-bootstrap";
import Encabezado from "./componentes/_Encabezado";

export default function Layout({ children }) {
  return (
    <>
      <Encabezado />
      <Container className="flex-grow-1">
        {children}
      </Container>
    </>
  );
}