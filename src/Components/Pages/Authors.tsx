import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthorService } from "../../Services/authorService";
import type { AuthorModel } from "../../Models/AuthorModel";

export const Authors = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authors, setAuthors] = useState<AuthorModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Reload authors from API
  const loadAuthors = async () => {
    try {
      setLoading(true);
      const resp: any = await AuthorService.GetList({
        search,
        pageNumber: 1,
        pageSize: 100,
      });
      setAuthors(resp.data.authors);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load authors on mount
  useEffect(() => {
    loadAuthors();
  }, []);

  // Refresh list if navigated from AuthorForm with refresh flag
  useEffect(() => {
    if (location.state?.refresh) {
      loadAuthors();
      window.history.replaceState({}, document.title); // clear refresh flag
    }
  }, [location.state]);

  // Delete author
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this author?")) return;
    try {
       AuthorService.Delete(id).then(resp => {
        alert(resp.data.message)
        loadAuthors();
       })

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Authors</h3>
        <button className="btn btn-primary" onClick={() => navigate("/authors/add")}>
          Add Author
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search author..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyUp={loadAuthors}
      />

      {loading ? (
        <p>Loading...</p>
      ) : authors.length === 0 ? (
        <p>No authors found.</p>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {authors.map((author) => (
              <tr key={author.id}>
                <td>{author.name}</td>
                <td>{author.address}</td>
                <td>{author.contact}</td>
                <td>{author.status === 1 ? "Active" : "Inactive"}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => navigate(`/authors/edit/${author.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(author.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};