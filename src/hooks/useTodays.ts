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
  "2022-12-15": "campfarwestreservoir",
  "2022-12-16": "sanluisreservoir", 
  "2022-12-17": "owenslake", 
  "2022-12-18": "shastalake", 
  "2022-12-19": "unionvalleyreservoir", 
  "2022-12-20": "isabellalake", 
  "2022-12-21": "lakenacimiento", 
  "2022-12-22": "lakepiru", 
  "2022-12-23": "trinitylake", 
  "2022-12-24": "lakealmanor", 
  "2022-12-25": "pardeereservoir", 
  "2022-12-26": "camanchereservoir", 
  "2022-12-27": "lakemathews", 
  "2022-12-28": "murshareservoir", 
  "2022-12-29": "frenchmeadowsreservoir", 
  "2022-12-30": "lakeberryessa", 
  "2022-12-31": "frenchmanlake", 
  "2023-01-01": "donpedroreservoir", 
  "2023-01-02": "elderberryforebay", 
  "2023-01-03": "lakethomasaedison", 
  "2023-01-04": "bigsagereservoir", 
  "2023-01-05": "folsomlake", 
  "2023-01-06": "whitehorseflatreservoir", 
  "2023-01-07": "campfarwestreservoir", 
  "2023-01-08": "losbanosreservoir", 
  "2023-01-09": "newbullardsbarreservoir", 
  "2023-01-10": "whiskeytownlake", 
  "2023-01-11": "shaverlake", 
  "2023-01-12": "spicermeadowreservoir", 
  "2023-01-13": "courtrightreservoir", 
  "2023-01-14": "lakecachuma", 
  "2023-01-15": "pineflatlake", 
  "2023-01-16": "lakecrowley", 
  "2023-01-17": "blackbuttelake", 
  "2023-01-18": "newhoganlake", 
  "2023-01-19": "mountainmeadowsreservoir", 
  "2023-01-20": "lakekaweah", 
  "2023-01-21": "thermalitoafterbay", 
  "2023-01-22": "castaiclake", 
  "2023-01-23": "lakenatoma", 
  "2023-01-24": "stampedereservoir", 
  "2023-01-25": "newmeloneslake", 
  "2023-01-26": "oneillforebay", 
  "2023-01-27": "thermalitoforebay", 
  "2023-01-28": "stonygorgereservoir", 
  "2023-01-29": "buttvalleyreservoir", 
  "2023-01-30": "huntingtonlake", 
  "2023-01-31": "diamondvalleylake", 
  "2023-02-01": "bigbearlake", 
  "2023-02-02": "clearlake", 
  "2023-02-03": "mccoyflatreservoir", 
  "2023-02-04": "littlegrassvalleyreservoir", 
  "2023-02-05": "moonlake", 
  "2023-02-06": "perrisreservoir", 
  "2023-02-07": "fallenleaflake", 
  "2023-02-08": "hetchhetchyreservoir", 
  "2023-02-09": "lakemohave", 
  "2023-02-10": "lakehenshaw", 
  "2023-02-11": "indianvalleyreservoir", 
  "2023-02-12": "drewsreservoir", 
  "2023-02-13": "lakemcclure", 
  "2023-02-14": "lakedavis", 
  "2023-02-15": "modestoreservoir", 
  "2023-02-16": "millertonlake", 
  "2023-02-17": "lakesuccess", 
  "2023-02-18": "lakeoroville", 
  "2023-02-19": "gerberreservoir", 
  "2023-02-20": "lakehavasu", 
  "2023-02-21": "cliftoncourtforebay", 
  "2023-02-22": "buckslake", 
  "2023-02-23": "eastparkreservoir", 
  "2023-02-24": "lakecasitas", 
  "2023-02-25": "clearlakereservoir", 
  "2023-02-26": "lakemendocino", 
  "2023-02-27": "sanvicentereservoir", 
  "2023-02-28": "cherrylake", 
  "2023-03-01": "turlocklake", 
  "2023-03-02": "woodwardreservoir", 
  "2023-03-03": "bridgeportreservoir", 
  "2023-03-04": "lakesonoma", 
  "2023-03-05": "pyramidlake", 
  "2023-03-06": "topazlake", 
  "2023-03-07": "thermalitodiversionpool",
  "2023-03-08": "fallenleaflake", 
  "2023-03-09": "losbanosreservoir", 
  "2023-03-10": "lakemathews", 
  "2023-03-11": "bigbearlake", 
  "2023-03-12": "buckslake", 
  "2023-03-13": "eastparkreservoir", 
  "2023-03-14": "shaverlake", 
  "2023-03-15": "mccoyflatreservoir", 
  "2023-03-16": "drewsreservoir", 
  "2023-03-17": "castaiclake", 
  "2023-03-18": "sanluisreservoir", 
  "2023-03-19": "thermalitoforebay", 
  "2023-03-20": "lakenacimiento", 
  "2023-03-21": "folsomlake", 
  "2023-03-22": "lakehavasu", 
  "2023-03-23": "blackbuttelake", 
  "2023-03-24": "oneillforebay", 
  "2023-03-25": "unionvalleyreservoir", 
  "2023-03-26": "lakethomasaedison", 
  "2023-03-27": "millertonlake", 
  "2023-03-28": "clearlake", 
  "2023-03-29": "frenchmeadowsreservoir", 
  "2023-03-30": "gerberreservoir", 
  "2023-03-31": "littlegrassvalleyreservoir", 
  "2023-04-01": "trinitylake", 
  "2023-04-02": "spicermeadowreservoir", 
  "2023-04-03": "pardeereservoir", 
  "2023-04-04": "moonlake", 
  "2023-04-05": "thermalitoafterbay", 
  "2023-04-06": "indianvalleyreservoir", 
  "2023-04-07": "elderberryforebay", 
  "2023-04-08": "bigsagereservoir", 
  "2023-04-09": "stampedereservoir", 
  "2023-04-10": "lakemendocino", 
  "2023-04-11": "campfarwestreservoir", 
  "2023-04-12": "huntingtonlake", 
  "2023-04-13": "stonygorgereservoir", 
  "2023-04-14": "pineflatlake", 
  "2023-04-15": "newbullardsbarreservoir", 
  "2023-04-16": "thermalitodiversionpool", 
  "2023-04-17": "hetchhetchyreservoir", 
  "2023-04-18": "pyramidlake", 
  "2023-04-19": "shastalake", 
  "2023-04-20": "newhoganlake", 
  "2023-04-21": "camanchereservoir", 
  "2023-04-22": "buttvalleyreservoir", 
  "2023-04-23": "whitehorseflatreservoir", 
  "2023-04-24": "lakenatoma", 
  "2023-04-25": "lakealmanor", 
  "2023-04-26": "mountainmeadowsreservoir", 
  "2023-04-27": "cliftoncourtforebay", 
  "2023-04-28": "bridgeportreservoir", 
  "2023-04-29": "lakepiru", 
  "2023-04-30": "clearlakereservoir", 
  "2023-05-01": "lakemohave", 
  "2023-05-02": "lakecasitas", 
  "2023-05-03": "newmeloneslake", 
  "2023-05-04": "lakeberryessa", 
  "2023-05-05": "isabellalake", 
  "2023-05-06": "topazlake", 
  "2023-05-07": "lakehenshaw", 
  "2023-05-08": "lakecrowley", 
  "2023-05-09": "frenchmanlake", 
  "2023-05-10": "lakedavis", 
  "2023-05-11": "turlocklake", 
  "2023-05-12": "diamondvalleylake", 
  "2023-05-13": "lakemcclure", 
  "2023-05-14": "cherrylake", 
  "2023-05-15": "donpedroreservoir", 
  "2023-05-16": "lakesuccess", 
  "2023-05-17": "sanvicentereservoir", 
  "2023-05-18": "lakekaweah", 
  "2023-05-19": "whiskeytownlake", 
  "2023-05-20": "woodwardreservoir", 
  "2023-05-21": "lakecachuma", 
  "2023-05-22": "lakeoroville", 
  "2023-05-23": "lakesonoma", 
  "2023-05-24": "owenslake", 
  "2023-05-25": "courtrightreservoir", 
  "2023-05-26": "perrisreservoir", 
  "2023-05-27": "murshareservoir", 
  "2023-05-28": "modestoreservoir", 
  "2023-05-29": "buttvalleyreservoir", 
  "2023-05-30": "fallenleaflake", 
  "2023-05-31": "lakehenshaw", 
  "2023-06-01": "bigsagereservoir", 
  "2023-06-02": "trinitylake", 
  "2023-06-03": "newhoganlake", 
  "2023-06-04": "courtrightreservoir", 
  "2023-06-05": "lakesonoma", 
  "2023-06-06": "lakemathews", 
  "2023-06-07": "turlocklake", 
  "2023-06-08": "sanvicentereservoir", 
  "2023-06-09": "stampedereservoir", 
  "2023-06-10": "lakenatoma", 
  "2023-06-11": "unionvalleyreservoir", 
  "2023-06-12": "topazlake", 
  "2023-06-13": "bigbearlake", 
  "2023-06-14": "lakesonoma", 
  "2023-06-15": "lakemohave", 
  "2023-06-16": "stonygorgereservoir", 
  "2023-06-17": "lakemcclure", 
  "2023-06-18": "huntingtonlake", 
  "2023-06-19": "campfarwestreservoir", 
  "2023-06-20": "courtrightreservoir", 
  "2023-06-21": "lakenatoma", 
  "2023-06-22": "lakecrowley", 
  "2023-06-23": "lakecasitas", 
  "2023-06-24": "lakekaweah", 
  "2023-06-25": "newmeloneslake", 
  "2023-06-26": "shastalake", 
  "2023-06-27": "isabellalake", 
  "2023-06-28": "cherrylake", 
  "2023-06-29": "folsomlake", 
  "2023-06-30": "lakemcclure", 
  "2023-07-01": "donpedroreservoir", 
  "2023-07-02": "whitehorseflatreservoir", 
  "2023-07-03": "losbanosreservoir", 
  "2023-07-04": "stampedereservoir", 
  "2023-07-05": "lakemendocino", 
  "2023-07-06": "lakecachuma", 
  "2023-07-07": "lakesuccess", 
  "2023-07-08": "gerberreservoir", 
  "2023-07-09": "campfarwestreservoir", 
  "2023-07-10": "losbanosreservoir", 
  "2023-07-11": "lakehenshaw", 
  "2023-07-12": "elderberryforebay", 
  "2023-07-13": "whitehorseflatreservoir", 
  "2023-07-14": "frenchmeadowsreservoir", 
  "2023-07-15": "frenchmanlake", 
  "2023-07-16": "castaiclake", 
  "2023-07-17": "thermalitodiversionpool", 
  "2023-07-18": "pyramidlake", 
  "2023-07-19": "camanchereservoir", 
  "2023-07-20": "lakealmanor", 
  "2023-07-21": "lakecachuma", 
  "2023-07-22": "lakenacimiento", 
  "2023-07-23": "lakeberryessa", 
  "2023-07-24": "lakedavis", 
  "2023-07-25": "whiskeytownlake", 
  "2023-07-26": "bridgeportreservoir", 
  "2023-07-27": "cherrylake", 
  "2023-07-28": "sanluisreservoir", 
  "2023-07-29": "shaverlake", 
  "2023-07-30": "drewsreservoir", 
  "2023-07-31": "pineflatlake", 
  "2023-08-01": "folsomlake", 
  "2023-08-02": "elderberryforebay", 
  "2023-08-03": "woodwardreservoir", 
  "2023-08-04": "unionvalleyreservoir", 
  "2023-08-05": "mccoyflatreservoir", 
  "2023-08-06": "camanchereservoir", 
  "2023-08-07": "mountainmeadowsreservoir", 
  "2023-08-08": "stonygorgereservoir", 
  "2023-08-09": "moonlake", 
  "2023-08-10": "oneillforebay", 
  "2023-08-11": "turlocklake", 
  "2023-08-12": "buttvalleyreservoir", 
  "2023-08-13": "clearlakereservoir", 
  "2023-08-14": "littlegrassvalleyreservoir", 
  "2023-08-15": "murshareservoir", 
  "2023-08-16": "owenslake", 
  "2023-08-17": "sanvicentereservoir", 
  "2023-08-18": "trinitylake", 
  "2023-08-19": "bridgeportreservoir", 
  "2023-08-20": "lakedavis", 
  "2023-08-21": "blackbuttelake", 
  "2023-08-22": "whiskeytownlake", 
  "2023-08-23": "pyramidlake", 
  "2023-08-24": "shaverlake", 
  "2023-08-25": "drewsreservoir", 
  "2023-08-26": "spicermeadowreservoir", 
  "2023-08-27": "lakecasitas", 
  "2023-08-28": "hetchhetchyreservoir", 
  "2023-08-29": "topazlake", 
  "2023-08-30": "owenslake", 
  "2023-08-31": "lakenacimiento", 
  "2023-09-01": "lakehavasu", 
  "2023-09-02": "pineflatlake", 
  "2023-09-03": "huntingtonlake", 
  "2023-09-04": "frenchmeadowsreservoir", 
  "2023-09-05": "donpedroreservoir", 
  "2023-09-06": "indianvalleyreservoir", 
  "2023-09-07": "lakehavasu", 
  "2023-09-08": "perrisreservoir", 
  "2023-09-09": "buckslake", 
  "2023-09-10": "oneillforebay", 
  "2023-09-11": "fallenleaflake", 
  "2023-09-12": "moonlake", 
  "2023-09-13": "thermalitoafterbay", 
  "2023-09-14": "clearlake", 
  "2023-09-15": "thermalitoforebay", 
  "2023-09-16": "sanluisreservoir", 
  "2023-09-17": "clearlake", 
  "2023-09-18": "lakeoroville", 
  "2023-09-19": "newhoganlake", 
  "2023-09-20": "eastparkreservoir", 
  "2023-09-21": "newmeloneslake", 
  "2023-09-22": "modestoreservoir", 
  "2023-09-23": "lakemendocino", 
  "2023-09-24": "perrisreservoir", 
  "2023-09-25": "lakeberryessa", 
  "2023-09-26": "indianvalleyreservoir", 
  "2023-09-27": "millertonlake", 
  "2023-09-28": "frenchmanlake", 
  "2023-09-29": "lakemohave", 
  "2023-09-30": "bigbearlake", 
  "2023-10-01": "bigsagereservoir", 
  "2023-10-02": "blackbuttelake", 
  "2023-10-03": "newbullardsbarreservoir", 
  "2023-10-04": "lakepiru", 
  "2023-10-05": "mccoyflatreservoir", 
  "2023-10-06": "modestoreservoir", 
  "2023-10-07": "thermalitoforebay", 
  "2023-10-08": "thermalitoafterbay", 
  "2023-10-09": "lakeoroville", 
  "2023-10-10": "shastalake", 
  "2023-10-11": "lakethomasaedison", 
  "2023-10-12": "lakepiru", 
  "2023-10-13": "spicermeadowreservoir", 
  "2023-10-14": "lakekaweah", 
  "2023-10-15": "lakethomasaedison", 
  "2023-10-16": "buckslake", 
  "2023-10-17": "isabellalake", 
  "2023-10-18": "clearlakereservoir", 
  "2023-10-19": "murshareservoir", 
  "2023-10-20": "hetchhetchyreservoir", 
  "2023-10-21": "pardeereservoir", 
  "2023-10-22": "newbullardsbarreservoir", 
  "2023-10-23": "castaiclake", 
  "2023-10-24": "lakemathews", 
  "2023-10-25": "pardeereservoir", 
  "2023-10-26": "lakesuccess", 
  "2023-10-27": "gerberreservoir", 
  "2023-10-28": "lakealmanor", 
  "2023-10-29": "littlegrassvalleyreservoir", 
  "2023-10-30": "lakecrowley", 
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
