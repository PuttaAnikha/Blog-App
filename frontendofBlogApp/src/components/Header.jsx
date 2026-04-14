import { NavLink } from "react-router";
import { useAuth } from "../store/authStore";
import {
  navbarClass,
  navContainerClass,
  navBrandClass,
  navLinksClass,
  navLinkClass,
  navLinkActiveClass,
} from "../styles/common";

function Header() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const user = useAuth((state) => state.currentUser);

  // decide profile route based on role
  const getProfilePath = () => {
    if (!user) return "/";

    switch (user.role) {
      case "AUTHOR":
        return "/author-profile";
      case "ADMIN":
        return "/admin-profile";
      default:
        return "/user-profile";
    }
  };

  return (
    <nav className={navbarClass}>
      <div className={navContainerClass}>

        {/* LOGO */}
        <NavLink to="/" className={navBrandClass}>
          MyBlog
        </NavLink>

        <ul className={navLinksClass}>

          {/* HOME */}
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? navLinkActiveClass : navLinkClass
              }
            >
              Home
            </NavLink>
          </li>

          {/* NOT LOGGED IN */}
          {!isAuthenticated && (
            <>
              <li>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive ? navLinkActiveClass : navLinkClass
                  }
                >
                  Register
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? navLinkActiveClass : navLinkClass
                  }
                >
                  Login
                </NavLink>
              </li>
            </>
          )}

          {/* LOGGED IN */}
          {isAuthenticated && (
            <li>
              <NavLink
                to={getProfilePath()}
                className={({ isActive }) =>
                  `flex items-center gap-2 ${isActive ? navLinkActiveClass : navLinkClass}`
                }
              >
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="profile"
                    className="w-8 h-8 rounded-full object-cover border border-white/20"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center text-xs font-bold border border-white/20">
                    {user?.firstName?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span>Profile</span>
              </NavLink>
            </li>
          )}

        </ul>
      </div>
    </nav>
  );
}

export default Header;