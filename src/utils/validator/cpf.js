import { isValid } from "@fnando/cpf";

/**
 * Validate CPF
 * @param {string} value
 */
const validate = value => isValid(value);

export default validate;
