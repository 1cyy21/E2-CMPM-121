export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let assignedToSupplies = 2;
const CREW_SIZE = 6;
const suppliesPerCrew = 3;

type ShiftReport = {
  assignedToSupplies: number;
  crewSize: number;
  production: number;
  consumption: number;
  balance: number;
};

function calculateShift(assignedToSupplies: number): ShiftReport {
  const crewSize = CREW_SIZE;
  const production = assignedToSupplies * suppliesPerCrew;
  const consumption = crewSize;
  const balance = production - consumption;
  return { assignedToSupplies, crewSize, production, consumption, balance };
}

function drawShift(report: ShiftReport) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < report.crewSize; i++) {
    ctx.fillStyle = i < report.assignedToSupplies ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < report.assignedToSupplies ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(
    `Producers: ${report.assignedToSupplies} / ${report.crewSize}`,
    18,
    76,
  );
  ctx.fillText(`Production: ${report.production}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, report.production * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${report.consumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, report.consumption * 14, 20);
}

function writeShift(report: ShiftReport) {
  readout.textContent =
    `Assigned: ${report.assignedToSupplies}/${report.crewSize} · Production: ${report.production} · Consumption: ${report.consumption} · Balance: ${
      report.balance > 0 ? "+" : ""
    }${report.balance}`;
}

function update() {
  const report = calculateShift(assignedToSupplies);
  drawShift(report);
  writeShift(report);
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  assignedToSupplies = Math.max(0, assignedToSupplies - 1);
  update();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  assignedToSupplies = Math.min(CREW_SIZE, assignedToSupplies + 1);
  update();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    assignedToSupplies = 2;
    update();
  };
update();
