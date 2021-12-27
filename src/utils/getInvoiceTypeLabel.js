const getInvoiceTypeLabel = type => {
  let statusType;
  switch (type) {
    case 1:
      statusType = "deposit";
      break;
    case 2:
      statusType = "withdraw";
      break;
    case 3:
      statusType = "conversion";
      break;
    case 4:
      statusType = "gainBroker";
      break;
    case 5:
      statusType = "accountUpgrade";
      break;
    case 6:
      statusType = "internalTransfer";
      break;
    case 7:
      statusType = "buy";
      break;
    case 8:
      statusType = "sell";
      break;
  }
  return `invoices.types.${statusType}`;
};

export default getInvoiceTypeLabel;
