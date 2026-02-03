function apply_discount(price, discount) {
  // Check if price is not a number
  if (typeof price !== 'number' || isNaN(price)) {
    return "The price should be a number";
  }
  
  // Check if discount is not a number
  if (typeof discount !== 'number' || isNaN(discount)) {
    return "The discount should be a number";
  }
  
  // Check if price is less than or equal to 0
  if (price <= 0) {
    return "The price should be greater than 0";
  }
  
  // Check if discount is out of range
  if (discount < 0 || discount > 100) {
    return "The discount should be between 0 and 100";
  }
  
  // Calculate final price
  const finalPrice = price - (price * discount / 100);
  return finalPrice;
}
