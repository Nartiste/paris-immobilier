import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q || q.length < 3) {
    return NextResponse.json({ features: [] });
  }

  const url = new URL("https://api-adresse.data.gouv.fr/search/");
  url.searchParams.set("q", q);
  url.searchParams.set("limit", "8");
  url.searchParams.set("autocomplete", "1");

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return NextResponse.json(
        { features: [], error: `BAN ${res.status}` },
        { status: 502 },
      );
    }
    const data = await res.json();
    const features = (data.features ?? []).map(
      (f: {
        properties: {
          label: string;
          city: string;
          postcode: string;
          citycode: string;
          score: number;
        };
        geometry: { coordinates: [number, number] };
      }) => ({
        label: f.properties.label,
        city: f.properties.city,
        postcode: f.properties.postcode,
        citycode: f.properties.citycode,
        lat: f.geometry.coordinates[1],
        lon: f.geometry.coordinates[0],
        score: f.properties.score,
      }),
    );
    return NextResponse.json({ features });
  } catch (error) {
    return NextResponse.json(
      { features: [], error: String(error) },
      { status: 502 },
    );
  }
}
