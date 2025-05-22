import React, { useState, useEffect } from "react";
import api from "../services/api";
import { AccessRequest } from "../types/types";
import RequestCard from "../components/Requestcard";
import { Loader2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

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
    <div className="max-w-6xl mx-auto px-6 py-10">
      <Card className="mb-6 shadow-none border-none">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">
            PENDING ACCESS REQUEST
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
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
                    All access requests have been handled.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingRequests;
