export function isValidIntProperty(input) {
  return Number.isInteger(input);
}

export function isValidPositiveIntProperty(input) {
  return isValidIntProperty(input) && input >= 0;
}
