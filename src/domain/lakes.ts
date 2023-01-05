import { areas } from "./lakes.area";
import { lakes } from "./lakes.position";

import { lakeCodesWithImage } from "./lakes.image";

export interface Lake {
  code: string;
  latitude: number;
  longitude: number;
  name: string;
}

export const lakesWithImage = lakes.filter((c) =>
  lakeCodesWithImage.includes(c.code.toLowerCase())
);

export const smallLakeLimit = 5000;
export const bigEnoughCountriesWithImage = lakesWithImage.filter(
  (lake) => areas[lake.code] > smallLakeLimit
);

export function getLakeName(language: string, lake: Lake) {
  switch (language) {
    default:
      return lake.name;
  }
}

export function sanitizeLakeName(lakeName: string): string {
  return lakeName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[- '()]/g, "")
    .toLowerCase();
}
