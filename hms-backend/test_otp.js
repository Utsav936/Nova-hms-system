const { sendOTP } = require('./src/utils/notification');

async function runTest() {
  console.log('🧪 Starting Live OTP Test...');
  try {
    const result = await sendOTP({
      identifier: 'mahorsanjana341@gmail.com', // Sending to yourself for verification
      otp: '999888',
      type: 'email'
    });
    
    if (result) {
      console.log('✅ TEST SUCCESSFUL! Check your inbox (mahorsanjana341@gmail.com).');
    } else {
      console.log('❌ TEST FAILED: The dispatcher returned false.');
    }
  } catch (error) {
    console.error('❌ CRITICAL ERROR during test:', error.message);
    if (error.message.includes('Invalid login')) {
      console.log('\n💡 SUGGESTION: Google blocked the login. You MUST use an "App Password".');
    }
  }
}

runTest();
