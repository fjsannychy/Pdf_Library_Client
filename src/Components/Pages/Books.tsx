import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom"; 
import { BookService } from "../../Services/bookService";
import { Book } from "../Molecoles/Book";
import type { BookFilterModel } from "../../Models/BookFilterModel";

export const Books = () => {
  const navigate = useNavigate();

  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [filter, setFilter] = useState<BookFilterModel>({
    search: "",
    pageNumber: 1,
    pageSize: 5 // adjust as needed
  });

  // Load books
  const loadBooks = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);

    BookService.GetList(filter)
      .then((resp: any) => {
        const newItems = resp.data.items || [];
        if (newItems.length === 0) setHasMore(false);
        else setBooks(prev =>
          filter.pageNumber === 1 ? newItems : [...prev, ...newItems]
        );
      })
      .finally(() => setLoading(false));
  }, [filter, loading, hasMore]);

  // Initial load and page change
  useEffect(() => {
    loadBooks();
  }, [filter.pageNumber]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= docHeight - 100) {
        setFilter(prev => ({ ...prev, pageNumber: prev.pageNumber + 1 }));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const clickDelete = (id: number) => {
    if (confirm("Do you want to delete this book?")) {
      BookService.Delete(id).then(() => {
        alert("Deleted!");
        setBooks([]);
        setHasMore(true);
        setFilter(prev => ({ ...prev, pageNumber: 1 }));
      });
    }
  };

  const clickEdit = (id: number) => {
    navigate(`/book-form/${id}`);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h3>Books</h3>
        <button className="btn btn-success" onClick={() => navigate('/book-form')}>
          + Add New Book
        </button>
      </div>

      <div className="row">
        {books.map(book => (
          <Book
            key={book.id}
            book={book}
            handleEdit={clickEdit}
            handleDelete={clickDelete}
          />
        ))}
      </div>

      {loading && <p className="text-center my-3">Loading more books...</p>}
    </div>
  );
};