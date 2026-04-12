import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from '../Contexts/auth/authContext.ts';

export const AppBar = () => {
  const { state } = useContext(AuthContext);
  const loggedIn = !!state.accessToken;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">
        {/* Logo with Icon */}
        <NavLink className="navbar-brand d-flex align-items-center fw-bold" to="/">
          <i className="bi bi-book-half me-2 text-primary"></i>
          PDF <span className="text-primary">Library</span>
        </NavLink>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            
            {/* Nav Links Helper Function for cleaner code */}
            <li className="nav-item">
              <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                Home
              </NavLink>
            </li>

            {loggedIn && (
              <li className="nav-item">
                <NavLink to="/books" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                  Books
                </NavLink>
              </li>
            )}

            {/* Admin Dropdown - Better than listing everything in a row */}
            {loggedIn && state.role === "Admin" && (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="adminDropdown" role="button" data-bs-toggle="dropdown">
                  Management
                </a>
                <ul className="dropdown-menu dropdown-menu-dark shadow">
                  <li><NavLink className="dropdown-item" to="/users"><i className="bi bi-people me-2"></i>Users</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/authors"><i className="bi bi-person-badge me-2"></i>Authors</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/publishers"><i className="bi bi-building me-2"></i>Publishers</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/categories"> <i className="bi bi-tags me-2"></i>Categories  </NavLink></li>
                  
   


                </ul>
              </li>
            )}

            {/* User Profile & Auth Section */}
            <div className="ms-lg-3 d-flex align-items-center">
              {loggedIn ? (
                <>
                  <span className="navbar-text me-3 d-none d-lg-inline text-light opacity-75">
                    <i className="bi bi-person-circle me-1"></i> {state.username}
                  </span>
                  <NavLink
      to="/profile"
      className="btn btn-outline-light btn-sm rounded-pill px-3 me-2"
    >
      Profile
    </NavLink>

                  <NavLink to="/logout" className="btn btn-outline-danger btn-sm rounded-pill px-3">
                    Logout
                  </NavLink>
                </>
              ) : (
                <div className="btn-group">
                  <NavLink to="/login" className="btn btn-primary btn-sm px-4">Login</NavLink>
                  <NavLink to="/register" className="btn btn-outline-primary btn-sm px-4">Register</NavLink>
                </div>
              )}
            </div>

          </ul>
        </div>
      </div>
    </nav>
  );
};