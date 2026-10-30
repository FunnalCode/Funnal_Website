# Funnal website assets

Hosted files for the redesigned funnal.co.uk (built in Webflow):

- `funnal.css` – the stylesheet for everything Webflow can't hold natively (animations, hover and open states, dark mode, WebGL fallbacks). Every class is prefixed `fn-`.
- `funnal.js` – menus, sounds, FAQ, project pop-up, theme switch, headline hover, WebGL effects. No dependencies.
- `assets/img` – case-study images used by the work pop-ups and pages.
- `assets/audio` – the four interface sounds (open, close, tab, success).

Each redesigned Webflow page loads these from its page settings → Custom code → Head:

```html
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/FunnalCode/Funnal_Website@main/funnal.css">
<script>try{var t=localStorage.getItem('fnl-theme');document.documentElement.setAttribute('data-theme',t==='dark'||t==='light'?t:'light')}catch(e){document.documentElement.setAttribute('data-theme','light')}</script>
<script src="https://cdn.jsdelivr.net/gh/FunnalCode/Funnal_Website@main/funnal.js" defer></script>
```

`funnal.js` finds the images and sounds relative to its own address, so keep the folder layout as is.
