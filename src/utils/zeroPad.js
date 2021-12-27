/**
 * @brief Puts leading zeros
 * @param {Number|String} val Numeric value
 * @param {Number} size Min chars
 * @returns {String} Number with leading zeros
 */
export default function zeroPad(val, size) {
  var s = String(val);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
}
