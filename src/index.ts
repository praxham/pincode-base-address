import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  return c.text("Get base address for pincode");
});

app.get("/api/v1/fromPincode/getBaseAddress/:pincode", async (c) => {
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
    console.log(data[0].PostOffice);
    if (data[0].Status === "Success" && data[0].PostOffice.length > 0) {
      let baseAddresses: string[] = [];
      data[0]?.PostOffice?.map(
        (
          areas: {
            Name: string;
            District: string;
            State: string;
            Country: string;
          },
          index: number
        ) => {
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
      return c.json({ baseAddresses, district, state, areas, country });
    } else {
      return c.json({ error: "Pincode not found or invalid" }, 404);
    }
  } catch (error: any) {
    console.error("Error:", error.message);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default app;
