window.addEventListener('DOMContentLoaded', function() {
  var widget = document.getElementById('baumpaten-widget');
  if (!widget) return;
  var trees = parseInt(widget.getAttribute('data-trees')) || 0;
  var size = widget.getAttribute('data-size') || 'standard';

  widget.classList.add('bpw-' + size);

  // Widget-Container bauen, jetzt mit deinem SVG-Logo!
  widget.innerHTML = `
    <div class="bpw-rahmen">
      <div class="bpw-content">
        <div class="bpw-gemeinsam">Gemeinsam mit</div>
        <img src="https://martinz93.github.io/baumpaten-widget-selfservice/Design%20ohne%20Titel%20(4).svg" alt="Baumpaten Logo" class="bpw-logo" />
        <div class="bpw-headline">Gepflanzte Bäume</div>
        <div class="bpw-counter"></div>
      </div>
    </div>
  `;

  // Flip Counter inside .bpw-counter
  var counter = widget.querySelector('.bpw-counter');
  var digits = trees.toString().length;
  let current = Array(digits).fill(0);

  // Build digits
  counter.innerHTML = '';
  for (let i = 0; i < digits; i++) {
      const digit = document.createElement('div');
      digit.className = 'bpw-flip-digit';
      digit.innerHTML = `<span class="bpw-digit-inner">0</span>`;
      counter.appendChild(digit);
  }

  // Flip-Animation
  function flipDigit(digitEl, from, to) {
      if (from === to) return;
      const flip = document.createElement('span');
      flip.className = 'bpw-flip';
      flip.textContent = from;
      digitEl.appendChild(flip);

      setTimeout(() => {
          flip.style.transform = 'rotateX(-90deg)';
          flip.style.opacity = 0;
          digitEl.querySelector('.bpw-digit-inner').textContent = to;
      }, 120);
      setTimeout(() => {
          if (flip.parentNode) flip.parentNode.removeChild(flip);
      }, 180);
  }

  function animateTo(target, duration = 500) {
      const startNum = parseInt(current.join(''), 10);
      const steps = 25;
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
                  counter.children[i].querySelector('.bpw-digit-inner').textContent = endStr[i];
                  current[i] = endStr[i];
              }
          }
      }
      step();
  }

  animateTo(trees, 500);

  // Optional: Ganzes Widget klickbar machen
  widget.querySelector('.bpw-rahmen').onclick = function() {
      window.open('https://baumpaten-deutschland.de/products/deine-baumpatenschaft', '_blank');
  }
});
