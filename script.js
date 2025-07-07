console.log("script.js loaded!");

const level = {
  images: {
    a: 'assets/level1_a.jpeg',
    b: 'assets/level1_b.jpeg'
  },
  differences: [
    {x: 394, y: 300, radius: 50}, // circle
    {x: 868, y: 542, radius: 50}, // lil circles
    {x: 1108, y: 268, radius: 50}, // mcpickle
    {x: 1402, y: 300, radius: 50}, // date
    {x: 1525, y: 440, radiusX: 70, radiusY: 25, shape: 'oval' }, // day, wide oval
    {x: 1081, y: 575, radius: 50}, // clear
    {x: 1200, y: 850, radiusX: 150, radiusY: 50, shape: 'oval' }, // signature, wide oval
    {x: 1750, y: 950, radius: 50}, // trash
    {x: 1900, y: 1100, radiusX: 200, radiusY: 75, shape: 'oval' }, // chain, wide oval
    {x: 2219, y: 935, radius: 150}, // cat
    {x: 2100, y: 1550, radiusX: 700, radiusY: 250, shape: 'oval' }, // chair, wide oval
    {x: 950, y: 1284, radius: 100}, // guinea
    {x: 514, y: 1193, radius: 100}, // chips
    {x: 182, y: 1200, radiusX: 200, radiusY: 400, shape: 'oval' }, // cup, tall oval
    {x: 263, y: 768, radius: 50} // straw
  ]
};

let found = [];
let score = 0;

window.onload = () => {
  const imageA = document.getElementById('imageA');
  const imageB = document.getElementById('imageB');
  const canvasA = document.getElementById('canvasA');
  const canvasB = document.getElementById('canvasB');
  const feedback = document.getElementById('feedback');
  const scoreDisplay = document.getElementById('score');
  const finalMessage = document.getElementById('final-message');

  function resizeCanvas(canvas, image) {
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    canvas.style.width = image.offsetWidth + "px";
    canvas.style.height = image.offsetHeight + "px";
  }

  function drawFoundCircles() {
    [canvasA, canvasB].forEach(canvas => {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      found.forEach(idx => {
        const diff = level.differences[idx];
        ctx.beginPath();
        if (diff.shape === 'oval') {
          ctx.ellipse(
            diff.x,
            diff.y,
            diff.radiusX || 30,
            diff.radiusY || 30,
            0,
            0,
            2 * Math.PI
          );
        } else {
          ctx.arc(diff.x, diff.y, diff.radius || 30, 0, 2 * Math.PI);
        }
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(76, 175, 80, 0.7)';
        ctx.stroke();
      });
    });
  }

  function handleClick(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    let hit = false;

    level.differences.forEach((diff, idx) => {
      if (!found.includes(idx)) {
        if (diff.shape === 'oval') {
          const rx = diff.radiusX || 30;
          const ry = diff.radiusY || 30;
          const dx = x - diff.x;
          const dy = y - diff.y;
          const inside = ((dx * dx) / (rx * rx)) + ((dy * dy) / (ry * ry)) <= 1;
          if (inside) {
            found.push(idx);
            hit = true;
            score += 1;
            scoreDisplay.textContent = `Score: ${score}`;
          }
        } else {
          const dist = Math.sqrt((x - diff.x) ** 2 + (y - diff.y) ** 2);
          if (dist <= diff.radius) {
            found.push(idx);
            hit = true;
            score += 1;
            scoreDisplay.textContent = `Score: ${score}`;
          }
        }
      }
    });

    if (hit) {
      feedback.textContent = '✅ Correct!';
      drawFoundCircles();
      if (found.length === level.differences.length) {
        feedback.textContent = '';
        finalMessage.style.display = 'block';
      }
    }
  }

  function loadLevel() {
    found = [];
    score = 0;
    feedback.textContent = '';
    finalMessage.style.display = 'none';
    scoreDisplay.textContent = `Score: ${score}`;

    imageA.onload = () => resizeCanvas(canvasA, imageA);
    imageB.onload = () => resizeCanvas(canvasB, imageB);

    imageA.src = level.images.a;
    imageB.src = level.images.b;
  }

  canvasA.addEventListener('click', e => handleClick(e, canvasA));
  canvasB.addEventListener('click', e => handleClick(e, canvasB));

  loadLevel();
};

