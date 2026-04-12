import { NavLink } from "react-router-dom";

export const Home = () => {
  return (
    <div className="bg-light">
      
      {/* Premium Hero Section */}
      <div 
        className="text-white py-5 shadow-lg" 
        style={{ background: "#11364a", borderBottom: "4px solid #f7941e" }}
      >
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-7 text-center text-lg-start">
              <h1 className="display-2 fw-bolder mb-3 lh-1">
                Your <span style={{ color: "#f7941e" }}>Digital</span> <span className="text-light">Library</span>
              </h1>
              <p className="lead fs-5 mb-5 opacity-75">
                Centralize, organize, and access your entire PDF collection in one powerful,
                secure platform. Optimized for researchers, students, and avid readers.
              </p>
              <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                <NavLink 
                  to="/books" 
                  className="btn btn-lg px-5 py-3 rounded-pill fw-bold"
                  style={{ background: "#f7941e", color: "white", border: "2px solid #f7941e" }}
                >
                  <i className="bi bi-book me-2"></i>Browse Collection
                </NavLink>
                <NavLink 
                  to="/register" 
                  className="btn btn-lg btn-outline-light px-5 py-3 rounded-pill fw-medium"
                >
                  Create Account
                </NavLink>
              </div>
            </div>
            <div className="col-lg-5 d-none d-lg-block text-center position-relative">
                {/* Visual Anchor */}
                <i 
                  className="bi bi-journal-richtext" 
                  style={{ fontSize: "14rem", color: "#f7941e", opacity: 0.85 }}
                ></i>
                <i 
                  className="bi bi-file-earmark-pdf position-absolute start-0 text-white opacity-25" 
                  style={{ fontSize: "6rem", transform: "rotate(-15deg)" }}
                ></i>
                <i 
                  className="bi bi-eye position-absolute end-0 bottom-0 text-white opacity-25" 
                  style={{ fontSize: "5rem" }}
                ></i>
            </div>
          </div>
        </div>
      </div>

      {/* Sleek Features Section */}
      <div className="container py-5 mt-5">
        <h3 className="text-center text-secondary fw-bold mb-5">Built for a Modern PDF Library</h3>
        <div className="row g-5 text-center">
          <div className="col-md-4">
            <div className="p-5 bg-white shadow-lg rounded-4 h-100 border border-light">
              <div className="display-4 text-secondary mb-3"><i className="bi bi-cloud-arrow-up-fill"></i></div>
              <h4 className="fw-bold mb-3 text-dark">Easy Uploads</h4>
              <p className="text-muted fs-6">
                Drag-and-drop secure file transfers to centralize your entire library in minutes.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-5 bg-white shadow-lg rounded-4 h-100 border border-light">
              <div className="display-4 text-secondary mb-3"><i className="bi bi-search-heart"></i></div>
              <h4 className="fw-bold mb-3 text-dark">Advanced Search</h4>
              <p className="text-muted fs-6">
                Instantly locate any book by title, author, or publisher across thousands of entries.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-5 bg-white shadow-lg rounded-4 h-100 border border-light">
              <div className="display-4 text-secondary mb-3"><i className="bi bi-shield-lock-fill"></i></div>
              <h4 className="fw-bold mb-3 text-dark">Role Security</h4>
              <p className="text-muted fs-6">
                Granular permissions ensure your library data remains protected, accurate, and accessible.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Refined Footer */}
      <div className="container py-5 mt-5 border-top">
        <div className="row align-items-center text-muted">
          <div className="col-md-6 text-center text-md-start">
            <h5 className="fw-bold" style={{ color: "#11364a" }}>PDF Library</h5>
            <small>© 2026 PDF Library Project. Built with professional passion in Bangladesh.</small>
          </div>
          <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
             <i className="bi bi-dot mx-2"></i>
             <NavLink to="/" className="text-muted text-decoration-none small">Home</NavLink>
             <i className="bi bi-dot mx-2"></i>
             <NavLink to="/books" className="text-muted text-decoration-none small">Books</NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};