import { Routes, Route } from "react-router";
import "./App.css";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoutes";
import ScanPage from "./pages/ScanPage";
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<HomePage />} />

          <Route
            path="scan"
            element={
              <ProtectedRoute>
                <ScanPage />
              </ProtectedRoute>
            }
          />

          <Route />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
