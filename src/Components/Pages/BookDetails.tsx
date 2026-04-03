import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookService } from "../../Services/bookService";
import { AppConstants } from "../../AppConstants";

export const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState<any>(null);
  const loaded = useRef<boolean>(false);


  useEffect(() => {
    if (id && !loaded.current) {
      loaded.current = true;
      BookService.GetById(Number(id), false)
        .then((resp: any) => {
          const data = resp.data.result || resp.data;
          setBook(data);

          BookService.AddUserAction({ bookId: Number(id), actionType: 0});

        })
        .catch(() => alert("Failed to load book"));
    }
  }, [id]);

  const renderPrice = () => {
    if (!book) return null;

    if (book.price === 0) {
      return <span className="badge bg-success">Free</span>;
    }

    if (book.discountPercent && book.discountPercent > 0) {
      const discountedPrice = book.price - book.discountPercent;
      return (
        <span>
          <span className="text-decoration-line-through me-2">
            {book.price}{AppConstants.Currency}
          </span>
          <span className="text-danger">{discountedPrice}{AppConstants.Currency}</span>
        </span>
      );
    }

    return <span>{book.price}{AppConstants.Currency}</span>;
  };

  if (!book) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-4">
      {/* Back Button */}
      <button className="btn btn-secondary mb-3" onClick={() => navigate("/Books")}>
        ← Back to List
      </button>

      <div className="card p-4 shadow d-flex flex-row gap-4">
        {/* Cover */}
        {book.coverPhotoUrl && (
          <img
            src={AppConstants.FileServerUrl + book.coverPhotoUrl}
            alt={book.title}
            style={{ width: "300px", height: "200px", objectFit: "cover" }}
            className="mb-3"
          />
        )}

        {/* Info beside cover */}
        <div>
          <h2>{book.title}</h2>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Publisher:</strong> {book.publisher}</p>
          <p><strong>Category:</strong> {book.category}</p>
          <p><strong>Price:</strong> {renderPrice()}</p>
          <button className="btn btn-success mt-2 mb-2" onClick={() => navigate("/read-book/"+book.id)}>
             Read Book
          </button>
        </div>
      </div>

      {/* Short Description & Details below */}
      <div className="mt-3">
        {book.shortDescription && (
          <p><strong>Short Description:</strong> {book.shortDescription}</p>
        )}

        {book.details && (
          <p><strong>Details:</strong> {book.details}</p>
        )}
      </div>
    </div>
  );
};