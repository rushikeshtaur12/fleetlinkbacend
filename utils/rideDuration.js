export const calculateRideDuration = (fromPincode, toPincode) => {
  return Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24 || 1;
};
