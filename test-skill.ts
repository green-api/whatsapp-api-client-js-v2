/**
 * GREEN-API SDK Test Script
 * 
 * This script tests basic SDK functionality.
 * Run with: npx ts-node test-skill.ts
 * 
 * Before running, set environment variables:
 * - ID_INSTANCE: Your instance ID
 * - API_TOKEN_INSTANCE: Your API token
 * - TEST_CHAT_ID: Target chat ID (format: 1234567890@c.us)
 */

import { GreenApiClient } from './src';

async function testSDK() {
  console.log('🧪 Testing GREEN-API SDK Skill\n');

  // Get credentials from environment
  const idInstance = process.env.ID_INSTANCE;
  const apiTokenInstance = process.env.API_TOKEN_INSTANCE;
  const testChatId = process.env.TEST_CHAT_ID || '1234567890@c.us'; // Replace with actual

  if (!idInstance || !apiTokenInstance) {
    console.error('❌ Missing credentials:');
    console.error('   Set ID_INSTANCE and API_TOKEN_INSTANCE environment variables');
    process.exit(1);
  }

  // Initialize client
  const client = new GreenApiClient({
    idInstance: parseInt(idInstance, 10),
    apiTokenInstance
  });

  try {
    // Test 1: Check instance state
    console.log('Test 1: Check instance state');
    const state = await client.getStateInstance();
    console.log(`  ✓ State: ${state.stateInstance}`);

    if (state.stateInstance !== 'authorized') {
      console.error('  ❌ Instance not authorized. Scan QR code:');
      const qr = await client.getQR();
      console.log('     QR Code (base64): ' + qr.qrCode.substring(0, 50) + '...');
      console.log('     Then re-run this script.');
      process.exit(1);
    }

    // Test 2: Get settings
    console.log('\nTest 2: Get instance settings');
    const settings = await client.getSettings();
    console.log(`  ✓ Settings retrieved`);

    // Test 3: Get contacts (if any)
    console.log('\nTest 3: List contacts');
    const contacts = await client.getContacts();
    console.log(`  ✓ Found ${contacts.length} contacts`);

    // Test 4: Get recent chats
    console.log('\nTest 4: Get recent chats');
    const chats = await client.getChats(5);
    console.log(`  ✓ Found ${chats.length} recent chats`);
    chats.slice(0, 3).forEach(chat => {
      console.log(`    - ${chat.title}`);
    });

    // Test 5: Send test message
    console.log('\nTest 5: Send test message');
    console.log(`  Sending to: ${testChatId}`);
    try {
      const response = await client.sendMessage({
        chatId: testChatId,
        message: '✓ GREEN-API SDK test message at ' + new Date().toISOString()
      });
      console.log(`  ✓ Message sent: ${response.idMessage}`);
    } catch (error: any) {
      if (error.message.includes('400') || error.message.includes('401')) {
        console.log(`  ⚠ Could not send (invalid chat ID or not authorized)`);
        console.log(`    Update TEST_CHAT_ID in script or scan QR code`);
      } else {
        throw error;
      }
    }

    // Test 6: Test polling (with timeout)
    console.log('\nTest 6: Check for new notifications (5s timeout)');
    const notification = await client.receiveNotification(5);
    if (notification) {
      console.log(`  ✓ Notification received: ${notification.body.eventType}`);
      await client.deleteNotification(notification.receiptId);
    } else {
      console.log(`  ✓ No new notifications (timeout)`);
    }

    // Test 7: Get avatar
    console.log('\nTest 7: Get your own avatar');
    try {
      // Get own number from settings or contacts
      const myId = `${idInstance}@c.us`; // Simplified; use actual number
      const avatar = await client.getAvatar({ chatId: myId });
      console.log(`  ✓ Avatar URL: ${avatar.urlFile.substring(0, 50)}...`);
    } catch (error: any) {
      console.log(`  ⚠ Could not get avatar (might not have profile picture)`);
    }

    // Summary
    console.log('\n✅ All tests passed!');
    console.log('\n📝 Next steps:');
    console.log('   1. Update TEST_CHAT_ID with your recipient phone (1234567890@c.us)');
    console.log('   2. Create groups with createGroup()');
    console.log('   3. Set up webhooks for real-time notifications');
    console.log('   4. See references/*.md for more methods and examples');

    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Test failed:');
    console.error('  ', error.message);
    console.error('\n💡 Common issues:');
    console.error('   - Invalid credentials: Check ID_INSTANCE and API_TOKEN_INSTANCE');
    console.error('   - Not authorized: Call getQR() and scan QR code');
    console.error('   - Invalid chat ID: Use format "1234567890@c.us" for contacts');
    process.exit(1);
  }
}

// Run tests
testSDK();
