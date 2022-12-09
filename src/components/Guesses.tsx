import { Guess } from "../domain/guess";
import { GuessRow } from "./GuessRow";
import React from "react";
import { SettingsData } from "../hooks/useSettings";
import { Lake } from "../domain/lakes";

interface GuessesProps {
  targetLake?: Lake;
  rowCount: number;
  guesses: Guess[];
  settingsData: SettingsData;
  lakeInputRef?: React.RefObject<HTMLInputElement>;
}

export function Guesses({
  targetLake,
  rowCount,
  guesses,
  settingsData,
  lakeInputRef,
}: GuessesProps) {
  return (
    <div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {Array.from(Array(rowCount).keys()).map((index) => (
          <GuessRow
            targetLake={targetLake}
            key={index}
            guess={guesses[index]}
            settingsData={settingsData}
            lakeInputRef={lakeInputRef}
          />
        ))}
      </div>
    </div>
  );
}
