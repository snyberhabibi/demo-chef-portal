# Dish Template API Format Recommendation

## Current Issue

The current template API response doesn't match the form structure, requiring complex frontend transformation.

## Recommended Backend Format

The backend should return a format that matches `DishFormData` structure for consistency:

```json
{
  "id": "8f67ac3e-0850-491d-a68b-20ba3bad7291",
  "name": "test dish template",
  "description": "test dish template", // Plain string, not Lexical format
  "cuisineId": "00a042a3-5763-4f28-944d-670ce5590b54", // ID only, not full object
  "categoryId": "1f8819f0-4120-4250-8843-7ae332c26cdc", // ID only, not full object
  "status": "published",
  "leadTime": 2,
  "spiceLevel": "none", // Single value: "none" | "mild" | "medium" | "hot" | "extra-hot"
  "portionSizes": [
    {
      "portionLabelId": "256b9496-7320-43ae-b8c2-7ac186a4cee8", // ID only
      "size": "serves 4 people",
      "price": 10.55
    }
  ],
  "ingredientIds": ["01778632-4024-460c-8535-9b8c1c40c99c"], // Array of IDs
  "allergenIds": ["4d645456-9dba-4d5f-b4ec-0079b6dfefab"], // Array of IDs
  "dietaryLabelIds": ["0fba4f1f-d34f-4217-a95b-9fc7783d96a2"], // Array of IDs
  "maxQuantityPerDay": 4,
  "availability": ["tuesday", "wednesday"],
  "images": [
    {
      "url": "https://d3htxyn6qgrjnm.cloudfront.net/dish-templates/template_ea32c927-ceb3-4600-b473-27c74495de7d_1758807884799.png",
      "isPrimary": false
    }
  ],
  "customizationGroups": [] // Optional, same format as dish
}
```

## Key Differences from Current Format

1. **description**: Return plain string instead of Lexical editor format

   - If you need rich text, consider a separate `descriptionRich` field

2. **spiceLevel**: Single value instead of array

   - Current: `"spiceLevels": []`
   - Recommended: `"spiceLevel": "none"`

3. **cuisine/category**: Return IDs only, not full objects

   - Current: `"cuisine": { "id": "...", "name": "...", ... }`
   - Recommended: `"cuisineId": "..."`

4. **ingredients/allergens/dietaryLabels**: Return arrays of IDs

   - Current: `"ingredients": [{ "id": "...", "name": "...", ... }]`
   - Recommended: `"ingredientIds": ["..."]`

5. **images**: Simplified format
   - Current: `"images": [{ "id": "...", "url": "...", "isPrimary": false }]`
   - Recommended: `"images": [{ "url": "...", "isPrimary": false }]`
   - Or even simpler: `"imageUrls": ["..."]` if only URLs are needed

## Benefits

1. **Consistency**: Matches the form structure exactly
2. **Less transformation**: Frontend can use template data directly
3. **Smaller payload**: Only IDs instead of full objects
4. **Easier maintenance**: Single source of truth for data structure

## Alternative: Query Parameter

If you want to keep the current format, consider adding a query parameter:

- `GET /api/dish-templates/:id?format=form` - Returns form-ready format
- `GET /api/dish-templates/:id?format=full` - Returns full format (current)

This way you can support both use cases.
