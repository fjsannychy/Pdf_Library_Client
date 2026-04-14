import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthorService } from "../../Services/authorService";
import type { AuthorModel } from "../../Models/AuthorModel";

export const AuthorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const entityName = "Author";

  const [author, setAuthor] = useState<AuthorModel>({
    id: 0,
    name: "",
    address: "",
    contact: "",
    status: 0, 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      AuthorService.GetById(Number(id))
        .then((resp: any) => setAuthor(resp.data))
        .catch((err) => console.error(err));
    }
  }, [id]);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAuthor({ ...author, [name]: name === "status" ? Number(value) : value });
  };

  const saveAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await AuthorService.Update(Number(id), author);
        alert(`${entityName} updated successfully!`);
      } else {
        await AuthorService.Create(author);
        alert(`${entityName} saved successfully!`);
      }
      navigate("/authors", { state: { refresh: true } });
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
        // 🔹 Light-themed background related to registry/form-filling
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), 
                          url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            
            {/* 🔹 Form Card with Orange Border (Kept identical to your request) */}
            <div 
              className="card shadow-lg rounded-4 overflow-hidden" 
              style={{ 
                border: "4px solid #f97316", // Orange Frame
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
                  <h2 className="fw-bold text-dark">{id ? "Edit Author" : "Add New Author"}</h2>
                  <p className="text-muted small">Update the contributor registry records</p>
                </div>

                <form onSubmit={saveAuthor}>
                  
                  {/* Author Name */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase text-muted">Legal Name</label>
                    <div className="input-group border rounded-3 overflow-hidden shadow-sm">
                      <span className="input-group-text bg-light border-0"><i className="bi bi-person text-muted"></i></span>
                      <input
                        name="name"
                        className="form-control border-0 py-2 shadow-none"
                        placeholder="e.g. Humayan Ahmed"
                        value={author.name}
                        onChange={handleInput}
                        required
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase text-muted">Address / Location</label>
                    <div className="input-group border rounded-3 overflow-hidden shadow-sm">
                      <span className="input-group-text bg-light border-0"><i className="bi bi-geo-alt text-muted"></i></span>
                      <input
                        name="address"
                        className="form-control border-0 py-2 shadow-none"
                        placeholder="City, Country"
                        value={author.address}
                        onChange={handleInput}
                      />
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase text-muted">Contact Details</label>
                    <div className="input-group border rounded-3 overflow-hidden shadow-sm">
                      <span className="input-group-text bg-light border-0"><i className="bi bi-telephone text-muted"></i></span>
                      <input
                        name="contact"
                        className="form-control border-0 py-2 shadow-none"
                        placeholder="+880..."
                        value={author.contact}
                        onChange={handleInput}
                      />
                    </div>
                  </div>

                  {/* Status Selection */}
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-uppercase text-muted">Registry Status</label>
                    <div className="input-group border rounded-3 overflow-hidden shadow-sm">
                      <span className="input-group-text bg-light border-0"><i className="bi bi-activity text-muted"></i></span>
                      <select
                        name="status"
                        className="form-select border-0 py-2 shadow-none"
                        value={author.status}
                        onChange={handleInput}
                      >
                        <option value={0}>Active</option>
                        <option value={1}>Inactive</option>
                      </select>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-grid gap-2 d-md-flex">
                    <button
                      type="button"
                      className="btn btn-light rounded-pill px-4 fw-bold flex-grow-1 border"
                      onClick={() => navigate("/authors")}
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
                      {id ? "Update Record" : "Save Entry"}
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