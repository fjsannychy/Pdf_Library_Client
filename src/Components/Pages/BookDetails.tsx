import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookService } from "../../Services/bookService";
import { AppConstants } from "../../AppConstants";

export const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState<any>(null);
  const [isFavourited, setIsFavourited] = useState<boolean>(false);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [favLoading, setFavLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const lastFetchedId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (id && lastFetchedId.current !== id) {
      setLoading(true);
      lastFetchedId.current = id;

      BookService.GetById(Number(id), false)
        .then((resp: any) => {
          const data = resp.data.result || resp.data;

          if (data) {
            setBook(data);
            setIsFavourited(!!data.isFavourited);
            const paidStatus = data.isPaid ?? data.IsPaid ?? false;
            setIsPaid(!!paidStatus);
            BookService.AddUserAction({ bookId: Number(id), actionType: 0 });
          }
        })
        .catch((err) => {
          console.error("Load Error:", err);
          alert("Failed to load book details.");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleToggleFavourite = () => {
    if (!id) return;
    setFavLoading(true);
    BookService.ToggleFavourite(Number(id))
      .then((resp: any) => {
        setIsFavourited(resp.data.status === "added");
      })
      .catch(() => alert("Error updating wishlist."))
      .finally(() => setFavLoading(false));
  };

  const renderPrice = () => {
    if (!book) return null;
    if (isPaid || book.price === 0) {
      return <span className="badge bg-success fs-5 px-3 shadow-sm">
        <i className="bi bi-check-circle-fill me-2"></i>
        {isPaid ? "Purchased " : "Free Access"}
      </span>;
    }

    if (book.discountPercent && book.discountPercent > 0) {
      const discountedPrice = book.price * (1 - book.discountPercent / 100);
      return (
        <div className="d-flex flex-column">
          <span className="text-muted text-decoration-line-through small">
            {book.priceBeforeDiscount || book.price}{AppConstants.Currency}
          </span>
          <div className="d-flex align-items-center gap-2">
            <span className="text-danger fw-bold fs-3">
              {discountedPrice.toFixed(2)}{AppConstants.Currency}
            </span>
            <span className="badge bg-danger rounded-pill">-{book.discountPercent}% OFF</span>
          </div>
        </div>
      );
    }

    return <span className="fs-3 fw-bold">{book.price}{AppConstants.Currency}</span>;
  };

  if (loading || !book) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-vh-100" 
      style={{ 
        // 🔹 Background: High-quality overhead shot of an opened book
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.85)), 
                          url('https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2000')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        paddingBottom: "3rem"
      }}
    >
      <div className="container pt-4">
        <button className="btn btn-outline-secondary mb-3 btn-sm shadow-sm bg-white" onClick={() => navigate("/Books")}>
          ← Back to Library
        </button>

        {/* 🔹 Glassmorphism Card Style */}
        <div className="card p-4 shadow-sm border-0 d-flex flex-md-row flex-column gap-4 rounded-4" 
             style={{ backgroundColor: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(8px)" }}>
          <div className="text-center">
            {book.coverPhotoUrl && (
              <img
                src={AppConstants.FileServerUrl + book.coverPhotoUrl}
                alt={book.title}
                style={{ width: "280px", height: "400px", objectFit: "cover" }}
                className="rounded-3 shadow-sm mb-3 border"
              />
            )}
          </div>

          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h1 className="fw-bold mb-1">{book.title}</h1>
                <p className="text-muted mb-3">By <span className="text-primary fw-semibold">{book.author}</span></p>
              </div>
              {isPaid && <span className="badge bg-primary rounded-pill">My Library</span>}
            </div>

            <hr className="opacity-10" />

            <div className="mb-4">
              <p className="mb-2"><strong>Category:</strong> <span className="badge bg-light text-dark border ms-1">{book.category}</span></p>
              <div className="mt-3">
                <strong className="text-secondary small text-uppercase">Status</strong>
                <div className="mt-1">{renderPrice()}</div>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2 mt-auto pt-3">
              {book.price > 0 && !isPaid && (
                <button
                  className="btn btn-warning btn-lg px-4 fw-bold shadow-sm"
                  onClick={() => navigate(`/payment/${book.id}`)}
                >
                  <i className="bi bi-cart-fill me-2"></i> Buy Now
                </button>
              )}

              {(book.price === 0 || isPaid) && (
                <button
                  className="btn btn-success btn-lg px-4 shadow-sm fw-bold"
                  onClick={() => navigate("/read-book/" + book.id)}
                >
                  <i className="bi bi-book-half me-2"></i> Read Now
                </button>
              )}

              <button
                className={`btn btn-lg shadow-sm ${isFavourited ? 'btn-danger' : 'btn-outline-danger'}`}
                onClick={handleToggleFavourite}
                disabled={favLoading}
              >
                <i className={`bi ${isFavourited ? 'bi-heart-fill' : 'bi-heart'} me-2`}></i>
                {isFavourited ? 'Favourited' : 'Add to favourites'}
              </button>
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-lg-8">
            {book.shortDescription && (
              <div className="mb-4 bg-white bg-opacity-75 p-4 rounded-4 border shadow-sm" style={{ backdropFilter: "blur(5px)" }}>
                <h5 className="fw-bold mb-3">About this Book</h5>
                <p className="text-muted" style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>{book.shortDescription}</p>
              </div>
            )}

            {book.details && (
              <div className="bg-white bg-opacity-75 p-4 rounded-4 border shadow-sm" style={{ backdropFilter: "blur(5px)" }}>
                <h5 className="fw-bold mb-3 border-bottom pb-2">Full Specifications</h5>
                <p style={{ lineHeight: '1.8', whiteSpace: 'pre-line' }} className="text-secondary">{book.details}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};