/**
 * Script to submit sitemap to search engines
 * Run with: npx ts-node scripts/submit-to-search-engines.ts
 */

import https from 'https';
import http from 'http';

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://omnilynk.io';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

interface SubmissionResult {
  engine: string;
  success: boolean;
  message: string;
}

async function submitToSearchEngine(url: string, engineName: string): Promise<SubmissionResult> {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const success = res.statusCode === 200;
        resolve({
          engine: engineName,
          success,
          message: success ? 'Successfully submitted' : `Error: ${res.statusCode} - ${data}`
        });
      });
    });
    
    req.on('error', (error) => {
      resolve({
        engine: engineName,
        success: false,
        message: `Network error: ${error.message}`
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        engine: engineName,
        success: false,
        message: 'Request timeout'
      });
    });
  });
}

async function submitSitemaps() {
  console.log('🚀 Starting sitemap submission...');
  console.log(`📍 Site URL: ${SITE_URL}`);
  console.log(`🗺️  Sitemap URL: ${SITEMAP_URL}`);
  console.log('');

  const submissions = [
    {
      name: 'Google',
      url: `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`
    },
    {
      name: 'Bing',
      url: `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`
    }
  ];

  const results: SubmissionResult[] = [];

  for (const submission of submissions) {
    console.log(`📤 Submitting to ${submission.name}...`);
    const result = await submitToSearchEngine(submission.url, submission.name);
    results.push(result);
    
    if (result.success) {
      console.log(`✅ ${submission.name}: ${result.message}`);
    } else {
      console.log(`❌ ${submission.name}: ${result.message}`);
    }
    
    // Add delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('');
  console.log('📊 Summary:');
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.engine}: ${result.success ? 'Success' : 'Failed'}`);
  });

  const successCount = results.filter(r => r.success).length;
  console.log('');
  console.log(`🎯 ${successCount}/${results.length} submissions successful`);
  
  if (successCount === results.length) {
    console.log('🎉 All sitemaps submitted successfully!');
  } else {
    console.log('⚠️  Some submissions failed. Check the errors above.');
  }
}

// Run the script
submitSitemaps().catch(console.error);