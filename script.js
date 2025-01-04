const map = document.getElementById('map');
const viewport = document.getElementById('viewport');
const character = document.getElementById('character');
const joystick = document.getElementById('joystick');
const stick = document.getElementById('stick');

// Initial positions and settings
let characterX = 1000, characterY = 1000;
let mapX = -1000 + viewport.offsetWidth / 2;
let mapY = -1000 + viewport.offsetHeight / 2;
const moveSpeed = 5, mapWidth = 2000, mapHeight = 2000;

let isDragging = false, direction = { dx: 0, dy: 0 };
let currentFrame = 0, lastFrameTime = Date.now(), lastDirectionKey = '';
const frameInterval = 200;

// Preload character animation frames
const characterFrames = {
  up: ['up_1.png', 'up_2.png', 'up_3.png', 'up_4.png'],
  down: ['down_1.png', 'down_2.png', 'down_3.png', 'down_4.png'],
  left: ['left_1.png', 'left_2.png', 'left_3.png', 'left_4.png'],
  right: ['right_1.png', 'right_2.png', 'right_3.png', 'right_4.png']
};

// Preload images
Object.values(characterFrames).flat().forEach(src => {
  const img = new Image();
  img.src = src;
});

// Update character and map positions
function updatePosition(dx, dy) {
  characterX = Math.max(0, Math.min(characterX + dx, mapWidth));
  characterY = Math.max(0, Math.min(characterY + dy, mapHeight));

  mapX = Math.min(0, Math.max(-characterX + viewport.offsetWidth / 2, viewport.offsetWidth - mapWidth));
  mapY = Math.min(0, Math.max(-characterY + viewport.offsetHeight / 2, viewport.offsetHeight - mapHeight));

  map.style.transform = `translate(${mapX}px, ${mapY}px)`;
}

// Animation logic
function moveCharacter() {
  if (isDragging && (direction.dx || direction.dy)) {
    updatePosition(direction.dx * moveSpeed, direction.dy * moveSpeed);

    let directionKey = '';
    if (Math.abs(direction.dx) > Math.abs(direction.dy)) {
      directionKey = direction.dx > 0 ? 'right' : 'left';
    } else {
      directionKey = direction.dy > 0 ? 'down' : 'up';
    }

    if (directionKey && (Date.now() - lastFrameTime >= frameInterval || lastDirectionKey !== directionKey)) {
      currentFrame = (currentFrame + 1) % characterFrames[directionKey].length;
      character.src = characterFrames[directionKey][currentFrame];
      lastFrameTime = Date.now();
      lastDirectionKey = directionKey;
    }
  }
  requestAnimationFrame(moveCharacter);
}

// Joystick logic
joystick.addEventListener('mousedown', () => { isDragging = true; });
document.addEventListener('mousemove', e => handleJoystick(e));
document.addEventListener('mouseup', () => resetJoystick());

joystick.addEventListener('touchstart', () => { isDragging = true; });
document.addEventListener('touchmove', e => handleJoystick(e.touches[0]));
document.addEventListener('touchend', () => resetJoystick());

function handleJoystick(e) {
  if (!isDragging) return;
  const rect = joystick.getBoundingClientRect();
  const dx = e.clientX - (rect.left + rect.width / 2);
  const dy = e.clientY - (rect.top + rect.height / 2);
  const magnitude = Math.sqrt(dx * dx + dy * dy);

  direction.dx = dx / magnitude || 0;
  direction.dy = dy / magnitude || 0;

  const distance = Math.min(50, magnitude);
  const angle = Math.atan2(dy, dx);
  stick.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
}

function resetJoystick() {
  isDragging = false;
  direction = { dx: 0, dy: 0 };
  stick.style.transform = `translate(0px, 0px)`;
  if (lastDirectionKey) {
    character.src = characterFrames[lastDirectionKey][0];
  }
}

// Start animation loop
moveCharacter();
