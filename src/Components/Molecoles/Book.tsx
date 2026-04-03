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

    const renderPrice = () => {
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

    const truncateText = (text: string, length: number) =>
        text.length > length ? text.substring(0, length) + "..." : text;

    return (
        <div className="col-md-4 mb-3">
            <div className="card h-100">

                {/* Cover Photo */}
                {book.coverPhotoUrl && (
                    <img
                        src={`${AppConstants.FileServerUrl}${book.coverPhotoUrl}`}
                        className="card-img-top"
                        alt={book.title}
                        style={{ height: '200px', objectFit: 'cover' }}
                    />
                )}

                <div className="card-body">
                    <h5 className="card-title">{book.title}</h5>

                    {/* Author / Publisher / Category / Price */}
                    <p className="mb-1 text-muted">
                        <strong>Author:</strong> {book.author} <br />
                        <strong>Publisher:</strong> {book.publisher} <br />
                        <strong>Category:</strong> {book.category} <br />
                        <strong>Price:</strong> {renderPrice()}
                    </p>

                    {/* Short Description with Read more */}
                    {book.shortDescription && (
                        <p className="card-text">
                            {showFullShort
                                ? book.shortDescription
                                : truncateText(book.shortDescription, 50)}
                            {book.shortDescription.length > 50 && (
                                <button
                                    className="btn btn-link btn-sm p-0 ms-1"
                                    onClick={() => setShowFullShort(!showFullShort)}
                                >
                                    {showFullShort ? "Show less" : "Read more"}
                                </button>
                            )}
                        </p>
                    )}

                    {/* Features */}
                    {Array.isArray(book.features) && book.features.length > 0 && (
                        <p className="card-text">
                            <strong>Features:</strong> {book.features.join(", ")}
                        </p>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="card-footer d-flex gap-2 justify-content-between">
                    {(state.role === 'Admin' ||
                      state.role === 'Librarian' ?
                        <div className="d-flex gap-2" >
                            <button className="btn btn-sm btn-warning" onClick={() => handleEdit(book.id)}>Edit</button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(book.id)}>Delete</button>
                        </div> : <></>)}

                    {/* View Details Button */}
                    <button className="btn btn-sm btn-info" onClick={() => navigate(`/book-details/${book.id}`)}>
                        Details
                    </button>
                </div>
            </div>
        </div>
    );
};