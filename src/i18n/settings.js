const validLanguages = ["pt-br", "en-us"];

const navigatorLanguage = navigator.language.toLowerCase();

const isValidLanguage = validLanguages.includes(navigatorLanguage);

const locale = isValidLanguage ? navigatorLanguage : "en-us";

export default locale;
