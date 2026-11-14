import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Microscope, Compass, Puzzle, BookOpen, ArrowRight, Sparkles, HelpCircle, Trophy, Waves } from 'lucide-react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import './curiosity-home.css';

const paths = [
  { id: 'mystery', icon: Search, mood: 'I want to solve something', title: 'Solve a mystery', question: 'What happened after lunch?', text: 'Gather clues, compare lunches and test an idea with Aunt Juju.', action: 'Investigate the Cafeteria Clue', route: '/investigations/cafeteria', tag: 'Clues + experiments' },
  { id: 'microscope', icon: Microscope, mood: 'I want a closer look', title: 'Look through a microscope', question: 'What can you notice up close?', text: 'Explore virtual specimens and discover details you might otherwise miss.', action: 'Open the Microscope Lab', route: '/microscope-discovery-lab', tag: 'Observe + discover' },
  { id: 'world', icon: Compass, mood: 'I want to explore a place', title: 'Explore a tiny world', question: 'Where might microbes live?', text: 'Visit soil, a pond or the gut. Follow clues to learn how microbes live.', action: 'Visit World Explorer', route: '/world-explorer-mode', tag: 'Places + discoveries' },
  { id: 'challenge', icon: Puzzle, mood: 'I want a quick challenge', title: 'Play with what you know', question: 'Can you make a match?', text: 'Match microbes and their characteristics. Or choose a quick quiz below.', action: 'Try Microbe Matching', route: '/microbe-matching-game', tag: 'Puzzles + practice' },
  { id: 'adventure', icon: Waves, mood: 'I want an adventure', title: 'Enter a living world', question: 'Who lives in a drop of pond water?', text: 'Travel with Aunt Juju. Follow moving neighbors and discover how they live.', action: 'Explore Life in a Drop', route: '/life-in-a-drop', tag: 'Move + meet + wonder' },
  { id: 'story', icon: BookOpen, mood: 'I want a story', title: 'Follow a discovery', question: 'How did scientists find out?', text: 'Travel through microbiology history and meet the people behind discoveries.', action: 'Explore the Timeline', route: '/microbe-timeline-adventure', tag: 'People + big ideas' },
];
const suggestions = { notice: paths[1], puzzle: paths[0], play: paths[3] };
export default function GameHomeDashboard() {
  const [preference, setPreference] = useState(null);
  const suggested = suggestions[preference];
  return <div className="mq-curiosity-home">
    <Header />
    <main className="cq-main">
      <section className="cq-welcome" aria-labelledby="curiosity-title">
        <div>
          <span className="cq-kicker"><Sparkles size={18} aria-hidden="true" /> Welcome to MicrobeQuest</span>
          <h1 id="curiosity-title">What are you curious<br className="cq-desktop-break" /> about today?</h1>
          <p>Big questions. Tiny worlds. Your choice.</p>
          <a className="cq-start" href="#curiosity-choices">Find your next discovery <ArrowRight size={19} aria-hidden="true" /></a>
        </div>
        <aside className="cq-juju" aria-label="Aunt Juju welcomes you">
          <img src="/assets/images/color_graduating_aunt_juju-1760838289072.png" alt="Cartoon Aunt Juju smiling and holding a book" width="144" height="144" />
          <div><strong>Aunt Juju says…</strong><p>“You don’t need to know all the answers. Pick something that makes you wonder. I’ll help you get started.”</p></div>
        </aside>
      </section>

      <details className="cq-helper">
        <summary><HelpCircle size={21} aria-hidden="true" /> Help me choose, Aunt Juju</summary>
        <p>What sounds fun right now? I can suggest a place to start. You can still choose anything.</p>
        <div className="cq-helper-choices" role="group" aria-label="What sounds fun?">
          { [['notice','Noticing something new'],['puzzle','Figuring out a mystery'],['play','Trying a puzzle']].map(([id,label])=><button key={id} type="button" aria-pressed={preference === id} onClick={()=>setPreference(id)}>{label}</button>) }
        </div>
        {suggested && <div className="cq-suggestion" role="status"><strong>You could try: {suggested.title}</strong><p>{suggested.text}</p><Link to={suggested.route}>{suggested.action} <ArrowRight size={18} aria-hidden="true" /></Link><p className="cq-small">Just a suggestion. All the choices below are still yours.</p></div>}
      </details>

      <section id="curiosity-choices" className="cq-choices" aria-labelledby="choices-title">
        <div className="cq-section-heading"><h2 id="choices-title">So many ways to wonder</h2><p>Choose what interests you. There’s no required order.</p></div>
        <div className="cq-grid">{paths.map(({id,icon:Icon,mood,title,question,text,action,route,tag})=><article className={`cq-card cq-${id}`} key={id}>
          <div className="cq-card-top"><span className="cq-art"><Icon size={46} strokeWidth={1.8} aria-hidden="true" /></span><span className="cq-tag">{tag}</span></div>
          <p className="cq-mood">{mood}</p><h3>{title}</h3><p className="cq-question">{question}</p><p className="cq-description">{text}</p>
          <Link className="cq-action" to={route}>{action}<ArrowRight size={18} aria-hidden="true" /></Link>
          {id === 'challenge' && <details className="cq-more-games"><summary>More ways to play</summary><Link to="/quiz-challenge-system">Try a Quiz Challenge <ArrowRight size={16} aria-hidden="true" /></Link></details>}
        </article>)}</div>
      </section>

      <section className="cq-book" aria-labelledby="book-link-title">
        <img src="/assets/images/IMG_2430-1760838191946.PNG" width="104" height="104" alt="Charlie the Zebra" loading="lazy" />
        <div><p className="cq-kicker">The adventure can begin in a book, too</p><h2 id="book-link-title">Meet Aunt Juju &amp; Charlie</h2><p>Already know them from the book? Keep exploring. Meeting them for the first time? Come say hello.</p><Link to="/meet-aunt-juju-charlie">Meet the characters <ArrowRight size={18} aria-hidden="true" /></Link></div>
      </section>
      <nav className="cq-extras" aria-label="More MicrobeQuest options"><Link to="/progress-achievement-hub"><Trophy size={18} aria-hidden="true" /> View saved progress</Link><Link to="/microbe-detective-mystery-outbreak">More detective cases</Link><Link to="/parent-controls-dashboard">For grown-ups: Parent Controls</Link></nav>
      <p className="cq-preview-note">We’re refining these experiences. The Cafeteria Clue shows our newest guided investigation; the other activities are being reviewed next.</p>
    </main>
    <Footer />
  </div>;
}
