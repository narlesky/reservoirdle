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
export const bigEnoughLakesWithImage = lakesWithImage.filter(
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

export const alphaLakeStrings = [
  "bigbearlake",
  "bigsagereservoir",
  "blackbuttelake",
  "bridgeportreservoir",
  "buckslake",
  "buttvalleyreservoir",
  "camanchereservoir",
  "campfarwestreservoir",
  "castaiclake",
  "cherrylake",
  "clearlake",
  "clearlakereservoir",
  "cliftoncourtforebay",
  "courtrightreservoir",
  "diamondvalleylake",
  "donpedroreservoir",
  "drewsreservoir",
  "eastparkreservoir",
  "elderberryforebay",
  "fallenleaflake",
  "folsomlake",
  "frenchmanlake",
  "frenchmeadowsreservoir",
  "gerberreservoir",
  "hetchhetchyreservoir",
  "huntingtonlake",
  "indianvalleyreservoir",
  "isabellalake",
  "lakealmanor",
  "lakeberryessa",
  "lakecachuma",
  "lakecasitas",
  "lakecrowley",
  "lakedavis",
  "lakehavasu",
  "lakehenshaw",
  "lakekaweah",
  "lakemathews",
  "lakemcclure",
  "lakemendocino",
  "lakemohave",
  "lakenacimiento",
  "lakenatoma",
  "lakeoroville",
  "lakepiru",
  "lakesonoma",
  "lakesuccess",
  "lakethomasaedison",
  "littlegrassvalleyreservoir",
  "losbanosreservoir",
  "mccoyflatreservoir",
  "millertonlake",
  "modestoreservoir",
  "moonlake",
  "mountainmeadowsreservoir",
  "murshareservoir",
  "newbullardsbarreservoir",
  "newhoganlake",
  "newmeloneslake",
  "oneillforebay",
  "owenslake",
  "pardeereservoir",
  "perrisreservoir",
  "pineflatlake",
  "pyramidlake",
  "sanluisreservoir",
  "sanvicentereservoir",
  "shastalake",
  "shaverlake",
  "spicermeadowreservoir",
  "stampedereservoir",
  "stonygorgereservoir",
  "thermalitoafterbay",
  "thermalitodiversionpool",
  "thermalitoforebay",
  "topazlake",
  "trinitylake",
  "turlocklake",
  "unionvalleyreservoir",
  "whiskeytownlake",
  "whitehorseflatreservoir",
  "woodwardreservoir"
]