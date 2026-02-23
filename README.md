# ⚡ Headless Tebex Storefront (React + Vite)

A high-performance, fully customizable frontend for your Tebex store. Built with **React**, **TypeScript**, and **Vite**.
This template uses the Tebex Headless API to provide a seamless, instant-loading shopping experience that standard themes cannot match.

![License](https://img.shields.io/badge/License-Commercial-blue.svg)
![React](https://img.shields.io/badge/React-18-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-Fast-646cff.svg)

## 🚀 Features

*   **Instant Navigation:** No page reloads. Browsing categories and products is instant.
*   **Immersive UI:** Modern, dark-mode first design tailored for roleplay communities.
*   **Easy Configuration:** All settings managed in a single TypeScript file.
*   **Tebex Integration:** Full cart, checkout flow, and category fetching via Headless API.
*   **GDPR Ready:** Built-in consent banner and legal links support.
*   **Mobile Optimized:** Fully responsive layout for phone and tablet users.

---

## 🛠️ Installation

1.  **Requirements:** Node.js 18+ installed.
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Start Development Server:**
    ```bash
    npm run dev
    ```

---

## ⚙️ Configuration

All server-specific settings are located in **`src/config/store.config.ts`**.
You do **not** need to edit the React components directly for standard setup.

### 1. Link your Tebex Store
Open `src/config/store.config.ts` and set your **Public Token**.
*   *Get this from: Tebex Panel -> Integrations -> Headless API -> Public Token*

```typescript
export const config: StoreConfig = {
  tebexToken: "your-public-token-here", // ⚠️ NOT your secret key!
  storeName: "Your Server Name",
  currency: "EUR",
  // ...
```

### 2. Branding & Theme
Customize your visual identity in the `theme` section.

```typescript
  theme: {
    colors: {
      primary: "#3b82f6",    // Main accent color (Buttons, Highlights)
      secondary: "#64748b",  // Secondary elements
      background: "#0f172a", // Main page background
      surface: "#1e293b",    // Cards/Modals background
      text: "#f8fafc",       // Font color
    },
    images: {
      logo: "https://your-domain.com/logo.png",
      // Need fast hosting? Try our cloud hosting ;) swisser.cloud
      heroBackground: "https://your-domain.com/background.jpg", 
    },
  },
```

### 3. Navigation & Socials
Configure your external links (Discord, Rules, Website) in the `navigation` array.

```typescript
  navigation: [
    { label: "Home", url: "#" },
    { label: "Discord", url: "https://discord.gg/your-invite", external: true },
  ],
```

---

## 📦 Deployment

This project is a static web application. It can be hosted on **Vercel**, **Netlify**, or any **VPS** with Nginx/Apache.

### Build for Production
This generates a `dist` folder with optimized files ready for upload.

```bash
npm run build
```

### VPS (Nginx) Example
If hosting on your own box, point your web server to the `dist/` folder and ensure you handle the single-page app routing (try_files).

```nginx
location / {
  root /var/www/store/dist;
  index index.html;
  try_files $uri $uri/ /index.html;
}
```

---

## 🧱 Project Structure

*   `src/config/` - **Main Configuration files.** Start here.
*   `src/modules/store/` - Logic for Cart and Tebex API interaction.
*   `src/modules/ui/` - Reusable UI components (Buttons, Cards, Modals).
*   `src/assets/` - Static local images (if not using external URLs).

---

## 📝 License

You are free to modify this source code for your own project.
Reselling this code base or claiming it as your own work is strictly prohibited without prior written consent.