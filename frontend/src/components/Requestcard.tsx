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

  const borderColor = {
    Approved: "border-l-green-500",
    Rejected: "border-l-red-500",
    Pending: "border-l-yellow-500",
  };

  return (
    <Card
      className={`relative border-l-4 ${
        borderColor[request.status as keyof typeof borderColor] ||
        "border-l-muted"
      } bg-muted/30 hover:bg-muted/50 transition-colors`}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">
              Request from{" "}
              <span className="font-semibold">{request.user.username}</span>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Software: {request.software.name}
            </CardDescription>
          </div>
          <Badge
            variant={getBadgeVariant(request.status)}
            className="text-xs py-2"
          >
            {request.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          <span className="font-medium text-muted-foreground">
            Access Type:
          </span>{" "}
          {request.accessType}
        </p>
        <p>
          <span className="font-medium text-muted-foreground">Reason:</span>{" "}
          {request.reason}
        </p>

        {request.status === "Pending" && onApprove && onReject && (
          <div className="pt-3 flex flex-col sm:flex-row gap-2">
            <Button
              onClick={() => onApprove(request.id)}
              className="w-full sm:w-auto cursor-pointer"
            >
              APPROVE
            </Button>
            <Button
              variant="destructive"
              onClick={() => onReject(request.id)}
              className="w-full sm:w-auto cursor-pointer"
            >
              REJECT
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RequestCard;
