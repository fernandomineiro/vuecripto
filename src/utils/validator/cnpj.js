import { isValid } from "@fnando/cnpj";

/**
 * Validate CNPJ
 * @param {string} value
 */
const validate = value => isValid(value);

export default validate;
