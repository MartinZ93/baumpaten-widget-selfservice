window.addEventListener('DOMContentLoaded', function() {
  var widget = document.getElementById('baumpaten-widget');
  if (!widget) return;

  var trees = parseInt(widget.getAttribute('data-trees')) || 0;
  var headline = widget.getAttribute('data-headline') || 'Wir sind Baumpate';
  var label = widget.getAttribute('data-label') || 'Bäume bereits gepflanzt';

  // Absoluter Pfad zu deinem Logo!
  var logoUrl = 'https://martinz93.github.io/baumpaten-widget-selfservice/logoneu.svg';

  function logoImgHtml() {
    return `<img src="${logoUrl}" alt="Baumpaten Logo" class="bp-logo" />`;
  }

  // Emoji-Regen-Container (kommt ganz oben)
  let emojiRainId = 'emoji-rain-' + Math.floor(Math.random() * 100000);
  widget.innerHTML = `
    <div class="bp-emoji-rain" id="${emojiRainId}"></div>
    <div class="bp-card" id="bp-card-main">
      <div class="bp-logo-box">
        ${logoImgHtml()}
      </div>
      <div class="bp-headline">${headline}</div>
      <div class="bp-counter-row"></div>
      <div class="bp-counter-label">${label}</div>
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

  // Mouseover Pulse & Emoji Regen
  const card = widget.querySelector('.bp-card');
  const emojiRain = document.getElementById(emojiRainId);

  let emojiRainTimer = null;
  let runningEmojis = [];

  function startEmojiRain() {
    stopEmojiRain();
    emojiRainTimer = setInterval(() => {
      let emoji = document.createElement('span');
      emoji.textContent = Math.random() < 0.15 ? '🌲' : '🌳';
      emoji.style.position = 'absolute';
      emoji.style.left = (Math.random() * 90 + 2) + '%';
      emoji.style.top = '-40px';
      emoji.style.fontSize = (Math.random() * 18 + 24) + 'px';
      emoji.style.opacity = Math.random() * 0.4 + 0.6;
      emoji.style.transition = 'top 1.2s linear, opacity 0.7s';
      emoji.style.pointerEvents = 'none';
      emojiRain.appendChild(emoji);
      runningEmojis.push(emoji);

      setTimeout(() => {
        emoji.style.top = (Math.random() * 50 + 50) + '%';
        emoji.style.opacity = 0.2 + Math.random() * 0.15;
      }, 30);

      setTimeout(() => {
        if (emoji.parentNode) emoji.parentNode.removeChild(emoji);
        runningEmojis = runningEmojis.filter(e => e !== emoji);
      }, 1300);
    }, 110);
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
