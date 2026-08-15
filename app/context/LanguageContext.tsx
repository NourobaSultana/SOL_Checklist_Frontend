"use client";

import { createContext, useContext, useState } from "react";

import en from "../dictionaries/en.json";
import bn from "../dictionaries/bn.json";

const dictionaries = {
  en,
  bn,
};

type Language = "en" | "bn";

const LanguageContext = createContext<any>(null);

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLanguage] = useState<Language>("en");

  const dictionary = dictionaries[language];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        dictionary,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};
