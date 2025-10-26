import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage/idnex";
import AgentsPage from "./pages/AgentsPage/idnex";
import HistoryPage from "./pages/HistoryPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminsPage from "./pages/AdminsPage/idnex";

const App = () => {
  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <div className="p-4 max-w-[1364px] mx-auto">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/resolver" element={<MainPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route
            path="/agents/admin"
            element={
              <ProtectedRoute>
                <AdminsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/history/:agentId" element={<HistoryPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
