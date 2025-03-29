import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Space Cargo Management</h1>
      <nav>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm">{user.username}</span>
            <button
              onClick={logout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/signup" className="hover:underline">
              Signup
            </Link>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;