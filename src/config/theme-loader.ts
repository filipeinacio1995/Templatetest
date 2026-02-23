import { config } from './store.config';

export const loadTheme = () => {
  const root = document.documentElement;
  const { colors } = config.theme;

  root.style.setProperty('--color-primary', colors.primary);
  root.style.setProperty('--color-secondary', colors.secondary);
  root.style.setProperty('--color-background', colors.background);
  root.style.setProperty('--color-surface', colors.surface);
  root.style.setProperty('--color-text', colors.text);
  
  document.title = config.storeName;
};
