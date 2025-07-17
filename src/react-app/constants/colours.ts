// Generate random colors for countries
const generateRandomColor = (): string => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 40) + 60; // 60-100% saturation for vibrant colors
  const lightness = Math.floor(Math.random() * 30) + 35; // 35-65% lightness for good contrast
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export const colours = Array.from({ length: 195 }, () => generateRandomColor());