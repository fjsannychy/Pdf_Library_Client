import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CategoryService } from "../../Services/categoryService";
import type { CategoryModel } from "../../Models/CategoryModel";

export const Categories = () => {
  const navigate = useNavigate();
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
  }, [loadCategories]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      CategoryService.Delete(id).then(resp => {
        alert(resp.data.message);
        loadCategories();
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: "#cbd5e1" }}>
      <div className="container">

        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-end mb-5">
          <div className="d-flex align-items-center">
            <button 
              className="btn btn-white rounded-circle shadow-sm me-3 border-2" 
              style={{ 
                width: "45px", height: "45px", 
                borderColor: "#11364a", color: "#11364a",
                transition: "0.3s" 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#11364a";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.borderColor = "#f97316"; 
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.color = "#11364a";
                e.currentTarget.style.borderColor = "#11364a";
              }}
              onClick={() => navigate("/")} 
            >
              <i className="bi bi-arrow-left fs-5"></i>
            </button>

            <div>
              <h1 className="fw-bold text-dark mb-1" style={{ letterSpacing: "-1px" }}>Category Registry</h1>
              <p className="text-muted mb-0 fs-5">Manage and organize your book categories</p>
            </div>
          </div>
          
          <button 
            className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold border-0 py-2" 
            style={{ backgroundColor: "#11364a" }} 
            onClick={() => navigate("/categories/add")}
          >
            <i className="bi bi-plus-circle-fill me-2"></i>Add Category
          </button>
        </div>

        {/* Search Bar */}
        <div 
          className="card shadow-lg rounded-4 mb-4 overflow-hidden"
          style={{ border: "3px solid", borderImageSource: "linear-gradient(90deg, #11364a, #f97316)", borderImageSlice: 1 }}
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
                    placeholder="Search categories by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-lg-4 bg-light d-none d-lg-flex justify-content-center align-items-center border-start border-light">
                <span className="text-muted fw-bold small text-uppercase py-4">
                  Total Categories: {categories.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div 
          className="card shadow-lg rounded-4 overflow-hidden" 
          style={{ border: "4px solid", borderImageSource: "linear-gradient(90deg, #ffb700, #5a09aa)", borderImageSlice: 1 }}
        >
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead style={{ backgroundColor: "#f8fafc" }}>
                <tr>
                  <th className="px-4 py-3 border-0 text-muted small fw-bold text-uppercase">Category Details</th>
                  <th className="py-3 border-0 text-muted small fw-bold text-uppercase text-center">Status</th>
                  <th className="py-3 border-0 text-muted small fw-bold text-uppercase text-end px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {loading ? (
                  <tr><td colSpan={3} className="text-center py-5"><div className="spinner-border text-primary"></div></td></tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id}>
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center">
                          <div className="rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm" 
                               style={{ width: "45px", height: "45px", backgroundColor: "#fef3c7", color: "#92400e" }}>
                            <i className="bi bi-tag-fill fs-5"></i>
                          </div>
                          <div>
                            <div className="fw-bold text-dark">{cat.name}</div>
                            <div className="text-muted small">ID: #{cat.id.toString().padStart(3, '0')}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <span className={`badge rounded-pill px-3 py-2 border ${cat.status === 1 ? 'bg-success-subtle text-success border-success' : 'bg-secondary-subtle text-secondary border-secondary'}`}>
                          {cat.status === 1 ? "● Active" : "○ Inactive"}
                        </span>
                      </td>
                      <td className="py-3 text-end px-4">
                        {/* Edit Button */}
                        <button
                          className="btn btn-sm rounded-pill me-2 px-3 shadow-sm fw-bold border-2"
                          style={{ 
                            backgroundColor: "#ffffff",
                            color: "#0d6efd", 
                            borderColor: "#0d6efd", 
                            transition: "all 0.25s ease"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#e0f2fe"; 
                            e.currentTarget.style.borderColor = "#f97316"; 
                            e.currentTarget.style.transform = "translateY(-2px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#ffffff";
                            e.currentTarget.style.borderColor = "#0d6efd";
                            e.currentTarget.style.transform = "translateY(0px)";
                          }}
                          onClick={() => navigate(`/categories/edit/${cat.id}`)}
                        >
                          <i className="bi bi-pencil-square me-1"></i> Edit
                        </button>

                        {/* Delete Button */}
                        <button
                          className="btn btn-sm btn-outline-danger rounded-pill px-3 shadow-sm border-2"
                          onClick={() => handleDelete(cat.id)}
                        >
                          <i className="bi bi-trash3"></i>
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