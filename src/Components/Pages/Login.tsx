import { useContext, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { LoginModel } from "../../Models/LoginModel";
import { CommonService } from "../../Services/commonServices";
import { AuthService } from "../../Services/authServices";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../Contexts/auth/authContext";

export const Login: React.FC = () => {
  const { state, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [refreshAuth, setRefreshAuth] = useState<boolean>(true);

  useEffect(() => {
    if (refreshAuth) {
      setRefreshAuth(false);
      dispatch({ type: "Refresh", data: null });
      if (state.accessToken) {
        navigate("/");
      }
    }
  }, [refreshAuth, state.accessToken, dispatch, navigate]);

  const [form, setForm] = useState<LoginModel>({
    username: "",
    password: ""
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (CommonService.IsEmptyValueInForm(form, [])) {
      alert("Please Provide Valid Username and Password!");
      return;
    }

    setLoading(true);
    AuthService.Login(form)
      .then((resp: any) => {
        CommonService.SaveDataToSession({
          ...resp.data,
          username: form.username
        });

        dispatch({
          type: "LoginSuccess",
          data: {
            accessToken: CommonService.GetUserToken(),
            username: CommonService.GetSessionValByKey("username"),
            role: CommonService.GetSessionValByKey("role"), 
          }
        });
        navigate("/");
      })
      .catch((error: any) => {
        const message = error.response?.status === 401 ? "Invalid credentials" : "Login failed";
        alert(message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3" 
         style={{ 
           background: "linear-gradient(135deg, #11364a 50%, #cbd5e1 50%)",
           fontFamily: "'Plus Jakarta Sans', sans-serif" 
         }}>
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            
            {/* 🔹 Portal Card */}
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden" 
                 style={{ backdropFilter: "blur(10px)", backgroundColor: "rgba(255, 255, 255, 0.95)" }}>
              
              {/* Header Accent Strip */}
              <div style={{ height: "6px", background: "linear-gradient(to right, #f97316, #11364a)" }}></div>
              
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-5">
                  <div className="d-inline-block p-3 rounded-4 shadow-sm mb-3" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                    <i className="bi bi-shield-lock-fill fs-1" style={{ color: "#11364a" }}></i>
                  </div>
                  <h2 className="fw-bold text-dark mb-1">Welcome Back</h2>
                  <p className="text-muted small">Access your digital library portal</p>
                </div>

                <form onSubmit={handleSubmit}>
                  
                  {/* Username/Email */}
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted text-uppercase">Identification</label>
                    <div className="input-group border rounded-3 overflow-hidden transition-all shadow-sm">
                      <span className="input-group-text bg-white border-0"><i className="bi bi-envelope-at text-muted"></i></span>
                      <input
                        type="email"
                        name="username"
                        className="form-control border-0 py-2 shadow-none"
                        placeholder="Email address"
                        value={form.username}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <label className="form-label small fw-bold text-muted text-uppercase">Password</label>
                        <Link to="/forgot-password" style={{ color: "#f97316" }} className="text-decoration-none small fw-bold mb-2">Reset?</Link>
                    </div>
                    <div className="input-group border rounded-3 overflow-hidden shadow-sm">
                      <span className="input-group-text bg-white border-0"><i className="bi bi-key text-muted"></i></span>
                      <input
                        type="password"
                        name="password"
                        className="form-control border-0 py-2 shadow-none"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="mb-4 form-check">
                    <input type="checkbox" className="form-check-input" id="rememberMe" />
                    <label className="form-check-label small text-muted" htmlFor="rememberMe">Remember this device</label>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-primary btn-lg rounded-3 fw-bold shadow-sm py-2 border-0" 
                      type="submit" 
                      disabled={loading}
                      style={{ backgroundColor: "#11364a" }}
                    >
                      {loading ? (
                        <span className="spinner-border spinner-border-sm me-2"></span>
                      ) : (
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                      )}
                      Authorize Session
                    </button>
                    
                    <div className="text-center mt-4 pt-3 border-top">
                        <p className="text-muted small">New to the platform?</p>
                        <Link to="/register" className="btn btn-outline-dark btn-sm rounded-pill px-4 fw-bold">
                            Create New Account
                        </Link>
                    </div>
                  </div>

                </form>
              </div>
            </div>

            {/* Bottom Brand Link */}
            <div className="text-center mt-4">
              <Link to="/" className="text-white-50 small text-decoration-none">
                <i className="bi bi-arrow-left me-1"></i> Return to Public Site
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};