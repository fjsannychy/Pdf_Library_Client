import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookService } from "../../Services/bookService";
import { AppConstants } from "../../AppConstants";

export const PaymentPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState<any>(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (id) {
            BookService.GetById(Number(id), false).then((resp: any) => {
                setBook(resp.data.result || resp.data);
            });
        }
    }, [id]);

    const handleFakePayment = () => {
        setProcessing(true);
        
        // Simulating a delay for the payment gateway
        setTimeout(() => {
            // ActionType 2 represents 'Paid' or 'Purchased' in your logic
            BookService.AddUserAction({ bookId: Number(id), actionType: 2 })
                .then(() => {
                    alert("Payment Successful! This book is now in your library.");
                    navigate("/Books"); // Redirect to book list or owned books
                })
                .catch(() => alert("Payment failed. Please try again."))
                .finally(() => setProcessing(false));
        }, 2000);
    };

    if (!book) return <div className="text-center mt-5">Loading...</div>;

    return (
        <div className="container mt-5">
            <div className="card mx-auto shadow-lg border-0" style={{ maxWidth: "500px" }}>
                <div className="card-header bg-primary text-white text-center py-3">
                    <h4 className="mb-0">Secure Checkout</h4>
                </div>
                <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                        <img 
                            src={AppConstants.FileServerUrl + book.coverPhotoUrl} 
                            alt={book.title} 
                            style={{ width: "60px", height: "80px", objectFit: "cover" }} 
                            className="rounded me-3"
                        />
                        <div>
                            <h6 className="mb-0">{book.title}</h6>
                            <small className="text-muted">Digital Copy</small>
                        </div>
                        <div className="ms-auto fw-bold text-primary">
                            {/* Logic to show the discounted price if it exists */}
                            {(book.discountPercent > 0 
                                ? (book.price * (1 - book.discountPercent / 100)) 
                                : book.price).toFixed(2)} {AppConstants.Currency}
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label small fw-bold">Card Number</label>
                        <input type="text" className="form-control" placeholder="**** **** **** 1234" disabled />
                    </div>

                    <div className="row mb-4">
                        <div className="col-6">
                            <label className="form-label small fw-bold">Expiry</label>
                            <input type="text" className="form-control" placeholder="MM/YY" disabled />
                        </div>
                        <div className="col-6">
                            <label className="form-label small fw-bold">CVV</label>
                            <input type="text" className="form-control" placeholder="***" disabled />
                        </div>
                    </div>

                    <button 
                        className="btn btn-primary w-100 py-2 fw-bold" 
                        onClick={handleFakePayment}
                        disabled={processing}
                    >
                        {processing ? (
                            <><span className="spinner-border spinner-border-sm me-2"></span>Processing...</>
                        ) : (
                            `Pay Now`
                        )}
                    </button>
                    
                    <button className="btn btn-link w-100 text-muted mt-2 text-decoration-none" onClick={() => navigate(-1)}>
                        Cancel Transaction
                    </button>
                </div>
                <div className="card-footer bg-light text-center py-2">
                    <small className="text-muted"><i className="bi bi-shield-lock-fill me-1"></i> Demo Payment Mode Active</small>
                </div>
            </div>
        </div>
    );
};