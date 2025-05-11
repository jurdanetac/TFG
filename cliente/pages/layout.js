import Encabezado from "./componentes/_Encabezado";

export default function Layout({ children }) {
  return (
    <>
      <Encabezado />
      <main>
        {children}
      </main>
    </>
  );
}