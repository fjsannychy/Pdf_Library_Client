import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CategoryService } from "../../Services/categoryService";
import type { CategoryModel } from "../../Models/CategoryModel";

export const Categories = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const resp: any = await CategoryService.GetList({
        search,
        pageNumber: 1,
        pageSize: 100,
      });
      setCategories(resp.data.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadCategories();
    if (location.state?.refresh) {
      window.history.replaceState({}, document.title);
    }
  }, [loadCategories, location.state]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Permanent Action: Are you sure you want to remove this category?")) return;
    try {
      const resp = await CategoryService.Delete(id);
      alert(resp.data.message);
      loadCategories();
    } catch (err) {
      console.error(err);
    }
  };

  // Glassmorphism style matching the Directory theme
  const glassHeader: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.65)",
    backdropFilter: "blur(12px)",
    border: "4px solid rgba(8, 57, 86, 0.4)", 
    borderRadius: "20px",
    padding: "0.5rem 1.5rem",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
    transition: "0.3s ease"
  };

  return (
    <div 
      className="min-vh-100 py-5" 
      style={{ 
        // Updated to a light, organized library/book-related background
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.82), rgba(241, 245, 249, 0.92)), 
                          url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2000')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="container">
        
        {/* Header Section */}
        <div className="row align-items-center mb-5">
          <div className="col-md-8 d-flex align-items-center">
            <button 
              className="btn btn-white rounded-circle shadow-sm me-4 border-2 d-flex align-items-center justify-content-center" 
              style={{ 
                width: "45px", height: "45px", 
                borderColor: "#11364a", color: "#11364a",
                transition: "0.3s", backgroundColor: "#fff"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#11364a";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.color = "#11364a";
              }}
              onClick={() => navigate("/")} 
            >
              <i className="bi bi-arrow-left fs-5"></i>
            </button>

            <div>
              <h1 className="display-6 fw-bolder text-dark mb-0 tracking-tight">
                Category <span style={{ color: "#f97316" }}>Registry</span>
              </h1>
              <p className="text-muted fw-medium mb-0 fs-6">Organize and classify your digital library</p>
            </div>
          </div>
          
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <button 
              className="btn rounded-pill px-4 shadow-sm fw-bold border-0 py-2 text-white" 
              style={{ backgroundColor: "#11364a" }} 
              onClick={() => navigate("/categories/add")}
            >
              <i className="bi bi-tag me-2"></i>Add Category
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div style={glassHeader} className="mb-4 search-container">
          <div className="row g-0 align-items-center">
            <div className="col-12 d-flex align-items-center">
              <i className="bi bi-search fs-5 me-3 opacity-75" style={{ color: "#11364a" }}></i>
              <input
                type="text"
                className="form-control border-0 shadow-none py-3 bg-transparent"
                placeholder="Filter categories by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ fontSize: "1.1rem", fontWeight: "500" }}
              />
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div 
          className="card shadow-lg rounded-4 overflow-hidden" 
          style={{ 
            background: "rgba(255, 255, 255, 0.95)",
            border: "4px solid #f97316",
            transition: "transform 0.3s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.002)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light bg-opacity-50">
                <tr>
                  <th className="px-4 py-3 text-muted small fw-bold text-uppercase border-0">Classification</th>
                  <th className="py-3 text-muted small fw-bold text-uppercase text-center border-0">Status</th>
                  <th className="py-3 text-muted small fw-bold text-uppercase text-end px-4 border-0">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-transparent">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="text-center py-5 border-0">
                      <div className="spinner-border" style={{ color: "#f97316" }}></div>
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id} className="border-bottom border-light">
                      <td className="px-4 py-4">
                        <div className="d-flex align-items-center">
                          <div className="rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm fw-bold border bg-white text-warning" 
                               style={{ width: "45px", height: "45px", fontSize: "1.2rem" }}>
                            <i className="bi bi-tag-fill"></i>
                          </div>
                          <div>
                            <div className="fw-bold text-dark">{cat.name}</div>
                            <div className="text-muted small">Reference: #{cat.id.toString().padStart(3, '0')}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <span className={`badge rounded-pill px-3 py-2 border ${cat.status === 1 ? 'bg-success-subtle text-success border-success-subtle' : 'bg-light text-secondary border-secondary-subtle'}`}>
                          {cat.status === 1 ? "● Active" : "○ Inactive"}
                        </span>
                      </td>
                      <td className="py-4 text-end px-4">
                        <div className="btn-group shadow-sm rounded-pill overflow-hidden border bg-white">
                          <button
                            className="btn btn-white btn-sm px-3 py-2 border-end"
                            style={{ transition: "0.3s" }}
                            onMouseEnter={(e) => { 
                              e.currentTarget.style.backgroundColor = "#0d6efd"; 
                              e.currentTarget.querySelector('i')?.classList.replace('text-primary', 'text-white'); 
                            }}
                            onMouseLeave={(e) => { 
                              e.currentTarget.style.backgroundColor = "#fff"; 
                              e.currentTarget.querySelector('i')?.classList.replace('text-white', 'text-primary'); 
                            }}
                            onClick={() => navigate(`/categories/edit/${cat.id}`)}
                          >
                            <i className="bi bi-pencil-square text-primary"></i>
                          </button>
                          <button
                            className="btn btn-white btn-sm px-3 py-2"
                            style={{ transition: "0.3s" }}
                            onMouseEnter={(e) => { 
                              e.currentTarget.style.backgroundColor = "#dc3545"; 
                              e.currentTarget.querySelector('i')?.classList.replace('text-danger', 'text-white'); 
                            }}
                            onMouseLeave={(e) => { 
                              e.currentTarget.style.backgroundColor = "#fff"; 
                              e.currentTarget.querySelector('i')?.classList.replace('text-white', 'text-danger'); 
                            }}
                            onClick={() => handleDelete(cat.id)}
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
              Total Categories Identified: {categories.length}
            </span>
        </div>
      </div>

      <style>{`
        .tracking-tight { letter-spacing: -0.02em; }
        .btn-white { background: #fff; border: none; }
        tr:hover { background-color: rgba(248, 250, 252, 0.8) !important; }
        .search-container:focus-within {
          box-shadow: 0 10px 25px rgba(249, 115, 22, 0.1) !important;
          background: rgba(255, 255, 255, 0.9) !important;
        }
      `}</style>
    </div>
  );
};