import { useEffect, useState, useCallback, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BookService } from "../../Services/bookService";
import { Book } from "../Molecoles/Book";
import type { BookFilterModel } from "../../Models/BookFilterModel";
import { AuthContext } from "../Contexts/auth/authContext.ts";

export const Books = () => {
  const navigate = useNavigate();
  useLocation();
  const { state } = useContext(AuthContext);

  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [filter, setFilter] = useState<BookFilterModel>({
    filterType: 0,
    search: "",
    pageNumber: 1,
    pageSize: 8 
  });

  const loadBooks = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);

    BookService.GetList(filter)
      .then((resp: any) => {
        const newItems = resp.data.items || [];
        if (newItems.length === 0 && filter.pageNumber !== 1) {
          setHasMore(false);
        } else {
          setBooks(prev =>
            filter.pageNumber === 1 ? newItems : [...prev, ...newItems]
          );
        }
      })
      .finally(() => setLoading(false));
  }, [filter, loading, hasMore]);

  useEffect(() => {
    loadBooks();
  }, [filter]);

  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollTop + windowHeight >= docHeight - 120) {
        setFilter(prev => ({ ...prev, pageNumber: prev.pageNumber + 1 }));
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  const clickDelete = (id: number) => {
    if (confirm("Do you want to delete this book?")) {
      BookService.Delete(id).then(() => {
        setBooks([]);
        setHasMore(true);
        setFilter(prev => ({ ...prev, pageNumber: 1 }));
      });
    }
  };

  const clickEdit = (id: number) => navigate(`/book-form/${id}`);

  // --- ENHANCED THEME DESIGN ---
  const pageWrapper: React.CSSProperties = {
    minHeight: "100vh",
    // Light overlay (0.9) ensures background is clear but text is readable
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), 
                      url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed", // Parallax effect
    paddingBottom: "100px"
  };

  const glassHeader: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    borderRadius: "20px",
    padding: "1.5rem",
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.05)"
  };

  return (
    <div style={pageWrapper}>
      <div className="container py-5">
        
        {/* Header Section */}
        <div className="row align-items-center mb-5">
          <div className="col">
            <h1 className="display-5 fw-bolder text-dark tracking-tight">
              Digital <span className="text-gradient">Library</span>
            </h1>
            <p className="text-muted lead fs-6">
              <i className="bi bi-collection me-2 text-primary"></i>
              Browse and manage your personal collection of PDF volumes.
            </p>
          </div>
          <div className="col-auto">
            {(state.role === "Admin" || state.role === "Librarian") && (
              <button
                className="btn btn-primary px-4 py-2 rounded-pill shadow-lg border-0 d-flex align-items-center fw-bold"
                onClick={() => navigate("/book-form")}
                style={{ transition: 'all 0.3s ease', backgroundColor: '#11364a' }}
              >
                <i className="bi bi-plus-lg me-2"></i> Add New Book
              </button>
            )}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div style={glassHeader} className="mb-5">
          <div className="row g-3 align-items-center">
            <div className="col-md-3">
              <div className="form-floating">
                <select
                  className="form-select border-0 bg-white shadow-sm"
                  id="filterSelect"
                  value={filter.filterType}
                  onChange={(e) => {
                    setHasMore(true);
                    setBooks([]);
                    setFilter({ ...filter, pageNumber: 1, filterType: parseInt(e.target.value) });
                  }}
                  style={{ borderRadius: "12px" }}
                >
                  <option value={0}>✨ Recommended</option>
                  <option value={1}>❤️ Favorites</option>
                  <option value={2}>📖 My Library</option>
                </select>
                <label htmlFor="filterSelect">Filter By</label>
              </div>
            </div>

            <div className="col-md-9">
              <div className="input-group input-group-lg shadow-sm" style={{ borderRadius: "12px", overflow: "hidden" }}>
                <span className="input-group-text border-0 bg-white pe-0">
                  <i className="bi bi-search text-primary opacity-50"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-0 py-3 ps-3"
                  placeholder="Search titles, authors, or topics..."
                  value={filter.search}
                  onChange={(e) => {
                    setHasMore(true);
                    setBooks([]);
                    setFilter({ ...filter, pageNumber: 1, search: e.target.value });
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Book Grid */}
        <div className="row g-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
          {books.length > 0 ? (
            books.map(book => (
              <div className="col d-flex align-items-stretch" key={book.id}>
                <div className="w-100 book-card-hover transition-3d">
                  <Book
                    book={book}
                    handleEdit={clickEdit}
                    handleDelete={clickDelete}
                  />
                </div>
              </div>
            ))
          ) : (
            !loading && (
              <div className="col-12 text-center py-5">
                <div className="bg-white p-5 rounded-5 shadow-sm border border-light">
                   <h4 className="fw-bold">No results found</h4>
                   <p className="text-muted">We couldn't find any books matching your current search.</p>
                   <button 
                    className="btn btn-primary rounded-pill mt-2 px-4" 
                    onClick={() => setFilter({ ...filter, search: "", filterType: 0 })}
                    style={{ backgroundColor: '#f7941e', border: 'none' }}
                   >
                     Reset All Filters
                   </button>
                </div>
              </div>
            )
          )}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="d-flex flex-column align-items-center my-5 py-5">
            <div className="spinner-border" role="status" style={{ color: '#f7941e', width: '3rem', height: '3rem' }}></div>
            <span className="mt-3 text-muted fw-bold">Loading your library...</span>
          </div>
        )}
      </div>

      <style>{`
        .text-gradient {
          background: linear-gradient(90deg, #11364a, #f7941e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .transition-3d {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .book-card-hover:hover {
          transform: translateY(-8px);
        }
        .form-select:focus, .form-control:focus {
          box-shadow: 0 0 0 4px rgba(247, 148, 30, 0.15) !important;
        }
        .tracking-tight { letter-spacing: -0.02em; }
      `}</style>
    </div>
  );
};