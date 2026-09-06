# $JERK — retro starfield site build

Copy the files below into a folder and open it in VS Code. No build step, no dependencies — just open `index.html` in a browser (or use the VS Code "Live Server" extension for auto-reload while you edit).

```
jerk-site/
├── index.html
├── style.css
├── script.js
└── assets/
    └── logo.svg   <- put your final ring logo here (see note at bottom)
```

## Before you touch code

1. Swap in your own ring artwork at `assets/logo.svg`. This build currently has a placeholder path — see the note at the bottom.
2. Double-check the contract address in `index.html` against your actual deployed contract. A typo here sends people's funds to the wrong address.
3. Decide where your live market-cap number will come from (Dexscreener API, your own backend, etc.) before wiring up the "RPM" spin-speed mechanic — this build ships with a fixed spin speed as a starting point.

---

## index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>$JERK</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

<div class="starfield">

  <div class="desktop">

    <div class="planet" style="left:8%; top:4%;">
      <div class="planet-circle" style="background:#e0393e; border-color:#ffb0b0;"></div>
      <div class="planet-label">the lineup</div>
    </div>

    <div class="planet" style="right:6%; top:0%;">
      <div class="planet-circle" style="background:#ff8c1a; border-color:#ffd9a0;"></div>
      <div class="planet-label">holders club</div>
    </div>

    <div class="planet" style="left:2%; top:34%;">
      <div class="planet-circle" style="background:#8fd13f; border-color:#d8ffb0;"></div>
      <div class="planet-label">buy $jerk</div>
    </div>

    <div class="planet" style="right:2%; top:38%;">
      <div class="planet-circle" style="background:#33c1c9; border-color:#b0f0ff;"></div>
      <div class="planet-label">chart</div>
    </div>

    <div class="planet" style="left:6%; bottom:6%;">
      <div class="planet-circle" style="background:#28c9c0; border-color:#b0fff5;"></div>
      <div class="planet-label">stellar bags</div>
    </div>

    <div class="planet" style="right:10%; bottom:0%;">
      <div class="planet-circle" style="background:#c04ad6; border-color:#f0c0ff;"></div>
      <div class="planet-label">telegram</div>
    </div>

    <div class="center-stage">
      <div class="ring-logo-wrap" id="ringLogo">
        <img src="assets/logo.svg" alt="Jerk ring logo" width="180" height="180">
      </div>
      <div class="wordmark">JERK</div>
    </div>

    <div class="ad-banner">
      <div class="ad-headline">!!! GET BIGGER GAINS FAST !!!</div>
      <div class="ad-body">TRY NEW "VIGOR-EZ" — CLICK HERE FOR FREE TRIAL</div>
    </div>

    <div class="ticker-wrap">
      <div class="ticker-track" id="tickerTrack">
        $JERK &nbsp;|&nbsp; 0xe1e5f00a9b0255ca4df85b3130ee0f77d15acc2d &nbsp;|&nbsp;
        $JERK &nbsp;|&nbsp; 0xe1e5f00a9b0255ca4df85b3130ee0f77d15acc2d &nbsp;|&nbsp;
        $JERK &nbsp;|&nbsp; 0xe1e5f00a9b0255ca4df85b3130ee0f77d15acc2d
      </div>
    </div>

  </div>

  <div class="taskbar">
    <div class="start-btn"><span class="win-icon">&#9635;</span> Start</div>
    <div class="clock" id="clock">4:00 PM</div>
  </div>

</div>

<script src="script.js"></script>
</body>
</html>
```

---

## style.css

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Tahoma, Arial, sans-serif;
  background: #000;
}

.starfield {
  min-height: 100vh;
  background-color: #000;
  background-image:
    radial-gradient(1px 1px at 20px 30px, #fff, transparent),
    radial-gradient(1px 1px at 90px 60px, #fff, transparent),
    radial-gradient(1px 1px at 150px 20px, #fff, transparent),
    radial-gradient(2px 2px at 200px 90px, #fff, transparent),
    radial-gradient(1px 1px at 260px 40px, #fff, transparent),
    radial-gradient(1px 1px at 320px 110px, #fff, transparent),
    radial-gradient(2px 2px at 40px 130px, #fff, transparent),
    radial-gradient(1px 1px at 380px 70px, #fff, transparent),
    radial-gradient(1px 1px at 440px 20px, #fff, transparent),
    radial-gradient(1px 1px at 500px 100px, #fff, transparent),
    radial-gradient(2px 2px at 560px 50px, #fff, transparent),
    radial-gradient(1px 1px at 620px 120px, #fff, transparent);
  background-size: 640px 160px;
  padding: 24px 12px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.desktop {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  min-height: 420px;
  flex: 1;
}

.planet {
  position: absolute;
  text-align: center;
}

.planet-circle {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  margin: 0 auto;
  border: 2px solid;
}

.planet-label {
  color: #ffe94d;
  font-size: 11px;
  margin-top: 4px;
  text-shadow: 0 0 4px #ffb800;
}

.center-stage {
  text-align: center;
  padding-top: 90px;
}

.ring-logo-wrap {
  width: 180px;
  height: 180px;
  margin: 0 auto;
  animation: spin 2.4s linear infinite;
}

.ring-logo-wrap img {
  width: 100%;
  height: 100%;
  display: block;
}

.wordmark {
  font-family: Impact, "Arial Black", sans-serif;
  font-size: 44px;
  letter-spacing: 3px;
  color: #ffe94d;
  text-shadow: 2px 2px 0 #cc3300, -1px -1px 0 #fff;
  margin-top: 6px;
}

.ad-banner {
  background: #ffff00;
  border: 3px dashed #ff2020;
  padding: 8px;
  text-align: center;
  margin: 16px 20px 12px;
}

.ad-headline {
  font-size: 14px;
  font-weight: 700;
  color: #d40000;
  animation: blink 1s step-start infinite;
}

.ad-body {
  font-size: 12px;
  color: #000080;
  font-weight: 700;
}

.ticker-wrap {
  background: #000;
  border-top: 2px solid #ffb800;
  border-bottom: 2px solid #ffb800;
  padding: 6px 0;
  margin: 0 20px;
  overflow: hidden;
}

.ticker-track {
  white-space: nowrap;
  display: inline-block;
  color: #ffb800;
  font-family: "Courier New", monospace;
  font-size: 13px;
  font-weight: 700;
  animation: ticker 14s linear infinite;
  padding-left: 100%;
}

.taskbar {
  background: #c0c0c0;
  border-top: 2px solid #dfdfdf;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.start-btn {
  background: #c0c0c0;
  border: 2px solid;
  border-color: #dfdfdf #000 #000 #dfdfdf;
  padding: 3px 12px;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #000;
  cursor: pointer;
}

.win-icon {
  color: #000080;
}

.clock {
  background: #c0c0c0;
  border: 2px solid;
  border-color: #000 #dfdfdf #dfdfdf #000;
  padding: 3px 12px;
  font-size: 12px;
  color: #000;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes blink {
  50% { opacity: 0; }
}

@keyframes ticker {
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
}
```

---

## script.js

```javascript
function updateClock() {
  const clockEl = document.getElementById('clock');
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  clockEl.textContent = `${hours}:${minutes} ${ampm}`;
}

updateClock();
setInterval(updateClock, 1000 * 30);

// Placeholder hook for wiring the ring's spin speed to live market cap.
// Fetch your MC from your data source of choice, then scale the
// animation-duration on #ringLogo — lower duration = faster spin.
//
// Example shape (replace with a real fetch to your API / Dexscreener):
//
// async function updateSpinFromMarketCap() {
//   const mc = await fetchMarketCap(); // implement this
//   const ring = document.getElementById('ringLogo');
//   const duration = Math.max(0.4, 3 - mc / 50000); // tune this curve
//   ring.style.animationDuration = duration + 's';
// }
// setInterval(updateSpinFromMarketCap, 5000);
```

---

## Notes

- **Logo**: `assets/logo.svg` is referenced but not included here — export your final ring artwork as an SVG (or PNG) into the `assets` folder with that filename, or update the `src` in `index.html`.
- **Contract address**: appears in the ticker in `index.html` — verify it's correct before this goes anywhere public.
- **Planet icons**: currently plain colored circles with labels. Swap in small planet/ring graphics if you want them to look closer to the reference screenshots.
- **Live MC → spin speed**: `script.js` has a commented-out starting point for wiring the ring's spin speed to real market cap data once you have a source (Dexscreener's API is a common free option for this).
