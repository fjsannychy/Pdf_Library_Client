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
      case 1: return <span className="badge rounded-pill bg-success-subtle text-success px-3">Active</span>;
      case 0: return <span className="badge rounded-pill bg-secondary-subtle text-secondary px-3 border">Inactive</span>;
      case 2: return <span className="badge rounded-pill bg-danger-subtle text-danger px-3">Suspended</span>;
      default: return null;
    }
  };

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: "#cbd5e1" }}>
      <div className="container">
        
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-end mb-5">
          <div className="d-flex align-items-center">
            {/* 🔹 Back Button to Home */}
            <button 
              className="btn btn-white rounded-circle shadow-sm me-3 border-2" 
              style={{ 
                width: "45px", 
                height: "45px", 
                borderColor: "#11364a", 
                color: "#11364a",
                transition: "0.3s" 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#11364a";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.borderColor = "#f97316"; // Mixed with orange on hover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.color = "#11364a";
                e.currentTarget.style.borderColor = "#11364a";
              }}
              onClick={() => navigate("/")} // Navigates to Home
              title="Back to Home"
            >
              <i className="bi bi-arrow-left fs-5"></i>
            </button>

            <div>
              <h1 className="fw-bold text-dark mb-1" style={{ letterSpacing: "-1px" }}>User Management</h1>
              <p className="text-muted mb-0 fs-5">Review and manage library access privileges</p>
            </div>
          </div>
          
          <button 
            className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold border-0 py-2" 
            style={{ backgroundColor: "#11364a" }} 
            onClick={() => navigate('/Register')}
          >
            <i className="bi bi-person-plus-fill me-2"></i>New User
          </button>
        </div>

        {/* Search Bar with Mixed Border */}
        <div 
          className="card shadow-lg rounded-4 mb-4 overflow-hidden"
          style={{ 
            border: "3px solid",
            borderImageSource: "linear-gradient(90deg, #270ab9, #f97316)", 
            borderImageSlice: 1 
          }}
        >
          <div className="card-body p-0">
            <div className="row g-0 align-items-center">
              <div className="col-lg-8 bg-white d-flex align-items-center">
                <div className="input-group input-group-lg px-3">
                  <span className="input-group-text bg-transparent border-0 text-muted ps-2">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 shadow-none ps-2 py-4"
                    placeholder="Search by username or name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-lg-4 bg-light d-none d-lg-flex justify-content-center align-items-center border-start border-light">
                <span className="text-muted fw-bold small text-uppercase py-4">
                  Total Users: {users.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Table Card with Mixed Border */}
        <div 
          className="card shadow-lg rounded-4 overflow-hidden" 
          style={{ 
            border: "4px solid",
            borderImageSource: "linear-gradient(90deg, #ffb700, #5a09aa)", 
            borderImageSlice: 1 
          }}
        >
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead style={{ backgroundColor: "#f8fafc" }}>
                <tr>
                  <th className="px-4 py-3 border-0 text-muted small fw-bold text-uppercase">Identity / Username</th>
                  <th className="py-3 border-0 text-muted small fw-bold text-uppercase">Access Role</th>
                  <th className="py-3 border-0 text-muted small fw-bold text-uppercase text-center">Status</th>
                  <th className="px-4 py-3 border-0 text-muted small fw-bold text-uppercase text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {loading ? (
                  <tr><td colSpan={4} className="text-center py-5"><div className="spinner-border text-primary"></div></td></tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center">
                          <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                               style={{ width: '40px', height: '40px' }}>
                            <i className="bi bi-person fs-5"></i>
                          </div>
                          <div>
                            <div className="fw-bold text-dark">{user.fullname}</div>
                            <div className="small text-muted">@{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="d-flex align-items-center text-dark small">
                          <i className={`bi bi-shield-lock me-2 ${user.role === 'Admin' ? 'text-danger' : 'text-primary'}`}></i>
                          {user.role}
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        {renderStatus(user.status)}
                      </td>
                      <td className="px-4 py-3 text-end">
                        <button
                          className="btn btn-sm rounded-pill me-2 px-3 shadow-sm fw-bold"
                          style={{ 
                            backgroundColor: "#ffffff",
                            color: "#0d6efd",
                            border: "2px solid #0d6efd",
                            transition: "all 0.2s ease"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#e0f2fe"; 
                            e.currentTarget.style.boxShadow = "0 0 10px rgba(13, 110, 253, 0.3)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#ffffff";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                          onClick={() => navigate(`/users/edit/${user.id}`)}
                        >
                          <i className="bi bi-pencil me-1"></i> Edit
                        </button>
                        <button className="btn btn-sm btn-outline-danger rounded-pill px-3 shadow-sm" onClick={() => handleDelete(user.id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};