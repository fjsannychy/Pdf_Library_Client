import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PublisherService } from "../../Services/publisherService";
import type { PublisherModel } from "../../Models/PublisherModel";

const Publishers = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [publishers, setPublishers] = useState<PublisherModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 🔹 Load Publishers
  const loadPublishers = async () => {
    try {
      setLoading(true);
      const resp: any = await PublisherService.GetList({
        search,
        pageNumber: 1,
        pageSize: 100,
      });
      setPublishers(resp.data.publishers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Initial load
  useEffect(() => {
    loadPublishers();
  }, []);

  // 🔹 Refresh after create/update
  useEffect(() => {
    if (location.state?.refresh) {
      loadPublishers();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // 🔹 Delete
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this publisher?")) return;

    try {
      PublisherService.Delete(id).then((resp) => {
        alert(resp.data.message);
        loadPublishers();
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      {/* 🔝 Title + Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Publishers</h3>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/publishers/add")}
        >
          Add Publisher
        </button>
      </div>

      {/* 🔍 Search */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search publisher..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyUp={loadPublishers}
      />

      {/* 📋 Table */}
      {loading ? (
        <p>Loading...</p>
      ) : publishers.length === 0 ? (
        <p>No publishers found.</p>
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
            {publishers.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.address}</td>
                <td>{p.contact}</td>
                <td>{p.status === 1 ? "Active" : "Inactive"}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => navigate(`/publishers/edit/${p.id}`)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(p.id)}
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

export default Publishers;