import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Software } from "../types/types";

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
        const response = await api.get("/software");
        setSoftware(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching software:", err);
        setError("Failed to load software list. Please try again later.");
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
      await api.post("/requests", {
        softwareId: Number(selectedSoftwareId),
        accessType,
        reason,
      });

      setSuccess("Access request submitted successfully!");
      setSelectedSoftwareId("");
      setAccessType("Read");
      setReason("");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to submit request. Please try again."
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
      <h2 className="mb-4">Request Software Access</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="software" className="form-label">
                Select Software
              </label>
              <select
                className="form-select"
                id="software"
                value={selectedSoftwareId}
                onChange={(e) =>
                  setSelectedSoftwareId(
                    e.target.value ? Number(e.target.value) : ""
                  )
                }
                required
              >
                <option value="">-- Select Software --</option>
                {software.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="accessType" className="form-label">
                Access Type
              </label>
              <select
                className="form-select"
                id="accessType"
                value={accessType}
                onChange={(e) => setAccessType(e.target.value)}
                disabled={availableAccessTypes.length === 0}
                required
              >
                {availableAccessTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="reason" className="form-label">
                Reason
              </label>
              <textarea
                className="form-control"
                id="reason"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={!selectedSoftwareId}
            >
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestAccess;
