const gameArea = document.getElementById('gamePlay');

const pcts = ["+1%", "+5%", "+10%", "-1%", "-5%", "-10%"];

const fallIntervals = new Map ();

function spawnItem() {
    const label = pcts[Math.floor(Math.random() * pcts.length)];

    const item = document.createElement('div');
    item.classList.add('item');
    item.textContent = label;

    if (label.startsWith('-')) {
        item.style.background = '#e63946';
        item.style.color = 'white';
    }

    item.style.left = Math.random() * 85 + '%';
    item.style.top = '0px';

    gameArea.appendChild(item);

    const fallInterval = setInterval(function() {
        const currentTop = parseInt(item.style.top);
        item.style.top = (currentTop + 3) + 'px';

        const fadeStart = window.innerHeight * 0.1;
        const fadeEnd = window.innerHeight;
        const opacity = currentTop < fadeStart ? 1 : 1 - (currentTop - fadeStart) / (fadeEnd - fadeStart) * 0.85;
        item.style.opacity = Math.max(0, opacity);

        if (currentTop > window.innerHeight) {
            clearInterval(fallInterval);
            item.remove();
        }
    }, 20);

    fallIntervals.set(item, fallInterval);
}

let spawnInterval = null;

const bucket = document.getElementById('bucket');
const bucketWidth = 60;
let bucketX = window.innerWidth / 2;

function updateBucket() {
    bucket.style.left = bucketX + 'px';
    bucket.style.transform = 'translateX(-50%)';
}

document.addEventListener('mousemove', function(move) {
    bucketX = move.clientX;
    updateBucket();
});

let currentVolume = 50;
let goalVolume = 50;

const volumeNumber = document.getElementById('volumeNumber');
const goalNumber = document.getElementById('goalNumber');
const startScreen = document.getElementById('startScreen');
const winScreen = document.getElementById('winScreen');
const goalInput = document.getElementById('goalInput');

function updateVolumeDisplay() {
    volumeNumber.textContent = currentVolume;
}

function checkCollisions() {
    const items = document.querySelectorAll('.item');
    const bucketRect = bucket.getBoundingClientRect();

    items.forEach(function(item) {
        const itemRect = item.getBoundingClientRect();
        
        const OverlapX = itemRect.right > bucketRect.left && itemRect.left < bucketRect.right;
        const OverlapY = itemRect.bottom > bucketRect.top && itemRect.top < bucketRect.bottom;

        if (OverlapX && OverlapY) {
            const value = parseInt(item.textContent);
            currentVolume = Math.min(100, Math.max(0, currentVolume + value));
            updateVolumeDisplay();

            clearInterval(item.fallInterval);
            item.remove();
            
            if (currentVolume === goalVolume) {
                winScreen.style.display = 'flex'
            }
        }
    });

    requestAnimationFrame(checkCollisions);
}

function startGame() {
    goalVolume = parseInt(goalInput.value);
    goalNumber.textContent = goalVolume;
    currentVolume = 0;
    updateVolumeDisplay();

    startScreen.style.display = 'none'
    gameArea.style.display = 'block';
    spawnInterval = setInterval(spawnItem, 1500);

    requestAnimationFrame(checkCollisions);
}

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('restartButton').addEventListener('click', function() {
    winScreen.style.display = 'none';
    startScreen.style.display = 'flex';
    gameArea.style.display = 'none';
    clearInterval(spawnInterval);
    spawnInterval = null;

    document.querySelectorAll('.item').forEach(function(item) {
        item.remove();
    });
});