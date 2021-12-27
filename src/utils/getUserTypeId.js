export default function getUserTypeId(user_type_id) {
  let type = "";
  switch (user_type_id) {
    case 1:
      type = "Trader";
      break;
    case 2:
      type = "Broker";
      break;
    case 3:
      type = "Manager";
      break;
  }
  return type;
}
