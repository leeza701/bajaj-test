import { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const data = input
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

        console.log("Sending:", data);

      const res = await fetch("http://localhost:3000/bfhl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });

      const result = await res.json();

      setResponse(result);
    } catch (err) {
      alert("API Error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Hierarchy Builder</h1>

      <textarea
        rows="10"
        placeholder={`A->B
A->C
B->D`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={handleSubmit}>
        {loading ? "Processing..." : "Submit"}
      </button>

      {response && (
        <div className="result">
          <h2>Response</h2>

          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;