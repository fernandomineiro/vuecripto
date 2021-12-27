import zeroPad from "./zeroPad";

/**
 * @description Takes a number of decimal places and returns its minimum step
 * value, suitable for inputs of type number
 * @param {number} decimals
 */
const getStepFromDecimals = decimals => "0." + zeroPad(1, decimals);

export default getStepFromDecimals;
