# Brew Bliss Cafe Reservation API

A comprehensive reservation management system for Brew Bliss Cafe built with Node.js, Express, and MongoDB.

## Features

- ✅ Create new reservations
- ✅ Retrieve all reservations with filtering and pagination
- ✅ Get reservation by ID
- ✅ Update existing reservations
- ✅ Delete reservations
- ✅ Find reservations by phone number
- ✅ Time slot conflict prevention
- ✅ Data validation and error handling
- ✅ MongoDB integration

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

### 1. Health Check
```
GET /api/health
```
Returns API status and timestamp.

**Response:**
```json
{
  "message": "Brew Bliss Cafe API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "status": "healthy"
}
```

### 2. Create Reservation
```
POST /api/reservations
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "1234567890",
  "guests": 4,
  "date": "2024-02-15",
  "time": "19:00",
  "occasion": "birthday",
  "notes": "Celebrating my birthday",
  "status": "pending"
}
```

**Response:**
```json
{
  "message": "Reservation created successfully",
  "reservation": {
    "_id": "65a1b2c3d4e5f6789012345",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "1234567890",
    "guests": 4,
    "date": "2024-02-15T00:00:00.000Z",
    "time": "19:00",
    "occasion": "birthday",
    "notes": "Celebrating my birthday",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 3. Get All Reservations
```
GET /api/reservations
```

**Query Parameters:**
- `status` (optional): Filter by status (pending, confirmed, cancelled, completed)
- `date` (optional): Filter by specific date (YYYY-MM-DD)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of results per page (default: 10)

**Example:**
```
GET /api/reservations?status=confirmed&date=2024-02-15&page=1&limit=5
```

**Response:**
```json
{
  "reservations": [...],
  "totalPages": 3,
  "currentPage": 1,
  "total": 25
}
```

### 4. Get Reservation by ID
```
GET /api/reservations/:id
```

**Response:**
```json
{
  "reservation": {
    "_id": "65a1b2c3d4e5f6789012345",
    "name": "John Doe",
    // ... other fields
  }
}
```

### 5. Update Reservation
```
PUT /api/reservations/:id
```

**Request Body:** (any fields to update)
```json
{
  "guests": 6,
  "notes": "Updated notes"
}
```

**Response:**
```json
{
  "message": "Reservation updated successfully",
  "reservation": {
    // Updated reservation object
  }
}
```

### 6. Delete Reservation
```
DELETE /api/reservations/:id
```

**Response:**
```json
{
  "message": "Reservation deleted successfully"
}
```

### 7. Get Reservations by Phone
```
GET /api/reservations/phone/:phone
```

**Response:**
```json
{
  "reservations": [...],
  "count": 3
}
```

## Data Model

### Reservation Schema
```javascript
{
  name: String (required, 2-100 chars)
  email: String (required, valid email format)
  phone: String (required, valid phone format)
  guests: Number (required, 1-20)
  date: Date (required, not in past)
  time: String (required, HH:MM format)
  occasion: String (enum: '', 'birthday', 'anniversary', 'business', 'date', 'family', 'other')
  notes: String (optional, max 500 chars)
  status: String (enum: 'pending', 'confirmed', 'cancelled', 'completed', default: 'pending')
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-generated)
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400` - Bad Request (validation errors, time conflicts)
- `404` - Not Found (reservation not found)
- `500` - Internal Server Error

**Error Response Format:**
```json
{
  "message": "Error description",
  "error": "Detailed error information",
  "errors": ["Array of validation errors"]
}
```

## Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Set up Environment Variables:**
   Create a `.env` file with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   PORT=5000
   ```

3. **Start the Server:**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

4. **Test the API:**
   ```bash
   node test-reservations.js
   ```

## Testing

Use the provided test script to verify all endpoints:

```bash
node test-reservations.js
```

This will test all CRUD operations and demonstrate the API functionality.

## Frontend Integration

The API is designed to work with the existing frontend HTML files. The frontend can make requests to:

- `POST /api/reservations` - Create new reservations from the reservation form
- `GET /api/reservations` - Display existing reservations
- `PUT /api/reservations/:id` - Update reservations
- `DELETE /api/reservations/:id` - Cancel reservations

## Database

The system uses MongoDB with the following features:
- Automatic timestamps
- Data validation
- Indexes for performance
- Conflict prevention for time slots

## Security Considerations

- Input validation and sanitization
- CORS enabled for cross-origin requests
- Error messages don't expose sensitive information
- MongoDB injection prevention through Mongoose

## Future Enhancements

- User authentication and authorization
- Email notifications
- SMS reminders
- Table management
- Payment integration
- Admin dashboard
- Reservation analytics
