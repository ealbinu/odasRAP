window.human = false;

var canv = document.createElement('canvas');
canv.setAttribute('class', 'fireworks');
document.body.appendChild(canv);

var canvasEl = document.querySelector('.fireworks');
var ctx = canvasEl.getContext('2d');

var numberOfParticules = 10;
var pointerX = 0;
var pointerY = 0;
var tap = ('ontouchstart' in window || navigator.msMaxTouchPoints) ? 'touchstart' : 'mousedown';
var colors = ['#5EB246', '#35BCE1', '#DB3E34', '#E7792C'];

function setCanvasSize() {
    canvasEl.width = window.innerWidth * 2;
    canvasEl.height = window.innerHeight * 2;
    canvasEl.style.width = window.innerWidth + 'px';
    canvasEl.style.height = window.innerHeight + 'px';
    canvasEl.getContext('2d').scale(2, 2);
}

function updateCoords(e) {
  pointerX = e.clientX || e.touches[0].clientX;
  pointerY = e.clientY || e.touches[0].clientY;
}

function setParticuleDirection(p) {
  var angle = anime.random(0, 360) * Math.PI / 180;
  var value = anime.random(50, 180);
  var radius = [-1, 1][anime.random(0, 1)] * value;
  return {
    x: p.x + radius * Math.cos(angle),
    y: p.y + radius * Math.sin(angle)
  }
}

function createParticule(x,y, maxsize, onecolor) {
  var maximumSize = maxsize ? maxsize : 20
  var p = {};
  p.x = x;
  p.y = y;
  p.color = onecolor ? onecolor : (colors[anime.random(0, colors.length - 1)]);
  p.radius = anime.random(6, maximumSize);
  p.endPos = setParticuleDirection(p);
  p.draw = function() {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
    ctx.fillStyle = p.color;
    ctx.fill();
  }
  return p;
}



function renderParticule(anim) {
  for (var i = 0; i < anim.animatables.length; i++) {
    anim.animatables[i].target.draw();
  }
}

function animateParticules(x, y, numParticles, maxtime, maxsize, onecolor) {
  var numberParticles = numParticles ? numParticles : numberOfParticules
  var maximumTime = maxtime ? maxtime : 1800
  var maximumSize = maxsize ? maxsize : 20
  var particules = [];
  for (var i = 0; i < numberParticles; i++) {
    particules.push(createParticule(x, y, maximumSize, onecolor));
  }
  anime.timeline().add({
    targets: particules,
    x: function(p) { return p.endPos.x; },
    y: function(p) { return p.endPos.y; },
    radius: 0.1,
    duration: anime.random(1200, maximumTime),
    easing: 'easeOutExpo',
    update: renderParticule
  });
}

var render = anime({
  duration: Infinity,
  update: function() {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  }
});

document.addEventListener(tap, function(e) {
  window.human = true;
  render.play();
  updateCoords(e);
  animateParticules(pointerX, pointerY);
}, false);

var centerX = window.innerWidth / 2;
var centerY = window.innerHeight / 2;

function autoClick() {
  if (window.human) return;
  animateParticules(
    anime.random(centerX-50, centerX+50), 
    anime.random(centerY-50, centerY+50)
  );
  anime({duration: 200}).finished.then(autoClick);
}

setCanvasSize();
window.addEventListener('resize', setCanvasSize, false);