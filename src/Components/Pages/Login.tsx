import { useContext, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { LoginModel } from "../../Models/LoginModel";
import { CommonService } from "../../Services/commonServices";
import { AuthService } from "../../Services/authServices";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Contexts/auth/authContext";


export const Login: React.FC = () => {

  const { state, dispatch } = useContext(AuthContext);

  const navigate = useNavigate();


  const [refreshAuth, setRefreshAuth] = useState<boolean>(true);

  useEffect(() => {

    if (refreshAuth) {
      setRefreshAuth(false);
      dispatch({ type: "Refresh", data: null });
      if (state.accessToken) {
        navigate("/");
      }
    }

  }, [refreshAuth]);

  const [form, setForm] = useState<LoginModel>({
    username: "",
    password: ""
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(form);
    if (CommonService.IsEmptyValueInForm(form, [])) {

      alert("Please Provide Valid Username and Password!");
      return;

    }


    AuthService.Login(form).then((resp: any) => {


      CommonService.SaveDataToSession({
        ...resp.data,
        username: form.username
      });

      dispatch({
        type: "LoginSuccess",
        data: {
          accessToken: CommonService.GetUserToken(),
          username: CommonService.GetSessionValByKey("username")
        }
      });

      navigate("/");

    })
      .catch((error: any) => {
        if (error.response) {
          if (error.response.status === 401) {
            alert("Invalid credentials");
          } else {
            alert(`Error: ${error.response.status} - ${error.response.data?.message || ""}`);
          }
        } else {
          alert("Network error");
        }
      });
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center vh-100">

        <div className="col-md-4">

          <div className="card shadow">

            <div className="card-body">

              <h3 className="text-center mb-4">Login</h3>

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="username"
                    className="form-control"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="d-grid">
                  <button className="btn btn-primary" type="submit">
                    Login
                  </button>
                </div>

              </form>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};