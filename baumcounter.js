window.addEventListener('DOMContentLoaded', function() {
  var widget = document.getElementById('baumpaten-widget');
  if (!widget) return;

  var trees = parseInt(widget.getAttribute('data-trees')) || 0;
  var logoUrl = 'https://martinz93.github.io/baumpaten-widget-selfservice/logoneuv2.svg';
  var logoRegenUrl = 'https://martinz93.github.io/baumpaten-widget-selfservice/logoregen.svg';

  let emojiRainId = 'emoji-rain-' + Math.floor(Math.random() * 100000);

  widget.innerHTML = `
    <div class="bp-emoji-rain" id="${emojiRainId}"></div>
    <div class="bp-card" id="bp-card-main">
      <div class="bp-superheadline">Wir sind Baumpaten!</div>
      <div class="bp-subheadline">In Zusammenarbeit mit den Baumpaten Deutschland® haben wir bereits</div>
      <div class="bp-counter-row"></div>
      <div class="bp-subbottom">Bäume gepflanzt – regional, nachhaltig, transparent.</div>
      <div class="bp-logo-bottom">
        <img src="${logoUrl}" alt="Baumpaten Logo" class="bp-logo-main" />
      </div>
    </div>
  `;

  var counter = widget.querySelector('.bp-counter-row');
  var digits = trees.toString().length;
  let current = Array(digits).fill(0);

  counter.innerHTML = '';
  for (let i = 0; i < digits; i++) {
    const digit = document.createElement('div');
    digit.className = 'bp-flip-digit';
    digit.innerHTML = `<span class="bp-digit-inner">0</span>`;
    counter.appendChild(digit);
  }

  function flipDigit(digitEl, from, to) {
    if (from === to) return;
    const flip = document.createElement('span');
    flip.className = 'bp-flip';
    flip.textContent = from;
    digitEl.appendChild(flip);

    setTimeout(() => {
      flip.style.transform = 'rotateX(-90deg)';
      flip.style.opacity = 0;
      digitEl.querySelector('.bp-digit-inner').textContent = to;
    }, 85);
    setTimeout(() => {
      if (flip.parentNode) flip.parentNode.removeChild(flip);
    }, 130);
  }

  function animateTo(target, duration = 210) {
    const startNum = parseInt(current.join(''), 10);
    const steps = 10;
    let frame = 0;
    const stepTime = duration / steps;

    function step() {
      const progress = frame / steps;
      let val = Math.round(startNum + (target - startNum) * progress);
      let strVal = val.toString().padStart(digits, '0').split('');
      for (let i = 0; i < digits; i++) {
        const from = current[i];
        const to = strVal[i];
        if (from !== to) {
          flipDigit(counter.children[i], from, to);
        }
        current[i] = to;
      }
      frame++;
      if (frame <= steps) {
        setTimeout(step, stepTime);
      } else {
        let endStr = target.toString().padStart(digits, '0').split('');
        for (let i = 0; i < digits; i++) {
          counter.children[i].querySelector('.bp-digit-inner').textContent = endStr[i];
          current[i] = endStr[i];
        }
      }
    }
    step();
  }

  animateTo(trees, 210);

  // --- Regen: Logo + Baum-Emojis ---
  const card = widget.querySelector('.bp-card');
  const emojiRain = document.getElementById(emojiRainId);

  let emojiRainTimer = null;
  let runningEmojis = [];

  function startEmojiRain() {
    stopEmojiRain();
    emojiRainTimer = setInterval(() => {
      let rainElem;
      // 60% Chance Regenlogo, 40% Emoji
      if (Math.random() < 0.6) {
        rainElem = document.createElement('img');
        rainElem.src = logoRegenUrl;
        rainElem.className = "bp-logo-rain";
        let size = Math.random() * 12 + 28;
        rainElem.style.width = size + 'px';
        rainElem.style.height = size + 'px';
      } else {
        rainElem = document.createElement('span');
        rainElem.className = "bp-logo-rain";
        rainElem.textContent = Math.random() > 0.5 ? '🌳' : '🌲';
        let size = Math.random() * 12 + 28;
        rainElem.style.fontSize = size + 'px';
      }
      rainElem.style.position = 'absolute';
      rainElem.style.left = (Math.random() * 88 + 4) + '%';
      rainElem.style.top = '-40px';
      rainElem.style.opacity = Math.random() * 0.4 + 0.55;
      rainElem.style.transition = 'top 1.25s linear, opacity 0.9s';
      rainElem.style.pointerEvents = 'none';
      emojiRain.appendChild(rainElem);
      runningEmojis.push(rainElem);

      setTimeout(() => {
        rainElem.style.top = (Math.random() * 50 + 50) + '%';
        rainElem.style.opacity = 0.18 + Math.random() * 0.15;
      }, 30);

      setTimeout(() => {
        if (rainElem.parentNode) rainElem.parentNode.removeChild(rainElem);
        runningEmojis = runningEmojis.filter(e => e !== rainElem);
      }, 1300);
    }, 100);
  }
  function stopEmojiRain() {
    if (emojiRainTimer) clearInterval(emojiRainTimer);
    runningEmojis.forEach(e => e.remove());
    runningEmojis = [];
  }

  card.addEventListener('mouseenter', function() {
    card.classList.add('pulse');
    startEmojiRain();
  });
  card.addEventListener('mouseleave', function() {
    card.classList.remove('pulse');
    stopEmojiRain();
  });

  // Klicken: Link öffnen (ganzes Widget)
  card.addEventListener('click', function() {
    window.open('https://baumpaten-deutschland.de/products/deine-baumpatenschaft', '_blank');
  });
});
