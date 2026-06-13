/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GeocodeResult = {
  displayName: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

export type PlanetPosition = {
  name: string;
  sign: string;
  house: number;
  nakshatra: string;
};

export type BirthChartResult = {
  provider: "prokerala" | "vedicastroapi" | "offline";
  name: string;
  dob: string;
  tob: string;
  pob: string;
  location: GeocodeResult;
  lagnaSign: string;
  lagnaSignNum: number;
  rashi: string;
  nakshatra: string;
  dasha: string;
  planets: PlanetPosition[];
  interpretation: string;
  remedy: string;
};

export async function fetchBirthChart(input: {
  name: string;
  dob: string;
  tob: string;
  pob: string;
}): Promise<BirthChartResult> {
  const response = await fetch("/api/astrology/chart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error(`Astrology API returned status ${response.status}`);
  }

  return response.json();
}