const map = document.getElementById('map');
const viewport = document.getElementById('viewport');
const character = document.getElementById('character');

const joystick = document.getElementById('joystick');
const stick = document.getElementById('stick');

let characterX = 1000; // Character's initial position (center of map)
let characterY = 1000;

let mapX = -1000 + viewport.offsetWidth / 2;
let mapY = -1000 + viewport.offsetHeight / 2;

const moveSpeed = 5; // Movement speed
const mapWidth = 2000; // Map width
const mapHeight = 2000;

let isDragging = false;
let direction = { dx: 0, dy: 0 };

// Define image paths for the animations
const characterFrames = {
  up: ['up_1.png', 'up_2.png', 'up_3.png', 'up_4.png'],
  down: ['down_1.png', 'down_2.png', 'down_3.png', 'down_4.png'],
  left: ['left_1.png', 'left_2.png', 'left_3.png', 'left_4.png'],
  right: ['right_1.png', 'right_2.png', 'right_3.png', 'right_4.png']
};

let currentFrame = 0;
let frameInterval = 200; // Time between frame changes (in milliseconds)
let lastFrameTime = Date.now();
let lastDirectionKey = ''; // Keeps track of the last direction for animations

// Update map and character positions
function updatePosition(dx, dy) {
  characterX += dx;
  characterY += dy;

  // Constrain character within map boundaries
  characterX = Math.max(0, Math.min(characterX, mapWidth));
  characterY = Math.max(0, Math.min(characterY, mapHeight));

  // Update map position
  mapX = -characterX + viewport.offsetWidth / 2;
  mapY = -characterY + viewport.offsetHeight / 2;

  // Constrain map within viewport
  mapX = Math.min(0, Math.max(mapX, viewport.offsetWidth - mapWidth));
  mapY = Math.min(0, Math.max(mapY, viewport.offsetHeight - mapHeight));

  // Apply transformations
  map.style.transform = `translate(${mapX}px, ${mapY}px)`;
}

// Continuous movement logic
function moveCharacter() {
  if (isDragging && (direction.dx !== 0 || direction.dy !== 0)) {
    updatePosition(direction.dx * moveSpeed, direction.dy * moveSpeed);

    // Determine primary direction based on dominant movement axis
    let directionKey = '';

    if (Math.abs(direction.dx) > Math.abs(direction.dy)) {
      // Horizontal movement dominates
      directionKey = direction.dx > 0 ? 'right' : 'left';
    } else {
      // Vertical movement dominates
      directionKey = direction.dy > 0 ? 'down' : 'up';
    }

    // Change the character image based on direction and frame
    if (directionKey) {
      const frames = characterFrames[directionKey];

      // Update frame at regular intervals or on direction change
      if (Date.now() - lastFrameTime >= frameInterval || lastDirectionKey !== directionKey) {
        currentFrame = (currentFrame + 1) % frames.length;
        character.src = frames[currentFrame];
        lastFrameTime = Date.now();
        lastDirectionKey = directionKey;
      }
    }
  }

  requestAnimationFrame(moveCharacter);
}

// Start the movement loop
moveCharacter();

// Joystick functionality
joystick.addEventListener('mousedown', (e) => {
  isDragging = true;
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  const rect = joystick.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const dx = e.clientX - centerX;
  const dy = e.clientY - centerY;

  // Calculate movement direction
  const magnitude = Math.sqrt(dx * dx + dy * dy);
  direction.dx = dx / magnitude || 0;
  direction.dy = dy / magnitude || 0;

  // Update stick position
  const maxDistance = 50; // Max stick movement radius
  const distance = Math.min(maxDistance, magnitude);
  const angle = Math.atan2(dy, dx);
  stick.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  direction = { dx: 0, dy: 0 };
  stick.style.transform = `translate(0px, 0px)`;

  // Reset to the first frame of the last direction
  if (lastDirectionKey) {
    character.src = characterFrames[lastDirectionKey][0];
  }
});

// Mobile touch support
joystick.addEventListener('touchstart', (e) => {
  isDragging = true;
});

document.addEventListener('touchmove', (e) => {
  if (!isDragging) return;

  const touch = e.touches[0];
  const rect = joystick.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const dx = touch.clientX - centerX;
  const dy = touch.clientY - centerY;

  // Calculate movement direction
  const magnitude = Math.sqrt(dx * dx + dy * dy);
  direction.dx = dx / magnitude || 0;
  direction.dy = dy / magnitude || 0;

  // Update stick position
  const maxDistance = 50; // Max stick movement radius
  const distance = Math.min(maxDistance, magnitude);
  const angle = Math.atan2(dy, dx);
  stick.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
});

document.addEventListener('touchend', () => {
  isDragging = false;
  direction = { dx: 0, dy: 0 };
  stick.style.transform = `translate(0px, 0px)`;

  // Reset to the first frame of the last direction
  if (lastDirectionKey) {
    character.src = characterFrames[lastDirectionKey][0];
  }
});
