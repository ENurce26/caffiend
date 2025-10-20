# ☕ Caffiend – Caffeine Tracker

Caffiend is a full-stack web application that helps users monitor and manage their daily caffeine intake.  
Built with **React** for the frontend and **Firebase** for authentication, data storage, and hosting.

---

## Problem

Caffeine is one of the most widely consumed psychoactive substances in the world. While it can boost alertness and productivity, excessive intake can lead to:

- Anxiety and jitteriness
- Sleep disruption
- Heart palpitations
- Dependency and withdrawal

Most people don’t keep track of their daily caffeine consumption, making it easy to exceed healthy limits without realizing it.

---

## Solution

Caffiend provides an easy, intuitive way for users to:

- Log their caffeinated drinks throughout the day
- See real-time total caffeine consumption
- Compare their intake against recommended daily limits
- Track consumption history over time

**Key Features:**
- 🔐 **User Authentication** (Firebase Auth)
- ☕ **Drink Logging** with caffeine amount per beverage
- 📊 **Daily Summary** of total caffeine intake
- 🗓 **History View** to track habits
- 📱 Responsive, mobile-friendly design

---

## Tech Stack

**Frontend:**
- React (Hooks & functional components)
- CSS Modules / Tailwind (styling)
- React Router (navigation)

**Backend & Hosting:**
- Firebase Authentication
- Firebase Firestore (real-time NoSQL database)
- Firebase Hosting

---

## How It Works

1. **Sign Up / Log In** – Secure authentication with Firebase.
2. **Add Drinks** – Choose from a predefined list (coffee, tea, energy drinks) or add custom entries with caffeine amounts.
3. **View Dashboard** – See your total caffeine for the day and how close you are to your limit.
4. **History** – Browse past days to see trends in your caffeine consumption.

---

## Issues & Solutions

### 1. **Firestore Security Rules**
**Problem:** Initially, all data in Firestore was publicly readable and writable.  
**Solution:** Implemented Firebase security rules that restrict read/write access to authenticated users and only their own documents.

### 2. **Time Zone Differences**
**Problem:** Users in different time zones were getting inaccurate "daily totals" because of UTC-based timestamps.  
**Solution:** Adjusted timestamps to store and calculate based on the user’s local time zone using `Intl.DateTimeFormat` and client-side date handling.

### 3. **Data Duplication in Firestore**
**Problem:** Rapid double-clicking on "Add Drink" button caused duplicate entries.  
**Solution:** Disabled the button during the async write operation to prevent multiple submissions.

### 4. **State Sync Between UI and Firestore**
**Problem:** The UI sometimes displayed stale data after adding a drink.  
**Solution:** Used Firestore’s real-time snapshot listeners to instantly reflect changes in the UI without manual refresh.

---
