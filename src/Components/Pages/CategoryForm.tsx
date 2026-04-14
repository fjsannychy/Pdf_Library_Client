import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CategoryService } from "../../Services/categoryService";
import type { CategoryModel } from "../../Models/CategoryModel";

export const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const entityName = "Category";

  const [category, setCategory] = useState<CategoryModel>({
    id: 0,
    name: "",
    status: 1,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      CategoryService.GetById(Number(id))
        .then((resp: any) => {
          setCategory({
            id: resp.data.id,
            name: resp.data.name || "",
            status: resp.data.status,
          });
        })
        .catch((err) => console.error("Error fetching category:", err));
    }
  }, [id]);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCategory((prev) => ({
      ...prev,
      [name]: name === "status" ? Number(value) : value,
    }));
  };

  const saveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await CategoryService.Update(Number(id), category);
        alert(`${entityName} updated successfully!`);
      } else {
        await CategoryService.Create(category);
        alert(`${entityName} saved successfully!`);
      }
      navigate("/categories");
    } catch (err) {
      console.error(err);
      alert("Operation failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 py-5 d-flex align-items-center justify-content-center"
      style={{
        // 🔹 Category-themed background: Organized library shelves
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.75)), 
                          url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2100')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            
            <div
              className="card shadow-lg rounded-4 overflow-hidden"
              style={{
                border: "4px solid #f97316", 
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <div className="card-body p-4 p-md-5 bg-white">
                
                <div className="text-center mb-4">
                  <div
                    className="d-inline-block p-3 rounded-circle mb-3"
                    style={{ backgroundColor: "#fff7ed" }}
                  >
                    <i
                      className="bi bi-collection fs-2" // Changed icon to 'collection' for categories
                      style={{ color: "#f97316" }}
                    ></i>
                  </div>
                  <h2 className="fw-bold text-dark">
                    {id ? "Edit Category" : "Add New Category"}
                  </h2>
                  <p className="text-muted small">Organize books by genre or classification</p>
                </div>

                <form onSubmit={saveCategory}>
                  
                  {/* Category Name */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase text-muted">
                      Classification Name
                    </label>
                    <div className="input-group border rounded-3 overflow-hidden shadow-sm">
                      <span className="input-group-text bg-light border-0">
                        <i className="bi bi-bookmark-star text-muted"></i>
                      </span>
                      <input
                        name="name"
                        className="form-control border-0 py-2 shadow-none"
                        placeholder="e.g. History, Technology, Fiction"
                        value={category.name}
                        onChange={handleInput}
                        required
                      />
                    </div>
                  </div>

                  {/* Status Selection */}
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-uppercase text-muted">
                      Visibility Status
                    </label>
                    <div className="input-group border rounded-3 overflow-hidden shadow-sm">
                      <span className="input-group-text bg-light border-0">
                        <i className="bi bi-eye text-muted"></i>
                      </span>
                      <select
                        name="status"
                        className="form-select border-0 py-2 shadow-none"
                        value={category.status}
                        onChange={handleInput}
                      >
                        <option value={1}>Active (Visible)</option>
                        <option value={0}>Inactive (Hidden)</option>
                      </select>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-grid gap-2 d-md-flex">
                    <button
                      type="button"
                      className="btn btn-light rounded-pill px-4 fw-bold flex-grow-1 border"
                      onClick={() => navigate("/categories")}
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
                        <i className="bi bi-save me-2"></i>
                      )}
                      {id ? "Update Category" : "Save Category"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};