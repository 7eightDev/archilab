/** Two-digit ordinal used for section, area and step numbers: 1 → "01". */
export function pad(value: number): string {
  return String(value).padStart(2, '0')
}
