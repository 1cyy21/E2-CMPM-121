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

type ReportRow = {
  label: string;
  color: string;
  value: (report: ShiftReport) => number;
};

const REPORT_ROWS: ReportRow[] = [
  {
    label: "Production",
    color: "#27766b",
    value: (report) => report.production,
  },
  {
    label: "Consumption",
    color: "#a44d23",
    value: (report) => report.consumption,
  },
];

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

  const ROW_TOP = 102;
  const ROW_SPACING = 52;
  const BAR_OFFSET = 8;
  const BAR_SCALE = 14;
  const BAR_HEIGHT = 20;

  REPORT_ROWS.forEach((row, index) => {
    const labelY = ROW_TOP + index * ROW_SPACING;
    const amount = row.value(report);

    ctx.fillStyle = "#233e43";
    ctx.fillText(`${row.label}: ${amount}`, 18, labelY);
    ctx.fillStyle = row.color;
    ctx.fillRect(18, labelY + BAR_OFFSET, amount * BAR_SCALE, BAR_HEIGHT);
  });
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
