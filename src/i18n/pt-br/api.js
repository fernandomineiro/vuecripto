/**
 * List of error messages for API requests
 */

const unexpectedErr = "Erro inesperado";
const internalSrvErr = "Erro interno do servidor";
const checkInternet = "Verifique sua conexão com a internet";

const unauthenticated = "Você não está autenticado";
const unauthorized = "Você não está autorizado a realizar essa ação";
const badRequest = "Dados inválidos ou incompletos";

export default {
  avatar: {
    BadRequest: badRequest,
    Unauthorized: "Você não está autorizado a realizar esta ação",
    UnprocessableEntity: "Os dados enviados parecem inválidos",
    otherError: unexpectedErr,
    serverError: internalSrvErr
  },
  bankAccounts: {
    getByCurrencyUnauthorized: unauthorized,
    getByCurrencyNotFound: "Moeda não encontrada",
    addBrlAccountBadRequest:
      "Dados inválidos ou incompletos, verifique se preencheu todos os dados corretamente",
    addBrlAccountUnauthorized: unauthorized,
    addEurAccountBadRequest:
      "Dados inválidos ou incompletos, verifique se preencheu todos os dados corretamente",
    addEurAccountUnauthorized: "Você nao está autenticado",
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
    getAddressByIdNotFound: "Endereço não encontrado",
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
      "Você está impossibilitado de realizar depósitos até que verifique sua identidade. Para isso vá até PERFIL, preencha seus dados e envie os documentos requeridos.",
    depositFiatForbidden:
      "Você está impossibilitado de realizar depósitos até que verifique sua identidade. Para isso vá até PERFIL, preencha seus dados e envie os documentos requeridos.",
    depositFiatNotAccepted: "Você excedeu seu limite diário de depósitos",
    uploadReceiptBadRequest: "Dados inválidos ou incompletos",
    uploadReceiptForbidden:
      "O comprovante para este depósito já foi enviado ou você não está autorizado a realizar o envio",
    uploadReceiptUnauthorized:
      "Você não possui permissão para realizar esta ação",
    uploadReceiptNotFound: "Depósito não encontrado",
    otherError: unexpectedErr,
    serverError: internalSrvErr,
    undefined: checkInternet,
    timeout: checkInternet
  },
  documents: {
    addNewBadRequest: "Dados inválidos",
    addNewUnauthorized: unauthorized,
    addNewUnauthenticated: unauthenticated,
    addNewNotFound: "Tipo do documento não encontrado",
    updateDocumentBadRequest: "Dados inválidos ou incompletos",
    updateDocumentUnauthorized: unauthorized,
    updateDocumentUnauthenticated: unauthenticated,
    updateDocumentNotFound:
      "O documento que está tentando alterar não foi encontrado",
    getAllUnauthorized: unauthorized,
    otherError: unexpectedErr,
    serverError: internalSrvErr,
    undefined: checkInternet,
    timeout: checkInternet
  },
  exchange: {
    cancelOrderForbidden: "Você não pode cancelar esta ordem",
    cancelOrderNotFound: "Ordem não encontrada",
    createOrderBadRequest: "Dados inválidos",
    createOrderUnauthorized: unauthorized,
    createOrderNoFunds: "Saldo insuficiente para esta operação",
    createOrderForbidden: "Você não está autorizado a realizar esta operação",
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
    transferBadRequest: "Dados inválidos ou incompletos",
    transferUnauthorized: "Você não possui permissão para realizar esta ação",
    transferNoFunds: "Saldo insuficiente para esta operação",
    transferForbidden:
      "Você está impossibilitado de realizar transferências até que verifique sua identidade",
    transferNotFound: "Destinatário não encontrado",
    transferNotAccepted: "Você excedeu seu limite diário de transferêcias",
    otherError: unexpectedErr,
    serverError: internalSrvErr,
    undefined: checkInternet,
    timeout: checkInternet
  },
  invite: {
    inviteEmailsBadRequest: "E-mail inválido",
    inviteEmailsUnauthorized: unauthorized,
    inviteEmailsForbidden:
      "Você está impossibilitado de convidar e-mails no momento",
    inviteEmailsNotAccepted:
      "Você excedeu o limite de convites no momento, por favor, tente novamente em 5 minutos",
    invitePhonesBadRequest: "Telefone inválido",
    invitePhonesUnauthorized: unauthorized,
    invitePhonesForbidden:
      "Você está impossibilitado de convidar telefones no momento",
    invitePhonesNotAccepted:
      "Você excedeu o limite de convites no momento, por favor, tente novamente em 5 minutos",
    otherError: internalSrvErr,
    undefined: checkInternet,
    timeout: checkInternet
  },
  invoice: {
    getByIdUnauthorized:
      "Você não está autenticado ou não possui autorização para acessar esta transação",
    getByIdNotFound: "Transação não encontrada",
    getAllInvoicesUnauthorized: unauthorized,
    otherError: unexpectedErr,
    serverError: internalSrvErr,
    undefined: checkInternet,
    timeout: checkInternet
  },
  method: {
    getByCurrencyNotFound: "Moeda não encontrada",
    otherError: unexpectedErr,
    serverError: internalSrvErr,
    undefined: checkInternet,
    timeout: checkInternet
  },
  otc: {
    createRequestBadRequest: "Dados inválidos",
    createRequestUnauthorized: unauthorized,
    createRequestNoFunds: "Saldo insuficiente para esta operação",
    createRequestForbidden:
      "Você não possui permissão para realizar esta operação. Para utilizar o OTC é preciso verificar sua identidade",
    createRequestNotFound: "Par OTC não encontrado",
    getOtcUnauthorized: unauthorized,
    getOtcNotFound: "Operação OTC não encontrada",
    listAllUnauthorized: unauthorized,
    updateOtcBadRequest: "Dados inválidos ou incompletos",
    updateOtcUnauthorized: unauthorized,
    updateOtcNoFunds:
      "Você não possui fundos suficientes para realizar esta operação",
    updateOtcForbidden: "Você não pode mais alterar esta oferta",
    updateOtcNotFound:
      "A operação OTC que está tentando alterar não foi encontrada",
    updateOtcExpired: "Esta oferta expirou",
    deleteOtcUnauthorized: unauthorized,
    deleteOtcNotFound:
      "A operação OTC que está tentando cancelar não foi encontrada",
    deleteOtcExpired: "Esta oferta não pode ser cancelada pois já expirou",
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
    preferencesBadRequest: "Dados inválidos ou incompletos",
    preferencesUnauthorized: unauthorized,
    preferencesForbidden: "Acesso negado",
    preferencesNotFound: "Preferences não encontradas",
    otherError: "Ocorreu um erro inesperado"
  },
  profile: {
    createBadRequest: "Dados inválidos ou incompletos",
    createConflict: "Já existe um perfil cadastrado",
    createUnauthorized: "Você não possui permissão para realizar esta ação",
    editBadRequest: "Dados inválidos ou incompletos",
    editUnauthorized: "Você não possui permissão para realizar esta ação",
    editNotFound: "O perfil que está tentando editar não existe",
    getUnauthorized: "Você não possui permissão para ver este perfil",
    getNotFound: "O perfil não foi encontrado",
    getAllUnauthorized: "Você não possui permissão para realizar esta ação",
    otherError: unexpectedErr,
    serverError: "Erro do servidor",
    undefined: checkInternet,
    timeout: checkInternet
  },
  trade: {
    sendRequestBadRequest: "Dados inválidos ou incompletos",
    sendRequestUnauthorized: "Negociação não autorizada",
    sendRequestNoFunds: "Saldo Insuficiente",
    sendRequestForbidden:
      "Você está impossibilitado de realizar negociações até que verifique sua identidade",
    sendRequestNotFound: "Par de trade não encontrado",
    sendRequestNotAccepted: "Você excedeu seu limite diário de negociações",
    otherError: unexpectedErr,
    serverError: "Erro do servidor",
    undefined: checkInternet,
    timeout: checkInternet
  },
  twoFactor: {
    createPinBadRequest: badRequest,
    createPinConflict: "Não é possível criar PIN porque já existe um",
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
    getTokenBadRequest: "Dados inválidos ou incompletos",
    getTokenNotAuthorized: "Usuário e senha incorretos",
    getTokenForbidden:
      'Atenção! Sua conta está bloqueada. Motivo: "{reason}". Caso tenha alguma dúvida entre em contato conosco: contato@capitaldigitalaberto.com.br',
    createUserBadRequest: "Dados inválidos ou incompletos",
    createUserConflict: "Usuário já cadastrado",
    createUserUnprocessable: badRequest,
    resetPasswordBadRequest: "E-mail inválido",
    recoverPasswordBadRequest: "Senha inválida ou não confere",
    recoverPasswordTokenNotFound: "Código não encontrado ou incorreto",
    recoverPasswordTokenExpired: "O código expirou",
    getUserUnauthorized: unauthorized,
    changePasswordBadRequest:
      "Dados inválidos, sua nova senha atende aos critérios exigidos?",
    changePasswordUnauthorized: unauthorized,
    getReferralsUnauthorized: unauthorized,
    getReferralsUserIsTrader:
      'Sua conta é "trader" e, por isso, não possui referências. Para habilitar esta função promova sua conta para Broker ou Manager',
    requestUpgradeBadRequest: "Dados inválidos ou incompletos",
    requestUpgradeUnauthorized: unauthorized,
    requestUpgradeForbidden: "Você não pode requisitar upgrade",
    otherError: unexpectedErr,
    serverError: "Erro do servidor",
    undefined: checkInternet,
    timeout: checkInternet,
    password: {
      addNewBadRequest: "As senhas não estão iguais",
      getUserUnauthorized: "Você não está autorizado a mudar sua senha!",
      otherError: "Erro desconhecido",
      serverError: internalSrvErr,
      tip: "Sua senha deve ter de 8 a 25 caracteres",
      undefined: checkInternet,
      timeout: checkInternet
    },
    settings: "Configurações da conta"
  },
  wallet: {
    getAllWalletsUnauthorized: unauthorized,
    createWalletUnauthorized: unauthorized,
    createWalletCurrencyNotFound:
      "Você está tentando criar uma carteira em uma moeda que não foi encontrada",
    otherError: unexpectedErr,
    serverError: internalSrvErr,
    undefined: checkInternet,
    timeout: checkInternet
  },
  withdraw: {
    success: "Pedido de saque realizado com sucesso",

    withdrawCryptoBadRequest: "Dados inválidos ou incompletos",
    withdrawCryptoUnauthorized: unauthorized,
    withdrawCryptoNoFunds: "Saldo insuficiente para esta operação",
    withdrawCryptoNotFound:
      "A moeda que está tentando sacar não foi encontrada",
    withdrawNotAccepted: "Você excedeu seu limite diário de saques",
    withdrawFiatBadRequest: "Dados inválidos ou incompletos",
    withdrawFiatUnauthorized: unauthorized,
    withdrawFiatNoFunds: "Saldo insuficiente para esta operação",
    withdrawForbidden:
      "Você está impossibilitado de realizar transferências até que verifique sua identidade",
    withdrawFiatNotFound: "Selecione sua conta bancária para saque",
    otherError: unexpectedErr,
    serverError: internalSrvErr,
    undefined: checkInternet,
    timeout: checkInternet
  }
};
