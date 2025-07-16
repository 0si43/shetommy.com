import { useState, useEffect } from 'react'

export enum Appearance {
  Auto = 'auto',
  Light = 'light', 
  Dark = 'dark',
}

export const useAppearance = () => {
  const [appearance, setAppearance] = useState<Appearance>(Appearance.Auto);

  useEffect(() => {
    const storedAppearance = localStorage.getItem('preferAppearance')
    switch (storedAppearance) {
      case null:
        setAppearance(Appearance.Auto);
        document.documentElement.setAttribute('site-apperance', Appearance.Auto)
        break;
      default:
        setAppearance(storedAppearance as Appearance);
        document.documentElement.setAttribute('site-apperance', storedAppearance)
    }
  }, []);

  const changeAppearance = () => {
    switch (appearance) {
      case Appearance.Auto:
        setAppearance(Appearance.Light);
        localStorage.setItem('preferAppearance', Appearance.Light);
        document.documentElement.setAttribute('site-apperance', Appearance.Light);
        break;
      case Appearance.Light:
        setAppearance(Appearance.Dark);
        localStorage.setItem('preferAppearance', Appearance.Dark);
        document.documentElement.setAttribute('site-apperance', Appearance.Dark);
        break;
      case Appearance.Dark:
        setAppearance(Appearance.Auto);
        localStorage.setItem('preferAppearance', Appearance.Auto);
        document.documentElement.setAttribute('site-apperance', Appearance.Auto);
        break;
    }
  };

  const getAppearanceLabel = (appearance: Appearance): string => {
    switch (appearance) {
      case Appearance.Auto:
        return '⚙️ auto';
      case Appearance.Light:
        return '☀️ light';
      case Appearance.Dark:
        return '🌑 dark';
    }
  };

  return {
    appearance,
    changeAppearance,
    getAppearanceLabel,
  };
};