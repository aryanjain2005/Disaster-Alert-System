// api/proxy.ts

export default async function handler(req, res) {
  const { method, query } = req;
  const backendUrl = "http://10.8.1.10:8079"; // Your HTTP backend URL

  try {
    // Forward the request to your HTTP backend
    const response = await fetch(`${backendUrl}${req.url}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: req.method === "POST" ? JSON.stringify(req.body) : null,
    });

    // Return the response from the backend to the frontend
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Error with backend request", error);
    res.status(500).json({ message: "Error with backend request", error });
  }
}
