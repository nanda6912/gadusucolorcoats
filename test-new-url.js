// Test new Google Apps Script URL
const testNewURL = async () => {
    try {
        console.log('Testing new Google Apps Script URL...');
        
        const testData = {
            name: 'New URL Test',
            phone: '9876543210',
            service: 'interior',
            location: 'Test Location',
            message: 'Testing new deployment URL',
            date: '2026-03-19'
        };
        
        const response = await fetch('http://localhost:3001/api/google-sheets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });
        
        const result = await response.text();
        console.log('Response status:', response.status);
        console.log('Response text:', result);
        
        if (response.ok) {
            console.log('✅ New URL test successful!');
        } else {
            console.log('❌ New URL test failed');
        }
        
    } catch (error) {
        console.error('Test error:', error.message);
    }
};

testNewURL();
