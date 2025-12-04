# Brew Bliss Cafe - Reservation System Backend

A Node.js backend API for managing restaurant reservations, built with Express.js and MongoDB.

## Features

- **Reservation Management**: Create, read, update, and cancel reservations
- **Real-time Availability**: Check available time slots for specific dates
- **Input Validation**: Comprehensive validation for all reservation data
- **Confirmation System**: Generate unique confirmation codes for each reservation
- **Status Tracking**: Track reservation status (pending, confirmed, cancelled, completed)
- **Security**: Rate limiting, CORS protection, and input sanitization
- **Error Handling**: Detailed error messages and proper HTTP status codes

## API Endpoints

### Reservations

- `POST /api/reservations` - Create a new reservation
- `GET /api/reservations` - Get all reservations (with pagination and filtering)
- `GET /api/reservations/:id` - Get reservation by ID
- `GET /api/reservations/confirmation/:code` - Get reservation by confirmation code
- `PUT /api/reservations/:id` - Update reservation
- `PATCH /api/reservations/:id/status` - Update reservation status
- `PATCH /api/reservations/:id/cancel` - Cancel reservation
- `DELETE /api/reservations/:id` - Delete reservation
- `GET /api/reservations/availability/:date` - Get available time slots for a date

### Health Check

- `GET /api/health` - Server health status

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd brew-bliss-cafe-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/brewblisscafe
   PORT=3000
   FRONTEND_URL=http://localhost:5500
   NODE_ENV=development
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system. You can use:
   - Local MongoDB installation
   - MongoDB Atlas (cloud)
   - Docker: `docker run -d -p 27017:27017 mongo`

5. **Run the application**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

## Database Schema

### Reservation Model

```javascript
{
  name: String (required, 2-100 chars)
  email: String (required, valid email)
  phone: String (required, valid phone number)
  guests: Number (required, 1-20)
  date: Date (required, not in past)
  time: String (required, HH:MM format)
  occasion: String (optional, enum)
  notes: String (optional, max 500 chars)
  status: String (enum: pending, confirmed, cancelled, completed)
  confirmationCode: String (unique, auto-generated)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

## API Usage Examples

### Create a Reservation

```javascript
POST /api/reservations
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "guests": 4,
  "date": "2024-01-15",
  "time": "19:00",
  "occasion": "birthday",
  "notes": "Window table preferred"
}
```

### Response

```javascript
{
  "message": "Reservation created successfully",
  "reservation": {
    "id": "65a1b2c3d4e5f6789abcdef0",
    "confirmationCode": "ABC12345",
    "name": "John Doe",
    "email": "john@example.com",
    "guests": 4,
    "date": "January 15, 2024",
    "time": "7:00 PM",
    "occasion": "birthday",
    "status": "pending"
  }
}
```

### Get Available Time Slots

```javascript
GET /api/reservations/availability/2024-01-15
```

### Response

```javascript
{
  "date": "2024-01-15",
  "availableTimes": ["07:00", "07:30", "08:00", ...],
  "bookedTimes": ["19:00", "20:30"]
}
```

## Frontend Integration

The frontend has been updated to connect to this backend API. The reservation form now:

1. Validates input on the client side
2. Sends data to the backend API
3. Displays confirmation codes and success/error messages
4. Handles network errors gracefully

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400` - Bad Request (validation errors)
- `404` - Not Found (reservation not found)
- `409` - Conflict (time slot already booked)
- `500` - Internal Server Error

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for frontend domain
- **Input Validation**: Server-side validation for all inputs
- **Helmet**: Security headers
- **MongoDB Injection Protection**: Using Mongoose ODM

## Development

### Project Structure

```
├── models/
│   └── Reservation.js          # MongoDB schema
├── routes/
│   └── reservations.js         # API routes
├── server.js                   # Main server file
├── package.json               # Dependencies
├── env.example               # Environment variables template
└── README.md                 # This file
```

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-restart
- `npm test` - Run tests (not implemented yet)

## Deployment

### Environment Variables for Production

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/brewblisscafe
PORT=3000
FRONTEND_URL=https://yourdomain.com
NODE_ENV=production
```

### Recommended Hosting Platforms

- **Backend**: Heroku, Railway, DigitalOcean, AWS
- **Database**: MongoDB Atlas
- **Frontend**: Netlify, Vercel, GitHub Pages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, email info@brewbliss.lk or create an issue in the repository.
"# Brew-Bliss-Cafe" 
