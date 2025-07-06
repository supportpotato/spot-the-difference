// Ensure this is the very first line of your script.js file.
console.log("script.js loaded and running!");

// ========== CONFIGURATION ==========
// Replace these with your actual image names and difference data!
const levels = [
  {
    images: {
      a: 'assets/level1_a.jpeg',
      b: 'assets/level1_b.jpeg'
    },
    differences: [
      // IMPORTANT: Replace these with your actual difference coordinates and radii!
      // Example: { x: 120, y: 80, radius: 25 },
      // Add your difference data here. Each object represents one clickable difference.
      // For example, if you found a difference at x=250, y=180, and want a 30px radius:
      // { x: 250, y: 180, radius: 30 },
      // Make sure to populate this array with ALL your actual differences for level 1!
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
  // Add more levels as needed
];

// ========== GAME LOGIC ==========

let currentLevel = 0;
let found = []; // Stores the indices of differences that have been found
let score = 0;
const scoreDisplay = document.getElementById('score');
if (dist <= diff.radius) {
  found.push(idx);
  hit = true;
  score += 10; // Add 10 points for each correct click
  scoreDisplay.textContent = `Score: ${score}`;
}
if (found.length === level.differences.length) {
  feedback.textContent = 'Level complete!';
  document.getElementById('final-message').style.display = 'block';
  nextLevelBtn.style.display = (currentLevel < levels.length - 1) ? 'inline-block' : 'none';
}

const imageA = document.getElementById('imageA');
const imageB = document.getElementById('imageB');
const canvasB = document.getElementById('canvasB');
const feedback = document.getElementById('feedback');
const nextLevelBtn = document.getElementById('next-level');

// Helper: adjust canvas size to match image display size
function resizeCanvasToImage() {
  const img = imageB;
  const canvas = canvasB;

  // Ensure image has loaded and has natural dimensions before resizing canvas
  if (img.naturalWidth === 0 || img.naturalHeight === 0) {
      console.warn("Image B natural dimensions are 0. Canvas not resized.");
      return; // Exit if image dimensions aren't ready
  }

  // Set canvas internal size to natural image size (pixel perfect for drawing)
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  // Set canvas display size to match rendered image size (CSS-controlled size)
  // offsetWidth/offsetHeight give the actual rendered size of the HTML element
  canvas.style.width = (img.offsetWidth + 1) + "px";
  canvas.style.height = (img.offsetHeight + 1) + "px";

  console.log(`Canvas resized to: ${canvas.width}x${canvas.height} (internal), ${canvas.style.width}x${canvas.style.height} (display)`);
  drawFound(); // Redraw differences after resizing
}

// Redraw canvas on window resize or image load
window.addEventListener('resize', resizeCanvasToImage);

/**
 * Loads a specific level, resetting game state and images.
 * @param {number} levelIdx The index of the level to load from the 'levels' array.
 */
function loadLevel(levelIdx) {
  found = []; // Reset found differences for the new level
  feedback.textContent = ''; // Clear feedback message
  nextLevelBtn.style.display = 'none'; // Hide next level button

  const level = levels[levelIdx]; // Get the current level data

  // Set source for image A
  imageA.src = level.images.a;

  // Clear any previous onload handlers for imageB to prevent multiple calls
  imageB.onload = null;

  // Assign the onload handler for imageB. This will run when the image finishes loading.
  imageB.onload = () => {
    console.log("Image B loaded!");
    resizeCanvasToImage(); // Resize canvas to match the loaded image
    clearCanvas(); // Clear any previous drawings on the canvas
    drawFound(); // Draw any already found differences (if applicable, e.g., on level reload)
  };

  // Set the source for image B. This action triggers the image loading.
  imageB.src = level.images.b;

  // Handle the case where the image might already be complete (e.g., from browser cache).
  // In this scenario, the onload event might not fire, so we manually call the handler.
  if (imageB.complete) {
      console.log("Image B already complete (from cache or very fast load). Manually triggering resize.");
      imageB.onload(); // Directly call the onload handler logic
  }

  // Ensure canvas visibility based on whether there are differences defined for the level
  if (!level.differences || level.differences.length === 0) {
    canvasB.style.display = "none";
  } else {
    canvasB.style.display = "block";
  }
}

/**
 * Clears the entire canvas, making it transparent.
 */
function clearCanvas() {
  const ctx = canvasB.getContext('2d');
  ctx.clearRect(0, 0, canvasB.width, canvasB.height);
}

/**
 * Draws circles around the differences that have been found.
 */
function drawFound() {
  const ctx = canvasB.getContext('2d');
  clearCanvas(); // Always clear the canvas before redrawing to avoid overlapping circles

  const level = levels[currentLevel];

  // If no differences are defined for the current level, hide the canvas.
  // Otherwise, ensure it's visible.
  if (!level.differences || level.differences.length === 0) {
    canvasB.style.display = "none";
    console.log("Canvas display set to none (no differences defined)");
    return;
  } else {
    canvasB.style.display = "block";
    console.log("Canvas display set to block (has differences)");
  }

  // This loop iterates through the 'found' array (which contains indices of found differences)
  found.forEach(idx => {
    const diff = level.differences[idx]; // Get the difference object from the current level's data
    ctx.beginPath(); // Start a new drawing path
    // Draw a circle (arc) using the difference's x, y, and radius
    ctx.arc(diff.x, diff.y, diff.radius, 0, 2 * Math.PI);
    ctx.lineWidth = 4; // Set the thickness of the circle's outline
    ctx.strokeStyle = 'rgba(76, 175, 80, 0.7)'; // Set the color of the circle (green with 70% opacity)
    ctx.stroke(); // Draw the outline of the circle
  });
}

// Event listener for clicks on the canvas (imageB)
canvasB.addEventListener('click', function(e) {
  // console.log("Click event detected on canvasB!"); // Temporarily removed for full game logic

  const rect = canvasB.getBoundingClientRect(); // Get the size and position of the canvas on screen

  // Check if canvas dimensions are valid to prevent division by zero
  if (canvasB.width === 0 || canvasB.height === 0) {
      console.warn("Canvas dimensions are 0, cannot process click.");
      return;
  }

  // Calculate scaling factors to convert screen coordinates to image pixel coordinates
  const scaleX = canvasB.width / rect.width;
  const scaleY = canvasB.height / rect.height;

  // Calculate the click coordinates relative to the image's natural pixel size
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;

  // console.log(`Clicked at: x=${Math.round(x)}, y=${Math.round(y)}`); // Temporarily removed for full game logic

  const level = levels[currentLevel];

  // If no differences are defined for this level, provide feedback and exit
  if (!level.differences || level.differences.length === 0) {
      feedback.textContent = 'No differences defined for this level.';
      return;
  }

  let hit = false; // Flag to track if a difference was found in this click

  // Iterate through all differences for the current level
  level.differences.forEach((diff, idx) => {
    // Only check differences that haven't been found yet
    if (!found.includes(idx)) {
      // Calculate the distance between the click point and the center of the difference
      const dist = Math.sqrt((x - diff.x) ** 2 + (y - diff.y) ** 2);
      // If the click is within the difference's radius, it's a hit
      if (dist <= diff.radius) {
        found.push(idx); // Add the index of the found difference to the 'found' array
        hit = true; // Set hit flag to true
      }
    }
  });

  // Provide feedback based on whether a difference was hit
  if (hit) {
    feedback.textContent = 'Correct!';
    drawFound(); // Redraw canvas to show the newly found difference
    // Check if all differences for the level have been found
    if (found.length === level.differences.length) {
      feedback.textContent = 'Level complete!';
      // Show next level button if there are more levels, otherwise hide it
      nextLevelBtn.style.display = (currentLevel < levels.length - 1) ? 'inline-block' : 'none';
    }
  } else {
    feedback.textContent = 'Try again!'; // Incorrect click
  }
});

// Event listener for the "Next Level" button
nextLevelBtn.addEventListener('click', () => {
  currentLevel++; // Increment level counter
  // Load the next level if it exists, otherwise provide completion message
  if (currentLevel < levels.length) {
    loadLevel(currentLevel);
  } else {
    feedback.textContent = 'You completed all levels!';
    nextLevelBtn.style.display = 'none'; // Hide button if no more levels
  }
});

// Initial load of the first level when the window finishes loading
window.onload = () => {
  loadLevel(currentLevel);
};
