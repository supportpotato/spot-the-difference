// ========== CONFIGURATION ==========
// Replace these with your actual image names and difference data!
const levels = [
  {
    images: {
      a: 'assets/level1_a.jpeg',
      b: 'assets/level1_b.jpeg'
    },
    differences: [
      // Example: { x: 120, y: 80, radius: 25 },
      // Add your difference data here
      // For testing, let's add a dummy difference if it's empty
      { x: 100, y: 100, radius: 20 }
    ]
  }
  // Add more levels as needed
];

// ========== GAME LOGIC ==========

let currentLevel = 0;
let found = [];
const imageA = document.getElementById('imageA');
const imageB = document.getElementById('imageB');
const canvasB = document.getElementById('canvasB');
const feedback = document.getElementById('feedback');
const nextLevelBtn = document.getElementById('next-level');

// Helper: adjust canvas size to match image display size
function resizeCanvasToImage() {
  const img = imageB;
  const canvas = canvasB;

  if (img.naturalWidth === 0 || img.naturalHeight === 0) {
      console.warn("Image B natural dimensions are 0. Canvas not resized.");
      return;
  }

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  canvas.style.width = img.offsetWidth + "px";
  canvas.style.height = img.offsetHeight + "px";

  console.log(`Canvas resized to: ${canvas.width}x${canvas.height} (internal), ${canvas.style.width}x${canvas.style.height} (display)`);
  drawFound(); // Call drawFound after resize
}

// Redraw canvas on window resize or image load
window.addEventListener('resize', resizeCanvasToImage);

function loadLevel(levelIdx) {
  found = [];
  feedback.textContent = '';
  nextLevelBtn.style.display = 'none';
  const level = levels[levelIdx];

  imageA.src = level.images.a;

  imageB.onload = null; // Clear previous handlers

  imageB.onload = () => {
    console.log("Image B loaded!");
    resizeCanvasToImage();
    // clearCanvas(); // TEMPORARILY COMMENT THIS OUT FOR TESTING
    drawFound();
  };

  imageB.src = level.images.b;

  if (imageB.complete) {
      console.log("Image B already complete (from cache or very fast load). Manually triggering resize.");
      imageB.onload();
  }

  // Ensure canvas visibility based on differences
  // This is now handled by drawFound()
}

function clearCanvas() {
  const ctx = canvasB.getContext('2d');
  ctx.clearRect(0, 0, canvasB.width, canvasB.height);
}

// *** TEMPORARILY MODIFIED drawFound() TO DO MINIMAL WORK ***
function drawFound() {
  // const ctx = canvasB.getContext('2d'); // Don't even get context for this test
  // clearCanvas(); // Don't clear for this test, as it's commented out in onload

  const level = levels[currentLevel];
  // If no differences, hide canvas. Otherwise, ensure it's visible.
  if (!level.differences || level.differences.length === 0) {
    canvasB.style.display = "none";
    console.log("Canvas display set to none (no differences)");
    return;
  } else {
    canvasB.style.display = "block";
    console.log("Canvas display set to block (has differences)");
  }

  // *** ALL ACTUAL DRAWING CODE IS COMMENTED OUT FOR THIS TEST ***
  /*
  found.forEach(idx => {
    const diff = level.differences[idx];
    ctx.beginPath();
    ctx.arc(diff.x, diff.y, diff.radius, 0, 2 * Math.PI);
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(76, 175, 80, 0.7)';
    ctx.stroke();
  });
  */
}
// *** END TEMPORARY MODIFICATION ***


canvasB.addEventListener('click', function(e) {
  const rect = canvasB.getBoundingClientRect();
  if (canvasB.width === 0 || canvasB.height === 0) {
      console.warn("Canvas dimensions are 0, cannot process click.");
      return;
  }
  const scaleX = canvasB.width / rect.width;
  const scaleY = canvasB.height / rect.height;
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;

  const level = levels[currentLevel];
  if (!level.differences || level.differences.length === 0) {
      feedback.textContent = 'No differences defined for this level.';
      return;
  }

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
  if (currentLevel < levels.length) {
    loadLevel(currentLevel);
  } else {
    feedback.textContent = 'You completed all levels!';
    nextLevelBtn.style.display = 'none';
  }
});

// Initial load
window.onload = () => {
  loadLevel(currentLevel);
};
