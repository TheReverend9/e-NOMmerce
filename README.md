# 🛒 e-NOMmerce

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![React Native](https://img.shields.io/badge/built%20with-React%20Native-61DAFB)
![WooCommerce API](https://img.shields.io/badge/woocommerce-api-orange)
![Platform](https://img.shields.io/badge/platform-android%20%7C%20ios%20%7C%20web-green)
![Status](https://img.shields.io/badge/status-active-brightgreen)

**A fast, mobile-friendly WooCommerce Orders App**  
e-NOMmerce syncs WooCommerce orders every few minutes—offering a real-time alternative to the official WooCommerce app’s 30-minute delay.

## 🚀 Features

- 🔄 **Fast Order Syncing** – Refreshes orders every few minutes  
- 🔐 **Secure API Input** – Enter your WooCommerce credentials directly in the app, no `.env` file required  
- ⚡ **Lightweight UI** – Designed for speed and simplicity  
- ☁️ **Free Web Deployment** via Expo  

## 🔐 WooCommerce Credentials

When you first open the app, you’ll be prompted to enter your WooCommerce credentials:

🔐 Enter WooCommerce Credentials
API URL (e.g. https://your-website.com/wp-json/wc/v3)
Consumer Key:
Consumer Secret:
[✓] Remember these credentials on this device

- Credentials are stored **locally and unencrypted** in your browser’s storage or mobile device storage if you check "Remember these credentials."
- A **"Clear API Credentials"** button is available in the top right corner of the app to manually remove saved credentials at any time.
- This feature is convenient, but ⚠️ we recommend not using "remember" on shared or public devices.

## 📦 Tech Stack

- **React Native** (via Expo)  
- **React Navigation**  
- **WooCommerce REST API**  
- **Axios**  
- **AsyncStorage**  

## 🛠️ Installation & Setup

### Requirements

- Node.js  
- Expo CLI (`npm install -g expo-cli`)  
- WooCommerce site with REST API enabled  
- Android/iOS emulator or physical device (or a browser for web)  

### 1. Clone the Repo

```bash
git clone https://github.com/TheReverend9/e-NOMmerce.git
cd e-NOMmerce

### 2. Install Dependencies
```bash
npm install

### 3. Start the App

**To run the app in your web browser**
npx expo start --web

## ☁️ EAS Deployment

You can build and deploy your app using [Expo Application Services (EAS)](https://expo.dev/eas).

### 1. 📋 Create an Expo Account

To use EAS, you’ll need an Expo account.

- Sign up at: [https://expo.dev/signup](https://expo.dev/signup)  
- Or from the command line:

```bash
npx expo register

### 2. 🔑 Log In to Your Expo Account

```bash
npx expo login
Follow the prompts to enter your Expo username and password.

### 3. 🏗️ Initialize EAS in Your Project

Inside your project folder, run:
```bash
npx eas init
This will generate an eas.json file in your root directory and help you configure your first EAS build.

Example eas.json structure:
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {},
    "production": {
      "android": {
        "workflow": "managed"
      },
      "ios": {
        "workflow": "managed"
      }
    }
  }
}

You can tweak these settings later based on your platform and workflow preferences.

### 4. 🔨 Build the App for EAS

```bash
npx expo export --platform web
This will generate a static export of your web application in the ***dist*** folder.

### 5. 📲 Publish the Production Build to EAS Servers

``` npx eas deploy --prod
You can then visit the site using the Production URL


👨‍💻 Built with ❤️ by Kevin @TheReverend9 and Jasmine @JCastillo-webdesign
