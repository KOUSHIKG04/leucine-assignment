import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Software, AccessRequest } from "../types/types";
import SoftwareCard from "../components/Softwarecard"

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [software, setSoftware] = useState<Software[]>([]);
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
       
        const softwareResponse = await api.get("/software");
        setSoftware(softwareResponse.data);

        if (user?.role === "Manager") {
          const requestsResponse = await api.get("/requests");
          setRequests(requestsResponse.data);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border"></div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      <p>
        Welcome, {user?.username}! You are logged in as {user?.role}.
      </p>

      <div className="mt-4">
        <h3>Available Software</h3>
        {software.length > 0 ? (
          <div className="row">
            {software.map((item) => (
              <div className="col-md-4" key={item.id}>
                <SoftwareCard software={item} />
              </div>
            ))}
          </div>
        ) : (
          <p>No software available.</p>
        )}
      </div>

      {user?.role === "Employee" && (
        <div className="mt-4">
          <p>
            To request access to software, please visit the{" "}
            <a href="/request-access">Request Access</a> page.
          </p>
        </div>
      )}

      {user?.role === "Manager" && requests.length > 0 && (
        <div className="mt-4">
          <h3>Pending Requests</h3>
          <p>
            You have {requests.length} pending requests to review. Visit the{" "}
            <a href="/pending-requests">Pending Requests</a> page to manage
            them.
          </p>
        </div>
      )}

      {user?.role === "Admin" && (
        <div className="mt-4">
          <p>
            As an admin, you can{" "}
            <a href="/create-software">create new software</a>.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
