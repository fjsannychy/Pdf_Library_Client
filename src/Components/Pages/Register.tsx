import { useState, type ChangeEvent, type FormEvent } from "react";
import { CommonService } from "../../Services/commonServices";
import type { RegisterModel } from "../../Models/RegisterModel";
import { AuthService } from "../../Services/authServices";
import { useNavigate } from "react-router-dom";


export const Register: React.FC = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterModel>({
    userid: 0,
    fullname: "",
    username: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (CommonService.IsEmptyValueInForm(form, [])) {

      alert("Please Fillup All Fields!");
      return;

    }

    if (form.confirmPassword != form.password) {

      alert("Confirm Password and Password Not Matched!");
      return;

    }

    AuthService.Resister(form).then((resp: any) => {

      console.log(resp);

      setForm({
        userid: 0,
        fullname: "",
        username: "",
        password: "",
        confirmPassword: ""
      });

      navigate("/login");


    })


  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center vh-100">

        <div className="col-md-4">

          <div className="card shadow">

            <div className="card-body">

              <h3 className="text-center mb-4">Register</h3>

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="fullname"
                    className="form-control"
                    value={form.fullname}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="username"
                    className="form-control"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Confirm-Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="d-grid">
                  <button className="btn btn-success" type="submit">
                    Register
                  </button>
                </div>

              </form>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};