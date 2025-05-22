import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Label } from "@radix-ui/react-label";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { Button } from "../components/ui/button";

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

      setName("");
      setDescription("");
      setAccessLevels(["Read"]);

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
    <div className="max-w-xl mx-auto mt-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Software</CardTitle>
        </CardHeader>
        <CardContent>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Software Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
              />
            </div>

            <div>
              <Label>Access Levels</Label>
              <div className="flex gap-4 mt-2">
                {["Read", "Write", "Admin"].map((level) => (
                  <div key={level} className="flex items-center gap-2">
                    <Checkbox
                      id={`${level.toLowerCase()}Access`}
                      checked={accessLevels.includes(level)}
                      onCheckedChange={() => handleAccessLevelChange(level)}
                    />
                    <Label htmlFor={`${level.toLowerCase()}Access`}>
                      {level}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full py-5 cursor-pointer">
              CREATE SOFTWARE
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateSoftware;
