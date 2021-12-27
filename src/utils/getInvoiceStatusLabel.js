const getInvoiceStatusLabel = status => {
  let statusType;
  switch (status) {
    case 1:
      statusType = "pending";
      break;
    case 2:
      statusType = "waiting";
      break;
    case 3:
      statusType = "canceled";
      break;
    case 4:
      statusType = "completed";
      break;
    case 5:
      statusType = "processing";
      break;
  }
  return `invoices.statuses.${statusType}`;
};

export default getInvoiceStatusLabel;
