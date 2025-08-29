import { useState } from "react";

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

  return (
    <>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <HeroSection darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    </>
  );
}