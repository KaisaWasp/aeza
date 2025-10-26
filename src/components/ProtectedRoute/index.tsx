import { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AutorizationModal from "../AutorizationModal";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const adminStatus = sessionStorage.getItem("isAdmin");
    if (adminStatus === "true") {
      setIsAuthenticated(true);
      navigate("/agents");
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return (
      <AutorizationModal
        isOpen={true}
        onClose={() => { }}
        onSuccess={() => {
          sessionStorage.setItem("isAdmin", "true"); 
          setIsAuthenticated(true);
          navigate("/agents"); 
        }}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
