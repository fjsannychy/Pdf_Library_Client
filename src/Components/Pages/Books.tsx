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

  // --- MODERN DESIGN THEME ---
  const pageWrapper: React.CSSProperties = {
    minHeight: "100vh",
    // Modern Mesh Gradient Background
    backgroundColor: "#afb0ba",
    backgroundImage: `
      radial-gradient(at 0% 0%, rgba(13, 110, 253, 0.05) 0px, transparent 50%),
      radial-gradient(at 100% 0%, rgba(102, 16, 242, 0.05) 0px, transparent 50%),
      radial-gradient(at 100% 100%, rgba(13, 202, 240, 0.05) 0px, transparent 50%),
      radial-gradient(at 0% 100%, rgba(102, 16, 242, 0.05) 0px, transparent 50%)
    `,
    paddingBottom: "100px"
  };

  const glassHeader: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "24px",
    padding: "1.5rem",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)"
  };

  return (
    <div style={pageWrapper}>
      <div className="container py-5">
        
        {/* Modern Animated Header */}
        <div className="row align-items-center mb-5">
          <div className="col">
            <h1 className="display-6 fw-bold text-dark tracking-tight">
              Digital <span className="text-primary text-gradient">Library</span>
            </h1>
            <p className="text-muted lead fs-6">Find your next favorite story in our curated collection.</p>
          </div>
          <div className="col-auto">
            {(state.role === "Admin" || state.role === "Librarian") && (
              <button
                className="btn btn-primary px-4 py-2 rounded-pill shadow-lg border-0 d-flex align-items-center"
                onClick={() => navigate("/book-form")}
                style={{ transition: 'all 0.3s ease' }}
              >
                <i className="bi bi-plus-lg me-2"></i> New Release
              </button>
            )}
          </div>
        </div>

        {/* Glassmorphism Control Bar */}
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
                  style={{ borderRadius: "14px" }}
                >
                  <option value={0}>✨ Recommended</option>
                  <option value={1}>❤️ Favorites</option>
                  <option value={2}>📖 Owned</option>
                </select>
                <label htmlFor="filterSelect">Browse by</label>
              </div>
            </div>

            <div className="col-md-9">
              <div className="input-group input-group-lg shadow-sm" style={{ borderRadius: "14px", overflow: "hidden" }}>
                <span className="input-group-text border-0 bg-white pe-0">
                  <i className="bi bi-search text-primary opacity-50"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-0 py-3 ps-3"
                  placeholder="Search titles, authors, genres..."
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

        {/* Uniform Sized Grid */}
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
                   <h4 className="fw-bold">No matches found</h4>
                   <p className="text-muted">Try adjusting your filters or search keywords.</p>
                   <button className="btn btn-outline-primary rounded-pill mt-2" onClick={() => setFilter({ ...filter, search: "", filterType: 0 })}>Reset Search</button>
                </div>
              </div>
            )
          )}
        </div>

        {/* Loader Section */}
        {loading && (
          <div className="d-flex flex-column align-items-center my-5 py-5">
            <div className="spinner-grow text-primary" role="status" style={{ width: '3rem', height: '3rem' }}></div>
            <span className="mt-3 text-muted fw-bold">Curating results...</span>
          </div>
        )}
      </div>

      <style>{`
        .text-gradient {
          background: linear-gradient(90deg, #0d6efd, #6610f2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .transition-3d {
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .book-card-hover:hover {
          transform: translateY(-10px) scale(1.02);
        }
        .form-select:focus, .form-control:focus {
          box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.1) !important;
        }
        .tracking-tight { letter-spacing: -0.05em; }
      `}</style>
    </div>
  );
};