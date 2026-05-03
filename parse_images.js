const fs = require('fs');

const html = fs.readFileSync('bananaclub.html', 'utf8');

// Regex for cdn/shop/files/... .(jpg|jpeg|png|webp)
const regex = /cdn\/shop\/files\/[^"'\s\?]+\.(?:jpg|jpeg|png|webp)/gi;
const matches = html.match(regex);

if (matches) {
  const unique = [...new Set(matches)];
  console.log("Found " + unique.length + " unique images.");
  unique.forEach(m => console.log(m));
} else {
  console.log("No images found.");
}
