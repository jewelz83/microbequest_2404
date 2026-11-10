export const VERSION = 1;
export const STUDENTS = Array.from({ length: 12 }, (_, i) => ({
  id: `S${String(i + 1).padStart(2, "0")}`,
  unwell: i < 6,
  salad: [0, 1, 2, 3, 4, 6].includes(i),
  apple: [0, 1, 5, 6, 7, 8].includes(i),
  water: true,
}));
export const FOODS = { salad: "Pasta salad", apple: "Apple", water: "Water" };
export const PATHS = ["interviews", "menu", "storage"];
export const STAGES = [
  "opening",
  "evidence",
  "compare",
  "model",
  "explain",
  "complete",
];
export const initialMission = () => ({
  version: VERSION,
  stage: "opening",
  firstPath: null,
  visited: [],
  food: "salad",
  comparison: null,
  prediction: null,
  setup: null,
  modelStep: 0,
  modelRead: null,
  claim: null,
  evidence: [],
  limit: null,
  complete: false,
});
export function groupsFor(food) {
  if (!Object.hasOwn(FOODS, food)) throw new Error("Unknown food");
  return {
    ate: STUDENTS.filter((s) => s[food]),
    didNot: STUDENTS.filter((s) => !s[food]),
  };
}
export const compared = (s) => s.comparison === "salad-pattern";
export const modeled = (s) =>
  compared(s) &&
  s.prediction !== null &&
  s.setup === "fair" &&
  s.modelStep === 3 &&
  s.modelRead === "slower";
export const concluded = (s) =>
  modeled(s) &&
  s.claim === "investigate" &&
  s.visited.includes("interviews") &&
  s.visited.includes("storage") &&
  s.evidence.length === 2 &&
  s.evidence.includes("survey") &&
  s.evidence.includes("storage") &&
  s.limit === "more-evidence";
export function canVisit(s, stage) {
  if (stage === "opening") return true;
  if (stage === "evidence") return s.firstPath !== null;
  if (stage === "compare") return PATHS.every((k) => s.visited.includes(k));
  if (stage === "model") return compared(s);
  if (stage === "explain") return modeled(s);
  return stage === "complete" && concluded(s);
}
export function hydrateMission(raw) {
  try {
    const x = JSON.parse(raw),
      s = initialMission();
    if (x?.version !== VERSION) return s;
    for (const key of [
      "firstPath",
      "food",
      "comparison",
      "prediction",
      "setup",
      "modelRead",
      "claim",
      "limit",
    ]) {
      const allowed = {
        firstPath: PATHS,
        food: Object.keys(FOODS),
        comparison: ["salad-pattern"],
        prediction: ["cold", "same", "room"],
        setup: ["fair", "unfair"],
        modelRead: ["slower", "safe", "proved"],
        claim: ["investigate", "proved", "everyone"],
        limit: ["more-evidence", "finished"],
      }[key];
      if (allowed.includes(x[key])) s[key] = x[key];
    }
    s.visited = Array.isArray(x.visited)
      ? PATHS.filter((k) => x.visited.includes(k))
      : [];
    s.evidence = Array.isArray(x.evidence)
      ? ["survey", "storage", "model-proof", "all-sick"].filter((k) =>
          x.evidence.includes(k),
        )
      : [];
    s.modelStep =
      Number.isInteger(x.modelStep) && x.modelStep >= 0 && x.modelStep <= 3
        ? x.modelStep
        : 0;
    s.stage =
      STAGES.includes(x.stage) && canVisit(s, x.stage)
        ? x.stage
        : s.firstPath
          ? "evidence"
          : "opening";
    s.complete = concluded(s) && x.complete === true;
    return s;
  } catch {
    return initialMission();
  }
}
