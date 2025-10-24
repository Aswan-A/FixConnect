import { useEffect, useState } from "react";
import { PUBLIC_URL } from "config";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "~/components/ui/carousel";
import { fetchWithAuth } from "~/hooks/fetchWithAuth";
import { Mail, Phone, User } from "lucide-react";

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
        const res = await fetchWithAuth(`${PUBLIC_URL}/api/profile/me`);


        if (!res.ok) {
          const text = await res.text();
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
    <div className="space-y-6">
  
      

      {/* Profile Content */}
      <div className="max-w-3xl p-6 bg-white rounded-xl shadow-lg space-y-6">
        {/* User Info */}
        <div className="flex items-center space-x-4">
          {user.profilePic && (
            <img
              src={user.profilePic}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover"
            />
          )}
          <div><div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/10">
                    <User className="h-3 w-3 text-[var(--primary)]" />
                  </div>
            <h2 className="text-2xl font-bold">{user.name}</h2></div><br />
            <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/10">
                    <Mail  className="h-3 w-3 text-[var(--primary)]" />
                  </div>
            <p className="text-gray-600">{user.email}</p></div><br></br>
            <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/10">
                    <Phone className="h-3 w-3 text-[var(--primary)]" />
                  </div>
            {user.phoneNumber && <p>{user.phoneNumber}</p>}</div>
            {user.isPro && <p className="text-green-600 font-semibold">Pro User</p>}
          </div>
        </div>

        {/* ProUser Info */}
        {proUser && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <h3 className="text-xl font-semibold mb-2">Pro User Info</h3>
            {proUser.occupation && <p>Occupation: {proUser.occupation}</p>}
            {proUser.skill && <p>Skills: {proUser.skill.join(", ")}</p>}
            {proUser.Degree && <p>Degree: {proUser.Degree}</p>}
            {proUser.certifications && proUser.certifications.length > 0 && (
              <div>
                <p className="font-medium mb-2">Certifications:</p>

                <Carousel className="w-full max-w-xl">
                  <CarouselContent>
                    {proUser.certifications.map((cert, index) => {
                      const isPdf = cert.toLowerCase().endsWith(".pdf")

                      return (
                        <CarouselItem key={index}>
                          <div className="p-2 border rounded-lg bg-white flex justify-center items-center">
                            {isPdf ? (
                              <embed
                                src={cert}
                                type="application/pdf"
                                width="100%"
                                height="400px"
                                className="rounded-lg border border-gray-300"
                              />
                            ) : (
                              <img
                                src={cert}
                                alt={`Certification ${index + 1}`}
                                className="rounded-lg border border-gray-300 w-full h-[400px] object-contain"
                              />
                            )}
                          </div>
                        </CarouselItem>
                      )
                    })}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            )}
            {proUser.description && <p>Description: {proUser.description}</p>}
          </div>
        )}
      </div>
        {proUser &&(
      <div><a href="/pro-register">
      <input type="button"
      className="p-2 rounded"
      style={{
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
           
          }} value="Edit Pro" ></input></a></div>)}

       {!proUser &&(
        

      <div><a href="/pro-register">
      <input type="button"
      className="p-2 rounded"
      style={{
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
           
          }} value="Make Pro" ></input></a></div>
          
          
          )}

        
        {/* </div> */}
    </div>
  );
}