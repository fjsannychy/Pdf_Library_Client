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
    <div className="d-flex justify-content-center mt-5">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  if (error || !profile) return (
    <div className="text-center mt-5 text-danger">
      <h5>Unable to load profile.</h5>
    </div>
  );

  return (
    <div className="container py-4">
      {/* User Info Section */}
      <div className="card shadow-sm border-0 p-4 mb-4 bg-light">
        <h3 className="mb-2">👤 {profile.fullname}</h3>
        <p className="mb-0 text-muted">
          <strong>Username:</strong> {profile.username} | <strong> Role:</strong> {profile.role}
        </p>
      </div>

      {/* Purchased Books Section (My Library) */}
      <h4 className="mb-3 text-success">📚 My Library</h4>
      <div className="row g-3 mb-5">
        {profile.purchasedBooks && profile.purchasedBooks.length > 0 ? (
          profile.purchasedBooks.map((book: any) => (
            <div className="col-md-3" key={`purchased-${book.id}`}>
              <div className="card h-100 shadow-sm border-0 border-top border-success border-4">
                <img
                  src={getImageUrl(book.coverPhotoUrl)}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                  alt={book.title}
                />
                <div className="card-body p-3 text-center">
                  <h6 className="mb-1 text-truncate">{book.title}</h6>
                  <p className="text-muted small mb-3">{book.author}</p>
                  <div className="d-grid">
                    <button 
                      className="btn btn-sm btn-success"
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
          <div className="col-12">
            <p className="text-muted ms-2 italic">You haven't purchased any books yet.</p>
          </div>
        )}
      </div>

      {/* Favorites Section */}
      <h4 className="mb-3">❤️ Favorites</h4>
      <div className="row g-3 mb-5">
        {profile.favorites && profile.favorites.length > 0 ? (
          profile.favorites.map((book: any) => (
            <div className="col-md-3" key={`fav-${book.id}`}>
              <div className="card h-100 shadow-sm border-0">
                <img
                  src={getImageUrl(book.coverPhotoUrl)}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                  alt={book.title}
                />
                <div className="card-body p-3 text-center">
                  <h6 className="mb-1 text-truncate">{book.title}</h6>
                  <p className="text-muted small mb-3">{book.author}</p>
                  <div className="d-grid">
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => handleViewDetails(book.id)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : <p className="text-muted ms-2">No favorites found</p>}
      </div>

      {/* Recent Activity Section */}
      <h4 className="mb-3">🕒 Recent Activity</h4>
      <div className="row g-3">
        {profile.recentActivity && profile.recentActivity.length > 0 ? (
          profile.recentActivity.map((book: any) => (
            <div className="col-md-3" key={`recent-${book.id}`}>
              <div className="card h-100 shadow-sm border-0">
                <img
                  src={getImageUrl(book.coverPhotoUrl)}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                  alt={book.title}
                />
                <div className="card-body p-3 text-center">
                  <h6 className="card-title text-truncate">{book.title}</h6>
                  <p className="text-muted small mb-3">{book.author}</p>
                  <div className="d-grid">
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleViewDetails(book.id)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : <p className="text-muted ms-2">No recent activity</p>}
      </div>
    </div>
  );
};