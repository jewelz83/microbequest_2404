import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  FlaskConical,
  Leaf,
  MessageCircle,
  Pause,
  Play,
  RotateCcw,
  Search,
  Snowflake,
  Sun,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import {
  FOODS,
  STUDENTS,
  PATHS,
  initialMission,
  groupsFor,
  hydrateMission,
  compared,
  modeled,
  concluded,
  canVisit,
} from "./mission.mjs";
import "./mission.css";
const KEY = "microbequest_cafeteria_v1:guest";
const labels = {
  opening: "Start",
  evidence: "Gather clues",
  compare: "Compare",
  model: "Test a model",
  explain: "Explain",
  complete: "Discovery",
};
const cards = {
  interviews: {
    label: "Talk to students",
    icon: Users,
    kicker: "INTERVIEW NOTES",
    title: "Every lunch tells a story",
    text: "Twelve students answered the same questions. Six felt unwell afterward. Six did not. What did each group eat?",
    clue: "Compare students who ate an item with students who did not.",
  },
  menu: {
    label: "Look at the menu",
    icon: BookOpen,
    kicker: "YESTERDAY’S MENU",
    title: "Three things to compare",
    text: "Students chose pasta salad, an apple, or both. Everyone drank water. Could one item help us find a pattern?",
    clue: "Knowing what was served is useful. Now we need to know who ate it.",
  },
  storage: {
    label: "Check food storage",
    icon: Snowflake,
    kicker: "KITCHEN RECORD",
    title: "A clue from the counter",
    text: "The chilled pasta salad was on the counter at 10:00 AM and still there at 12:30 PM. The record shows no setup to keep it cold.",
    clue: "This raises a storage concern. It does not tell us which germ was present or prove what caused illness.",
  },
};
function PersonGroup({ people, title }) {
  const ill = people.filter((p) => p.unwell).length;
  return (
    <div className="mq-group">
      <h3>{title}</h3>
      {people.length ? (
        <>
          <div
            className="mq-people"
            aria-label={`${ill} unwell, ${people.length - ill} well`}
          >
            {people.map((p) => (
              <div
                key={p.id}
                className={`mq-person ${p.unwell ? "unwell" : "well"}`}
              >
                <Users size={22} aria-hidden="true" />
                <span>{p.unwell ? "Unwell" : "Well"}</span>
              </div>
            ))}
          </div>
          <p className="mq-group-total">
            {ill} unwell <span>·</span> {people.length - ill} well
          </p>
        </>
      ) : (
        <p className="mq-no-group">
          No students in this group. We need a comparison.
        </p>
      )}
    </div>
  );
}
export default function CafeteriaInvestigation() {
  const { user } = useAuth();
  return <Mission key={user?.id || "guest"} guest={!user?.id} />;
}
function Mission({ guest }) {
  const [s, setS] = useState(() => {
    if (!guest) return initialMission();
    try {
      return hydrateMission(localStorage.getItem(KEY));
    } catch {
      return initialMission();
    }
  });
  const [saved, setSaved] = useState(
    guest
      ? "Checking device save…"
      : "Session only. Account saving is not part of this prototype.",
  );
  const [active, setActive] = useState(s.firstPath || "interviews");
  const [feedback, setFeedback] = useState("");
  const [paused, setPaused] = useState(false);
  const [notebook, setNotebook] = useState(false);
  const [restart, setRestart] = useState(false);
  const [hint, setHint] = useState(0);
  const heading = useRef(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (!guest) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
      setSaved("Saved on this browser for this guest.");
    } catch {
      setSaved(
        "Could not save on this browser. Keep this tab open to continue.",
      );
    }
  }, [s, guest]);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    heading.current?.focus();
  }, [s.stage, active]);
  const update = (patch) => {
    setS((p) => ({ ...p, ...patch }));
    setFeedback("");
  };
  const go = (stage) => {
    if (canVisit(s, stage)) {
      update({ stage });
      setHint(0);
    }
  };
  const visit = (key) => {
    setActive(key);
    setS((p) => ({
      ...p,
      firstPath: p.firstPath || key,
      visited: [...new Set([...p.visited, key])],
      stage: "evidence",
    }));
    setFeedback("");
  };
  const chooseFood = (food) => update({ food });
  const toggleEvidence = (id) =>
    update({
      evidence: s.evidence.includes(id)
        ? s.evidence.filter((x) => x !== id)
        : [...s.evidence, id],
    });
  const reset = () => {
    setS(initialMission());
    setActive("interviews");
    setRestart(false);
    setPaused(false);
    setNotebook(false);
    setFeedback("");
    setHint(0);
  };
  const closeOverlays = () => {
    setPaused(false);
    setNotebook(false);
    setRestart(false);
  };
  const group = groupsFor(s.food);
  const C = cards[active];
  const Icon = C.icon;
  const hints = [
    "Who could you compare?",
    "Look at students who did not eat the pasta salad too.",
    "Five of six salad eaters felt unwell. One of six who skipped it felt unwell. That pattern deserves another look.",
  ];
  const submitConclusion = () => {
    if (concluded(s)) {
      update({ complete: true, stage: "complete" });
      return;
    }
    if (!s.visited.includes("interviews") || !s.visited.includes("storage"))
      setFeedback(
        "Visit the interview notes and storage record before using them in your explanation. You can return through Gather clues.",
      );
    else if (s.claim !== "investigate")
      setFeedback(
        s.claim === "everyone"
          ? "One student who skipped salad also felt unwell. Look at both groups again."
          : "Our clues suggest what to investigate. They do not identify a germ or prove the cause.",
      );
    else if (s.evidence.includes("model-proof"))
      setFeedback(
        "The model explores a general idea. It did not test the school’s food. Remove that evidence and choose observations from the case.",
      );
    else if (s.evidence.includes("all-sick"))
      setFeedback(
        "Not everyone who ate salad felt unwell. Check the group icons and remove this claim.",
      );
    else if (!s.evidence.includes("survey") || !s.evidence.includes("storage"))
      setFeedback(
        "Use both the survey pattern and the storage record to support the next step.",
      );
    else
      setFeedback(
        "What can’t we tell yet? Choose the statement that leaves room for more evidence.",
      );
  };
  const doneStage = {
    evidence: PATHS.every((k) => s.visited.includes(k)),
    compare: compared(s),
    model: modeled(s),
    explain: s.complete,
  };
  return (
    <div className="mq-mission">
      <div className="mq-grain" aria-hidden="true" />
      <header className="mq-header">
        <Link to="/microbe-detective-mystery-outbreak" className="mq-brand">
          <span className="mq-brand-icon">
            <FlaskConical size={23} />
          </span>
          <span>
            MicrobeQuest<small>THE DISCOVERY DESK</small>
          </span>
        </Link>
        <div className="mq-header-right">
          <span className="mq-prototype">PLAYABLE PROTOTYPE</span>
          <button
            onClick={() => setNotebook(true)}
            aria-label="Open discovery notebook"
          >
            <BookOpen size={19} />
            <span>Notebook</span>
          </button>
          <button
            onClick={() => setPaused(true)}
            aria-label="Pause investigation"
          >
            <Pause size={18} />
            <span>Pause</span>
          </button>
        </div>
      </header>
      <div className="mq-shell">
        <aside className="mq-sidebar">
          <Link className="mq-back" to="/microbe-detective-mystery-outbreak">
            <ArrowLeft size={16} /> Investigation home
          </Link>
          <div className="mq-case-label">CASE STUDY 01</div>
          <h1>
            The Cafeteria{" "}
            <br />
            Clue<span>.</span>
          </h1>
          <p className="mq-case-desc">
            A little curiosity.
            <br />A pattern worth finding.
          </p>
          <nav aria-label="Investigation steps">
            {["evidence", "compare", "model", "explain"].map((stage, i) => (
              <button
                key={stage}
                disabled={!canVisit(s, stage)}
                aria-current={s.stage === stage ? "step" : undefined}
                onClick={() => go(stage)}
              >
                <span className="mq-step-number">
                  {doneStage[stage] ? (
                    <Check size={16} />
                  ) : (
                    String(i + 1).padStart(2, "0")
                  )}
                </span>
                <span>{labels[stage]}</span>
                {s.stage === stage && <ChevronRight size={16} />}
              </button>
            ))}
          </nav>
          <div className="mq-sidebar-note">
            <Leaf size={21} />
            <p>Good scientists change their minds when the evidence changes.</p>
          </div>
          <small className="mq-save" role="status">
            {saved}
          </small>
          <button className="mq-reset" onClick={() => setRestart(true)}>
            <RotateCcw size={13} /> Start over
          </button>
        </aside>
        <main
          className="mq-main"
          inert={paused || notebook || restart ? "" : undefined}
        >
          <div className="mq-topline">
            <span>YOUR NEXT DISCOVERY</span>
            <span>Fictional investigation · No timer</span>
          </div>
          {s.stage !== "opening" && <div className="mq-guidance-nav">
            <button className="mq-text-button" onClick={() => {
              const previous = {evidence: "opening", compare: "evidence", model: "compare", explain: "model", complete: "explain"};
              go(previous[s.stage]);
            }}><ArrowLeft size={16} /> Back</button>
            <strong role="status">{s.stage === "complete" ? "Investigation complete" : `You are here: Step ${{evidence: 1, compare: 2, model: 3, explain: 4}[s.stage]} of 4 · ${labels[s.stage]}`}</strong>
            <button className="mq-text-button" aria-expanded={hint > 0} onClick={() => setHint(hint ? 0 : 1)}>Help me, Aunt Juju</button>
          </div>}
          {hint > 0 && s.stage !== "compare" && <Guide>{ {
            evidence: "Read the clue card below. The Next button will take you to a clue you haven’t visited. Once you’ve visited all three, we’ll compare the lunches.",
            model: "Choose a prediction, then a setup that changes only storage temperature. Press Advance model three times. Finally, choose what the model supports.",
            explain: "Choose one claim, two supporting observations, and one statement about what remains unknown. You can use Back or your notebook to check the clues.",
            complete: "You’ve finished! Open your notebook to revisit your discoveries, or explore another comparison."
          }[s.stage]}</Guide>}
          {s.stage === "opening" && (
            <>
              <h2 ref={heading} tabIndex={-1} className="mq-hero-title">
                Something happened
                <br />
                after <em>lunch.</em>
              </h2>
              <p className="mq-intro">
                Aunt Juju has a mystery for our science team.
              </p>
              <Guide>
                “Something puzzling happened after lunch. Some students felt unwell,
                but others didn’t. The grown-ups are helping them, and we’ve been
                asked to look for clues. Will you help me figure out what the
                science team should investigate?”
              </Guide>
              <div className="mq-route-map" aria-label="Our investigation plan">
                <strong>Our plan</strong>
                <p>1. Collect clues → 2. Compare lunches → 3. Try a model → 4. Explain our thinking</p>
              </div>
              <Guide>
                “First, let’s find out what everyone ate. Did students who felt
                unwell eat the same things as students who felt well?”
              </Guide>
              <div className="mq-actions">
                <span>Start here. I’ll help you along the way.</span>
                <Primary onClick={() => visit("interviews")}>
                  Look at the students’ lunches
                </Primary>
              </div>
              <div
                className="mq-scene"
                aria-label="Illustrated cafeteria desk with lunch tray, apple and interview notes"
              >
                <div className="mq-scene-label">YESTERDAY AT THE CAFETERIA</div>
                <div className="mq-paper">
                  <span>FIELD NOTES</span>
                  <strong>
                    12 students.
                    <br />
                    Different lunches.
                    <br />
                    One question.
                  </strong>
                  <div className="mq-paper-lines" />
                </div>
                <div className="mq-tray">
                  <div className="mq-salad">
                    <Leaf />
                    <Leaf />
                    <Leaf />
                  </div>
                  <div className="mq-apple">
                    ●<span />
                  </div>
                  <div className="mq-cup" />
                  <small>LUNCH MENU</small>
                </div>
                <div className="mq-scene-badge">
                  <Search size={26} />
                </div>
              </div>

            </>
          )}
          {s.stage === "evidence" && (
            <>
              <Eyebrow n="01" text="GATHER CLUES" />
              <h2 ref={heading} tabIndex={-1}>
                Let’s collect our clues.
              </h2>
              <p className="mq-intro">
                Read the student notes, look at the menu, then check the storage record. Aunt Juju will guide you through each clue.
              </p>
              <div className="mq-tabs" role="group" aria-label="Evidence paths">
                {PATHS.map((k) => (
                  <button
                    key={k}
                    aria-pressed={active === k}
                    onClick={() => visit(k)}
                  >
                    {cards[k].label}
                    {s.visited.includes(k) && <Check size={15} />}
                  </button>
                ))}
              </div>
              <article className="mq-evidence-card">
                <span className="mq-card-icon">
                  <Icon size={29} />
                </span>
                <p className="mq-eyebrow">{C.kicker}</p>
                <h3>{C.title}</h3>
                <p>{C.text}</p>
                <ClueVisual kind={active} />
                <div className="mq-clue">
                  <Search size={19} />
                  <p>{C.clue}</p>
                </div>
              </article>
              <Guide>
                {active === "storage"
                  ? "“A storage concern is a useful clue. Could it explain who felt unwell? Let’s compare what people ate.”"
                  : active === "menu"
                    ? "“The menu tells us what was offered. The interviews help us see what each person ate.”"
                    : "“We need both sides of the story: students who felt unwell and students who felt well.”"}
              </Guide>
              <div className="mq-actions">
                <span>{s.visited.length} of 3 clues visited. You can revisit any clue.</span>
                <Primary onClick={() => {
                  const next = PATHS.find((k) => !s.visited.includes(k));
                  if (next) visit(next); else go("compare");
                }}>
                  {PATHS.find((k) => !s.visited.includes(k))
                    ? `Next: ${cards[PATHS.find((k) => !s.visited.includes(k))].label}`
                    : "Next: Compare the lunches"}
                </Primary>
              </div>
            </>
          )}
          {s.stage === "compare" && (
            <>
              <Eyebrow n="02" text="LOOK FOR A PATTERN" />
              <h2 ref={heading} tabIndex={-1}>
                Same lunch.
                <br />
                <em>Different stories.</em>
              </h2>
              <Guide>“Did students who ate pasta salad feel unwell more often than students who didn’t? Count the Unwell labels in each group. Then choose the sentence that matches.”</Guide>
              <p className="mq-intro">Start with pasta salad. Look at both groups, then choose a sentence below. You can explore apple and water too.</p>
              <div
                className="mq-foods"
                role="group"
                aria-label="Choose food to compare"
              >
                {Object.entries(FOODS).map(([k, v]) => (
                  <button
                    key={k}
                    aria-pressed={s.food === k}
                    onClick={() => chooseFood(k)}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className="mq-groups">
                <PersonGroup
                  title={`${s.food === "water" ? "Drank" : "Ate"} ${FOODS[s.food].toLowerCase()}`}
                  people={group.ate}
                />
                <PersonGroup
                  title={`${s.food === "water" ? "Did not drink" : "Did not eat"} ${FOODS[s.food].toLowerCase()}`}
                  people={group.didNot}
                />
              </div>
              <p className="mq-data-note">
                Invented survey data for this game. One icon = one fictional
                student.
              </p>
              <h3 className="mq-question">
                What does this comparison tell you?
              </h3>
              <div className="mq-options">
                {[
                  [
                    "pattern",
                    s.food === "water" ? "More of the students who drank water felt unwell." : "More of the students who ate this item felt unwell.",
                  ],
                  ["equal", "The two groups have the same illness counts."],
                  [
                    "missing",
                    s.food === "water" ? "There is no group of students who did not drink water." : "There is no group of students who skipped this item.",
                  ],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => {
                      const right = {
                        salad: "pattern",
                        apple: "equal",
                        water: "missing",
                      }[s.food];
                      if (id !== right) {
                        setFeedback(
                          "Look at both groups again. Compare the unwell labels, and check whether both groups exist.",
                        );
                        return;
                      }
                      if (s.food === "salad") {
                        update({ comparison: "salad-pattern" });
                        setFeedback(
                          "A pattern worth investigating: 5 of 6 who ate salad felt unwell, compared with 1 of 6 who did not. This is a clue, not proof.",
                        );
                      } else
                        setFeedback(
                          s.food === "apple"
                            ? "Yes. Both groups have 3 unwell students. Try another item to find a stronger pattern."
                            : "Yes. Everyone drank water, so this survey cannot compare drinkers with non-drinkers. It does not prove water is safe. Try another item.",
                        );
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {compared(s) && (
                <>
                  <Guide>
                    “You compared groups to find a pattern. Epidemiologists use
                    comparisons like this to investigate illness.”
                  </Guide>
                  <div className="mq-actions">
                    <span>You can compare other items too.</span>
                    <Primary onClick={() => go("model")}>Next: Try an experiment</Primary>
                  </div>
                </>
              )}
              <button
                className="mq-hint"
                onClick={() => setHint((n) => Math.min(3, n + 1))}
              >
                Help me compare, Aunt Juju
              </button>
              {hint > 0 && <p className="mq-hint-text">{hints[hint - 1]}</p>}
            </>
          )}
          {s.stage === "model" && (
            <>
              <Eyebrow n="03" text="TEST A MODEL" />
              <h2 ref={heading} tabIndex={-1}>
                What difference
                <br />
                could <em>cold</em> make?
              </h2>
              <p className="mq-intro">
                Explore a virtual model. It won’t test the school’s food.
              </p>
              <Guide>“Could keeping food cold make a difference? First, choose what you think will happen. A prediction is an idea to explore, not a scored answer. Then we’ll choose a fair setup and advance the model three times.”</Guide>
              <h3 className="mq-question">First, make a prediction.</h3>
              <div className="mq-options">
                {[
                  ["cold", "Bacteria multiply more slowly in the cold sample."],
                  ["same", "Both samples have the same growth."],
                  [
                    "room",
                    "Bacteria multiply more slowly in the room-temperature sample.",
                  ],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    aria-pressed={s.prediction === id}
                    onClick={() => update({ prediction: id })}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {s.prediction && (
                <>
                  <h3 className="mq-question">
                    Which setup makes a fair comparison?
                  </h3>
                  <div className="mq-setup">
                    <button
                      aria-pressed={s.setup === "fair"}
                      onClick={() =>
                        update({ setup: "fair", modelStep: 0, modelRead: null })
                      }
                    >
                      <Check size={22} />
                      <strong>Change the storage</strong>
                      <span>
                        Same food, same starting bacteria, same time. One cold,
                        one room-temperature.
                      </span>
                    </button>
                    <button
                      aria-pressed={s.setup === "unfair"}
                      onClick={() => {
                        update({
                          setup: "unfair",
                          modelStep: 0,
                          modelRead: null,
                        });
                        setFeedback(
                          "This changes the food and the temperature. Choose the same food in both samples to test storage fairly.",
                        );
                      }}
                    >
                      <FlaskConical size={22} />
                      <strong>Change the food too</strong>
                      <span>
                        Cold salad and a room-temperature apple, observed for
                        the same time.
                      </span>
                    </button>
                  </div>
                </>
              )}
              {s.setup === "fair" && (
                <div className="mq-model">
                  <div className="mq-model-heading">
                    <span>SIMPLIFIED VIRTUAL MODEL</span>
                    <span>Step {s.modelStep} of 3</span>
                  </div>
                  <div className="mq-samples">
                    {[
                      ["Cold storage", Snowflake, 15 + s.modelStep * 4],
                      ["Room temperature", Sun, 15 + s.modelStep * 23],
                    ].map(([name, I, value]) => (
                      <div key={name} className="mq-sample">
                        <I size={30} />
                        <h3>{name}</h3>
                        <div
                          className="mq-growth"
                          aria-label={`${name}: ${s.modelStep === 0 ? "same starting level" : name === "Cold storage" ? "slower increase" : "faster increase"}`}
                        >
                          <div style={{ height: `${value}%` }} />
                        </div>
                        <p>
                          {s.modelStep === 0
                            ? "Same starting level"
                            : name === "Cold storage"
                              ? "Slower increase"
                              : "Faster increase"}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="mq-data-note">
                    Illustrative growth indicator, not bacterial counts or a
                    food-safety measurement.
                  </p>
                  <div className="mq-model-actions">
                    <button
                      disabled={s.modelStep === 0}
                      onClick={() => update({ modelStep: 0, modelRead: null })}
                    >
                      Reset model
                    </button>
                    <Primary
                      disabled={s.modelStep === 3}
                      onClick={() =>
                        update({
                          modelStep: Math.min(3, s.modelStep + 1),
                          modelRead: null,
                        })
                      }
                    >
                      {s.modelStep === 3 ? "Model complete" : "Advance model"}
                    </Primary>
                  </div>
                </div>
              )}
              {s.modelStep === 3 && s.setup === "fair" && (
                <>
                  <h3 className="mq-question">What does this model support?</h3>
                  <div className="mq-options">
                    {[
                      [
                        "slower",
                        "Cold storage can slow the growth of some bacteria.",
                      ],
                      ["safe", "Cold storage makes all food safe."],
                      [
                        "proved",
                        "We proved which germ caused the school’s illness.",
                      ],
                    ].map(([id, label]) => (
                      <button
                        key={id}
                        aria-pressed={s.modelRead === id}
                        onClick={() => {
                          update({ modelRead: id });
                          setFeedback(
                            id === "slower"
                              ? "Yes. Cold can slow growth. It does not kill all germs, and this model did not test the school’s food."
                              : id === "safe"
                                ? "Cold does not kill all germs or make every food safe. Compare the rates of change."
                                : "This is a general model, not a lab test of the school’s food. What did it show about growth?",
                          );
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {s.modelRead === "slower" && (
                    <>
                      <Guide>
                        “Food microbiologists study microbes in food. They work
                        with other specialists to understand risks and help keep
                        food safer.”
                      </Guide>
                      <div className="mq-actions">
                        <span>Now bring your evidence together.</span>
                        <Primary onClick={() => go("explain")}>
                          Next: Explain what you found
                        </Primary>
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}
          {s.stage === "explain" && (
            <>
              <Eyebrow n="04" text="MAKE YOUR CASE" />
              <h2 ref={heading} tabIndex={-1}>
                What should the
                <br />
                team check <em>next?</em>
              </h2>
              <p className="mq-intro">
                A good explanation connects a claim to evidence, and leaves room
                for what we don’t know.
              </p>
              <Guide>“Let’s tell the team what to check next. Choose one next step, select two observations that support it, then say what we still don’t know.”</Guide>
              <h3 className="mq-question">1. Choose your claim</h3>
              <Choices
                value={s.claim}
                onChange={(claim) => update({ claim })}
                items={[
                  ["investigate", "Investigate the pasta salad further."],
                  ["proved", "We proved which germ caused the illness."],
                  ["everyone", "Only students who ate salad felt unwell."],
                ]}
              />
              <h3 className="mq-question">2. Choose supporting observations</h3>
              <div className="mq-options">
                {[
                  [
                    "survey",
                    "Illness was more common among students who ate salad.",
                  ],
                  [
                    "storage",
                    "The storage record raised a concern about keeping salad cold.",
                  ],
                  [
                    "model-proof",
                    "The virtual model proved that the school’s salad was contaminated.",
                  ],
                  ["all-sick", "Every student who ate salad felt unwell."],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    role="checkbox"
                    aria-checked={s.evidence.includes(id)}
                    onClick={() => toggleEvidence(id)}
                  >
                    <span className="mq-checkbox">
                      {s.evidence.includes(id) && <Check size={15} />}
                    </span>
                    {label}
                  </button>
                ))}
              </div>
              <h3 className="mq-question">3. What don’t we know yet?</h3>
              <Choices
                value={s.limit}
                onChange={(limit) => update({ limit })}
                items={[
                  [
                    "more-evidence",
                    "We need more evidence. These clues do not identify a germ or prove the cause.",
                  ],
                  [
                    "finished",
                    "The investigation is finished. No further evidence is needed.",
                  ],
                ]}
              />
              <div className="mq-actions">
                <button
                  className="mq-text-button"
                  onClick={() => go("compare")}
                >
                  Revisit the survey
                </button>
                <Primary onClick={submitConclusion}>
                  Share my explanation
                </Primary>
              </div>
            </>
          )}
          {s.stage === "complete" && (
            <>
              <div className="mq-complete-icon">
                <Check size={40} />
              </div>
              <Eyebrow text="A DISCOVERY WORTH KEEPING" />
              <h2 ref={heading} tabIndex={-1}>
                You followed
                <br />
                the <em>evidence.</em>
              </h2>
              <p className="mq-intro">
                You found a pattern and explained what the team should check
                next.
              </p>
              <div className="mq-summary">
                <h3>Your investigation notes</h3>
                <p>
                  <strong>The next step</strong>Investigate the pasta salad
                  further.
                </p>
                <p>
                  <strong>Your evidence</strong>The survey showed a pattern. The
                  storage record raised a concern.
                </p>
                <p>
                  <strong>The open question</strong>More evidence is needed to
                  identify the cause.
                </p>
              </div>
              <div className="mq-careers">
                <article>
                  <Users />
                  <h3>Epidemiologist</h3>
                  <p>
                    You compared groups and looked for a pattern in illness.
                  </p>
                </article>
                <article>
                  <FlaskConical />
                  <h3>Food microbiologist</h3>
                  <p>
                    You explored how storage conditions can affect bacterial
                    growth.
                  </p>
                </article>
              </div>
              <Guide>
                “Changing your mind when you find new evidence is part of doing
                science. What else are you curious about?”
              </Guide>
              <details className="mq-transfer">
                <summary>
                  One more question: how would you test storage at a picnic?
                </summary>
                <p>
                  In a virtual comparison, keep the food, starting conditions,
                  and time the same. Change only storage temperature. Ask an
                  adult about real food decisions.
                </p>
              </details>
              <div className="mq-actions">
                <button
                  className="mq-text-button"
                  onClick={() => go("compare")}
                >
                  Explore another comparison
                </button>
                <Primary onClick={() => setNotebook(true)}>
                  Open my notebook
                </Primary>
              </div>
            </>
          )}
          {feedback && (
            <div className="mq-feedback" role="status" aria-live="polite">
              <MessageCircle size={21} />
              <p>{feedback}</p>
            </div>
          )}
          <footer className="mq-footer">
            <span>Chase Street Press</span>
            <span>Lead with curiosity.</span>
          </footer>
        </main>
      </div>
      {(paused || notebook || restart) && (
        <div className="mq-modal-backdrop">
          <section
            className="mq-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mq-dialog-title"
            onKeyDown={(e) => {
              if (e.key === "Escape") closeOverlays();
              if (e.key === "Tab") {
                const els = Array.from(
                  e.currentTarget.querySelectorAll("button, a[href]"),
                );
                const first = els[0],
                  last = els[els.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                  e.preventDefault();
                  last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                  e.preventDefault();
                  first.focus();
                }
              }
            }}
          >
            <button
              className="mq-modal-close"
              autoFocus
              onClick={closeOverlays}
              aria-label="Close dialog"
            >
              <X />
            </button>
            <h2 id="mq-dialog-title">
              {restart
                ? "Start a new investigation?"
                : paused
                  ? "A little brain break."
                  : "Your discovery notebook"}
            </h2>
            {restart ? (
              <>
                <p>
                  This replaces only this prototype’s current notes on this
                  browser.
                </p>
                <Primary onClick={reset}>Start over</Primary>
              </>
            ) : paused ? (
              <>
                <p>Your choices are still here. Take your time.</p>
                <Primary onClick={() => setPaused(false)}>
                  <Play size={17} /> Continue investigating
                </Primary>
              </>
            ) : (
              <>
                <p className="mq-data-note">Fictional case · {saved}</p>
                <h3>What you observed</h3>
                {s.visited.length ? (
                  s.visited.map((k) => (
                    <p key={k}>
                      <strong>{cards[k].label}</strong>
                      <br />
                      {cards[k].text}
                    </p>
                  ))
                ) : (
                  <p>
                    No clues yet. Your first question is a great place to start.
                  </p>
                )}
                <h3>Your current thinking</h3>
                <p>
                  {compared(s)
                    ? "Pasta salad shows a pattern worth investigating."
                    : "You have not recorded a comparison yet."}
                </p>
                <p>
                  {s.prediction
                    ? `Prediction: ${s.prediction === "cold" ? "slower growth in cold storage" : s.prediction === "same" ? "same growth" : "slower growth at room temperature"}.`
                    : "No prediction yet."}
                </p>
                <h3>What remains open</h3>
                <p>
                  The case does not identify a germ or prove the cause. The team
                  needs more evidence.
                </p>
                <button className="mq-text-button" onClick={closeOverlays}>
                  Back to the investigation
                </button>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
function Eyebrow({ n, text }) {
  return (
    <p className="mq-eyebrow">
      {n && <span>{n} / </span>}
      {text}
    </p>
  );
}
function Primary({ children, ...props }) {
  return (
    <button className="mq-primary" {...props}>
      {children}
      <ArrowRight size={17} />
    </button>
  );
}
function Guide({ children }) {
  return (
    <div className="mq-guide">
      <img className="mq-guide-avatar" src="/assets/images/color_graduating_aunt_juju-1760838289072.png" alt="Cartoon Aunt Juju smiling, wearing glasses and holding a book" width="112" height="112" />
      <div>
        <span>AUNT JUJU · YOUR SCIENCE GUIDE</span>
        <p>{children}</p>
      </div>
    </div>
  );
}
function FoodPicture({ food }) {
  return <svg viewBox="0 0 120 100" aria-hidden="true" focusable="false">
    {food === "salad" ? <>
      <ellipse cx="60" cy="75" rx="48" ry="15" fill="#d9dbcc" />
      <path d="M16 44h88q-4 40-44 40T16 44" fill="#e7b975" stroke="#84633d" strokeWidth="3" />
      <ellipse cx="60" cy="44" rx="44" ry="17" fill="#93aa72" />
      {[25,45,65,85].map((x,i)=><g key={x} transform={`translate(${x} ${33+i%2*12}) rotate(-15)`}><path d="M0 0q12-6 14 4t-10 7" fill="none" stroke="#f5d690" strokeWidth="7" strokeLinecap="round" /></g>)}
      <circle cx="42" cy="50" r="5" fill="#b45d43" /><circle cx="76" cy="34" r="5" fill="#b45d43" />
    </> : food === "apple" ? <>
      <path d="M60 29C25 10 12 47 29 74q15 22 31 11 18 11 32-11c17-27 4-64-32-45" fill="#ba624b" stroke="#88422f" strokeWidth="3" />
      <path d="M60 29q-3-15 4-21" stroke="#6c5134" strokeWidth="5" fill="none" />
      <path d="M65 18q2-20 24-12-6 18-24 12" fill="#6e8e5c" />
      <path d="M36 39q-10 6-9 19" stroke="#e2a18a" strokeWidth="5" fill="none" strokeLinecap="round" />
    </> : <>
      <path d="M32 14h56L80 88H40Z" fill="#ecf5f3" stroke="#58888a" strokeWidth="3" />
      <path d="M37 43h46l-5 41H42Z" fill="#9bcbd0" /><ellipse cx="60" cy="43" rx="23" ry="5" fill="#c3e2e4" />
      <path d="M44 23l3 48" stroke="white" strokeWidth="5" strokeLinecap="round" />
    </>}
  </svg>;
}
function ClueVisual({ kind }) {
  if (kind === "interviews") return <figure className="mq-clue-visual">
    <figcaption>Our student interview cards <small>12 fictional students · The same questions for everyone</small></figcaption>
    <div className="mq-interview-grid">{STUDENTS.map((student)=><div key={student.id} className={`mq-interview-person ${student.unwell ? "unwell" : "well"}`}>
      <Users aria-hidden="true" size={28} /><strong>{student.id}</strong><span>{student.unwell ? "Felt unwell" : "Felt well"}</span>
    </div>)}</div>
    <p>Six felt unwell. Six felt well. We need to learn about both groups.</p>
  </figure>;
  if (kind === "menu") return <figure className="mq-clue-visual">
    <figcaption>What was served at lunch?<small>Students could choose one food or both.</small></figcaption>
    <div className="mq-menu-pictures">{Object.entries(FOODS).map(([food,name])=><div key={food}><FoodPicture food={food} /><strong>{name}</strong><span>{food === "water" ? "Everyone drank water" : "Some students chose this"}</span></div>)}</div>
    <p>The menu shows what was offered. The interview records show who chose each item.</p>
  </figure>;
  return <figure className="mq-clue-visual">
    <figcaption>Follow the storage record<small>The same pasta salad, at two recorded times.</small></figcaption>
    <div className="mq-storage-timeline">{["10:00 AM", "12:30 PM"].map(time=><div key={time}><strong>{time}</strong><FoodPicture food="salad" /><span>On the counter</span></div>)}</div>
    <div className="mq-storage-gap"><Snowflake size={22} aria-hidden="true" /><strong>2 hours, 30 minutes between records</strong><span>No setup to keep it cold was recorded.</span></div>
    <p>A reason to investigate storage, not proof that this food caused illness.</p>
  </figure>;
}
function Choices({ value, onChange, items }) {
  return (
    <div className="mq-options" role="group">
      {items.map(([id, label]) => (
        <button
          key={id}
          aria-pressed={value === id}
          onClick={() => onChange(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
