// ========== CONFIGURATION ==========
// Add your image pairs and their differences here
const levels = [
  {
    images: {
      a: 'assets/level1_a.jpeg',
      b: 'assets/level1_b.jpeg'
    },
    differences: [
      // Each difference is a circle: { x, y, radius }
      // Coordinates are relative to imageB (canvas), in pixels
      { x: 120, y: 80, radius: 25 },
      { x: 300, y: 220, radius: 20 }
    ]
  }
  // Add more levels as needed
];

// ========== GAME LOGIC ==========

let currentLevel = 0;
let found = [];
const imageB = document.getElementById('imageB');
const canvasB = document.getElementById('canvasB');
const feedback = document.getElementById('feedback');
const nextLevelBtn = document.getElementById('next-level');

function loadLevel(levelIdx) {
  found = [];
  feedback.textContent = '';
  nextLevelBtn.style.display = 'none';
  const level = levels[levelIdx];
  document.getElementById('imageA').src = level.images.a;
  imageB.src = level.images.b;
  imageB.onload = () => {
    canvasB.width = imageB.width;
    canvasB.height = imageB.height;
    canvasB.style.width = imageB.style.width;
    canvasB.style.height = imageB.style.height;
    clearCanvas();
  };
}

function clearCanvas() {
  const ctx = canvasB.getContext('2d');
  ctx.clearRect(0, 0, canvasB.width, canvasB.height);
}

function drawFound() {
  const ctx = canvasB.getContext('2d');
  clearCanvas();
  const level = levels[currentLevel];
  found.forEach(idx => {
    const diff = level.differences[idx];
    ctx.beginPath();
    ctx.arc(diff.x, diff.y, diff.radius, 0, 2 * Math.PI);
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(76, 175, 80, 0.7)';
    ctx.stroke();
  });
}

canvasB.addEventListener('click', function(e) {
  const rect = canvasB.getBoundingClientRect();
  const scaleX = canvasB.width / rect.width;
  const scaleY = canvasB.height / rect.height;
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
      }
    }
  });

  if (hit) {
    feedback.textContent = 'Correct!';
    drawFound();
    if (found.length === level.differences.length) {
      feedback.textContent = 'Level complete!';
      nextLevelBtn.style.display = (currentLevel < levels.length - 1) ? 'inline-block' : 'none';
    }
  } else {
    feedback.textContent = 'Try again!';
  }
});

nextLevelBtn.addEventListener('click', () => {
  currentLevel++;
  loadLevel(currentLevel);
});

// Initial load
window.onload = () => {
  loadLevel(currentLevel);
};