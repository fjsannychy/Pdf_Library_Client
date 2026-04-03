import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from '../Contexts/auth/authContext.ts';

export const AppBar = () => {
  const { state } = useContext(AuthContext);

  const loggedIn = !!state.accessToken;

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
            
            {/* Username */}
            {loggedIn && (
              <li className="nav-item">
                <span className="nav-link">{state.username}</span>
              </li>
            )}

            {/* Home (always visible) */}
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

            {/* Books */}
            {loggedIn && (
              <li className="nav-item">
                <NavLink
                  to="/books"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Books
                </NavLink>
              </li>
            )}

            {/* Authors */}
            {loggedIn && (
              <li className="nav-item">
                <NavLink
                  to="/authors"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Authors
                </NavLink>
              </li>
            )}

            {/* Users */}
            {loggedIn && (
              <li className="nav-item">
                <NavLink
                  to="/users"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Users
                </NavLink>
              </li>
            )}

            {/* Publishers (always visible) */}
            <li className="nav-item">
              <NavLink
                to="/publishers"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Publishers
              </NavLink>
            </li>

            {/* Login / Register (only when not logged in) */}
            {!loggedIn && (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                  >
                    Register
                  </NavLink>
                </li>
              </>
            )}

            {/* Logout (only when logged in) */}
            {loggedIn && (
              <li className="nav-item">
                <NavLink
                  to="/logout"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Logout
                </NavLink>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
};