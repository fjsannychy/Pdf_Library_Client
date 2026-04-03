import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from '../Contexts/auth/authContext.ts';

export const AppBar = () => {

  const { state } = useContext(AuthContext);


  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">

        <NavLink className="navbar-brand" to="/">
          PDF Library
        </NavLink>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
                  <span className="nav-link">{state.username}</span>
            </li>
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Home
              </NavLink>
            </li>


            <li className={state.accessToken ? "nav-item" : "d-none nav-item"}>
              <NavLink
                to="/Books"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Books
              </NavLink>
            </li>
             <li className={state.accessToken ? "nav-item" : "d-none nav-item"}>
              <NavLink
                to="/authors"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Authors
              </NavLink>
            </li>
             <li className="nav-item">
              <NavLink className="nav-link" to="/publishers">
                Publishers
              </NavLink>
            </li>


            <li className={state.accessToken ? "nav-item d-none" :"nav-item"}>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Login
              </NavLink>
            </li>

            <li className={state.accessToken ? "nav-item d-none" :"nav-item"}>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Register
              </NavLink>
            </li>

            <li className={state.accessToken ? "nav-item" : "d-none nav-item"}>
              <NavLink
                to="/logout"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Logout
              </NavLink>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
};