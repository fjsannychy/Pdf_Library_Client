import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PublisherService } from "../../Services/publisherService";
import type { PublisherModel } from "../../Models/PublisherModel";

export const PublisherForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const entityName = "Publisher";

  const [publisher, setPublisher] = useState<PublisherModel>({
    id: 0,
    name: "",
    address: "",
    contact: "",
    status: 1,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      PublisherService.GetById(Number(id))
        .then((resp: any) => setPublisher(resp.data))
        .catch((err) => console.error(err));
    }
  }, [id]);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPublisher({
      ...publisher,
      [name]: name === "status" ? Number(value) : value,
    });
  };

  const savePublisher = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await PublisherService.Update(Number(id), publisher);
        alert(`${entityName} updated successfully!`);
      } else {
        await PublisherService.Create(publisher);
        alert(`${entityName} saved successfully!`);
      }

      navigate("/publishers", { state: { refresh: true } });
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
        <h4 className="text-center mb-3">
          {id ? "Edit Publisher" : "Add Publisher"}
        </h4>

        <form onSubmit={savePublisher}>
          <input
            name="name"
            className="form-control mb-2"
            placeholder="Name"
            value={publisher.name}
            onChange={handleInput}
            required
          />

          <input
            name="address"
            className="form-control mb-2"
            placeholder="Address"
            value={publisher.address}
            onChange={handleInput}
          />

          <input
            name="contact"
            className="form-control mb-2"
            placeholder="Contact"
            value={publisher.contact}
            onChange={handleInput}
          />

          <select
            name="status"
            className="form-control mb-3"
            value={publisher.status}
            onChange={handleInput}
          >
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>

          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/publishers")}
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