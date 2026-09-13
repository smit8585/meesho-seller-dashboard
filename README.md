# YourPick Seller Tracker

A local dashboard for Meesho sellers to track orders from dispatch through delivery and payment — the visibility Meesho doesn't give you.

## What it does

- **Upload a manifest PDF** → Every sub-order is tracked from the moment you dispatch it
- **Upload a payment statement Excel** → Orders are automatically updated with delivery status, RTO outcome, and settlement amount
- **Dashboard** → See at a glance how many orders are in transit, delivered, returned, and how much you've been paid

## First-time setup (one time only)

You need Node.js installed. Download from https://nodejs.org if you don't have it.

```bash
# 1. Clone or download this project, then open the folder in a terminal

# 2. Install dependencies
npm install

# 3. Set up the database (creates a local SQLite file — no internet needed)
npx prisma migrate deploy
npx prisma generate

# 4. Start the app
npm run dev
```

Then open http://localhost:3000 in your browser.

## Daily use

Every day you dispatch:
1. Go to **Upload** → upload the manifest PDF from Meesho Supplier Panel
2. When Meesho releases a payment statement → upload the Excel file
3. Check your **Dashboard** for the full picture

## How to run it each day

Just open the project folder in a terminal and run:

```bash
npm run dev
```

Then open http://localhost:3000. Press `Ctrl+C` to stop.

## Order status flow

```
Dispatched → In Transit → Delivered → Payment Received  ✅
                        → RTO Initiated → RTO Received Back  ↩️
                        → Delivered → Customer Returned → Return Received → (Claim)  🔄
```

## Data storage

All data is stored locally in `prisma/dev.db` (a SQLite file on your computer). Nothing leaves your machine. Back this file up to avoid losing your order history.
