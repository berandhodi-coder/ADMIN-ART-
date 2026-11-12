export const TZ = 'Africa/Casablanca';

/** Date du jour au Maroc, au format YYYY-MM-DD. */
export function todayInCasablanca(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function offsetMinutes(date: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    timeZoneName: 'longOffset',
  }).formatToParts(date);
  const name = parts.find((p) => p.type === 'timeZoneName')?.value ?? 'GMT';
  const m = name.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!m) return 0; // "GMT" seul = décalage 0 (ex. pendant le Ramadan)
  const sign = m[1] === '-' ? -1 : 1;
  return sign * (Number(m[2]) * 60 + Number(m[3]));
}

function startOfDayUtc(day: string): Date {
  const [y, m, d] = day.split('-').map(Number);
  const guess = new Date(Date.UTC(y, m - 1, d));
  return new Date(guess.getTime() - offsetMinutes(guess) * 60_000);
}

/** Début (inclus) et fin (exclue) de la journée marocaine, en UTC ISO. */
export function dayRange(day: string): { start: string; end: string } {
  const [y, m, d] = day.split('-').map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);
  return {
    start: startOfDayUtc(day).toISOString(),
    end: startOfDayUtc(next).toISOString(),
  };
}
