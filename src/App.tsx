import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/routing/Layout";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import Login from "./pages/Login";
import PuntoDeVenta from "./pages/PuntoDeVenta";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* El resto de las ruas están protegidas, Protected Route se encarga de verificar que se cuenta con el token de sesión */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<PuntoDeVenta />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
