import { Route, Routes } from "react-router-dom";
import { ComplejosProvider } from "./context/ComplejosContext";
import { UnidadesAlojamientoProvider } from "./context/UnidadesAlojamientoContext";
import { ReservasProvider } from "./context/ReservasContext";
import { AuthProvider } from "./context/AuthContext";
import Panel from "./layout/Panel";
import Login from "./layout/Login";
import Complejos from "./pages/Complejos";
import UnidadesAlojamiento from "./pages/UnidadesAlojamiento";
import Reservas from "./pages/Reservas";

const App = () => {
  return (
    <AuthProvider>
      <ComplejosProvider>
        <UnidadesAlojamientoProvider>
          <ReservasProvider>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/panel" element={<Panel />}>
                <Route index element={null} />
                <Route path="complejos" element={<Complejos />} />
                <Route path="complejos/:complejoId/unidades" element={<UnidadesAlojamiento />} />
                <Route path="reservas" element={<Reservas />} />
              </Route>
            </Routes>
          </ReservasProvider>
        </UnidadesAlojamientoProvider>
      </ComplejosProvider>
    </AuthProvider>
  );
};

export default App;
