import React from "react";
import { AccessRequest } from "../types/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

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
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Approved":
        return "secondary";
      case "Rejected":
        return "destructive";
      case "Pending":
      default:
        return "default";
    }
  };

  return (
    <Card className="mb-4 shadow-sm">
      <CardHeader>
        <CardTitle>Request from {request.user.username}</CardTitle>
        <CardDescription>Software: {request.software.name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm">
          <span className="font-medium">Access Type:</span> {request.accessType}
        </p>
        <p className="text-sm">
          <span className="font-medium">Reason:</span> {request.reason}
        </p>
        <p className="text-sm flex items-center gap-2">
          <span className="font-medium">Status:</span>
          <Badge variant={getBadgeVariant(request.status)}>
            {request.status}
          </Badge>
        </p>

        {request.status === "Pending" && onApprove && onReject && (
          <div className="flex gap-3 pt-2">
            <Button onClick={() => onApprove(request.id)}>Approve</Button>
            <Button variant="destructive" onClick={() => onReject(request.id)}>
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RequestCard;
