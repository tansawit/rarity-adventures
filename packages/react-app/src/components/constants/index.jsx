export function secondsToString(d) {
  d = Number(d);
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor((d % 3600) % 60);
  const hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
  const mDisplay = m > 0 ? m + (m === 1 ? " min, " : " min, ") : "";
  const sDisplay = s > 0 ? s + (s === 1 ? " sec" : " sec") : "";
  return hDisplay + mDisplay + sDisplay;
}

export function calcAPCost(score) {
  if (score <= 14) {
    return score - 8;
  } else {
    return Math.floor((score - 8) ** 2 / 6);
  }
}
