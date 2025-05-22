import React, { useState, useEffect } from "react";
import api from "../services/api";
import { AccessRequest } from "../types/types";
import RequestCard from "../components/Requestcard";
import { Loader2, Filter } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";

const AllRequests: React.FC = () => {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(
        requests.filter((request) => request.status === statusFilter)
      );
    }
  }, [statusFilter, requests]);

  const fetchRequests = async () => {
    try {
      const response = await api.get("/requests");
      setRequests(response.data);
      setFilteredRequests(response.data);
    } catch (err) {
      setError("Failed to load requests. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await api.patch(`/requests/${id}`, { status: "Approved" });
      setMessage("Request approved successfully!");
      fetchRequests();
    } catch (err) {
      setError("Failed to approve request. Please try again.");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await api.patch(`/requests/${id}`, { status: "Rejected" });
      setMessage("Request rejected successfully!");
      fetchRequests();
    } catch (err) {
      setError("Failed to reject request. Please try again.");
    }
  };

  const handleDeleteRequest = async (id: number) => {
    try {
      await api.delete(`/requests/${id}`);
      setMessage("Request deleted successfully!");
      fetchRequests();
    } catch (err) {
      setError("Failed to delete request. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <Card className="mb-6 shadow-none border-none">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold">
              ALL ACCESS REQUESTS
            </CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Requests</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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

              {filteredRequests.length === 0 ? (
                <Alert className="mb-4">
                  <AlertTitle>No Requests Found</AlertTitle>
                  <AlertDescription>
                    No access requests match your current filter.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredRequests.map((request) => (
                    <div key={request.id} className="relative">
                      <RequestCard
                        request={request}
                        onApprove={
                          request.status === "Pending" ? handleApprove : undefined
                        }
                        onReject={
                          request.status === "Pending" ? handleReject : undefined
                        }
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0"
                        onClick={() => handleDeleteRequest(request.id)}
                      >
                        ×
                      </Button>
                    </div>
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

export default AllRequests;
