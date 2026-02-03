public class DiscountCalculator {
    
    public static Object apply_discount(Object price, Object discount) {
        // Check if price is not a number
        if (!(price instanceof Number)) {
            return "The price should be a number";
        }
        
        // Check if discount is not a number
        if (!(discount instanceof Number)) {
            return "The discount should be a number";
        }
        
        // Convert to double for calculation
        double priceVal = ((Number) price).doubleValue();
        double discountVal = ((Number) discount).doubleValue();
        
        // Check if price is less than or equal to 0
        if (priceVal <= 0) {
            return "The price should be greater than 0";
        }
        
        // Check if discount is out of range
        if (discountVal < 0 || discountVal > 100) {
            return "The discount should be between 0 and 100";
        }
        
        // Calculate final price
        double finalPrice = priceVal - (priceVal * discountVal / 100.0);
        return finalPrice;
    }
}
