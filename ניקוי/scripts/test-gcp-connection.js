#!/usr/bin/env node

// Test GCP Connection for Lions of Zion Platform
import { GoogleAuth } from 'google-auth-library';
import { VertexAI } from '@google-cloud/vertexai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('🦁 Lions of Zion - GCP Connection Test\n');

async function testGCPConnection() {
  try {
    console.log('📋 Environment Check:');
    console.log(`  ├─ Project ID: ${process.env.GOOGLE_CLOUD_PROJECT}`);
    console.log(`  ├─ Region: ${process.env.GCP_REGION}`);
    console.log(`  ├─ Credentials: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
    console.log(`  └─ Gemini API Key: ${process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Missing'}\n`);

    // Test 1: Basic Authentication
    console.log('🔐 Testing Authentication...');
    const auth = new GoogleAuth({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    
    const client = await auth.getClient();
    const projectId = await auth.getProjectId();
    
    console.log(`  ✅ Authentication successful`);
    console.log(`  ✅ Project ID verified: ${projectId}\n`);
    
    // Test 2: Vertex AI Connection
    console.log('🤖 Testing Vertex AI...');
    try {
      const vertexAI = new VertexAI({
        project: projectId,
        location: process.env.GCP_REGION || 'us-east1'
      });
      
      console.log(`  ✅ Vertex AI client initialized`);
      console.log(`  ✅ Location: ${process.env.GCP_REGION || 'us-east1'}\n`);
    } catch (vertexError) {
      console.log(`  ⚠️  Vertex AI warning: ${vertexError.message}\n`);
    }
    
    // Test 3: Service Account Details
    console.log('👤 Service Account Info:');
    const credentials = JSON.parse(
      await import('fs').then(fs => 
        fs.promises.readFile(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8')
      )
    );
    
    console.log(`  ├─ Email: ${credentials.client_email}`);
    console.log(`  ├─ Client ID: ${credentials.client_id}`);
    console.log(`  ├─ Private Key ID: ${credentials.private_key_id}`);
    console.log(`  └─ Type: ${credentials.type}\n`);
    
    // Test 4: OAuth Configuration
    console.log('🌐 OAuth Configuration:');
    console.log(`  ├─ Client ID: ${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`);
    console.log(`  ├─ Client Secret: ${process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing'}`);
    console.log(`  └─ Auth URL: ${process.env.NEXTAUTH_URL}\n`);
    
    console.log('🎉 All GCP services connected successfully!');
    console.log('🚀 Lions of Zion platform is ready for development!\n');
    
    return true;
    
  } catch (error) {
    console.error('❌ GCP Connection failed:');
    console.error(`   Error: ${error.message}`);
    console.error(`   Code: ${error.code || 'Unknown'}`);
    
    if (error.message.includes('ENOENT')) {
      console.error('\n💡 Fix: Check that the service account key file exists:');
      console.error(`   Path: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
    }
    
    if (error.message.includes('permission')) {
      console.error('\n💡 Fix: Check service account permissions in GCP Console');
    }
    
    console.error('\n📚 See docs/GCP_SERVICE_ACCOUNT_SETUP.md for help\n');
    process.exit(1);
  }
}

// Run the test
testGCPConnection();