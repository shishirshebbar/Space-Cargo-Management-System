import React from "react";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./AppRoutes";
import "./index.css"; // Import global styles

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;