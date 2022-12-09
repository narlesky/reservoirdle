import { t } from "i18next";
import React, { useState } from "react";
import Autosuggest from "react-autosuggest";
import { useTranslation } from "react-i18next";
import { getLakeName, sanitizeLakeName } from "../domain/lakes";
import { lakes } from "../domain/lakes.position";

interface LakeInputProps {
  inputRef: React.RefObject<HTMLInputElement>;
  currentGuess: string;
  setCurrentGuess: (guess: string) => void;
}

export function LakeInput({
  inputRef,
  currentGuess,
  setCurrentGuess,
}: LakeInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const { i18n } = useTranslation();

  return (
    <Autosuggest
      theme={{ suggestionHighlighted: "font-bold" }}
      shouldRenderSuggestions={() => true}
      highlightFirstSuggestion
      suggestions={suggestions}
      onSuggestionsFetchRequested={({ value }) =>
        setSuggestions(
          lakes
            .map((c) => getLakeName(i18n.resolvedLanguage, c).toUpperCase())
            .filter((lakeName) =>
              sanitizeLakeName(lakeName).includes(sanitizeLakeName(value))
            )
            .sort()
        )
      }
      onSuggestionsClearRequested={() => setSuggestions([])}
      getSuggestionValue={(suggestion) => suggestion}
      renderSuggestion={(suggestion) => (
        <div className="m-0.5 bg-white dark:bg-slate-800 dark:text-slate-100 p-1 cursor-pointer">
          {suggestion}
        </div>
      )}
      containerProps={{
        className: "border-2 rounded flex-auto relative",
      }}
      inputProps={{
        ref: inputRef,
        className: "w-full dark:bg-slate-800 dark:text-slate-100 p-1",
        placeholder: t("placeholder"),
        value: currentGuess,
        onChange: (_e, { newValue }) => setCurrentGuess(newValue),
      }}
      renderSuggestionsContainer={({ containerProps, children }) => (
        <div
          {...containerProps}
          className={`${containerProps.className} rounded absolute bottom-full w-full bg-gray-300 dark:bg-white mb-1 divide-x-2 max-h-52 overflow-auto`}
        >
          {children}
        </div>
      )}
    />
  );
}
