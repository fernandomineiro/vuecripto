/**
 * List of error messages for API requests
 */

// Standard messages
const unexpectedErr = "Unexpected error";
const internalSrvErr = "Internal server error";
const checkInternet = "Check your internet connection";

// Common patterns
const unauthorized = "You are not authorized";
const unauthenticated = "You are not authenticated";
const badRequest = "Invalid or incomplete data!";

export default {
  avatar: {
    BadRequest: badRequest,
    Unauthorized: "You are not authorized to execute this action",
    UnprocessableEntity: "You data request input seems to be incorrect",
    otherError: unexpectedErr,
    serverError: internalSrvErr
  },
  bankAccounts: {
    getByCurrencyUnauthorized: unauthorized,
    getByCurrencyNotFound: "Currency not found",
    addBrlAccountBadRequest:
      "Invalid or incomplete data, check if you have correctly filled every field",
    addBrlAccountUnauthorized: unauthorized,
    addEurAccountBadRequest:
      "Invalid or incomplete data, check if you have correctly filled every field",
    addEurAccountUnauthorized: unauthorized,
    otherError: unexpectedErr,
    serverError: internalSrvErr,
    undefined: checkInternet,
    timeout: checkInternet
  },
  banks: {
    otherError: unexpectedErr,
    serverError: internalSrvErr,
    undefined: checkInternet,
    timeout: checkInternet
  },
  cryptoAddress: {
    getAddressByIdNotFound: "Address not found",
    getAddressByIdUnauthorized: unauthorized,
    getAllAddressesUnauthorized: unauthorized
  },
  currency: {
    otherError: unexpectedErr,
    serverError: internalSrvErr,
    undefined: checkInternet,
    timeout: checkInternet
  },
  deposit: {
    depositCryptoForbidden:
      "You are unable to deposit until your identity is verified. Go to PROFILE, fill in your info and submit required documents.",
    withdrawCryptoUnauthorized: unauthorized,
    depositFiatUnauthorized: unauthorized,
    depositFiatForbidden:
      "You are unable to deposit until your identity is verified. Go to PROFILE, fill in your info and submit required documents.",
    depositFiatNotAccepted: "You have exceeded your daily deposit limit",
    uploadReceiptBadRequest: badRequest,
    uploadReceiptForbidden:
      "This receipt have already been sent or you are not allowed to do it!",
    uploadReceiptUnauthorized: unauthorized,
    uploadReceiptNotFound: "Deposit not found!",
    otherError: unexpectedErr,
    serverError: internalSrvErr,
    undefined: checkInternet,
    timeout: checkInternet
  },
  documents: {
    addNewBadRequest: badRequest,
    addNewUnauthorized: unauthorized,
    addNewUnauthenticated: unauthenticated,
    addNewNotFound: "Document type not found",
    updateDocumentBadRequest: badRequest,
    updateDocumentUnauthorized: unauthorized,
    updateDocumentUnauthenticated: unauthenticated,
    updateDocumentNotFound:
      "The document you are trying to modify was not found",
    getAllUnauthorized: unauthorized,
    otherError: unexpectedErr,
    serverError: internalSrvErr,
    undefined: checkInternet,
    timeout: checkInternet
  },
  exchange: {
    cancelOrderUnauthorized: unauthorized,
    cancelOrderForbidden: "You can not cancel this order",
    cancelOrderNotFound: "Order not found",
    createOrderBadRequest: badRequest,
    createOrderUnauthorized: unauthorized,
    createOrderNoFunds: "Insufficient funds",
    createOrderForbidden: "You are not authorized to perform this action",
    otherError: unexpectedErr,
    serverError: internalSrvErr,
    undefined: checkInternet,
    timeout: checkInternet
  },
  indicators: {
    otherError: unexpectedErr,
    serverError: internalSrvErr,
    undefined: checkInternet,
    timeout: checkInternet
  },
  internalTransfer: {
    transferBadRequest: badRequest,
    transferUnauthorized: unauthorized,
    transferNoFunds: "Insuficient Funds!",
    transferForbidden: "You cannot transfer until we verify your ID",
    transferNotFound: "Beneficiary not found!",
    transferNotAccepted: "You have exceeded your daily transfer limit",
    otherError: unexpectedErr,
    serverError: internalSrvErr,
    undefined: checkInternet,
    timeout: checkInternet
  },
  invite: {
    inviteEmailsBadRequest: "Invalid e-mail",
    inviteEmailsUnauthorized: unauthorized,
    inviteEmailsForbidden: "You can not invite e-mails for now",
    inviteEmailsNotAccepted:
      "You have exceeded your e-mail invites limit for now, try again in 5 minutes",
    invitePhonesBadRequest: "Invalid phone",
    invitePhonesUnauthorized: unauthorized,
    invitePhonesForbidden: "You can not invite e-mails for now",
    invitePhonesNotAccepted:
      "You have exceeded your invites limit for now, try again in 5 minutes",
    otherError: internalSrvErr,
    undefined: checkInternet,
    timeout: checkInternet
  },
  invoice: {
    getByIdUnauthorized:
      "You are not authenticated or has no permission to access this transaction",
    getByIdNotFound: "Transaction not found",
    getAllInvoicesUnauthorized: unauthorized,
    otherError: unexpectedErr,
    serverError: internalSrvErr,
    undefined: checkInternet,
    timeout: checkInternet
  },
  method: {
    getByCurrencyNotFound: "Currency not found",
    otherError: unexpectedErr,
    serverError: internalSrvErr,
    undefined: checkInternet,
    timeout: checkInternet
  },
  otc: {
    createRequestBadRequest: badRequest,
    createRequestUnauthorized: unauthorized,
    createRequestNoFunds: "Insufficient funds",
    createRequestForbidden: "You cannot use OTC until we verify your ID",
    createRequestNotFound: "OTC pair not found",
    getOtcUnauthorized: unauthorized,
    getOtcNotFound: "OTC transaction not found",
    listAllUnauthorized: unauthorized,
    updateOtcBadRequest: badRequest,
    updateOtcUnauthorized: unauthorized,
    updateOtcNoFunds: "Insufficient funds",
    updateOtcForbidden: "You can't change this offer",
    updateOtcNotFound: "The OTC offer you are trying to modify was not found",
    updateOtcExpired: "This offer has expired",
    deleteOtcUnauthorized: unauthorized,
    deleteOtcNotFound: "The OTC offer you are trying to cancel was not found",
    deleteOtcExpired: "This offer cannot be canceled because it has expired",
    otherError: unexpectedErr,
    serverError: internalSrvErr,
    undefined: checkInternet,
    timeout: checkInternet
  },
  pair: {
    otherError: unexpectedErr,
    serverError: internalSrvErr,
    undefined: checkInternet,
    timeout: checkInternet
  },
  preferences: {
    preferencesBadRequest: badRequest,
    preferencesUnauthorized: unauthorized,
    preferencesForbidden: "Forbidden Access",
    preferencesNotFound: "Preferences not found",
    otherError: unexpectedErr
  },
  profile: {
    createBadRequest: badRequest,
    createConflict: "A profile already exists",
    createUnauthorized: unauthorized,
    editBadRequest: badRequest,
    editUnauthorized: unauthorized,
    editNotFound: "Profile does not exist!",
    getUnauthorized: unauthorized,
    getNotFound: "Profile not found!",
    getAllUnauthorized: unauthorized,
    otherError: unexpectedErr,
    serverError: internalSrvErr,
    undefined: checkInternet,
    timeout: checkInternet
  },
  trade: {
    sendRequestBadRequest: badRequest,
    sendRequestUnauthorized: unauthorized,
    sendRequestNoFunds: "Insuficient funds!",
    sendRequestForbidden: "You cannot trade until we verify your ID",
    sendRequestNotFound: "Trade pair not found",
    sendRequestNotAccepted: "You have exceeded your daily trading limit",
    otherError: unexpectedErr,
    serverError: internalSrvErr,
    undefined: checkInternet,
    timeout: checkInternet
  },
  twoFactor: {
    createPinBadRequest: badRequest,
    createPinConflict: "Cannot create PIN because one already exists",
    createPinUnauthorized: unauthorized,
    otherError: unexpectedErr,
    removePinBadRequest: badRequest,
    removePinUnauthorized: unauthorized,
    serverError: internalSrvErr,
    timeout: checkInternet,
    updatePinBadRequest: badRequest,
    updatePinUnauthorized: unauthorized
  },
  user: {
    getTokenBadRequest: badRequest,
    getTokenNotAuthorized: "Incorrect user and password!",
    getTokenForbidden:
      "Attention! Your account is blocked. Reason: '{reason}'. Please contact us if you have any objection: contato@capitaldigitalaberto.com.br",
    createUserBadRequest: badRequest,
    createUserConflict: "User already registered!",
    createUserUnprocessable: badRequest,
    resetPasswordBadRequest: "Invalid e-mail!",
    recoverPasswordBadRequest: "Passwords do not match!",
    recoverPasswordTokenNotFound: "Code not found or incorrect",
    recoverPasswordTokenExpired: "Code has expired!",
    getUserUnauthorized: "Você não está autenticado",
    changePasswordBadRequest:
      "Dados inválidos, sua nova senha atende aos critérios exigidos?",
    changePasswordUnauthorized: "Você não está autenticado",
    getReferralsUnauthorized: "Você não está autenticado",
    getReferralsUserIsTrader:
      'Sua conta é "trader" e, por isso, não possui referências. Para habilitar esta função promova sua conta para Broker ou Manager',
    requestUpgradeBadRequest: badRequest,
    requestUpgradeUnauthorized: unauthorized,
    requestUpgradeForbidden: "You cannot request an upgrade",
    otherError: unexpectedErr,
    serverError: internalSrvErr,
    undefined: checkInternet,
    timeout: checkInternet,

    password: {
      addNewBadRequest: "Password don't match!",
      getUserUnauthorized: "Not authorized!",
      otherError: "Unknown Error!",
      serverError: "Internal Server Error!",
      tip: "Your password should have between 8 up to 25 characters",
      undefined: checkInternet,
      timeout: checkInternet
    },
    settings: "Account configuration"
  },
  wallet: {
    getAllWalletsUnauthorized: unauthorized,
    createWalletUnauthorized: unauthorized,
    createWalletCurrencyNotFound:
      "You are trying to create a wallet with an unavailable currency",
    otherError: unexpectedErr,
    serverError: internalSrvErr,
    undefined: checkInternet,
    timeout: checkInternet
  },
  withdraw: {
    withdrawCryptoBadRequest: badRequest,
    withdrawCryptoUnauthorized: unauthorized,
    withdrawCryptoNoFunds: "Insuficient funds!",
    withdrawCryptoNotFound:
      "The currency you are trying to withdraw was not found",
    withdrawNotAccepted: "You have exceeded your daily tranfer limit",
    withdrawFiatBadRequest: badRequest,
    withdrawFiatUnauthorized: unauthorized,
    withdrawFiatNoFunds: "Insuficient funds!",
    withdrawForbidden: "You cannot transfer until we verify your ID",
    withdrawFiatNotFound: "Select withdrawal account!",
    otherError: unexpectedErr,
    serverError: internalSrvErr,
    undefined: checkInternet,
    timeout: checkInternet
  }
};
