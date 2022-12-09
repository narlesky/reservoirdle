import { DateTime } from "luxon";
import { useCallback, useEffect, useMemo, useState } from "react";
import seedrandom from "seedrandom";
import {
  bigEnoughCountriesWithImage,
  lakesWithImage,
  Lake,
  smallLakeLimit,
} from "../domain/lakes";
import { areas } from "../domain/lakes.area";
import { LakeCode } from "../domain/lakes.position";
import { Guess, loadAllGuesses, saveGuesses } from "../domain/guess";

const forcedCountries: Record<string, LakeCode> = {
  "2022-12-08": "lakepiru",
  "2022-12-09": "losbanosreservoir",
  "2022-12-10": "lakeoroville",
  "2022-12-11": "castaiclake",
  "2022-12-12": "mccoyflatreservoir",
  "2022-12-13": "folsomlake",
  "2022-12-14": "newhoganlake",
  "2022-12-15": "whiskeytownlake",
  "2022-12-16": "laketahoe",
  "2022-12-17": "eastparkreservoir",
  "2022-12-18": "stampedereservoir",
  "2022-12-19": "biglagoon",
  "2022-12-20": "frenchmeadowsreservoir",
  "2022-12-21": "shastalake",
  "2022-12-22": "hartlake",
  "2022-12-23": "pardeereservoir",
  "2022-12-24": "millertonlake",
  "2022-12-25": "stonygorgereservoir",
  "2022-12-26": "isabellalake",
  "2022-12-27": "antelopeplains",
  "2022-12-28": "bolesmeadow",
  "2022-12-29": "lakenatoma",
  "2022-12-30": "massacrelake",
  "2022-12-31": "gerberreservoir",
  "2023-01-01": "saltonsea",
  "2023-01-02": "westlake",
  "2023-01-03": "crumplake",
  "2023-01-04": "clearlake",
  "2023-01-05": "hetchhetchyreservoir",
  "2023-01-06": "tulelake",
  "2023-01-07": "lakeelsinore",
  "2023-01-08": "campfarwestreservoir",
  "2023-01-09": "topazlake",
  "2023-01-10": "middlealkalilake",
  "2023-01-11": "sanluisreservoir",
  "2023-01-12": "frenchmanlake",
  "2023-01-13": "lakecasitas",
  "2023-01-14": "alkalilake",
  "2023-01-15": "honeylake",
  "2023-01-16": "flagstafflake",
  "2023-01-17": "buttvalleyreservoir",
  "2023-01-18": "sodalake",
  "2023-01-19": "lakenacimiento",
  "2023-01-20": "lakealmanor",
  "2023-01-21": "donpedroreservoir",
  "2023-01-22": "blackbuttelake",
  "2023-01-23": "washoelake",
  "2023-01-24": "calcuttalake",
  "2023-01-25": "colemanlake",
  "2023-01-26": "monolake",
  "2023-01-27": "meisslake",
  "2023-01-28": "campbelllake",
  "2023-01-29": "trinitylake",
  "2023-01-30": "huntingtonlake",
  "2023-01-31": "indianvalleyreservoir",
  "2023-02-01": "bigsagereservoir",
  "2023-02-02": "lakesuccess",
  "2023-02-03": "castaiclagoon",
  "2023-02-04": "lakehenshaw",
  "2023-02-05": "thermalitoforebay",
  "2023-02-06": "courtrightreservoir",
  "2023-02-07": "lakemcclure",
  "2023-02-08": "drewsreservoir",
  "2023-02-09": "thermalitoafterbay",
  "2023-02-10": "lakehavasu",
  "2023-02-11": "shermanlake",
  "2023-02-12": "cherrylake",
  "2023-02-13": "elderberryforebay",
  "2023-02-14": "lakedavis",
  "2023-02-15": "newbullardsbarreservoir",
  "2023-02-16": "lakekaweah",
  "2023-02-17": "newhoganlake",
  "2023-02-18": "lakethomasaedison",
  "2023-02-19": "lowerklamathlake",
  "2023-02-20": "horselake",
  "2023-02-21": "bridgeportreservoir",
  "2023-02-22": "shaverlake",
  "2023-02-23": "clearlakereservoir",
  "2023-02-24": "lakemendocino",
  "2023-02-25": "turlocklake",
  "2023-02-26": "buckslake",
  "2023-02-27": "woodwardreservoir",
  "2023-02-28": "eaglelake",
  "2023-03-01": "lakepillsbury",
  "2023-03-02": "thermalitodiversionpool",
  "2023-03-03": "bluejointlake",
  "2023-03-04": "spicermeadowreservoir",
  "2023-03-05": "lakemohave",
  "2023-03-06": "oneillforebay",
  "2023-03-07": "murshareservoir",
  "2023-03-08": "littlegrassvalleyreservoir",
  "2023-03-09": "lakesonoma",
  "2023-03-10": "laketalawa",
  "2023-03-11": "lowerklamathlakesump",
  "2023-03-12": "newmeloneslake",
  "2023-03-13": "owenslake",
  "2023-03-14": "modestoreservoir",
  "2023-03-15": "bigbearlake",
  "2023-03-16": "cliftoncourtforebay",
  "2023-03-17": "lakecachuma",
  "2023-03-18": "sanvicentereservoir",
  "2023-03-19": "lowerlake",
  "2023-03-20": "diamondvalleylake",
  "2023-03-21": "moonlake",
  "2023-03-22": "whitehorseflatreservoir",
  "2023-03-23": "folsomlake",
  "2023-03-24": "camanchereservoir",
  "2023-03-25": "pyramidlake",
  "2023-03-26": "artesialake",
  "2023-03-27": "fallenleaflake",
  "2023-03-28": "pineflatlake",
  "2023-03-29": "lakeberryessa",
  "2023-03-30": "lakeoroville",
  "2023-03-31": "lakemathews",
  "2023-04-01": "unionvalleyreservoir",
  "2023-04-02": "newyearlake",
  "2023-04-03": "gooselake",
  "2023-04-04": "lakecrowley",
  "2023-04-05": "upperlake",
  "2023-04-06": "lakepiru",
  "2023-04-07": "losbanosreservoir",
  "2023-04-08": "horrpond",
  "2023-04-09": "castaiclake",
  "2023-04-10": "mccoyflatreservoir",
  "2023-04-11": "perrisreservoir",
  "2023-04-12": "mountainmeadowsreservoir",
  "2023-04-13": "whiskeytownlake",
  "2023-04-14": "laketahoe",
  "2023-04-15": "eastparkreservoir",
  "2023-04-16": "stampedereservoir",
  "2023-04-17": "biglagoon",
  "2023-04-18": "frenchmeadowsreservoir",
  "2023-04-19": "shastalake",
  "2023-04-20": "hartlake",
  "2023-04-21": "pardeereservoir",
  "2023-04-22": "millertonlake",
  "2023-04-23": "stonygorgereservoir",
  "2023-04-24": "isabellalake",
  "2023-04-25": "antelopeplains",
  "2023-04-26": "bolesmeadow",
  "2023-04-27": "lakenatoma",
  "2023-04-28": "massacrelake",
  "2023-04-29": "gerberreservoir",
  "2023-04-30": "saltonsea",
  "2023-05-01": "westlake",
  "2023-05-02": "crumplake",
  "2023-05-03": "clearlake",
  "2023-05-04": "hetchhetchyreservoir",
  "2023-05-05": "tulelake",
  "2023-05-06": "lakeelsinore",
  "2023-05-07": "campfarwestreservoir",
  "2023-05-08": "topazlake",
  "2023-05-09": "middlealkalilake",
  "2023-05-10": "sanluisreservoir",
  "2023-05-11": "frenchmanlake",
  "2023-05-12": "lakecasitas",
  "2023-05-13": "alkalilake",
  "2023-05-14": "honeylake",
  "2023-05-15": "flagstafflake",
  "2023-05-16": "buttvalleyreservoir",
  "2023-05-17": "sodalake",
  "2023-05-18": "lakenacimiento",
  "2023-05-19": "lakealmanor",
  "2023-05-20": "donpedroreservoir",
  "2023-05-21": "blackbuttelake",
  "2023-05-22": "washoelake",
  "2023-05-23": "calcuttalake",
  "2023-05-24": "colemanlake",
  "2023-05-25": "monolake",
  "2023-05-26": "meisslake",
  "2023-05-27": "campbelllake",
  "2023-05-28": "trinitylake",
  "2023-05-29": "huntingtonlake",
  "2023-05-30": "indianvalleyreservoir",
  "2023-05-31": "bigsagereservoir",
  "2023-06-01": "lakesuccess",
  "2023-06-02": "castaiclagoon",
  "2023-06-03": "lakehenshaw",
  "2023-06-04": "thermalitoforebay",
  "2023-06-05": "courtrightreservoir",
  "2023-06-06": "lakemcclure",
  "2023-06-07": "drewsreservoir",
  "2023-06-08": "thermalitoafterbay",
  "2023-06-09": "lakehavasu",
  "2023-06-10": "shermanlake",
  "2023-06-11": "cherrylake",
  "2023-06-12": "elderberryforebay",
  "2023-06-13": "lakedavis",
  "2023-06-14": "newbullardsbarreservoir",
  "2023-06-15": "lakekaweah",
  "2023-06-16": "newhoganlake",
  "2023-06-17": "lakethomasaedison",
  "2023-06-18": "lowerklamathlake",
  "2023-06-19": "horselake",
  "2023-06-20": "bridgeportreservoir",
  "2023-06-21": "shaverlake",
  "2023-06-22": "clearlakereservoir",
  "2023-06-23": "lakemendocino",
  "2023-06-24": "turlocklake",
  "2023-06-25": "buckslake",
  "2023-06-26": "woodwardreservoir",
  "2023-06-27": "eaglelake",
  "2023-06-28": "lakepillsbury",
  "2023-06-29": "thermalitodiversionpool",
  "2023-06-30": "bluejointlake",
  "2023-07-01": "spicermeadowreservoir",
  "2023-07-02": "lakemohave",
  "2023-07-03": "oneillforebay",
  "2023-07-04": "murshareservoir",
  "2023-07-05": "littlegrassvalleyreservoir",
  "2023-07-06": "lakesonoma",
  "2023-07-07": "laketalawa",
  "2023-07-08": "lowerklamathlakesump",
  "2023-07-09": "newmeloneslake",
  "2023-07-10": "owenslake",
  "2023-07-11": "modestoreservoir",
  "2023-07-12": "bigbearlake",
  "2023-07-13": "cliftoncourtforebay",
  "2023-07-14": "lakecachuma",
  "2023-07-15": "sanvicentereservoir",
  "2023-07-16": "lowerlake",
  "2023-07-17": "diamondvalleylake",
  "2023-07-18": "moonlake",
  "2023-07-19": "whitehorseflatreservoir",
  "2023-07-20": "folsomlake",
  "2023-07-21": "camanchereservoir",
  "2023-07-22": "pyramidlake",
  "2023-07-23": "artesialake",
  "2023-07-24": "fallenleaflake",
  "2023-07-25": "pineflatlake",
  "2023-07-26": "lakeberryessa",
  "2023-07-27": "lakeoroville",
  "2023-07-28": "lakemathews",
  "2023-07-29": "unionvalleyreservoir",
  "2023-07-30": "newyearlake",
  "2023-07-31": "gooselake",
  "2023-08-01": "lakecrowley",
  "2023-08-02": "upperlake",
  "2023-08-03": "lakepiru",
  "2023-08-04": "losbanosreservoir",
  "2023-08-05": "horrpond",
  "2023-08-06": "castaiclake",
  "2023-08-07": "mccoyflatreservoir",
  "2023-08-08": "perrisreservoir",
  "2023-08-09": "mountainmeadowsreservoir",
  "2023-08-10": "whiskeytownlake",
  "2023-08-11": "laketahoe",
  "2023-08-12": "eastparkreservoir",
  "2023-08-13": "stampedereservoir",
  "2023-08-14": "biglagoon",
  "2023-08-15": "frenchmeadowsreservoir",
  "2023-08-16": "shastalake",
  "2023-08-17": "hartlake",
  "2023-08-18": "pardeereservoir",
  "2023-08-19": "millertonlake",
  "2023-08-20": "stonygorgereservoir",
  "2023-08-21": "isabellalake",
  "2023-08-22": "antelopeplains",
  "2023-08-23": "bolesmeadow",
  "2023-08-24": "lakenatoma",
  "2023-08-25": "massacrelake",
  "2023-08-26": "gerberreservoir",
  "2023-08-27": "saltonsea",
  "2023-08-28": "westlake",
  "2023-08-29": "crumplake",
  "2023-08-30": "clearlake",
  "2023-08-31": "hetchhetchyreservoir",
  "2023-09-01": "tulelake",
  "2023-09-02": "lakeelsinore",
  "2023-09-03": "campfarwestreservoir",
  "2023-09-04": "topazlake",
  "2023-09-05": "middlealkalilake",
  "2023-09-06": "sanluisreservoir",
  "2023-09-07": "frenchmanlake",
  "2023-09-08": "lakecasitas",
  "2023-09-09": "alkalilake",
  "2023-09-10": "honeylake",
  "2023-09-11": "flagstafflake",
  "2023-09-12": "buttvalleyreservoir",
  "2023-09-13": "sodalake",
  "2023-09-14": "lakenacimiento",
  "2023-09-15": "lakealmanor",
  "2023-09-16": "donpedroreservoir",
  "2023-09-17": "blackbuttelake",
  "2023-09-18": "washoelake",
  "2023-09-19": "calcuttalake",
  "2023-09-20": "colemanlake",
  "2023-09-21": "monolake",
  "2023-09-22": "meisslake",
  "2023-09-23": "campbelllake",
  "2023-09-24": "trinitylake",
  "2023-09-25": "huntingtonlake",
  "2023-09-26": "indianvalleyreservoir",
  "2023-09-27": "bigsagereservoir",
  "2023-09-28": "lakesuccess",
  "2023-09-29": "castaiclagoon",
  "2023-09-30": "lakehenshaw",
  "2023-10-01": "thermalitoforebay",
  "2023-10-02": "courtrightreservoir",
  "2023-10-03": "lakemcclure",
  "2023-10-04": "drewsreservoir",
  "2023-10-05": "thermalitoafterbay",
  "2023-10-06": "lakehavasu",
  "2023-10-07": "shermanlake",
  "2023-10-08": "cherrylake",
  "2023-10-09": "elderberryforebay",
  "2023-10-10": "lakedavis",
  "2023-10-11": "newbullardsbarreservoir",
  "2023-10-12": "lakekaweah",
  "2023-10-13": "newhoganlake",
  "2023-10-14": "lakethomasaedison",
  "2023-10-15": "lowerklamathlake",
  "2023-10-16": "horselake",
  "2023-10-17": "bridgeportreservoir",
  "2023-10-18": "shaverlake",
  "2023-10-19": "clearlakereservoir",
  "2023-10-20": "lakemendocino",
  "2023-10-21": "turlocklake",
  "2023-10-22": "buckslake",
  "2023-10-23": "woodwardreservoir",
  "2023-10-24": "eaglelake",
  "2023-10-25": "lakepillsbury",
  "2023-10-26": "thermalitodiversionpool",
  "2023-10-27": "bluejointlake",
  "2023-10-28": "spicermeadowreservoir",
  "2023-10-29": "lakemohave",
  "2023-10-30": "oneillforebay",
};

const noRepeatStartDate = DateTime.fromFormat("2022-05-01", "yyyy-MM-dd");

export function getDayString(shiftDayCount?: number) {
  return DateTime.now()
    .plus({ days: shiftDayCount ?? 0 })
    .toFormat("yyyy-MM-dd");
}

export function useTodays(dayString: string): [
  {
    lake?: Lake;
    guesses: Guess[];
  },
  (guess: Guess) => void,
  number,
  number
] {
  const [todays, setTodays] = useState<{
    lake?: Lake;
    guesses: Guess[];
  }>({ guesses: [] });

  const addGuess = useCallback(
    (newGuess: Guess) => {
      if (todays == null) {
        return;
      }

      const newGuesses = [...todays.guesses, newGuess];

      setTodays((prev) => ({ lake: prev.lake, guesses: newGuesses }));
      saveGuesses(dayString, newGuesses);
    },
    [dayString, todays]
  );

  useEffect(() => {
    const guesses = loadAllGuesses()[dayString] ?? [];
    const lake = getLake(dayString);

    setTodays({ lake, guesses });
  }, [dayString]);

  const randomAngle = useMemo(
    () => seedrandom.alea(dayString)() * 360,
    [dayString]
  );

  const imageScale = useMemo(() => {
    const normalizedAngle = 45 - (randomAngle % 90);
    const radianAngle = (normalizedAngle * Math.PI) / 180;
    return 1 / (Math.cos(radianAngle) * Math.sqrt(2));
  }, [randomAngle]);

  return [todays, addGuess, randomAngle, imageScale];
}

function getLake(dayString: string) {
  const currentDayDate = DateTime.fromFormat(dayString, "yyyy-MM-dd");
  let pickingDate = DateTime.fromFormat("2022-03-21", "yyyy-MM-dd");
  let smallLakeCooldown = 0;
  let pickedLake: Lake | null = null;

  const lastPickDates: Record<string, DateTime> = {};

  do {
    smallLakeCooldown--;

    const pickingDateString = pickingDate.toFormat("yyyy-MM-dd");

    const forcedLakeCode = forcedCountries[dayString];
    const forcedLake =
      forcedLakeCode != null
        ? lakesWithImage.find((lake) => lake.code === forcedLakeCode)
        : undefined;

    const lakeSelection =
      smallLakeCooldown < 0 ? lakesWithImage : bigEnoughCountriesWithImage;

    if (forcedLake != null) {
      pickedLake = forcedLake;
    } else {
      let lakeIndex = Math.floor(
        seedrandom.alea(pickingDateString)() * lakeSelection.length
      );
      pickedLake = lakeSelection[lakeIndex];

      if (pickingDate >= noRepeatStartDate) {
        while (isARepeat(pickedLake, lastPickDates, pickingDate)) {
          lakeIndex = (lakeIndex + 1) % lakeSelection.length;
          pickedLake = lakeSelection[lakeIndex];
        }
      }
    }

    if (areas[pickedLake.code] < smallLakeLimit) {
      smallLakeCooldown = 7;
    }

    lastPickDates[pickedLake.code] = pickingDate;
    pickingDate = pickingDate.plus({ day: 1 });
  } while (pickingDate <= currentDayDate);

  return pickedLake;
}

function isARepeat(
  pickedLake: Lake | null,
  lastPickDates: Record<string, DateTime>,
  pickingDate: DateTime
) {
  if (pickedLake == null || lastPickDates[pickedLake.code] == null) {
    return false;
  }
  const daysSinceLastPick = pickingDate.diff(
    lastPickDates[pickedLake.code],
    "day"
  ).days;

  return daysSinceLastPick < 100;
}
