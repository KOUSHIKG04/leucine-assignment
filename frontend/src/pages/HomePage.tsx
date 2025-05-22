import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useAuth } from "../context/AuthContext";


const HomePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Welcome{user?.username ? `, ${user.username}` : ""}!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-600">
            <span className="font-semibold">Your role:</span> {user?.role}
          </p>
          <Button variant="destructive" onClick={logout}>
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
