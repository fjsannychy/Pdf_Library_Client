import { useState, type ChangeEvent, type FormEvent } from "react";
import { CommonService } from "../../Services/commonServices";
import type { RegisterModel } from "../../Models/RegisterModel";
import { AuthService } from "../../Services/authServices";
import { useNavigate, Link } from "react-router-dom";

export const Register: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterModel>({
    userid: 0,
    fullname: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (CommonService.IsEmptyValueInForm(form, [])) {
      alert("Please fill up all fields!");
      return;
    }
    if (form.confirmPassword !== form.password) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    AuthService.Resister(form).then((resp: any) => {
      console.log(resp);
      navigate("/login");
    }).catch((ex: any) => {
      alert(ex.response?.data || "Registration failed");
    }).finally(() => setLoading(false));
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3" 
         style={{ 
           background: "radial-gradient(circle at top left, #1e293b, #11364a)",
           fontFamily: "'Plus Jakarta Sans', sans-serif"
         }}>
      
      {/* 🌌 Decorative background blobs */}
      <div className="position-fixed" style={{ top: '10%', right: '15%', width: '300px', height: '300px', background: 'rgba(14, 194, 200, 0.15)', filter: 'blur(80px)', borderRadius: '50%' }}></div>
      <div className="position-fixed" style={{ bottom: '10%', left: '10%', width: '250px', height: '250px', background: 'rgba(249, 115, 22, 0.15)', filter: 'blur(80px)', borderRadius: '50%' }}></div>

      <div className="container" style={{ maxWidth: "900px" }}>
        <div className="card border-0 bg-transparent overflow-hidden">
          <div className="row g-0 shadow-lg rounded-4 overflow-hidden" style={{ minHeight: "600px" }}>
            
            {/* 🎨 Left Side: Branding/Visual (Visible on MD+) */}
            <div className="col-lg-5 d-none d-lg-flex flex-column justify-content-center p-5 text-white" 
                 style={{ background: "linear-gradient(135deg, #11364a 0%, #064e3b 100%)", position: 'relative' }}>
              <div className="position-relative z-index-1">
                <div className="mb-4 bg-white d-inline-block p-3 rounded-4 shadow">
                   <i className="bi bi-book-half fs-1 text-dark"></i>
                </div>
                <h1 className="fw-bold display-5 mb-3">Begin Your Journey.</h1>
                <p className="opacity-75 fs-5">Access thousands of digital volumes and manage your personal library with ease.</p>
                <div className="mt-5 d-flex gap-3">
                    <div className="p-2 px-3 rounded-pill bg-white bg-opacity-10 small">✨ Cloud Sync</div>
                    <div className="p-2 px-3 rounded-pill bg-white bg-opacity-10 small">🔒 Secure</div>
                </div>
              </div>
            </div>

            {/* 📝 Right Side: Form */}
            <div className="col-lg-7 bg-white p-4 p-md-5">
              <div className="mb-4">
                <h3 className="fw-bold text-dark">Create Account</h3>
                <p className="text-muted">Fill in the details to set up your profile.</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Full Name */}
                  <div className="col-12">
                    <div className="form-floating">
                      <input
                        type="text"
                        name="fullname"
                        className="form-control border-0 bg-light shadow-none rounded-3"
                        id="floatingName"
                        placeholder="John Doe"
                        value={form.fullname}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="floatingName" className="text-muted small fw-bold">FULL NAME</label>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-12">
                    <div className="form-floating">
                      <input
                        type="email"
                        name="username"
                        className="form-control border-0 bg-light shadow-none rounded-3"
                        id="floatingEmail"
                        placeholder="name@example.com"
                        value={form.username}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="floatingEmail" className="text-muted small fw-bold">EMAIL ADDRESS</label>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="password"
                        name="password"
                        className="form-control border-0 bg-light shadow-none rounded-3"
                        id="floatingPass"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="floatingPass" className="text-muted small fw-bold">PASSWORD</label>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="password"
                        name="confirmPassword"
                        className="form-control border-0 bg-light shadow-none rounded-3"
                        id="floatingConfirm"
                        placeholder="••••••••"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="floatingConfirm" className="text-muted small fw-bold">CONFIRM</label>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2">
                  <button className="btn btn-dark w-100 py-3 rounded-3 fw-bold shadow transition-all mb-3" 
                          type="submit" 
                          disabled={loading}
                          style={{ background: "#11364a", border: 'none' }}>
                    {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-shield-check me-2"></i>}
                    Complete Registration
                  </button>
                  
                  <div className="text-center">
                    <span className="text-muted small">Already a member? </span>
                    <Link to="/login" className="text-decoration-none fw-bold small" style={{ color: "#0ec2c8" }}>
                      Log In Here
                    </Link>
                  </div>
                </div>
              </form>

              <div className="mt-5 pt-4 border-top text-center">
                <small className="text-muted">By joining, you agree to our Terms and Data Policy.</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};