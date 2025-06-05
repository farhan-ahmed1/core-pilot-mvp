// In App.js, add:
import { useEffect, useState } from "react";

function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/")
      .then((res) => res.json())
      .then((data) => setMsg(data.message));  // Changed from data.msg to data.message
  }, []);

  return (
    <div>
      <h1>Core Pilot MVP</h1>
      <p>Backend says: {msg}</p>
    </div>
  );
}
export default App;