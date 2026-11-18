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

// A missing comparison group has no rate, rather than a rate of zero.
export function illnessSummary(people) {
  const total = people.length;
  const unwell = people.filter(person => person.unwell).length;
  return {total, unwell, percent: total ? Math.round(unwell / total * 100) : null};
}
export function comparisonFeedback(food, answer) {
  if (food === "water") return answer === "missing"
    ? "Yes. All 12 students drank water, and 6 of 12 (50%) felt unwell. There are no non-drinkers, so we cannot calculate a percentage for that group or compare the two. This does not prove water was safe or unsafe. What other item gives us two groups?"
    : "You noticed illness among students who drank water. But all 12 drank it, including 6 who felt well. There are zero students in the non-drinker group, so its percentage is unknown, not 0%. Can we say illness was more common in one group if the other group does not exist? Look for the answer about a missing comparison group.";
  if (food === "apple") return answer === "equal"
    ? "Yes. In each group, 3 of 6 students (50%) felt unwell. These equal percentages do not show an apple-related difference in this small survey. They do not prove apples could never be involved. Which other lunch item shows a different pattern?"
    : answer === "missing"
      ? "There are students in both apple groups: 6 ate an apple and 6 did not. Count the unwell students in each: 3 of 6 (50%) in both. Does this show a missing group, or two groups with matching results? Try the statement about their illness counts."
      : "Look at the unwell students in both apple groups, not just one. Each has 3 unwell students out of 6, or 50%. If the percentages match, does this survey show that apple eaters felt unwell more often? Which sentence describes equal results?";
  return answer === "pattern"
    ? "A pattern worth investigating: 5 of 6 salad eaters felt unwell (about 83%), compared with 1 of 6 who did not eat salad (about 17%). Epidemiologists report both the counts and percentages so people can compare groups. This small, fictional survey shows an association, not proof of the cause. What else would the team need to investigate?"
    : answer === "equal"
      ? "Both salad groups have 6 students, but equal group sizes do not mean equal illness. Count only the unwell students: 5 of 6 (about 83%) in the salad group and 1 of 6 (about 17%) in the other group. Which group has the larger percentage? Choose the sentence that describes that difference."
      : "Both salad groups exist: 6 students ate salad and 6 did not. Now compare their unwell counts: 5 of 6 (about 83%) versus 1 of 6 (about 17%). A missing group would have no students at all. What pattern do these two groups show?";
}

export function predictionReflection(prediction) {
  const ideas = {
    cold: "You predicted that bacteria would multiply more slowly in the cold sample. Your prediction matched what this model showed. What evidence supports that explanation? A match in one model does not prove an idea is always true.",
    same: "You predicted that both samples would have the same growth. In this model, both increased, but the cold sample increased more slowly. Your prediction did not match the result, and that is okay. Testing an idea helps us learn, even when the result surprises us.",
    room: "You predicted that bacteria would multiply more slowly in the room-temperature sample. In this model, the room-temperature sample increased faster, while the cold sample increased more slowly. Your prediction did not match the result, and that is okay. New evidence gives us a reason to rethink an idea."
  };
  return ideas[prediction] || "Compare your prediction with what the model showed. Scientists learn by testing ideas and reconsidering them when evidence changes.";
}
