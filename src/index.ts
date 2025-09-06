import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Base Address from Pincode API</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 2rem;
          background-color: #f9f9f9;
          color: #333;
        }
        h1 {
          color: #2c3e50;
        }
        code {
          background-color: #eee;
          padding: 2px 4px;
          border-radius: 4px;
        }
        pre {
          background: #f4f4f4;
          padding: 1rem;
          border-left: 4px solid #ccc;
          overflow-x: auto;
        }
      </style>
    </head>
    <body>
      <h1>📍 Base Address from Pincode API</h1>
      <p>Use this endpoint to get base address for any valid Indian pincode.</p>

      <h2>📤 Endpoint</h2>
      <p><code>GET /api/getBaseAddress/:pincode</code></p>

      <h3>🔍 Example Request</h3>
      <pre>GET /api/getBaseAddress/400083</pre>

      <h3>✅ Example Response</h3>
      <pre>{
    "baseAddresses": [
        "Kannamwar Nagar, Mumbai-400083, Maharashtra, India",
        "Tagore Nagar, Mumbai-400083, Maharashtra, India"
    ],
    "district": "Mumbai",
    "state": "Maharashtra",
    "areas": [
        "Kannamwar Nagar",
        "Tagore Nagar"
    ],
    "pincode": "400083",
    "country": "India"
}</pre>

      <h3>❌ Error Responses</h3>
      <pre>{
  "error": "Pincode not found or invalid"
}</pre>
    </body>
    </html>
  `);
});

app.get("/api/getBaseAddress/:pincode", async (c) => {
  const pincode = c.req.param("pincode");
  let district;
  let state;
  let areas;
  let country;
  try {
    const response = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
    if (!response.ok) {
      return c.json({ error: "Failed to fetch pincode details" }, 500);
    }

    const data = await response.json();
    console.log(data[0]);
    if (data[0].Status === "Success" && data[0].PostOffice.length > 0) {
      let baseAddresses: string[] = [];
      data[0]?.PostOffice?.map(
        (areas: {
          Name: string;
          District: string;
          State: string;
          Country: string;
        }) => {
          const { District, State, Name, Country } = areas;
          baseAddresses.push(
            `${Name}, ${District}-${pincode}, ${State}, ${Country}`
          );
        }
      );
      const { District, State, Country } = data[0].PostOffice[0];
      district = District;
      state = State;
      areas = data[0]?.PostOffice?.map((areas: { Name: string }) => {
        return areas?.Name;
      });
      country = Country;
      return c.json({
        baseAddresses,
        district,
        state,
        areas,
        pincode,
        country,
      });
    } else {
      return c.json({ error: "Pincode not found or invalid" }, 404);
    }
  } catch (error: any) {
    console.error("Error:", error.message);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default app;
