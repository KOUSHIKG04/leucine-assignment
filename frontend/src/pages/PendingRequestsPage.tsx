import React, { useState, useEffect } from "react";
import api from "../services/api";
import { AccessRequest } from "../types/types";
import RequestCard from "../components/Requestcard";

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
      const response = await api.get("/requests");
      setRequests(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError("Failed to load pending requests. Please try again later.");
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await api.patch(`/requests/${id}`, { status: "Approved" });
      setMessage("Request approved successfully!");
      // Update the list
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
      // Update the list
      fetchRequests();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to reject request. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Pending Access Requests</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      {requests.length === 0 ? (
        <div className="alert alert-info">
          No pending requests at this time.
        </div>
      ) : (
        <div className="row">
          {requests.map((request) => (
            <div className="col-md-6" key={request.id}>
              <RequestCard
                request={request}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingRequests;
