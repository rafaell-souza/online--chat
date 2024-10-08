import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthComponent = ({ component }: { component: React.ReactNode }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    return <>{token ? component : null}</>;
}

export default AuthComponent;
