---
title: Overview
order: 1
---

## Project Structure

### Core files

- `src/scss` scss entry point and tailwind config
- `src/js` Core javascript, utilities, behaviour loader (see Javascript notes)
- `static/fonts` All of the webfonts
- `static/img/` Placeholder images (jpgs, pngs, svgs), prefix svg's with ui- for symbols

### Pattern library files

All of the html, css for specific pattern components can be found in `src/templates`. Eg:

- `src/templates/03-global/header/header.twig`
- `src/templates/03-global/header/_header.scss`
- `src/templates/03-global/header/header.config.js`

## Component categories

- **Base:** Typography, themes, base styles
- **Objects:** Small, reusable, and single purposes modules
- **Components:** Reusable components, could be comprised of several modules
- **Global:** Components that appear on every page on the site
