# App Builder Drag & Drop

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

A powerful drag-and-drop app builder with PostgreSQL database support.

## Database Configuration

This app uses PostgreSQL (AWS RDS) for data persistence.

## Run Locally

**Prerequisites:** Node.js, PostgreSQL

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   - Set `GEMINI_API_KEY` to your Gemini API key
   - Database credentials are pre-configured for AWS RDS PostgreSQL

3. Run database migrations:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

4. Run the app:
   ```bash
   npm run dev
   ```
