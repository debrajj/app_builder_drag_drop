const https = require('https');

https.get('https://bananaclub.co.in/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Basic regex to find high quality image URLs
    const imgRegex = /https:\/\/bananaclub\.co\.in\/cdn\/shop\/files\/[^"'\s\?]+\.(?:jpg|jpeg|png|webp)/g;
    const matches = data.match(imgRegex);
    const uniqueImages = [...new Set(matches)];
    
    console.log("Found Images:");
    uniqueImages.forEach(img => console.log(img));
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
