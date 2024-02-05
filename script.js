let totalRings = 3; // Default value
let towers = [[], [], []];
let movesStack = [];
let currentStep = 0;

function initializeTowers() {
    towers = [[], [], []];
    for (let i = totalRings; i > 0; i--) {
        towers[0].push({ size: i, color: getFixedColor(i) });
    }
}

function moveRing(from, to) {
    let ring = towers[from].pop();
    towers[to].push(ring);
    movesStack.push({ from, to });
}

function getRings() {
    totalRings = parseInt(document.getElementById('ringInput').value, 10);
    initializeTowers();
    updateVisualization();
    currentStep = 0;
    movesStack = [];
    movesStack.push('Initial state'); // Add a placeholder for the initial state
}

function getFixedColor(size) {
    const hue = (size * 30) % 360;
    return `hsl(${hue}, 70%, 50%)`;
}

function towerOfHanoi(n, source, destination, helper) {
    if (n === 1) {
        movesStack.push({ from: source, to: destination });
    } else {
        towerOfHanoi(n - 1, source, helper, destination);
        movesStack.push({ from: source, to: destination });
        towerOfHanoi(n - 1, helper, destination, source);
    }
}

function runHanoi() {
    movesStack = [];
    towerOfHanoi(totalRings, 0, 2, 1);
    executeNextMove();
}

function executeNextMove() {
    if (currentStep < movesStack.length - 1) {
        currentStep++;
        let move = movesStack[currentStep];
        moveRing(move.from, move.to);
        updateVisualization();
        setTimeout(executeNextMove, 1000); // Delay each move visualization by 1 second
    }
}

function previousStep() {
    if (currentStep > 0) {
        currentStep--;
        undoMove();
        updateVisualization();
    }
}

function undoMove() {
    let move = movesStack[currentStep];
    let ring = towers[move.to].pop();
    towers[move.from].push(ring);
}

function nextStep() {
    if (currentStep < movesStack.length - 1) {
        currentStep++;
        executeNextMove();
    }
}

function updateVisualization() {
    document.querySelectorAll('.tower').forEach((tower, index) => {
        let rings = towers[index];
        tower.innerHTML = '';

        rings.forEach((ring, ringIndex) => {
            let ringElement = document.createElement('div');
            ringElement.className = 'ring';
            ringElement.style.width = (ring.size * 20) + 'px';
            ringElement.style.height = (ring.size * 20) + 'px';
            ringElement.style.backgroundColor = ring.color;
            ringElement.style.position = 'absolute';
            ringElement.style.bottom = ringIndex * 20 + 'px'; // Adjust the spacing between rings
            ringElement.style.borderRadius = '50%';
            ringElement.style.marginLeft = 'calc(50% - ' + (ring.size * 10) + 'px)'; // Center the rings
            tower.appendChild(ringElement);
        });
    });

    let outputElement = document.getElementById('output');
    outputElement.innerHTML = `<p>${movesStack[currentStep]}</p>`;
}
