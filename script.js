console.log("script.js loaded!");

const levels = [
  {
    images: {
      a: 'assets/level1_a.jpeg',
      b: 'assets/level1_b.jpeg'
    },
    differences: [
      {x: 394, y: 274, radius: 30},
      {x: 868, y: 542, radius: 30},
      {x: 1108, y: 268, radius: 30},
      {x: 1402, y: 300, radius: 30},
      {x: 1489, y: 440, radius: 30},
      {x: 1081, y: 575, radius: 30},
      {x: 1070, y: 843, radius: 30},
      {x: 1740, y: 924, radius: 30},
      {x: 1860, y: 1005, radius: 30},
      {x: 2219, y: 935, radius: 30},
      {x: 1805, y: 1343, radius: 30},
      {x: 950, y: 1284, radius: 30},
      {x: 514, y: 1193, radius: 30},
      {x: 182, y: 1064, radius: 30},
      {x: 263, y: 768, radius: 30}
    ]
  }
];

let currentLevel = 0;
let found = [];
let score = 0;

window.onload = () => {
  const imageA = document.getElementById('imageA');
  const imageB = document.getElementById('imageB');
  const canvasA = document.getElementById('canvasA');
  const canvasB = document.getElementById('canvasB');
  const feedback = document.getElementById('feedback');
  const scoreDisplay = document.getElementById('score');
  const nextLevelBtn = document.getElementById('next-level');
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
        const diff = levels[currentLevel].differences[idx];
        ctx.beginPath();
        ctx.arc(diff.x, diff.y, diff.radius, 0, 2 * Math.PI);
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

    const level = levels[currentLevel];
    let hit = false;

    level.differences.forEach((diff, idx) => {
      if (!found.includes(idx)) {
        const dist = Math.sqrt((x - diff.x) ** 2 + (y - diff.y) ** 2);
      if (dist <= diff.radius) {
        found.push(idx);
        hit = true;
        score += 10;
        scoreDisplay.textContent = `Score: ${score}`;
      }

      }
    });

    if (hit) {
      feedback.textContent = 'Correct!';
      drawFoundCircles();
      if (found.length === level.differences.length) {
        feedback.textContent = 'Level complete!';
        finalMessage.style.display = 'block';
        nextLevelBtn.style.display = (currentLevel < levels.length - 1) ? 'inline-block' : 'none';
      }
    } else {
      feedback.textContent = 'Try again!';
    }
  }

  function loadLevel(levelIdx) {
    const level = levels[levelIdx];
    imageA.src = level.images.a;
    imageB.src = level.images.b;
    found = [];
    feedback.textContent = '';
    finalMessage.style.display = 'none';
    nextLevelBtn.style.display = 'none';

    function onImageLoad() {
      resizeCanvas(canvasA, imageA);
      resizeCanvas(canvasB, imageB);
      drawFoundCircles();
    }

    imageB.onload = imageA.onload = onImageLoad;

    if (imageA.complete && imageB.complete) {
      onImageLoad();
    }
  }

  canvasA.addEventListener('click', (e) => handleClick(e, canvasA));
  canvasB.addEventListener('click', (e) => handleClick(e, canvasB));

  nextLevelBtn.addEventListener('click', () => {
    currentLevel++;
    if (currentLevel < levels.length) {
      loadLevel(currentLevel);
    } else {
      feedback.textContent = 'You completed all levels!';
      nextLevelBtn.style.display = 'none';
    }
  });

  loadLevel(currentLevel);
};

