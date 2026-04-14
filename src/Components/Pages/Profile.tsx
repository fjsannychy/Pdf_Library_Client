import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserService } from "../../Services/userService";
import { AppConstants } from "../../AppConstants"; 
import type { ProfileViewModel } from "../../Models/ProfileViewModel";

export const Profile = () => {
  const [profile, setProfile] = useState<ProfileViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    UserService.GetProfile()
      .then((res) => setProfile(res))
      .catch((err) => {
        console.error("Profile error:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleViewDetails = (bookId: number) => {
    navigate(`/book-details/${bookId}`);
  };

  const getImageUrl = (url?: string) => 
    url ? `${AppConstants.FileServerUrl}${url}` : "/placeholder.png";

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  if (error || !profile) return (
    <div className="text-center mt-5 text-danger">
      <h5>Unable to load profile.</h5>
    </div>
  );

  return (
    <div 
      className="min-vh-100 py-4"
      style={{
        // 🔹 Profile Theme Background (Soft abstract workspace/tech vibe)
        backgroundImage: `linear-gradient(rgba(240, 244, 248, 0.9), rgba(240, 244, 248, 0.9)), 
                          url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="container">
        
        {/* User Info Section */}
        <div className="card shadow-sm border-0 p-4 mb-4 bg-white rounded-4">
          <div className="d-flex align-items-center">
             <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '60px', height: '60px', fontSize: '24px' }}>
                {profile.fullname.charAt(0).toUpperCase()}
             </div>
             <div>
                <h3 className="mb-1 fw-bold"> {profile.fullname}</h3>
                <p className="mb-0 text-muted">
                  <span className="badge bg-light text-dark border me-2">@{profile.username}</span>
                  <span className="badge bg-info text-dark">Role: {profile.role}</span>
                </p>
             </div>
          </div>
        </div>

        {/* Purchased Books Section (My Library) */}
        <h4 className="mb-3 text-success fw-bold">📚 My Library</h4>
        <div className="row g-3 mb-5">
          {profile.purchasedBooks && profile.purchasedBooks.length > 0 ? (
            profile.purchasedBooks.map((book: any) => (
              <div className="col-md-3" key={`purchased-${book.id}`}>
                <div className="card h-100 shadow-sm border-0 border-top border-success border-4 rounded-3 overflow-hidden">
                  <img
                    src={getImageUrl(book.coverPhotoUrl)}
                    className="card-img-top"
                    style={{ height: "220px", objectFit: "cover" }}
                    alt={book.title}
                  />
                  <div className="card-body p-3 text-center bg-white">
                    <h6 className="mb-1 text-truncate fw-bold">{book.title}</h6>
                    <p className="text-muted small mb-3">{book.author}</p>
                    <div className="d-grid">
                      <button 
                        className="btn btn-sm btn-success rounded-pill"
                        onClick={() => handleViewDetails(book.id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-4 bg-white rounded-4 shadow-sm">
              <p className="text-muted mb-0 italic">You haven't purchased any books yet.</p>
            </div>
          )}
        </div>

        {/* Favorites Section */}
        <h4 className="mb-3 fw-bold">❤️ Favorites</h4>
        <div className="row g-3 mb-5">
          {profile.favorites && profile.favorites.length > 0 ? (
            profile.favorites.map((book: any) => (
              <div className="col-md-3" key={`fav-${book.id}`}>
                <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
                  <img
                    src={getImageUrl(book.coverPhotoUrl)}
                    className="card-img-top"
                    style={{ height: "220px", objectFit: "cover" }}
                    alt={book.title}
                  />
                  <div className="card-body p-3 text-center bg-white">
                    <h6 className="mb-1 text-truncate fw-bold">{book.title}</h6>
                    <p className="text-muted small mb-3">{book.author}</p>
                    <div className="d-grid">
                      <button 
                        className="btn btn-sm btn-primary rounded-pill"
                        onClick={() => handleViewDetails(book.id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-4 bg-white rounded-4 shadow-sm">
               <p className="text-muted mb-0">No favorites found</p>
            </div>
          )}
        </div>

        {/* Recent Activity Section */}
        <h4 className="mb-3 fw-bold">🕒 Recent Activity</h4>
        <div className="row g-3">
          {profile.recentActivity && profile.recentActivity.length > 0 ? (
            profile.recentActivity.map((book: any) => (
              <div className="col-md-3" key={`recent-${book.id}`}>
                <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
                  <img
                    src={getImageUrl(book.coverPhotoUrl)}
                    className="card-img-top"
                    style={{ height: "220px", objectFit: "cover" }}
                    alt={book.title}
                  />
                  <div className="card-body p-3 text-center bg-white">
                    <h6 className="card-title text-truncate fw-bold">{book.title}</h6>
                    <p className="text-muted small mb-3">{book.author}</p>
                    <div className="d-grid">
                      <button 
                        className="btn btn-sm btn-outline-primary rounded-pill"
                        onClick={() => handleViewDetails(book.id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-4 bg-white rounded-4 shadow-sm">
               <p className="text-muted mb-0">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  ); 
};