# Utsav

Utsav is a live streaming and creator monetization platform built for the Indian market, connecting hosts with their audience through real-time video, audio, and virtual gifting.

## Features

- Phone number authentication
- Personalized creator profiles
- Live video and audio streaming
- Real-time chat and virtual gifting
- In-app wallet and earnings tracking
- Creator applications and agency management

## Tech Stack

- **Mobile:** React Native (Expo), TypeScript
- **Backend:** Firebase (Authentication, Firestore, Cloud Functions, Storage)
- **Real-time streaming:** Agora
- **Payments:** Razorpay

## Screenshots

<p align="center">
  <img src="assets/splash-hero.png" alt="Utsav splash screen" width="320" />
</p>

## Architecture

Utsav follows a layered mobile architecture with a clear separation between UI, application state, and data access. All backend communication is centralized through a service layer, and any operation involving money or account privileges is handled exclusively by server-side Cloud Functions rather than the client.

## Installation

```bash
npm install
npx expo start
```

The app uses native Firebase modules and requires a development build rather than Expo Go:

```bash
npx expo run:android
```

## Status

In active development. Core authentication and navigation are complete; live streaming, gifting, and wallet features are in progress.

## License

Proprietary — All rights reserved. See [LICENSE](LICENSE).
