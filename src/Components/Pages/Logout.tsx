import { useContext, useEffect } from "react";
import { CommonService } from "../../Services/commonServices";
import { AuthContext } from "../Contexts/auth/authContext";
import { useNavigate } from "react-router-dom";

export const Logout = () => {

    const { state, dispatch } = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {

        CommonService.ClearSession();

        dispatch({
            type: "Logout",
            data: null
        });

        navigate("/login");

    }, []);



    return (
        <div className="d-flex justify-content-center align-items-center vh-100" >
            <h1>Logout...</h1>
        </div>
    );

}