import React from "react";
import Routes from "./Routes";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function AccountRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <div role="status">Loading your session...</div>;
  // Discard in-memory game state when the account changes on a shared device.
  return <Routes key={user?.id ?? 'guest'} />;
}

function App() {
  return (
    <AuthProvider>
      <AccountRoutes />
    </AuthProvider>
  );
}

export default App;
