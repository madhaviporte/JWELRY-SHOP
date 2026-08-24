import { useAuth } from "./context/AuthContext";

function App() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Jewellery Shop</h1>

      {user ? (
        <>
          <h2>Welcome, {user.name}</h2>
          <p>{user.email}</p>

          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  );
}

export default App;