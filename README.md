# 📍 Base Address from Pincode API

Use this endpoint to get base address for any valid Indian pincode.

## 📤 Endpoint

`GET /api/getBaseAddress/:pincode`

### 🔍 Example Request

```
GET /api/getBaseAddress/400083
```

### ✅ Example Response

```json
{
  "baseAddresses": [
    "Kannamwar Nagar, Mumbai-400083, Maharashtra, India",
    "Tagore Nagar, Mumbai-400083, Maharashtra, India"
  ],
  "district": "Mumbai",
  "state": "Maharashtra",
  "areas": [
    "Kannamwar Nagar",
    "Tagore Nagar"
  ],
  "country": "India"
}
```

### ❌ Error Responses

```json
{
  "error": "Pincode not found or invalid"
}
```
