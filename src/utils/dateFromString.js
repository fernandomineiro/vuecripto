export default function(dateString) {
  return new Date(dateString.replace(" ", "T") + "-03:00");
}
