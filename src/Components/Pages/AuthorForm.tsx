import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthorService } from "../../Services/authorService";
import type { AuthorModel } from "../../Models/AuthorModel";

export const AuthorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const entityName = "Author";

  const [author, setAuthor] = useState<AuthorModel>({
    id: 0,
    name: "",
    address: "",
    contact: "",
    status: 1,
  });
  const [loading, setLoading] = useState(false);

  // Load author if editing
  useEffect(() => {
    if (id) {
      AuthorService.GetById(Number(id))
        .then((resp: any) => setAuthor(resp.data))
        .catch((err) => console.error(err));
    }
  }, [id]);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAuthor({ ...author, [name]: name === "status" ? Number(value) : value });
  };

  const saveAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await AuthorService.Update(Number(id), author);
        alert(`${entityName} updated successfully!`);
      } else {
        await AuthorService.Create(author);
        alert(`${entityName} saved successfully!`);
      }

      // Go back to list and refresh
      navigate("/authors", { state: { refresh: true } });
    } catch (err) {
      console.error(err);
      alert("Operation failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card p-4" style={{ maxWidth: 500, margin: "auto" }}>
        <h4 className="text-center mb-3">{id ? "Edit Author" : "Add Author"}</h4>

        <form onSubmit={saveAuthor}>
          <input
            name="name"
            className="form-control mb-2"
            placeholder="Name"
            value={author.name}
            onChange={handleInput}
            required
          />

          <input
            name="address"
            className="form-control mb-2"
            placeholder="Address"
            value={author.address}
            onChange={handleInput}
          />

          <input
            name="contact"
            className="form-control mb-2"
            placeholder="Contact"
            value={author.contact}
            onChange={handleInput}
          />

          <select
            name="status"
            className="form-control mb-3"
            value={author.status}
            onChange={handleInput}
          >
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>

          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/authors")}
              disabled={loading}
            >
              Back
            </button>
            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : id ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};