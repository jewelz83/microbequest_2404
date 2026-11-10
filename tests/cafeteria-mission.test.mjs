import test from "node:test";
import assert from "node:assert/strict";
import {
  STUDENTS,
  illnessSummary,
  comparisonFeedback,
  initialMission,
  groupsFor,
  hydrateMission,
  canVisit,
  modeled,
  concluded,
} from "../src/pages/cafeteria-investigation/mission.mjs";
const ready = () => ({
  ...initialMission(),
  firstPath: "interviews",
  visited: ["interviews", "storage"],
  comparison: "salad-pattern",
  prediction: "same",
  setup: "fair",
  modelStep: 3,
  modelRead: "slower",
  claim: "investigate",
  evidence: ["survey", "storage"],
  limit: "more-evidence",
});
test("survey partitions twelve distinct people and preserves comparison counts", () => {
  assert.equal(new Set(STUDENTS.map((s) => s.id)).size, 12);
  for (const [food, expected] of [
    ["salad", [5, 1, 1, 5]],
    ["apple", [3, 3, 3, 3]],
    ["water", [6, 6, 0, 0]],
  ]) {
    const { ate, didNot } = groupsFor(food);
    assert.equal(ate.length + didNot.length, 12);
    assert.deepEqual(
      [
        ate.filter((s) => s.unwell).length,
        ate.filter((s) => !s.unwell).length,
        didNot.filter((s) => s.unwell).length,
        didNot.filter((s) => !s.unwell).length,
      ],
      expected,
    );
  }
  assert.throws(() => groupsFor("unknown"));
});
test("stages require comparison and model interpretation without grading predictions", () => {
  const s = initialMission();
  assert.equal(canVisit(s, "model"), false);
  assert.equal(canVisit(s, "complete"), false);
  assert.equal(modeled(ready()), true);
  for (const prediction of ["cold", "room", "same"])
    assert.equal(concluded({ ...ready(), prediction }), true);
  assert.equal(modeled({ ...ready(), setup: "unfair" }), false);
  assert.equal(modeled({ ...ready(), modelRead: "safe" }), false);
});
test("conclusion requires actual case observations, correct claim, exact evidence and uncertainty", () => {
  assert.equal(concluded(ready()), true);
  for (const patch of [
    { visited: ["interviews"] },
    { claim: "proved" },
    { limit: "finished" },
    { evidence: ["survey"] },
    { evidence: ["survey", "storage", "model-proof"] },
    { evidence: ["survey", "storage", "all-sick"] },
    { modelStep: 2 },
  ])
    assert.equal(concluded({ ...ready(), ...patch }), false);
});
test("reload validates saved state, ignores malformed records and cannot invent completion", () => {
  assert.deepEqual(hydrateMission("bad-json"), initialMission());
  assert.deepEqual(hydrateMission('{"version":99}'), initialMission());
  const full = { ...ready(), stage: "complete", complete: true };
  assert.deepEqual(hydrateMission(JSON.stringify(full)), full);
  const invalid = hydrateMission(JSON.stringify({ ...full, claim: "proved" }));
  assert.equal(invalid.complete, false);
  assert.equal(invalid.stage, "evidence");
  const polluted = hydrateMission(
    JSON.stringify({
      version: 1,
      firstPath: "bad",
      visited: ["storage", "invented"],
      modelStep: 500,
      evidence: ["invented"],
    }),
  );
  assert.equal(polluted.firstPath, null);
  assert.equal(polluted.modelStep, 0);
  assert.deepEqual(polluted.evidence, []);
});

test("guided navigation requires all clue cards before comparison and restores older saves safely", () => {
  const s = {...initialMission(), firstPath: "interviews", visited: ["interviews"]};
  assert.equal(canVisit(s, "evidence"), true);
  assert.equal(canVisit(s, "compare"), false);
  s.visited.push("menu");
  assert.equal(canVisit(s, "compare"), false);
  s.visited.push("storage");
  assert.equal(canVisit(s, "compare"), true);
  const restored = hydrateMission(JSON.stringify({...s, stage: "compare", visited: ["interviews"]}));
  assert.equal(restored.stage, "evidence");
  assert.equal(restored.firstPath, "interviews");
});

test("illness percentages preserve denominators, rounding and missing groups", () => {
  assert.deepEqual(illnessSummary(groupsFor("salad").ate), {total:6, unwell:5, percent:83});
  assert.deepEqual(illnessSummary(groupsFor("salad").didNot), {total:6, unwell:1, percent:17});
  assert.equal(illnessSummary(groupsFor("apple").ate).percent, 50);
  assert.equal(illnessSummary(groupsFor("water").ate).percent, 50);
  assert.equal(illnessSummary([]).percent, null);
  assert.equal(illnessSummary([{unwell:false}]).percent, 0);
  assert.match(comparisonFeedback("salad", "equal"), /equal group sizes do not mean equal illness/);
  assert.match(comparisonFeedback("apple", "pattern"), /50%/);
  assert.match(comparisonFeedback("water", "equal"), /unknown, not 0%/);
  assert.match(comparisonFeedback("salad", "pattern"), /not proof/);
});
