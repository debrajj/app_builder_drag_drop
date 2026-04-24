#!/bin/bash

SERVER_IP="43.205.214.197"
PORT="3002"

echo "🔍 Checking deployment status..."
echo ""

# Check if server is responding
echo "Testing server at http://$SERVER_IP:$PORT..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://$SERVER_IP:$PORT" 2>/dev/null || echo "000")

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Server is running!"
    echo "🌐 Visit: http://$SERVER_IP:$PORT"
elif [ "$HTTP_CODE" = "000" ]; then
    echo "❌ Server is not responding"
    echo "   The deployment might still be in progress"
else
    echo "⚠️  Server returned HTTP $HTTP_CODE"
fi

echo ""
echo "📊 To check server logs:"
echo "   ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@$SERVER_IP 'pm2 logs appbuilder --lines 50'"
echo ""
echo "🔄 To restart the app:"
echo "   ssh -i /Users/debrajroy/Downloads/multi-vender.pem ubuntu@$SERVER_IP 'pm2 restart appbuilder'"
