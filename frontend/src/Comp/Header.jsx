import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const Header = () => {
  const { user, token, logout } = useAuth();
  const [profile, setProfile] = useState(null);

  // Fetch user profile from backend
  const fetchProfile = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data.user);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        Space Cargo Management
      </Link>
      <nav>
        {user ? (
          <div className="flex items-center gap-4">
            {/* Popover for User Profile */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-sm font-medium hover:underline mr-10">{user.username}</button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4 bg-white rounded-md shadow-md">
                <Card>
                  <CardContent>
                    <CardTitle className="text-lg">User Profile</CardTitle>
                    {profile ? (
                      <div className="mt-2">
                        <p><strong>Username:</strong> {profile.username}</p>
                        <p><strong>Joined:</strong> {new Date(profile.createdAt).toDateString()}</p>
                        <Button onClick={logout} className="mt-4 w-full bg-red-600 hover:bg-red-700">
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <p className="text-gray-500">Loading profile...</p>
                    )}
                  </CardContent>
                </Card>
              </PopoverContent>
            </Popover>
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
