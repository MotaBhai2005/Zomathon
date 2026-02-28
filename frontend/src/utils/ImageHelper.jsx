export const getFoodImage = (itemName) => {
  if (!itemName) return "/assets/placeholder.jpg";

  // 1. Remove parentheses
  // 2. Remove special characters like & or .
  // 3. IMPORTANT: Convert multiple spaces into a SINGLE space
  const fileName = itemName
    .trim()
    .replace(/[()]/g, '')           
    .replace(/[^a-zA-Z0-9 ]/g, ' ') // Replace symbols with a space
    .replace(/\s+/g, ' ')           // Collapse multiple spaces into one
    .trim();                        // Final trim

  // This will result in "Chicken Wings Hot Spicy.jpg"
  return `/assets/${fileName}.jpg`;
};