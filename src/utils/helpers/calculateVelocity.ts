export const calculatePositiveVelocityQuantity = (
  inventory: FindExcelDataByDateRangeProps[],
) => {
  return inventory.reduce((acc, curr, index, array) => {
    // Skip the first item since there's no previous day to compare with
    if (index === 0) return (acc += curr.quantity);

    // Get the previous day's quantity
    const prevQuantity = array[index - 1].quantity;

    // Calculate the difference; if positive, add to accumulator
    const difference = curr.quantity - prevQuantity;
    if (difference > 0) {
      acc += difference;
    }

    return acc;
  }, 0);
};

export const calculateNegativeVelocityQuantity = (
  inventory: FindExcelDataByDateRangeProps[],
) => {
  return inventory.reduce((acc, curr, index, array) => {
    // Skip the first item since there's no previous day to compare with
    if (index === 0) return acc;

    // Get the previous day's quantity
    const prevQuantity = array[index - 1].quantity;

    // Calculate the difference; if negative, add to accumulator
    const difference = curr.quantity - prevQuantity;
    if (difference < 0) {
      // Since the difference is negative, add its absolute value
      acc += Math.abs(difference);
    }

    return acc;
  }, 0);
};

export const calculateVelocityPrice = (
  inventory: FindExcelDataByDateRangeProps[],
) => {
  return inventory[0].price - inventory[inventory.length - 1].price;
};
