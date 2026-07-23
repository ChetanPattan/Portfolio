# Chetan Pattan — Portfolio (Blazor WebAssembly)

A static, single-page portfolio site built with Blazor WebAssembly (.NET 9).
No server, no database — everything runs in the browser, so it can be hosted
for free as static files.

## 1. Prerequisites

- Visual Studio 2022 (v17.10+) with the **ASP.NET and web development** workload
- .NET 9 SDK (Visual Studio's installer can add this, or get it from
  https://dotnet.microsoft.com/download)

## 2. Open and run locally

1. Unzip the project.
2. Double-click `PortfolioBlazor.csproj` (or open the folder) in Visual Studio 2022.
3. Press **F5** (or Ctrl+F5 to run without debugging).
4. The site opens at `https://localhost:7050`.

## 3. Before you publish — 2 things to customize

1. **Contact form** — `Shared/ContactForm.razor` posts to Formspree so the
   form works with zero backend:
   - Go to https://formspree.io and create a free account (50 submissions/month, free forever).
   - Create a new form, copy the endpoint it gives you (looks like
     `https://formspree.io/f/xxxxabcd`).
   - Open `Shared/ContactForm.razor` and replace:
     ```csharp
     private const string FormspreeEndpoint = "https://formspree.io/f/YOUR_FORM_ID";
     ```
     with your real endpoint.
2. **Resume file** — `wwwroot/resume/ChetanPattan_Resume.pdf` is already your
   uploaded resume. Replace this file any time you update your resume, keeping
   the same filename (or update the link in `Pages/Home.razor` if you rename it).

## 4. Hosting for free — GitHub Pages (recommended)

This repo already includes a GitHub Actions workflow
(`.github/workflows/deploy.yml`) that builds and deploys the site automatically
every time you push to `main`.

1. Create a free GitHub account if you don't have one: https://github.com
2. Create a new **public** repository, e.g. `portfolio`.
3. Push this project to it:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/portfolio.git
   git push -u origin main
   ```
4. In your GitHub repo, go to **Settings → Pages**, and under "Build and
   deployment → Source", choose **Deploy from a branch**, then pick the
   `gh-pages` branch (it appears automatically the first time the workflow
   runs — check the **Actions** tab to watch it build).
5. After a minute or two, your site is live at:
   ```
   https://<your-username>.github.io/portfolio/
   ```

The workflow automatically rewrites the `<base href>` to match your repo name,
so you don't need to edit anything by hand — it just works for any repo name
you choose.

### Alternative free hosts (also work great for static Blazor WASM sites)

- **Cloudflare Pages** — https://pages.cloudflare.com (connect the GitHub repo,
  build command `dotnet publish -c Release -o release`, output folder
  `release/wwwroot`)
- **Netlify** — https://netlify.com (same build command/output folder as above)
- **Azure Static Web Apps (Free tier)** — https://azure.microsoft.com/products/app-service/static
  (Microsoft's own static hosting, integrates natively with Blazor)

## 5. Add the link to your resume / LinkedIn / Indeed

Once live, add the URL (e.g. `https://<your-username>.github.io/portfolio/`)
to:
- Your resume header, next to your email/phone
- LinkedIn "Contact info" and the "Featured" section
- Indeed profile summary

## Project structure

```
PortfolioBlazor/
├── Pages/
│   └── Home.razor          # single-page site: hero, about, skills, experience, contact
├── Shared/
│   ├── MainLayout.razor     # sticky nav + footer
│   └── ContactForm.razor    # Formspree-powered contact form
├── wwwroot/
│   ├── css/app.css          # full design system
│   ├── resume/              # your resume PDF (downloadable)
│   ├── index.html
│   ├── 404.html              # GitHub Pages SPA deep-link fix
│   └── favicon.svg
└── .github/workflows/deploy.yml   # auto build + deploy to GitHub Pages
```

## Performance notes

- Trimming (`PublishTrimmed`) and Brotli compression are enabled in the
  `.csproj`, so the published `.wasm` payload stays as small as possible.
- No JS frameworks, no images to download, no external fonts beyond Google
  Fonts (loaded once, cached by the browser) — this keeps first load fast.
