#!/bin/bash
cd ~/wheelswatcher/wheelswatcher-app
git pull origin main
npm install
npm run build
sudo systemctl restart wheelswatcher-combined
