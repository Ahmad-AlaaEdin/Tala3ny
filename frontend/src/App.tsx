import { Routes, Route } from "react-router";
import "./App.css";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoutes";
import ScanPage from "./pages/ScanPage";
import ProfilePage from "./pages/ProfilePage";
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
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
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
