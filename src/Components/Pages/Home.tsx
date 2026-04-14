import { NavLink } from "react-router-dom";

export const Home = () => {
  return (
    <div className="bg-light min-vh-100">
      
      {/* High-Clarity Hero Section */}
      <div 
        className="position-relative d-flex align-items-center justify-content-center py-5" 
        style={{ 
          // Using a high-res "Flat Lay" image to match your screenshot's vibe
          backgroundImage: `url('https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=2070&auto=format&fit=crop')`, 
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "90vh",
          backgroundAttachment: "fixed" // This creates a professional parallax feel
        }}
      >
        {/* LIGHT Overlay: This keeps the background "Clear" but protects text readability */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100" 
          style={{ 
            background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)",
            zIndex: 1 
          }}
        ></div>

        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {/* White Card with soft shadow - exactly like the BookBub login box */}
              <div 
                className="p-5 rounded-4 shadow-lg text-center border-0" 
                style={{ 
                  background: "rgba(255, 255, 255, 0.98)", 
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                }}
              >
                <h1 className="display-4 fw-bolder mb-3" style={{ color: "#11364a" }}>
                  Your <span style={{ color: "#f7941e" }}>Digital</span> Library
                </h1>
                <p className="text-muted fs-5 mb-5 mx-auto" style={{ maxWidth: "600px" }}>
                  The most aesthetic way to organize your PDF collection. 
                  Access your books from anywhere, on any device.
                </p>
                
                <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
                  <NavLink 
                    to="/books" 
                    className="btn btn-lg px-5 py-3 rounded-2 fw-bold text-white"
                    style={{ background: "#f7941e", border: "none" }}
                  >
                    Browse Collection
                  </NavLink>
                  <NavLink 
                    to="/register" 
                    className="btn btn-lg btn-outline-secondary px-5 py-3 rounded-2 fw-medium"
                  >
                    Create Account
                  </NavLink>
                </div>

                <div className="mt-5 pt-4 border-top">
                  <span className="text-muted small">New to the platform? </span>
                  <NavLink to="/register" className="small fw-bold text-decoration-none" style={{color: "#f7941e"}}>
                    Join for free today.
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simplified Features for better flow */}
      <div className="container py-5">
        <div className="row g-4 py-5">
          {[
            { icon: "bi-lightning-charge", title: "Fast Sync", desc: "Your library stays updated across all devices instantly." },
            { icon: "bi-search", title: "Smart Filter", desc: "Search through metadata and tags in milliseconds." },
            { icon: "bi-shield-check", title: "Secure Cloud", desc: "Your documents are encrypted and privately stored." }
          ].map((feature, idx) => (
            <div key={idx} className="col-md-4 text-center">
              <div className="fs-1 mb-3" style={{ color: "#11364a" }}><i className={feature.icon}></i></div>
              <h5 className="fw-bold">{feature.title}</h5>
              <p className="text-muted small px-lg-5">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};