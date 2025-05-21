import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CreateSoftware: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [accessLevels, setAccessLevels] = useState<string[]>(["Read"]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleAccessLevelChange = (level: string) => {
    if (accessLevels.includes(level)) {
      setAccessLevels(accessLevels.filter((l) => l !== level));
    } else {
      setAccessLevels([...accessLevels, level]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (accessLevels.length === 0) {
      setError("At least one access level must be selected");
      return;
    }

    try {
      await api.post("/software", { name, description, accessLevels });
      setSuccess("Software created successfully!");

      // Reset form
      setName("");
      setDescription("");
      setAccessLevels(["Read"]);

      // Redirect after a delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to create software. Please try again."
      );
    }
  };

  return (
    <div>
      <h2 className="mb-4">Create Software</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Software Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">Access Levels</label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="readAccess"
                    checked={accessLevels.includes("Read")}
                    onChange={() => handleAccessLevelChange("Read")}
                  />
                  <label className="form-check-label" htmlFor="readAccess">
                    Read
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="writeAccess"
                    checked={accessLevels.includes("Write")}
                    onChange={() => handleAccessLevelChange("Write")}
                  />
                  <label className="form-check-label" htmlFor="writeAccess">
                    Write
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="adminAccess"
                    checked={accessLevels.includes("Admin")}
                    onChange={() => handleAccessLevelChange("Admin")}
                  />
                  <label className="form-check-label" htmlFor="adminAccess">
                    Admin
                  </label>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Create Software
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSoftware;
