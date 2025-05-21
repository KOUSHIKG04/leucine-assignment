import React from "react";
import { AccessRequest } from "../types/types";

interface RequestCardProps {
  request: AccessRequest;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
}

const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onApprove,
  onReject,
}) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">Request from {request.user.username}</h5>
        <h6 className="card-subtitle mb-2 text-muted">
          Software: {request.software.name}
        </h6>
        <p className="card-text">Access Type: {request.accessType}</p>
        <p className="card-text">Reason: {request.reason}</p>
        <p className="card-text">
          Status:{" "}
          <span
            className={`badge bg-${
              request.status === "Pending"
                ? "warning"
                : request.status === "Approved"
                ? "success"
                : "danger"
            }`}
          >
            {request.status}
          </span>
        </p>

        {request.status === "Pending" && onApprove && onReject && (
          <div className="mt-3">
            <button
              className="btn btn-success me-2"
              onClick={() => onApprove(request.id)}
            >
              Approve
            </button>
            <button
              className="btn btn-danger"
              onClick={() => onReject(request.id)}
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestCard;
