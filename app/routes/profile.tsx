import { useEffect, useState } from "react";
import { PUBLIC_URL } from "config";

type User = {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profilePic?: string;
  isPro?: boolean;
  // add other user fields here except password
};

type ProUser = {
  userID: string;
  occupation?: string;
  skill?: string[];
  Degree?: string;
  certifications?: string[];
  description?: string;
  // add other ProUser fields here
};

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [proUser, setProUser] = useState<ProUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("User not authenticated");

        const res = await fetch(`${PUBLIC_URL}/api/profile/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text(); // show actual error
          throw new Error(`Failed to fetch profile: ${text}`);
        }

        const data = await res.json();
        setUser(data.user);
        setProUser(data.proUser || null);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="p-6 text-center">Loading profile...</p>;
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;
  if (!user) return <p className="p-6 text-center">User not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-8 space-y-6">
      {/* User Info */}
      <div className="flex items-center space-x-4">
        {user.profilePic && (
          <img
            src={user.profilePic}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
          {user.phoneNumber && <p>Phone: {user.phoneNumber}</p>}
          {user.isPro && <p className="text-green-600 font-semibold">Pro User</p>}
        </div>
      </div>

      {/* ProUser Info */}
      {proUser && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-2">
          <h2 className="text-xl font-semibold mb-2">Pro User Info</h2>
          {proUser.occupation && <p>Occupation: {proUser.occupation}</p>}
          {proUser.skill && <p>Skills: {proUser.skill.join(", ")}</p>}
          {proUser.Degree && <p>Degree: {proUser.Degree}</p>}
          {proUser.certifications && <p>Certifications: {proUser.certifications.join(", ")}</p>}
          {proUser.description && <p>Description: {proUser.description}</p>}
        </div>
      )}
    </div>
  );
}
