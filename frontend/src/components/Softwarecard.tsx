import React from "react";
import { Software } from "../types/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";

interface SoftwareCardProps {
  software: Software;
}

const SoftwareCard: React.FC<SoftwareCardProps> = ({ software }) => {
  return (
    <Card className="mb-4 shadow-sm">
      <CardHeader>
        <CardTitle>{software.name}</CardTitle>
        <CardDescription>{software.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mt-2">
          {software.accessLevels.map((level) => (
            <Badge key={level} variant="outline">
              {level}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SoftwareCard;
