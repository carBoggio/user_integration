import { Navigate, Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
// import AllRafflesPage from "@/pages/AllRafflesPage";
// import RaffleDetailPage from "@/pages/RaffleDetailPage";
import UserProfilePage from "@/pages/UserProfilePage";
import LotteryPage from "@/pages/LotteryPage";
import Project from "@/principal_page/Project";
import ProtectedRoute from "@/components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Main routes */}
      <Route path="/" element={<Navigate to="/project" replace />} />
      <Route path="/project" element={<Project />} />
      
      {/* Protected routes */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <IndexPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lottery"
        element={
          <ProtectedRoute>
            <LotteryPage />
          </ProtectedRoute>
        }
      />
      
      {/* Static file routes */}
      <Route 
        path="/principal_page/principal.html" 
        element={<Project />} 
      />
      <Route 
        path="/.well-known/walletconnect.txt" 
        element={<Navigate to="/well-known/walletconnect.txt" replace />} 
      />
    </Routes>
  );
}

export default App;
