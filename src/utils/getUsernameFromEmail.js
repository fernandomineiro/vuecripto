/**
 * Get the string before the at of an e-mail
 *
 * @param {string} email
 * @returns {string}
 */
const getUsernameFromEmail = email => email.split("@")[0];

export default getUsernameFromEmail;
