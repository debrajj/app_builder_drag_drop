#!/bin/bash

echo "📸 Quick Media Library Setup"
echo "============================"
echo ""

SSH_KEY="/Users/debrajroy/Downloads/multi-vender.pem"
SERVER="ubuntu@43.205.214.197"

ssh -i "$SSH_KEY" "$SERVER" "cd /home/ubuntu/appbuilder && git pull && npx tsx add-media-only.ts"

echo ""
echo "✅ Done! Check Media Library at https://appbuilder.technoboost.in"
echo ""
