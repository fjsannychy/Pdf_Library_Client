import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PublisherService } from "../../Services/publisherService";
import type { PublisherModel } from "../../Models/PublisherModel";

export const PublisherForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const entityName = "Publisher";

  const [publisher, setPublisher] = useState<PublisherModel>({
    id: 0,
    name: "",
    address: "",
    contact: "",
    status: 0, 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      PublisherService.GetById(Number(id))
        .then((resp: any) => setPublisher(resp.data))
        .catch((err) => console.error(err));
    }
  }, [id]);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPublisher({
      ...publisher,
      [name]: name === "status" ? Number(value) : value,
    });
  };

  const savePublisher = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await PublisherService.Update(Number(id), publisher);
        alert(`${entityName} updated successfully!`);
      } else {
        await PublisherService.Create(publisher);
        alert(`${entityName} saved successfully!`);
      }
      navigate("/publishers", { state: { refresh: true } });
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
        // 🔹 Publishing specific image: High-quality books/editorial workspace
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.75), rgba(241, 245, 249, 0.85)), 
                          url('https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2000')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            
            {/* 🔹 Form Card with Orange Border */}
            <div 
              className="card shadow-lg rounded-4 overflow-hidden border-0" 
              style={{ 
                outline: "4px solid #f97316", 
                transition: "transform 0.3s ease",
                background: "rgba(255, 255, 255, 0.96)",
                backdropFilter: "blur(10px)"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.01)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <div className="card-body p-4 p-md-5">
                
                <div className="text-center mb-4">
                  <div className="d-inline-block p-3 rounded-circle mb-3" style={{ backgroundColor: "#fff7ed" }}>
                    <i className="bi bi-journal-bookmark-fill fs-2" style={{ color: "#f97316" }}></i>
                  </div>
                  <h2 className="fw-bold text-dark">{id ? "Edit Publisher" : "Add Publisher"}</h2>
                  <p className="text-muted small">Update official publishing house records</p>
                </div>

                <form onSubmit={savePublisher}>
                  
                  {/* Publisher Name */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase text-muted">Company Name</label>
                    <div className="input-group border rounded-3 overflow-hidden shadow-sm bg-white">
                      <span className="input-group-text bg-light border-0"><i className="bi bi-building text-muted"></i></span>
                      <input
                        name="name"
                        className="form-control border-0 py-2 shadow-none"
                        placeholder="e.g. Penguin Books"
                        value={publisher.name}
                        onChange={handleInput}
                        required
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase text-muted">Headquarters Address</label>
                    <div className="input-group border rounded-3 overflow-hidden shadow-sm bg-white">
                      <span className="input-group-text bg-light border-0"><i className="bi bi-geo-alt text-muted"></i></span>
                      <input
                        name="address"
                        className="form-control border-0 py-2 shadow-none"
                        placeholder="City, Country"
                        value={publisher.address}
                        onChange={handleInput}
                      />
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase text-muted">Business Contact</label>
                    <div className="input-group border rounded-3 overflow-hidden shadow-sm bg-white">
                      <span className="input-group-text bg-light border-0"><i className="bi bi-telephone text-muted"></i></span>
                      <input
                        name="contact"
                        className="form-control border-0 py-2 shadow-none"
                        placeholder="+880..."
                        value={publisher.contact}
                        onChange={handleInput}
                      />
                    </div>
                  </div>

                  {/* Status Selection */}
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-uppercase text-muted">Partnership Status</label>
                    <div className="input-group border rounded-3 overflow-hidden shadow-sm bg-white">
                      <span className="input-group-text bg-light border-0"><i className="bi bi-activity text-muted"></i></span>
                      <select
                        name="status"
                        className="form-select border-0 py-2 shadow-none"
                        value={publisher.status}
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
                      onClick={() => navigate("/publishers")}
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
                      {id ? "Update House" : "Save House"}
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