import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Software, AccessRequest } from "../types/types";
import SoftwareCard from "../components/Softwarecard";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";

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
          // Fix: Use the correct endpoint path for pending requests
          const requestsResponse = await api.get("/requests/pending");
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
      <div className="grid gap-4 p-6">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-6 w-3/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <Card>
        <CardHeader >
          <CardTitle>DASHBOARD</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Welcome, <strong>{user?.username}</strong>! You are logged in as{" "}
            <strong>{user?.role}</strong>.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AVAILABLE SOFTWARE</CardTitle>
        </CardHeader>
        <CardContent>
          {software.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {software.map((item) => (
                <SoftwareCard key={item.id} software={item} />
              ))}
            </div>
          ) : (
            <p>No available software</p>
          )}
        </CardContent>
      </Card>

      {user?.role === "Employee" && (
        <Card>
          <CardHeader>
            <CardTitle>Request Access</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              To request access to software, please visit the{" "}
              <a href="/request-access" className="text-blue-600 underline">
                Request Access
              </a>{" "}
              page.
            </p>
          </CardContent>
        </Card>
      )}

      {user?.role === "Manager" && requests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              You have {requests.length} pending requests. Manage them at the{" "}
              <a href="/pending-requests" className="text-blue-600 underline">
                Pending Requests
              </a>{" "}
              page.
            </p>
          </CardContent>
        </Card>
      )}

      {user?.role === "Admin" && (
        <Card>
          <CardHeader>
            <CardTitle>ADMIN ACTION</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              As an admin, you can{" "}
              <a href="/create-software" className="text-blue-600 underline">
                create new software
              </a>
              .
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
