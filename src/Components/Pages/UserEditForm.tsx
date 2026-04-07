import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserService } from "../../Services/userService";
import type { UserModel } from "../../Models/UserModel";

export const UserEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [form, setForm] = useState<UserModel>({
    id: 0,
    username: "",
    fullname: "",
    role: "General",
    status: 1,
    password: "" 
  });

  useEffect(() => {
    if (id) {
      UserService.GetById(Number(id)).then((data: any) => {
        setForm({
          // Handle both C# (Capital) and JS (lowercase) property names
          id: data.id || data.Id,
          username: data.username || data.UserName || "",
          fullname: data.fullname || data.FullName || "", 
          role: data.role || data.Role || "General",
          status: data.status ?? data.Status ?? 1,
          password: "" // Keep this empty to force user entry
        });
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Safety check to prevent 401 lockout
    if (!form.password || form.password.trim() === "") {
      alert("You must enter a password to save changes, otherwise the login will break.");
      return;
    }
    
    try {
      // This sends the data to your C# [HttpPut("{id}")] Update method
      await UserService.Update(Number(id), form);
      alert("User updated successfully!");
      navigate("/users"); 
    } catch (err: any) {
      alert("Update failed: " + (err.response?.data?.message || "Check Console"));
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 border-0">
        <h3 className="mb-4">Edit User: <span className="text-primary">{form.username}</span></h3>
        <form onSubmit={handleSubmit}>
          
          <div className="mb-3">
            <label className="form-label fw-bold">Full Name</label>
            <input 
              className="form-control"
              value={form.fullname}
              onChange={(e) => setForm({...form, fullname: e.target.value})}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold text-danger">Password (Required)</label>
            <input 
              type="password"
              className="form-control border-danger"
              placeholder="Enter password to sync with database"
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
              required
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Role</label>
              <select 
                className="form-select"
                value={form.role} 
                onChange={(e) => setForm({...form, role: e.target.value})}
              >
                <option value="General">General</option>
                <option value="Librarian">Librarian</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Status</label>
              <select 
                className="form-select"
                value={form.status}
                onChange={(e) => setForm({...form, status: Number(e.target.value)})}
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
                <option value={2}>Suspended</option>
              </select>
            </div>
          </div>

          <div className="d-flex gap-2 mt-3">
            <button type="submit" className="btn btn-primary">Save Changes</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/users")}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};