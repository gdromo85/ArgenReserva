import { Route, Routes } from "react-router-dom";
import { ComplejosProvider } from "./context/ComplejosContext";
import { AuthProvider } from "./context/AuthContext";
import Panel from "./layout/Panel";
import Login from "./layout/Login";
import Complejos from "./pages/Complejos";

const App = () => {
  return (
    <AuthProvider>
      <ComplejosProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/panel" element={<Panel />}>
            <Route index element={null} />
            <Route path="complejos" element={<Complejos />} />
          </Route>
        </Routes>
      </ComplejosProvider>
    </AuthProvider>
  );
};

export default App;
