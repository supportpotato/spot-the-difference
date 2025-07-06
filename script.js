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

  function resizeCan

