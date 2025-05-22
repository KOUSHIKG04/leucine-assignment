import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Software } from "../types/types";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Card, CardContent } from "../components/ui/card";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";

const RequestAccess: React.FC = () => {
  const [software, setSoftware] = useState<Software[]>([]);
  const [selectedSoftwareId, setSelectedSoftwareId] = useState<number | "">("");
  const [accessType, setAccessType] = useState<string>("Read");
  const [reason, setReason] = useState("");
  const [availableAccessTypes, setAvailableAccessTypes] = useState<string[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchSoftware = async () => {
      try {
        // The endpoint should match the backend route structure
        const response = await api.get("/software");
        setSoftware(response.data);
      } catch (err) {
        console.error("Error fetching software:", err);
        setError("Failed to load software list. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSoftware();
  }, []);

  useEffect(() => {
    if (selectedSoftwareId) {
      const selected = software.find(
        (s) => s.id === Number(selectedSoftwareId)
      );
      if (selected) {
        setAvailableAccessTypes(selected.accessLevels);
        setAccessType(selected.accessLevels[0] || "Read");
      }
    } else {
      setAvailableAccessTypes([]);
      setAccessType("Read");
    }
  }, [selectedSoftwareId, software]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedSoftwareId) {
      setError("Please select a software");
      return;
    }

    try {
      // Check if user is authenticated
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token");
      
      if (!token || !user?.id) {
        setError("You must be logged in to request access. Please log in and try again.");
        return;
      }
      
      console.log("User authenticated:", user);
      console.log("Token exists:", !!token);
      
      // Log the request payload for debugging
      const payload = {
        softwareId: Number(selectedSoftwareId),
        accessType,
        reason,
      };
      console.log("Request payload:", payload);
      
      // Make the API request
      const response = await api.post("/requests", payload);
      console.log("Request creation response:", response.data);

      setSuccess("Access request submitted successfully!");
      setSelectedSoftwareId("");
      setAccessType("Read");
      setReason("");
    } catch (err: any) {
      console.error("Detailed error:", err);
      // Extract more detailed error information if available
      const errorMessage = 
        err.response?.data?.message ||
        (err.message === "Network Error" ? "Cannot connect to server. Please check your connection." : 
        "Failed to submit request. Please try again.");
      
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 mt-5">
      <h2 className="text-xl font-semibold mb-6 text-center">REQUEST SOFTWARE ACCESS</h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="software" className="mb-2">
                SELECT SOFTWARE
              </Label>
              <Select
                onValueChange={(value) =>
                  setSelectedSoftwareId(value ? Number(value) : "")
                }
                value={selectedSoftwareId ? String(selectedSoftwareId) : ""}
              >
                <SelectTrigger id="software">
                  <SelectValue placeholder="-- Select Software --" />
                </SelectTrigger>
                <SelectContent>
                  {software.map((item) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="accessType" className="mb-2">
                ACCESS TYPE
              </Label>
              <Select
                onValueChange={setAccessType}
                value={accessType}
                disabled={availableAccessTypes.length === 0}
              >
                <SelectTrigger id="accessType">
                  <SelectValue placeholder="Select Access Type" />
                </SelectTrigger>
                <SelectContent>
                  {availableAccessTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reason" className="mb-2">
                REASON
              </Label>
              <Textarea
                id="reason"
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                placeholder="Why do you need access?"
              />
            </div>

            <Button type="submit" disabled={!selectedSoftwareId}>
              SUBMIT REQUEST
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestAccess;
