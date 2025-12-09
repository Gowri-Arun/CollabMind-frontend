import { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const checkHealth = async () => {
      setStatus("loading");
      try {
        const res = await fetch("/api/health");
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = (await res.json()) as { ok: boolean };
        if (data.ok) {
          setStatus("ok");
          setMessage("Backend OK");
        } else {
          setStatus("error");
          setMessage("Backend responded but ok=false");
        }
      } catch (err) {
        setStatus("error");
        setMessage(
          err instanceof Error ? err.message : "Unknown error contacting backend",
        );
      }
    };

    void checkHealth();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1>CollabMind Health Check</h1>
      {status === "loading" && <p>Checking backend...</p>}
      {status === "ok" && <p style={{ color: "green" }}>Backend OK ✅</p>}
      {status === "error" && (
        <p style={{ color: "red" }}>Backend ERROR: {message}</p>
      )}
    </div>
  );
}

export default App;
