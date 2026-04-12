import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppConstants } from '../../AppConstants';
import type { BookListItemModel } from '../../Models/BookListItemModel';
import { AuthContext } from "../Contexts/auth/authContext";

type BookProps = {
    book: BookListItemModel;
    handleEdit: (id: number) => void;
    handleDelete: (id: number) => void;
};

export const Book: React.FC<BookProps> = ({ book, handleEdit, handleDelete }) => {

    const { state } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showFullShort, setShowFullShort] = useState(false);

    // ★ UPDATE: Corrected logic for percentage-based discount
    const renderPrice = () => {
        if (book.price === 0) {
            return <span className="badge bg-success">Free</span>;
        }

        if (book.discountPercent && book.discountPercent > 0) {
            // Calculation: Price * (1 - Percent / 100)
            const discountedPrice = book.price * (1 - book.discountPercent / 100);
            
            return (
                <span>
                    <span className="text-decoration-line-through me-2 text-muted small">
                        {book.price}{AppConstants.Currency}
                    </span>
                    <span className="text-danger fw-bold">
                        {discountedPrice.toFixed(2)}{AppConstants.Currency}
                    </span>
                </span>
            );
        }

        return <span className="fw-bold">{book.price}{AppConstants.Currency}</span>;
    };

    const truncateText = (text: string, length: number) =>
        text.length > length ? text.substring(0, length) + "..." : text;

    return (
        <div className="card h-100 mb-3 shadow-sm border-0 overflow-hidden">

            {/* ★ UPDATE: Added Relative container for the Sale Badge */}
            <div className="position-relative">
                {book.coverPhotoUrl && (
                    <img
                        src={`${AppConstants.FileServerUrl}${book.coverPhotoUrl}`}
                        className="card-img-top"
                        alt={book.title}
                        style={{ height: '220px', objectFit: 'cover' }}
                    />
                )}
                
                {/* ★ UPDATE: Red Sale Badge on Image */}
                {book.discountPercent && book.discountPercent > 0 && (
                    <span 
                        className="position-absolute top-0 start-0 badge bg-danger m-2 shadow"
                        style={{ fontSize: '0.75rem', zIndex: 2 }}
                    >
                        {book.discountPercent}% OFF
                    </span>
                )}
            </div>

            <div className="card-body">
                <h5 className="card-title text-primary text-truncate">{book.title}</h5>

                <div className="mb-2 text-muted small">
                    <p className="mb-0"><strong>Author:</strong> {book.author}</p>
                    <p className="mb-0"><strong>Category:</strong> {book.category}</p>
                    <p className="mb-0 mt-1"><strong>Price:</strong> {renderPrice()}</p>
                </div>

                {book.shortDescription && (
                    <p className="card-text small text-secondary">
                        {showFullShort
                            ? book.shortDescription
                            : truncateText(book.shortDescription, 60)}
                        {book.shortDescription.length > 60 && (
                            <button
                                className="btn btn-link btn-sm p-0 ms-1 text-decoration-none"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowFullShort(!showFullShort);
                                }}
                            >
                                {showFullShort ? "Show less" : "Read more"}
                            </button>
                        )}
                    </p>
                )}
            </div>

            <div className="card-footer bg-white border-top-0 d-flex gap-2 justify-content-between pb-3">
                {/* Admin/Librarian Controls */}
                {(state.role === 'Admin' || state.role === 'Librarian') && (
                    <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-outline-warning" onClick={() => handleEdit(book.id)}>
                            <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(book.id)}>
                            <i className="bi bi-trash"></i>
                        </button>
                    </div>
                )}

                <button 
                    className="btn btn-sm btn-primary flex-grow-1 shadow-sm" 
                    onClick={() => navigate(`/book-details/${book.id}`)}
                >
                    View Details
                </button>
            </div>
        </div>
    );
};