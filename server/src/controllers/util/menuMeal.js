export function isBeforeCutoff(menuDate) {
  const menuCutOffHour = process.env.MENU_CUTOFF_HOUR;
  const menuCutOffMinute = process.env.MENU_CUTOFF_MINUTE;
  const menuCutOffTime = new Date(menuDate).setHours(
    menuCutOffHour,
    menuCutOffMinute,
    0,
    0
  );
  if (menuCutOffTime - new Date() < 0) {
    throw new Error(
      `Menu for today cannot be set after ${menuCutOffHour}:${menuCutOffMinute} Hours`
    );
  }
}
