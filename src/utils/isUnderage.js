import moment from "moment";

/**
 * Determine if user is underage (less than 18 yo)
 *
 * @param {string} birthDate
 * @returns {boolean}
 */
const isUnderage = birthDate => {
  const thresholdDate = moment()
    .subtract(18, "years")
    .endOf("day");

  return moment(birthDate).isAfter(thresholdDate);
};

export default isUnderage;
