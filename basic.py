def apply_discount(price, discount):
    # Check if price is not a number (int or float)
    if not isinstance(price, (int, float)):
        return "The price should be a number"
    
    # Check if discount is not a number (int or float)
    if not isinstance(discount, (int, float)):
        return "The discount should be a number"
    
    # Check if price is less than or equal to 0
    if price <= 0:
        return "The price should be greater than 0"
    
    # Check if discount is out of range
    if discount < 0 or discount > 100:
        return "The discount should be between 0 and 100"
    
    # Calculate final price
    final_price = price - (price * discount / 100)
    return final_price
