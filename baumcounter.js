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

  widget.innerHTML = `
    <div class="bp-card" id="bp-card-main">
      <div class="bp-headline">${headline}</div>
      <div class="bp-counter-row"></div>
      <div class="bp-counter-label">${label}</div>
      <div class="bp-logo-box">
        ${logoImgHtml()}
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

  // Mouseover Pulse
  const card = widget.querySelector('.bp-card');
  card.addEventListener('mouseenter', function() {
    card.classList.add('pulse');
  });
  card.addEventListener('mouseleave', function() {
    card.classList.remove('pulse');
  });

  // Klicken: Link öffnen (ganzes Widget)
  card.addEventListener('click', function() {
    window.open('https://baumpaten-deutschland.de/products/deine-baumpatenschaft', '_blank');
  });
});
