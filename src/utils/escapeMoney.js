export default function escapeMoney(moneyString = "9.999,99") {
  if (moneyString === null) {
    return "";
  }
  return moneyString.replace(/\./g, () => "").replace(",", ".");
}
