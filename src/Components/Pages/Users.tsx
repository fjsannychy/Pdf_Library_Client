import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { UserService } from "../../Services/userService";
import type { UserModel } from "../../Models/UserModel";

export const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const resp = await UserService.GetList({
        search,
        pageNumber: 1,
        pageSize: 100,
      });
      setUsers(resp.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Permanent Action: Are you sure you want to remove this user?")) return;
    try {
      await UserService.Delete(id);
      loadUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const renderStatus = (status: number) => {
    switch (status) {
      case 1: return <span className="badge rounded-pill bg-success-subtle text-success px-3 border border-success-subtle">Active Now</span>;
      case 0: return <span className="badge rounded-pill bg-light text-secondary px-3 border">Inactive</span>;
      case 2: return <span className="badge rounded-pill bg-danger-subtle text-danger px-3 border border-danger-subtle">Suspended</span>;
      default: return null;
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const pageWrapper: React.CSSProperties = {
    minHeight: "100vh",
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)), 
                      url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    paddingTop: "4rem",
    paddingBottom: "5rem"
  };

  const glassHeader: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(15px)",
    border: "4px solid rgba(8, 57, 86, 0.5)",
    borderRadius: "20px",
    padding: "1.5rem",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)"
  };

  return (
    <div style={pageWrapper}>
      <div className="container">
        
        {/* Header Section */}
        <div className="row align-items-center mb-5">
          <div className="col-md-8 d-flex align-items-center">
            <button 
              className="btn btn-white rounded-circle shadow-sm me-4 border-2 d-flex align-items-center justify-content-center" 
              style={{ width: "45px", height: "45px", borderColor: "#11364a", color: "#11364a", transition: "0.3s" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#11364a"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#fff"; e.currentTarget.style.color = "#11364a"; }}
              onClick={() => navigate("/")}
            >
              <i className="bi bi-arrow-left fs-5"></i>
            </button>
            <div>
              <h1 className="display-6 fw-bolder text-dark mb-0 tracking-tight">
                User <span style={{ color: "#f7941e" }}>Directory</span>
              </h1>
              <p className="text-muted fw-medium mb-0">Managing your active reading community</p>
            </div>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <button 
              className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm border-0" 
              style={{ backgroundColor: "#11364a" }} 
              onClick={() => navigate('/Register')}
            >
              <i className="bi bi-person-plus-fill me-2"></i>New Account
            </button>
          </div>
        </div>

        {/* Glassmorphism Search Bar */}
        <div style={glassHeader} className="mb-4">
          <div className="row g-0 align-items-center">
            <div className="col-12 d-flex align-items-center px-2">
              <i className="bi bi-search text-primary fs-5 me-3 opacity-50"></i>
              <input
                type="text"
                className="form-control border-0 shadow-none bg-transparent py-2"
                placeholder="Search name, username or roles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ fontSize: "1.1rem" }}
              />
            </div>
          </div>
        </div>

        {/* 🔹 User Table Grid with Orange Border */}
        <div 
          className="card shadow-lg rounded-4 overflow-hidden" 
          style={{ 
            background: "rgba(255, 255, 255, 0.95)",
            border: "4px solid #eb933b", // Orange Frame matching AuthorForm
            transition: "transform 0.3s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.005)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light bg-opacity-50">
                <tr>
                  <th className="px-4 py-3 border-0 text-muted small fw-bold text-uppercase">Member Identity</th>
                  <th className="py-3 border-0 text-muted small fw-bold text-uppercase text-center">Access Role</th>
                  <th className="py-3 border-0 text-muted small fw-bold text-uppercase text-center">Status</th>
                  <th className="px-4 py-3 border-0 text-muted small fw-bold text-uppercase text-end">Management</th>
                </tr>
              </thead>
              <tbody className="bg-transparent">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-5">
                      <div className="spinner-border" style={{ color: "#ff0f83" }}></div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-bottom border-light">
                      <td className="px-4 py-4">
                        <div className="d-flex align-items-center">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm fw-bold border bg-white text-primary"
                            style={{ 
                              width: "45px", 
                              height: "45px",
                              fontSize: "0.9rem",
                              letterSpacing: "0.5px"
                            }}
                          >
                            {getInitials(user.fullname)}
                          </div>
                          <div>
                            <div className="fw-bold text-dark">{user.fullname}</div>
                            <div className="small text-muted">@{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <span className={`badge rounded-pill py-2 px-3 fw-medium ${user.role === 'Admin' ? 'bg-danger-subtle text-danger' : 'bg-primary-subtle text-primary'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        {renderStatus(user.status)}
                      </td>
                      <td className="px-4 py-4 text-end">
                        <div className="btn-group shadow-sm rounded-pill overflow-hidden border bg-white">
                          <button
                            className="btn btn-white btn-sm px-3 py-2 border-end transition-all"
                            style={{ transition: "0.3s" }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#0d6efd"; e.currentTarget.querySelector('i')?.classList.replace('text-primary', 'text-white'); }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#fff"; e.currentTarget.querySelector('i')?.classList.replace('text-white', 'text-primary'); }}
                            onClick={() => navigate(`/users/edit/${user.id}`)}
                          >
                            <i className="bi bi-pencil-square text-primary"></i>
                          </button>
                          <button 
                            className="btn btn-white btn-sm px-3 py-2 transition-all" 
                            style={{ transition: "0.3s" }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#dc3545"; e.currentTarget.querySelector('i')?.classList.replace('text-danger', 'text-white'); }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#fff"; e.currentTarget.querySelector('i')?.classList.replace('text-white', 'text-danger'); }}
                            onClick={() => handleDelete(user.id)}
                          >
                            <i className="bi bi-trash text-danger"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-4 text-center">
            <span className="badge bg-white text-muted shadow-sm border px-3 py-2 rounded-pill fw-bold">
              Total Community Members: {users.length}
            </span>
        </div>

      </div>

      <style>{`
        .tracking-tight { letter-spacing: -0.02em; }
        .btn-white { background: #fff; border: none; }
        .btn-white:hover { background: #f8fafc; }
        tr:hover { background-color: rgba(248, 250, 252, 0.8) !important; }
        .transition-all { transition: all 0.3s ease; }
      `}</style>
    </div>
  );
};