/**
 * Creates new object from `target` and updates values that have matching key
 * from `patch`
 *
 * Parameters in `patch` that are not in `target` are ignored.
 * Parameters in `target` that are not in `patch` are copied without modifications.
 */
const patchObject = target => patch =>
  Object.fromEntries(
    Object.entries(target).map(([i, value]) => [i, patch[i] ? patch[i] : value])
  );

export default patchObject;
