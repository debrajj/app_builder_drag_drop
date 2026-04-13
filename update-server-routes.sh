#!/bin/bash
# Script to update all API routes in server.ts to support BASE_PATH

# This script will be used to update the server.ts file
# Run this on the EC2 server after deployment

echo "Updating server.ts to support BASE_PATH..."

# Backup original file
cp server.ts server.ts.backup

# Update all API routes to use BASE_PATH
sed -i 's|app\.get("/api/|app.get(`${BASE_PATH}/api/|g' server.ts
sed -i 's|app\.post("/api/|app.post(`${BASE_PATH}/api/|g' server.ts
sed -i 's|app\.put("/api/|app.put(`${BASE_PATH}/api/|g' server.ts
sed -i 's|app\.delete("/api/|app.delete(`${BASE_PATH}/api/|g' server.ts

# Fix the closing quotes
sed -i 's|/api/\([^"]*\)", async|/api/\1\`, async|g' server.ts

echo "Server routes updated successfully!"
echo "Backup saved as server.ts.backup"
