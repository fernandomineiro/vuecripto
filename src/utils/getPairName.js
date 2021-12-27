/**
 * @description Gets pair name from a pair object
 * @param {{
 *  id: number,
 *  coin_quote: string,
 *  coin_quote_id: number,
 *  coin_base: string,
 *  coin_base_id: number,
 *  otcSettings: object
 * }} pair
 * @param {boolean} withSlash Whether to separate currencies with a slash
 * @returns {string}
 */
const getPairName = (pair, withSlash = true) => {
  return "" + pair.coin_base + (withSlash ? "/" : "") + pair.coin_quote;
};

export default getPairName;
