import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserService } from "../../Services/userService";
import type { UserModel } from "../../Models/UserModel";

export const UserEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [form, setForm] = useState<UserModel>({
    id: 0,
    username: "",
    fullname: "",
    role: "General",
    status: 1,
    password: "" 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      UserService.GetById(Number(id)).then((data: any) => {
        setForm({
          id: data.id || data.Id,
          username: data.username || data.UserName || "",
          fullname: data.fullname || data.FullName || "", 
          role: data.role || data.Role || "General",
          status: data.status ?? data.Status ?? 1,
          password: "" 
        });
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.password || form.password.trim() === "") {
      alert("Authentication required: Please enter the password to save changes.");
      return;
    }
    
    setLoading(true);
    try {
      await UserService.Update(Number(id), form);
      alert("Account updated successfully!");
      navigate("/users"); 
    } catch (err: any) {
      alert("Update failed. Please check the network or console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 py-5 d-flex align-items-center justify-content-center" 
         style={{ background: "linear-gradient(to bottom, #11364a 50%, #cbd5e1 50%)" }}>
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-6">
            
            {/* 🔹 Form Card with Orange Border */}
            <div 
              className="card shadow-lg rounded-4 overflow-hidden" 
              style={{ 
                border: "4px solid #f97316", 
                transition: "transform 0.3s ease" 
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.01)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <div className="card-body p-4 p-md-5 bg-white">
                
                <div className="text-center mb-4">
                  <div className="d-inline-block p-3 rounded-circle mb-3" style={{ backgroundColor: "#fff7ed" }}>
                    <i className="bi bi-person-gear fs-2" style={{ color: "#f97316" }}></i>
                  </div>
                  <h2 className="fw-bold text-dark">User Profile</h2>
                  <p className="text-muted small">Managing account for <strong>{form.username}</strong></p>
                </div>

                <form onSubmit={handleSubmit}>
                  
                  {/* Full Name */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase text-muted">Legal Full Name</label>
                    <div className="input-group border rounded-3 overflow-hidden shadow-sm">
                      <span className="input-group-text bg-light border-0"><i className="bi bi-person-vcard text-muted"></i></span>
                      <input
                        className="form-control border-0 py-2 shadow-none"
                        value={form.fullname}
                        onChange={(e) => setForm({...form, fullname: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  {/* 🔹 Row for Role and Account Health */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-uppercase text-muted">Access Role</label>
                      <div className="input-group border rounded-3 overflow-hidden shadow-sm">
                        <span className="input-group-text bg-light border-0"><i className="bi bi-shield-shaded text-muted"></i></span>
                        <select 
                          className="form-select border-0 py-2 shadow-none"
                          value={form.role} 
                          onChange={(e) => setForm({...form, role: e.target.value})}
                        >
                          <option value="General">General User</option>
                          <option value="Librarian">Librarian</option>
                          <option value="Admin">System Admin</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-uppercase text-muted">Account Health</label>
                      <div className="input-group border rounded-3 overflow-hidden shadow-sm">
                        <span className="input-group-text bg-light border-0"><i className="bi bi-activity text-muted"></i></span>
                        <select 
                          className="form-select border-0 py-2 shadow-none"
                          value={form.status}
                          onChange={(e) => setForm({...form, status: Number(e.target.value)})}
                        >
                          <option value={1}>🟢 Active</option>
                          <option value={0}>🔴 Inactive</option>
                          <option value={2}>🟡 Suspended</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Security/Password Section */}
                  <div className="mb-4 p-3 rounded-3" style={{ background: "#fff5f5", border: "1px solid #feb2b2" }}>
                    <label className="form-label small fw-bold text-danger text-uppercase">
                      <i className="bi bi-lock-fill me-1"></i> Security Authorization
                    </label>
                    <input 
                      type="password"
                      className="form-control border-0 shadow-sm py-2 mb-1"
                      placeholder="Enter password to save changes"
                      value={form.password}
                      onChange={(e) => setForm({...form, password: e.target.value})}
                      required
                    />
                    <div className="text-danger" style={{ fontSize: '0.75rem' }}>
                      Re-entering password is required to sync with the encrypted database.
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-grid gap-2 d-md-flex">
                    <button
                      type="button"
                      className="btn btn-light rounded-pill px-4 fw-bold flex-grow-1 border"
                      onClick={() => navigate("/users")}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary rounded-pill px-4 fw-bold flex-grow-1 shadow-sm border-0" 
                      style={{ backgroundColor: "#11364a" }}
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="spinner-border spinner-border-sm me-2"></span>
                      ) : (
                        <i className="bi bi-check2-circle me-2"></i>
                      )}
                      Apply Profile Changes
                    </button>
                  </div>

                </form>
              </div>
            </div>

            {/* Subtle Footer */}
            <div className="text-center mt-4 text-muted small opacity-50">
                PDF Library Management System • Secure Admin Panel
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};