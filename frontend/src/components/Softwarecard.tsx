import React from "react";
import { Software } from "../types/types";

interface SoftwareCardProps {
  software: Software;
}

const SoftwareCard: React.FC<SoftwareCardProps> = ({ software }) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{software.name}</h5>
        <p className="card-text">{software.description}</p>
        <p className="card-text">
          <small className="text-muted">
            Access Levels: {software.accessLevels.join(", ")}
          </small>
        </p>
      </div>
    </div>
  );
};

export default SoftwareCard;
