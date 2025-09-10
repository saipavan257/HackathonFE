Create a badge design for HCPCS codes in Aetna data by following these specifications:

1. Split the input string using `:` as delimiter and extract only the first value
2. For values containing multiple codes separated by commas (,) or semicolons (;):
   - Split them into individual codes
   - Display each code separately
3. Format each code as a distinct badge element using appropriate styling
4. Ensure consistent badge appearance across all code displays
5. Handle edge cases including:
   - Empty values
   - Single codes
   - Multiple delimiters in the same string

Expected format for implementation:
- Input: "J1234:Description" or "J1234,J5678:Details" or "J1234;J5678:Notes"
- Output: Individual badges containing J1234 or [J1234] [J5678]

Reference existing badge design system or UI component library if available.