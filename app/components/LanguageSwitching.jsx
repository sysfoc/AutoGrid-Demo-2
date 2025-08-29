"use client";
import { Label, Select } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const LanguageSwitching = () => {
  const t = useTranslations("Footer");
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  useEffect(() => {
    const getCookieValue = (name) => {
      const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
      return match ? match[2] : "en";
    };

    const language = getCookieValue("language");
    setSelectedLanguage(language);
  }, []);

  const handleLanguageChange = (event) => {
    const language = event.target.value;
    document.cookie = `language=${language}; path=/; max-age=31536000`;
    setSelectedLanguage(language);
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-y-1">
      <Label className="text-black dark:text-gray-100" htmlFor="language">{t("setLanguage")}</Label>
      <Select
        id="language"
        value={selectedLanguage}
        onChange={handleLanguageChange}
      >
        <option value="en">English</option>
        <option value="ur">Urdu</option>
        <option value="ar">Arabic</option>
        <option value="hi">Hindi</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="es">Spanish</option>
        <option value="fa">Persian</option>
        <option value="kr">Korean</option>
        <option value="cn">Chinese</option>
      </Select>
    </div>
  );
};

export default LanguageSwitching;