export {};

const canvas = document.querySelector<HTMLCanvasElement>("#counter-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#counter-readout",
)!;
const host = document.querySelector<HTMLDivElement>("#counter-panel-host")!;
const diagnostic = document.querySelector<HTMLParagraphElement>(
  "#counter-diagnostic",
)!;
let count = 0;
let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;
const SHIELD_CAPACITY = 10;

const shieldEvents = new EventTarget();
const SHIELD_CHANGED = "shield_changed";

type ShieldSnapshot = {
  charge: number;
  capacity: number;
  missingCharge: number;
};

function takeShieldSnapshot(): ShieldSnapshot {
  return {
    charge: count,
    capacity: SHIELD_CAPACITY,
    missingCharge: SHIELD_CAPACITY - count,
  };
}

function drawMeter(shield: ShieldSnapshot) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < shield.capacity; i++) {
    ctx.fillStyle = i < shield.charge ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(`${shield.charge} / ${shield.capacity} shield`, 12, 100);
  readout.textContent = `Shield charge: ${shield.charge} / ${shield.capacity}`;
}

function updateStats(shield: ShieldSnapshot) {
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
  renderStats(shield);
}

function renderStats(shield: ShieldSnapshot) {
  if (!panel) return;
  panel.textContent =
    `Shield charge: ${shield.charge} · Missing charge: ${shield.missingCharge}`;
}

function setCount(next: number) {
  const bounded = Math.max(0, Math.min(SHIELD_CAPACITY, next));
  if (bounded === count) return;
  count = bounded;
  shieldEvents.dispatchEvent(new Event(SHIELD_CHANGED));
  if (panel) updateStats(takeShieldSnapshot());
}

shieldEvents.addEventListener(SHIELD_CHANGED, () => {
  drawMeter(takeShieldSnapshot());
});

document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () => {
  setCount(count - 1);
};
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () => {
  setCount(count + 1);
};
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () => {
  setCount(0);
};
document.querySelector<HTMLButtonElement>("#counter-open")!.onclick = () => {
  if (panel) return;
  panel = document.createElement("p");
  host.append(panel);
  renderStats(takeShieldSnapshot());
};
document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;
  panel.remove();
  panel = null;
};
drawMeter(takeShieldSnapshot());
