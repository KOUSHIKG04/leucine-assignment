import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Welcome, {user?.username}</h1>
      <p>Your role: {user?.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default HomePage;
