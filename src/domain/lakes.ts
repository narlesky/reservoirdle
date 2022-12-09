import { areas } from "./lakes.area";
import { lakes } from "./lakes.position";
// import { corsicanLakeNames } from "./lakes.name.co";
// import { frenchLakeNames } from "./lakes.name.fr";
// import { hungarianLakeNames } from "./lakes.name.hu";
// import { dutchLakeNames } from "./lakes.name.nl";
// import { polishLakeNames } from "./lakes.name.pl";

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
    // case "co":
    //   return corsicanLakeNames[lake.code];
    // case "fr":
    //   return frenchLakeNames[lake.code];
    // case "hu":
    //   return hungarianLakeNames[lake.code];
    // case "nl":
    //   return dutchLakeNames[lake.code];
    // case "pl":
    //   return polishLakeNames[lake.code];
    // case "de":
    //   return germanLakeNames[lake.code];
    // case "ja":
    //   return japaneseLakeNames[lake.code];
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
