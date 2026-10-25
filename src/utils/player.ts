import { PLAYER } from "../data/player.ts";

export function ageAt(date = new Date()): number {
  const [year, month, day] = PLAYER.birthDate.split("-").map(Number);
  const beforeBirthday =
    date.getMonth() < month - 1 ||
    (date.getMonth() === month - 1 && date.getDate() < day);
  return date.getFullYear() - year - (beforeBirthday ? 1 : 0);
}
