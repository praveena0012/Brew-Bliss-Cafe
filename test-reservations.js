// Test script for Brew Bliss Cafe Reservation API
// Run this with: node test-reservations.js

const API_BASE_URL = 'http://localhost:5000/api';

// Test data
const testReservation = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "1234567890",
    guests: 4,
    date: "2024-02-15",
    time: "19:00",
    occasion: "birthday",
    notes: "Celebrating my birthday with family"
};

async function testAPI() {
    console.log('🍰 Testing Brew Bliss Cafe Reservation API\n');

    try {
        // Test 1: Health check
        console.log('1. Testing health check...');
        const healthResponse = await fetch(`${API_BASE_URL}/health`);
        const healthData = await healthResponse.json();
        console.log('✅ Health check:', healthData.message);

        // Test 2: Create a reservation
        console.log('\n2. Creating a reservation...');
        const createResponse = await fetch(`${API_BASE_URL}/reservations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testReservation)
        });
        const createData = await createResponse.json();
        console.log('✅ Reservation created:', createData.message);
        console.log('   Reservation ID:', createData.reservation._id);

        const reservationId = createData.reservation._id;

        // Test 3: Get all reservations
        console.log('\n3. Getting all reservations...');
        const getAllResponse = await fetch(`${API_BASE_URL}/reservations`);
        const getAllData = await getAllResponse.json();
        console.log('✅ Found', getAllData.total, 'reservations');

        // Test 4: Get reservation by ID
        console.log('\n4. Getting reservation by ID...');
        const getByIdResponse = await fetch(`${API_BASE_URL}/reservations/${reservationId}`);
        const getByIdData = await getByIdResponse.json();
        console.log('✅ Reservation details:', getByIdData.reservation.name);

        // Test 5: Update reservation
        console.log('\n5. Updating reservation...');
        const updateData = {
            guests: 6,
            notes: "Updated: Now celebrating with extended family"
        };
        const updateResponse = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
        });
        const updateResult = await updateResponse.json();
        console.log('✅ Reservation updated:', updateResult.message);

        // Test 6: Get reservations by phone
        console.log('\n6. Getting reservations by phone...');
        const getByPhoneResponse = await fetch(`${API_BASE_URL}/reservations/phone/${testReservation.phone}`);
        const getByPhoneData = await getByPhoneResponse.json();
        console.log('✅ Found', getByPhoneData.count, 'reservations for phone number');

        // Test 7: Delete reservation
        console.log('\n7. Deleting reservation...');
        const deleteResponse = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, {
            method: 'DELETE'
        });
        const deleteData = await deleteResponse.json();
        console.log('✅ Reservation deleted:', deleteData.message);

        console.log('\n🎉 All tests completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.log('\nMake sure the server is running on http://localhost:5000');
    }
}

// Run the tests
testAPI();
