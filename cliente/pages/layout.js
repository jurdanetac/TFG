import Encabezado from "./componentes/_Encabezado";

export default function Layout({ children }) {
  return (
    <>
      <Encabezado />
      <main className="flex-grow-1">
        {children}
      </main>
    </>
  );
}