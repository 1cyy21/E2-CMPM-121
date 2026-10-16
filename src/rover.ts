export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
const pendingList = document.querySelector<HTMLOListElement>("#rover-pending")!;
const queueStatus = document.querySelector<HTMLParagraphElement>(
  "#rover-queue-status",
)!;
const runButton = document.querySelector<HTMLButtonElement>("#rover-run")!;
const clearButton = document.querySelector<HTMLButtonElement>("#rover-clear")!;

let x = 2;
let y = 2;
let directionIndex = 0;
const pendingCommands: Command[] = [];

function showPendingCommands() {
  pendingList.replaceChildren(...pendingCommands.map((command) => {
    const item = document.createElement("li");
    item.textContent = command.label;
    return item;
  }));

  const isEmpty = pendingCommands.length === 0;
  queueStatus.textContent = isEmpty
    ? "Empty"
    : `${pendingCommands.length} pending`;
  runButton.disabled = isEmpty;
  clearButton.disabled = isEmpty;
}

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(directionIndex * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    DIRECTIONS[directionIndex].name
  }`;
}

type Command = {
  label: string;
  execute: () => void;
};

type Direction = {
  name: string;
  dx: number;
  dy: number;
};

const DIRECTIONS: Direction[] = [
  { name: "North", dx: 0, dy: -1 },
  { name: "East", dx: 1, dy: 0 },
  { name: "South", dx: 0, dy: 1 },
  { name: "West", dx: -1, dy: 0 },
];

const GRID_SIZE = 5;

function clamp(value: number): number {
  return Math.min(GRID_SIZE - 1, Math.max(0, value));
}

const moveForward: Command = {
  label: "Forward",
  execute: () => {
    const heading = DIRECTIONS[directionIndex];
    x = clamp(x + heading.dx);
    y = clamp(y + heading.dy);
  },
};

const turnRight: Command = {
  label: "Right",
  execute: () => {
    directionIndex = (directionIndex + 1) % DIRECTIONS.length;
  },
};

function enqueueCommand(command: Command) {
  pendingCommands.push(command);
  showPendingCommands();
}

function runPendingCommands() {
  while (pendingCommands.length > 0) {
    const command = pendingCommands.shift()!;
    command.execute();
  }

  drawRover();
  showPendingCommands();
}

function clearPendingCommands() {
  pendingCommands.length = 0;
  showPendingCommands();
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  enqueueCommand(moveForward);
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  enqueueCommand(turnRight);
};
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  directionIndex = 0;
  clearPendingCommands();
  drawRover();
};

runButton.onclick = runPendingCommands;
clearButton.onclick = clearPendingCommands;
clearPendingCommands();
drawRover();
