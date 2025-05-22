import React, { useState, useEffect } from "react";
import api from "../services/api";
import { AccessRequest } from "../types/types";
import RequestCard from "../components/Requestcard";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";

const PendingRequests: React.FC = () => {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get("/requests/pending");
      setRequests(response.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError("Failed to load pending requests. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await api.patch(`/requests/${id}`, { status: "Approved" });
      setMessage("Request approved successfully!");
      fetchRequests();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to approve request. Please try again."
      );
    }
  };

  const handleReject = async (id: number) => {
    try {
      await api.patch(`/requests/${id}`, { status: "Rejected" });
      setMessage("Request rejected successfully!");
      fetchRequests();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to reject request. Please try again."
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-semibold text-center mb-6">
        Pending Access Requests
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert className="mb-4">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {requests.length === 0 ? (
            <Alert className="mb-4">
              <AlertTitle>No Pending Requests</AlertTitle>
              <AlertDescription>
                All access requests have been reviewed.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {requests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PendingRequests;
