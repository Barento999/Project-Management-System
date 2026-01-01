// Helper script to extract verification link from email logs
// Just copy the entire email log output and this will find the link

const emailLog = `
PASTE YOUR EMAIL LOG HERE
`;

// Extract verification URL
const urlMatch = emailLog.match(
  /http:\/\/localhost:5173\/verify-email\/([a-f0-9]+)/i
);

if (urlMatch) {
  const fullUrl = urlMatch[0];
  const token = urlMatch[1];

  console.log("\n✅ Found verification link!\n");
  console.log("Full URL:");
  console.log(fullUrl);
  console.log("\nToken:");
  console.log(token);
  console.log("\n📋 Next steps:");
  console.log("1. Copy the full URL above");
  console.log("2. Paste it in your browser");
  console.log("3. Your email will be verified!\n");
} else {
  console.log("❌ No verification link found in the log.");
  console.log("Make sure you copied the complete email log.");
}
