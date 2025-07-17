import { useAppearance } from './hooks/useAppearance';

const AppearanceToggleButton = () => {
  const { appearance, changeAppearance, getAppearanceLabel } = useAppearance();
  
  return (
    <button onClick={changeAppearance}>
      {getAppearanceLabel(appearance)}
    </button>
  );
};

export default AppearanceToggleButton;