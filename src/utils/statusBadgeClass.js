export default function statusTypeClass(status_id) {
  switch (status_id) {
    case 1:
      return "default";
    case 2:
      return "info";
    case 3:
      return "danger";
    case 4:
      return "success";
    case 5:
      return "primary";
    default:
      return "default";
  }
}
