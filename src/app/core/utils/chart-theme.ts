export interface ChartColors {
  text: string;
  textMuted: string;
  border: string;
  primary: string;
}

export function readChartColors(): ChartColors {
  const styles = getComputedStyle(document.documentElement);
  const read = (name: string) => styles.getPropertyValue(name).trim();
  return {
    text: read('--text'),
    textMuted: read('--text-muted'),
    border: read('--border'),
    primary: read('--primary'),
  };
}
