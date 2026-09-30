/* The Puzzle Cabinet · tools/gen/knaves.js
 *
 *   node tools/gen/knaves.js        writes data/knights-knaves.js
 *
 * Classic truth-teller puzzles retold in our own words, then puzzles made by
 * the engine's own generator (engines/knaves.js, makePuzzle) with a fixed
 * seed: random islanders, statements from a small grammar, kept only when
 * exactly one assignment fits, graded by the reasoning the hints would use.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'engines/knaves.js'));
const K = C.knaves;
const eng = C.engines.knaves;

const SMULLYAN = 'After Raymond Smullyan, *What Is the Name of This Book?* (1978), the book that first took readers to the island of knights and knaves.';
const KK_INTRO = 'Every native of this island is a **knight**, who always tells the truth, or a **knave**, who always lies.';
const ONE_EACH = [['and', ['cnt', 'knight', 'all', 'eq', 1], ['cnt', 'knave', 'all', 'eq', 1], ['cnt', 'normal', 'all', 'eq', 1]]];
const ONE_SPY = [['and', ['cnt', 'knight', 'all', 'eq', 1], ['cnt', 'knave', 'all', 'eq', 1], ['cnt', 'spy', 'all', 'eq', 1]]];
const DAY = Object.assign({}, K.DAY_VAR);
const DA = Object.assign({}, K.DA_VAR);

const classics = [
  {
    id: 'kk-at-least-one', title: 'At Least One Knave', diff: 1, year: 1978, source: SMULLYAN,
    text: KK_INTRO + '\n\nAt the ferry port you meet Ada and Bram. Ada says: “At least one of us is a knave.” Bram says nothing.\n\nWhat are Ada and Bram?',
    hints: ['Could a knave say this? What would it mean if Ada were a knave?', 'If Ada were a knave, “at least one of us is a knave” would be true — and knaves never say anything true.'],
    explain: 'If Ada were a knave, her words would be true (she herself would be the knave), and a knave cannot say something true. So Ada is a **knight**, her words are true, and since she is not a knave, **Bram** must be one. This is the first kind of puzzle Smullyan used to open the island to his readers.',
    data: { people: ['Ada', 'Bram'], says: [{ s: 0, f: ['cnt', 'knave', 'all', 'ge', 1] }] }
  },
  {
    id: 'kk-either-i-am', title: 'Either I Am a Knave…', diff: 1, year: 1978, source: SMULLYAN,
    text: KK_INTRO + '\n\nOn the harbour wall Cleo tells you: “Either I am a knave or Dex is a knight.” (“Or” allows both.)\n\nWhat are Cleo and Dex?',
    hints: ['Try Cleo as a knave: what does the first half of her sentence become?', 'For a knave, “I am a knave” is true, so the whole “either … or …” would be true.'],
    explain: 'A knave could never say it: for a knave the first half, “I am a knave”, is true, which makes the whole sentence true. So Cleo is a **knight**, the sentence is true, and since its first half is false, the second must hold: **Dex** is a knight too.',
    data: { people: ['Cleo', 'Dex'], says: [{ s: 0, f: ['or', ['is', 0, 'knave'], ['is', 1, 'knight']] }] }
  },
  {
    id: 'kk-both-knaves', title: 'Both of Us', diff: 1, year: 1978, source: SMULLYAN,
    text: KK_INTRO + '\n\nEdda, mending nets, says of herself and her brother Finn: “Finn and I are both knaves.”\n\nWhat are they?',
    hints: ['A knight cannot call herself a knave.', 'So Edda is a knave and her words are false: they are *not* both knaves.'],
    explain: 'A knight could never say it, since it calls her a knave. So Edda is a **knave**, and her words are false: the two are not both knaves. Edda is one, so **Finn** must be a knight.',
    data: { people: ['Edda', 'Finn'], says: [{ s: 0, f: ['cnt', 'knave', [0, 1], 'eq', 2] }] }
  },
  {
    id: 'kk-are-you-a-knight', title: 'Are You a Knight?', diff: 1,
    source: 'A point Smullyan makes early and often: the obvious question tells you nothing.',
    text: KK_INTRO + '\n\nYou walk up to a native — any native — and ask: “Are you a knight?”\n\nWhat answer will you get?',
    hints: ['Try both kinds: what does a knight say? What does a knave say?'],
    explain: 'A knight is a knight and says so: **yes**. A knave is not a knight, but lies about it: also **yes**. The question is useless for telling them apart — which is why the cleverer questions in this drawer exist, and why no islander can ever say “I am a knave”.',
    data: {
      people: ['Gus'],
      ask: {
        kind: 'entail', q: 'What does the native answer?',
        choices: [
          { t: 'Always yes', f: ['ans', 0, ['is', 0, 'knight']] },
          { t: 'Always no', f: ['not', ['ans', 0, ['is', 0, 'knight']]], why: 'A knight would hardly deny being one.' },
          { t: 'Yes from a knight, no from a knave', f: ['iff', ['ans', 0, ['is', 0, 'knight']], ['is', 0, 'knight']], why: 'A knave is not a knight — and lies about it.' }
        ],
        ans: 0, ok: 'Yes — everyone says yes, the knight truthfully and the knave falsely.'
      }
    }
  },
  {
    id: 'kk-of-a-kind', title: 'Of a Kind', diff: 2,
    source: 'A traditional variation on the knights-and-knaves theme.',
    text: KK_INTRO + '\n\nAt the goat pasture, Gus says: “Hattie and I are of the same kind.” Hattie says: “Gus and I are of different kinds.”\n\nWhat are they?',
    hints: ['The two statements say opposite things, so exactly one of them is true.', 'Exactly one true statement means exactly one knight — so they are of different kinds.'],
    explain: 'The two claims contradict each other, so exactly one is true and exactly one of the two is a knight. Then they are of different kinds, so **Hattie** told the truth (a **knight**) and **Gus** lied (a **knave**).',
    data: { people: ['Gus', 'Hattie'], says: [{ s: 0, f: ['same', 0, 1] }, { s: 1, f: ['diff', 0, 1] }] }
  },
  {
    id: 'kk-all-knaves', title: 'We Are All Knaves', diff: 2, year: 1978, source: SMULLYAN,
    text: KK_INTRO + '\n\nThree islanders are sheltering from the rain. Ivo says: “We are all knaves.” Juno says: “Exactly one of us is a knight.” Kit keeps quiet.\n\nWhat are the three?',
    hints: ['Ivo cannot be a knight — his sentence would make him a knave.', 'So not all three are knaves. Try Juno as a knave: who would then be the knight?'],
    explain: 'Ivo cannot be a knight, so he is a **knave** and “we are all knaves” is false: someone is a knight. If Juno were a knave too, Kit would be the only knight — but then Juno’s “exactly one of us is a knight” would be true, which no knave can say. So **Juno** is a knight, there is exactly one knight — Juno — and **Kit** is a knave.',
    data: { people: ['Ivo', 'Juno', 'Kit'], says: [{ s: 0, f: ['cnt', 'knave', 'all', 'eq', 3] }, { s: 1, f: ['cnt', 'knight', 'all', 'eq', 1] }] }
  },
  {
    id: 'kk-chain-of-liars', title: 'Everybody Accuses Somebody', diff: 2,
    source: 'A classic shape of knights-and-knaves puzzle, in the spirit of Smullyan.',
    text: KK_INTRO + '\n\nIn the fish market a quarrel breaks out. Lars says: “Mona is a knave.” Mona says: “Nils is a knave.” Nils says: “Lars and Mona are both knaves.”\n\nWho is who?',
    hints: ['Suppose Nils is a knight. Then Lars is a knave — but what does that do to Lars’s accusation?', 'If Nils were a knight, Lars and Mona would both be knaves, and Lars calling Mona a knave would be true.'],
    explain: 'If Nils were a knight, Lars and Mona would both be knaves — but then Lars’s “Mona is a knave” would be true, and knaves do not say true things. So **Nils** is a knave. Mona said exactly that, so **Mona** is a knight, and Lars, who called her a knave, is a **knave**.',
    data: { people: ['Lars', 'Mona', 'Nils'], says: [{ s: 0, f: ['is', 1, 'knave'] }, { s: 1, f: ['is', 2, 'knave'] }, { s: 2, f: ['cnt', 'knave', [0, 1], 'eq', 2] }] }
  },
  {
    id: 'kk-impossible-sentence', title: 'The Words Nobody Can Say', diff: 2, year: 1978, source: SMULLYAN,
    text: KK_INTRO + '\n\nYou ask Olga whether she is a knight or a knave. A gust of wind carries her answer away. Pip says: “Olga said that she is a knave.” Quill says: “Don’t believe Pip — he is lying.”\n\nWhat are Pip and Quill? And Olga — can you tell? (Mark anyone you cannot pin down with **?**.)',
    hints: ['Could *any* islander say “I am a knave”?', 'A knight saying it would be lying; a knave saying it would be telling the truth.'],
    explain: 'No islander can ever say “I am a knave”: from a knight it would be a lie, from a knave the truth. So Olga did not say it, and **Pip** is lying — a **knave**. **Quill**, who says so, is a **knight**. Of Olga we learn nothing at all. This is how the island dodges the ancient liar’s paradox: the paradoxical sentence simply cannot be spoken there.',
    data: {
      people: ['Olga', 'Pip', 'Quill'], open: true,
      vars: [{ id: 'said', mark: false, s: 'Olga said she is a knave', ns: 'Olga did not say she is a knave' }],
      facts: [['imp', ['var', 'said'], ['ans', 0, ['is', 0, 'knave']]]], factText: ['Olga’s answer, whatever it was, was true to her kind'],
      says: [{ s: 0, t: '(the wind carries the words away)' }, { s: 1, f: ['var', 'said'], t: '“Olga said that she is a knave.”' }, { s: 2, f: ['is', 1, 'knave'], t: '“Don’t believe Pip — he is lying.”' }]
    }
  },
  {
    id: 'kk-silent-third', title: 'The Silent Third', diff: 3, year: 1978, source: SMULLYAN,
    text: KK_INTRO + '\n\nThree islanders sit under the fig tree. Rosa says: “Sven is a knave.” Sven says: “Rosa and Tilly are of the same kind.” Tilly only smiles.\n\nWhat can you tell about each of them? Mark with **?** anyone whose kind cannot be settled.',
    hints: ['Try Rosa both ways. What do you learn about Tilly each time?', 'If Rosa is a knight, Sven is a knave, so Rosa and Tilly differ. If Rosa is a knave, Sven is a knight, so they are alike.'],
    explain: 'If Rosa is a knight, Sven is a knave and his words are false: Rosa and Tilly differ, so **Tilly** is a knave. If Rosa is a knave, Sven is a knight and his words are true: Rosa and Tilly are alike, so Tilly is a knave again. Either way Tilly is a **knave** — while Rosa and Sven could be either (one of each).',
    data: { people: ['Rosa', 'Sven', 'Tilly'], open: true, says: [{ s: 0, f: ['is', 1, 'knave'] }, { s: 1, f: ['same', 0, 2] }] }
  },
  {
    id: 'kk-how-many-knights', title: 'How Many Knights?', diff: 3, year: 1978, source: SMULLYAN,
    text: KK_INTRO + '\n\nYou ask Ulf: “How many knights are there among you three?” Ulf answers, but a passing cart drowns him out. Vera says: “Ulf said there is exactly one knight among us.” Wren says: “Don’t believe Vera — she is lying.”\n\nWhat are Vera and Wren? Can you tell about Ulf?',
    hints: ['Suppose Ulf really said “exactly one”. Try him as a knight, then as a knave.', 'As a knight he would be the only knight, so Wren would be a knave telling the truth about Vera… As a knave, Vera would be truthful — a knight — and then Wren?'],
    explain: 'Suppose Ulf really did say “exactly one knight”. If he were a knight he would be the only one, so Vera and Wren would be knaves — yet Wren’s “Vera is lying” would then be true. If he were a knave, the number of knights would not be one; Vera, reporting truthfully, would be a knight, so Wren would have to be a knight too — yet Wren calls Vera a liar. Either way it falls apart: Ulf never said it. So **Vera** is a knave, **Wren** is a knight, and Ulf remains a mystery.',
    data: {
      people: ['Ulf', 'Vera', 'Wren'], open: true,
      vars: [{ id: 'said', mark: false, s: 'Ulf said there is exactly one knight', ns: 'Ulf did not say that' }],
      facts: [['imp', ['var', 'said'], ['ans', 0, ['cnt', 'knight', 'all', 'eq', 1]]]], factText: ['Ulf’s answer, whatever it was, was true to his kind'],
      says: [{ s: 0, t: '(lost under the rattle of a cart)' }, { s: 1, f: ['var', 'said'], t: '“Ulf said there is exactly one knight among us.”' }, { s: 2, f: ['is', 1, 'knave'], t: '“Don’t believe Vera — she is lying.”' }]
    }
  },
  {
    id: 'kk-what-would-she-say', title: 'What Would Yara Say?', diff: 3, year: 1978, source: SMULLYAN,
    text: KK_INTRO + '\n\nXavi says: “Zed and Yara are of the same kind.” You turn to Yara and ask her: “Are Xavi and Zed of the same kind?”\n\nWhat does Yara answer?',
    hints: ['There are four cases: Xavi knight or knave, Yara knight or knave. Try them all.', 'In each case work out whether Xavi and Zed are alike, then what Yara would say about it.'],
    explain: 'If Xavi is a knight, Zed and Yara are alike: a knight Yara has a knight Xavi and a knight Zed, and truthfully says yes; a knave Yara has a knave Zed, so Xavi and Zed differ and she lies: yes. If Xavi is a knave, Zed and Yara differ: a knight Yara has a knave Zed, alike with Xavi, and truthfully says yes; a knave Yara has a knight Zed, different from Xavi, and lies: yes. Every road leads to **yes**.',
    data: {
      people: ['Xavi', 'Yara', 'Zed'], says: [{ s: 0, f: ['same', 2, 1] }],
      ask: {
        kind: 'entail', q: 'Asked “Are Xavi and Zed of the same kind?”, Yara answers…',
        choices: [
          { t: 'Yes', f: ['ans', 1, ['same', 0, 2]] },
          { t: 'No', f: ['not', ['ans', 1, ['same', 0, 2]]], why: 'Try the four cases one by one.' },
          { t: 'It cannot be told', f: null, why: 'Surprisingly, it can: every case gives the same answer.' }
        ],
        ans: 0, ok: 'Yes: all four possible cases end in the same answer.'
      }
    }
  },
  {
    id: 'kk-two-doors', title: 'The Two Doors', diff: 3,
    source: 'A traditional riddle, told in many forms; Smullyan gives versions of it, and a scene in the film *Labyrinth* (1986) made one famous.',
    text: 'You are shut in a room with two doors. One leads out; the other opens onto a very long drop. Before each door stands a guard. One guard is a **knight** who always tells the truth, the other a **knave** who always lies — and you do not know which is which.\n\nYou may ask one guard one question that can be answered yes or no.',
    hints: ['A question about the doors alone gets opposite answers from the two guards.', 'Make the answer pass through *both* guards: ask about what the other guard would say.'],
    explain: 'Ask either guard what the *other* would say. The knight truthfully reports the knave’s lie; the knave falsely reports the knight’s truth. Either way the answer is the opposite of the truth — so take the door they do not point to.',
    data: {
      people: ['Remy', 'Suki'], scene: 'doors', facts: [['diff', 0, 1]], factText: ['one guard is a knight and the other a knave'],
      vars: [{ id: 'left', mark: false, s: 'the left door leads out', ns: 'the right door leads out' }],
      ask: {
        kind: 'question', to: [0, 1], goal: ['var', 'left'], q: 'Which question tells you the way out, whichever guard you ask?',
        choices: [
          { t: '“Are you a knight?”', f: ['is', 'Y', 'knight'], why: 'Both guards answer yes to that — the knight truthfully, the knave falsely. You learn nothing about the doors.' },
          { t: '“Does the left door lead out?”', f: ['var', 'left'], why: 'The knight and the knave give opposite answers, and you do not know which one you asked.' },
          { t: '“If I asked the other guard whether the left door leads out, would he say yes?”', f: ['ans', 'O', ['var', 'left']] },
          { t: '“Is the other guard a knave?”', f: ['is', 'O', 'knave'], why: 'Both guards say yes — true from the knight, a lie from the knave — and the doors stay a mystery.' }
        ],
        ans: 2, ok: 'Right. Whoever you ask, the answer comes out opposite to the truth: if you hear “yes”, take the right-hand door.'
      }
    }
  },
  {
    id: 'kk-fork-in-the-road', title: 'The Fork in the Road', diff: 4, year: 1978, source: SMULLYAN,
    text: KK_INTRO + '\n\nThe road forks. One branch leads to the village, the other into the swamp. Kofi, a native, sits on the milestone — a knight or a knave, you cannot tell. You may ask him one question he can answer yes or no.',
    hints: ['A plain question about the road fails, because a knave would lie.', 'Make him lie about his own lie: ask what he *would* say if you asked him.'],
    explain: 'Ask: “If I asked you whether the left road leads to the village, would you say yes?” A knight answers honestly about an honest answer. A knave, asked directly, would give the wrong answer — and now he must lie about that, which turns it right again. Either way, “yes” means the left road.',
    data: {
      people: ['Kofi'],
      vars: [{ id: 'left', mark: false, s: 'the left road leads to the village', ns: 'the right road leads to the village' }],
      ask: {
        kind: 'question', to: [0], goal: ['var', 'left'], q: 'Which question shows you the way to the village?',
        choices: [
          { t: '“Does the left road lead to the village?”', f: ['var', 'left'], why: 'A knave would lie, and you cannot tell whether Kofi is one.' },
          { t: '“Are you a knight?”', f: ['is', 'Y', 'knight'], why: 'Every islander answers yes to that — and it says nothing about roads.' },
          { t: '“If I asked you whether the left road leads to the village, would you say yes?”', f: ['ans', 'Y', ['var', 'left']] },
          { t: '“Does the left road lead to the village, and are you a knight?”', f: ['and', ['var', 'left'], ['is', 'Y', 'knight']], why: 'A knave answers yes to that whichever road is right.' }
        ],
        ans: 2, ok: 'Right: knight or knave, “yes” means the left road.'
      }
    }
  },
  {
    id: 'kk-gold', title: 'Is There Gold?', diff: 3, year: 1978, source: SMULLYAN,
    text: KK_INTRO + '\n\nThe old maps say there may be gold buried on this island. You ask Una, a native, and she replies: “There is gold on this island if and only if I am a knight.”\n\nIs there gold? And what is Una? (Mark her **?** if it cannot be told.)',
    hints: ['Try Una as a knight: then her words are true, and the “if and only if” gives…', 'Now try her as a knave: her words are false, so the two sides of “if and only if” must differ.'],
    explain: 'If Una is a knight her words are true, and she is a knight, so there is gold. If she is a knave her words are false; she is not a knight, so for the “if and only if” to fail, there *must* be gold. Either way: **gold** — and no way to tell what Una is.',
    data: {
      people: ['Una'], open: true,
      vars: [{ id: 'gold', name: 'Gold on the island?', what: 'whether there is gold', yes: 'Gold', no: 'None', s: 'there is gold on this island', ns: 'there is no gold on this island', glyph: '◆' }],
      says: [{ s: 0, f: ['iff', ['var', 'gold'], ['is', 0, 'knight']] }]
    }
  },
  {
    id: 'kk-gold-question', title: 'One Question About Gold', diff: 4, year: 1978, source: SMULLYAN,
    text: KK_INTRO + '\n\nYou want to know whether there is gold on the island. You may ask Vic, a native, one question he can answer yes or no. You do not know whether he is a knight or a knave.',
    hints: ['Look back at [[kk-gold]]: what did Una’s sentence have to do with gold?', 'Build the question so that a knave’s lie gets turned around by the question itself.'],
    explain: 'Ask: “Are you a knight if and only if there is gold here?” For a knight the “if and only if” is simply the gold question, answered honestly. For a knave the clause about himself is false, which flips the question — and his lie flips it back. Either way, “yes” means gold.',
    data: {
      people: ['Vic'],
      vars: [{ id: 'gold', mark: false, s: 'there is gold', ns: 'there is no gold' }],
      ask: {
        kind: 'question', to: [0], goal: ['var', 'gold'], q: 'Which question settles whether there is gold?',
        choices: [
          { t: '“Is there gold on this island?”', f: ['var', 'gold'], why: 'A knave would lie, and you cannot tell a knave by looking.' },
          { t: '“Are you a knight if and only if there is gold on this island?”', f: ['iff', ['is', 'Y', 'knight'], ['var', 'gold']] },
          { t: '“Are you a knave?”', f: ['is', 'Y', 'knave'], why: 'Every islander answers no to that, and it is not about gold.' },
          { t: '“Is there gold here, and are you a knight?”', f: ['and', ['var', 'gold'], ['is', 'Y', 'knight']], why: 'A knave answers yes to that whether or not there is gold.' }
        ],
        ans: 1, ok: 'Right: for a knight or a knave alike, “yes” means gold.'
      }
    }
  },
  {
    id: 'kk-three-brothers', title: 'Three Brothers at the Fair', diff: 3, year: 1978, source: SMULLYAN,
    text: 'Three brothers run the coconut shy at the harvest fair. One is a **knight**, who always tells the truth, one a **knave**, who always lies, and one is **normal**: he lies or tells the truth as the mood takes him.\n\nBram says: “I am normal.” Dex says: “That is true.” Finn says: “I am not normal.”\n\nWhich brother is which?',
    hints: ['Bram cannot be the knight: a knight is not normal.', 'Try Bram as the normal brother: Dex would then be telling the truth… and who would be left for Finn?'],
    explain: 'Bram cannot be the knight. If Bram were the normal one, Dex’s “that is true” would be true, so Dex would be the knight and Finn the knave — but a knave cannot truthfully say “I am not normal”. So **Bram** is the knave, his claim is false, and so is Dex’s agreement: Dex is not the knight and must be the **normal** brother, leaving **Finn** as the knight.',
    data: {
      types: ['knight', 'knave', 'normal'], people: ['Bram', 'Dex', 'Finn'], facts: ONE_EACH, factText: ['there is exactly one knight, one knave and one normal among them'],
      says: [{ s: 0, f: ['is', 0, 'normal'] }, { s: 1, f: ['is', 0, 'normal'], t: '“That is true.”' }, { s: 2, f: ['not', ['is', 2, 'normal']] }]
    }
  },
  {
    id: 'kk-spy-trial', title: 'The Spy on Trial', diff: 3,
    source: 'A classic variation on Smullyan’s island, with a spy among the knights and knaves.',
    text: 'Three people stand before the island court: one **knight** (always truthful), one **knave** (always lying) and one **spy**, who lies or not as it suits him.\n\nAda says: “Cleo is a knave.” Bram says: “Ada is a knight.” Cleo says: “I am the spy.”\n\nWho is the spy?',
    hints: ['Cleo cannot be the knight — the knight is not the spy.', 'Suppose Cleo is the spy. Then Ada’s words are false… follow it to Bram.'],
    explain: 'Cleo is not the knight (the knight is not the spy). If Cleo were the spy, Ada’s “Cleo is a knave” would be false, making Ada the knave and Bram the knight — but then Bram’s “Ada is a knight” would be false. So **Cleo** is the knave. Ada spoke truly about her, so Ada is the knight or the spy; if Ada were the spy, Bram would be the knight and his “Ada is a knight” false. So **Ada** is the knight and **Bram** is the spy.',
    data: {
      types: ['knight', 'knave', 'spy'], people: ['Ada', 'Bram', 'Cleo'], facts: ONE_SPY, factText: ['there is exactly one knight, one knave and one spy'],
      says: [{ s: 0, f: ['is', 2, 'knave'] }, { s: 1, f: ['is', 0, 'knight'] }, { s: 2, f: ['is', 2, 'spy'] }]
    }
  },
  {
    id: 'kk-larks-and-owls', title: 'Larks and Owls', diff: 2,
    source: 'A variation on Smullyan’s island made for this cabinet.',
    text: 'On the Twilight Isle, **larks** tell the truth by day and lie by night; **owls** lie by day and tell the truth by night. A sea fog hides the sky, so you cannot tell whether it is day or night.\n\nGwen says: “It is day.” Hugo says: “It is night.”\n\nWhat are Gwen and Hugo? And can you tell the time? (Mark it **?** if not.)',
    hints: ['Can an owl ever say “It is day”? Try it by day, then by night.', 'By day an owl lies — so it would never say the true “it is day”; by night it tells the truth, so it would never say the false “it is day”.'],
    explain: 'An owl can never say “It is day”: by day it lies (and the words would be true), by night it tells the truth (and the words would be false). So **Gwen** is a lark. In the same way only an owl can say “It is night”: **Hugo** is an owl. And the time? Both statements fit either way — the fog keeps its secret.',
    data: { types: ['lark', 'owl'], people: ['Gwen', 'Hugo'], open: true, vars: [DAY], says: [{ s: 0, f: ['var', 'day'] }, { s: 1, f: ['not', ['var', 'day']] }] }
  },
  {
    id: 'kk-da-means', title: 'What Does “Da” Mean?', diff: 2, year: 1978,
    source: 'Smullyan liked natives who answer in words you do not know; George Boolos made the idea famous in “The Hardest Logic Puzzle Ever” (1996).',
    text: 'The natives here are **knights** and **knaves** who understand you perfectly but answer only in their own tongue: **da** or **ja**. One means yes and the other no; you do not know which.\n\nYou ask Iris: “Are you a knight?” She answers: “Da.”\n\nWhat does “da” mean? And is Iris a knight? (Mark **?** where it cannot be told.)',
    hints: ['What does every islander answer to “Are you a knight?”'],
    explain: 'Every islander answers **yes** to “Are you a knight?” — the knight truthfully, the knave falsely. So “da” means **yes**, and Iris could still be either.',
    data: { people: ['Iris'], open: true, vars: [DA], says: [{ s: 0, q: ['is', 0, 'knight'], w: 'da' }] }
  },
  {
    id: 'kk-da-two', title: 'Two Natives, Three Answers', diff: 3,
    source: 'In the spirit of the “da” and “ja” puzzles of Smullyan and Boolos.',
    text: 'Knights and knaves again, answering only **da** or **ja** (yes and no, in some order).\n\nYou ask Jonas: “Is Maud a knight?” — “Da.”\nYou ask Maud: “Are you and Jonas of the same kind?” — “Ja.”\nYou ask Maud: “Are you a knight?” — “Ja.”\n\nWhat are Jonas and Maud, and what does “da” mean?',
    hints: ['Start with the easiest answer: what does anyone say to “Are you a knight?”', 'So “ja” means yes. Now suppose Maud is a knight, and look at Jonas.'],
    explain: 'Everyone says yes to “Are you a knight?”, so “ja” means yes and **“da” means no**. If Maud were a knight, her yes would be true, so Jonas would be a knight too — but then his “no, Maud is not a knight” would be false. So **Maud** is a knave, her yes is a lie, and Jonas is of the other kind: a **knight**, who truthfully said Maud is not one.',
    data: { people: ['Jonas', 'Maud'], vars: [DA], says: [{ s: 0, q: ['is', 1, 'knight'], w: 'da' }, { s: 1, q: ['same', 0, 1], w: 'ja' }, { s: 1, q: ['is', 1, 'knight'], w: 'ja' }] }
  },
  {
    id: 'kk-cretan-poet', title: 'The Cretan Poet', diff: 2, year: -600,
    source: 'Epimenides of Knossos (about 600 BC); the line is quoted in the New Testament, Epistle to Titus 1:12.',
    text: 'The Cretan poet Epimenides is supposed to have said: “All Cretans are liars.”\n\nPut him on our island. Imagine that every Cretan is a **knight** or a **knave**, and that Crete has just three people: Epimenides, Ariadne and Minos.\n\nWhat follows from his words?',
    hints: ['Could Epimenides be a knight?', 'If he is a knave, his words are false. What is the opposite of “all Cretans are liars”?'],
    explain: 'Epimenides cannot be a knight: that would make him a liar. So he is a **knave**, and his words are false — which only means that *not* every Cretan lies: **at least one other Cretan is a knight**. This is the famous “Epimenides paradox”, and it is not really a paradox at all. The true liar’s paradox needs a sentence about itself, like “This sentence is false” — or, on the island, “I am a knave”, which no islander can ever say.',
    data: {
      people: ['Epimenides', 'Ariadne', 'Minos'], says: [{ s: 0, f: ['cnt', 'knave', 'all', 'eq', 3], t: '“All Cretans are liars.”' }],
      ask: {
        kind: 'entail', q: 'What follows?',
        choices: [
          { t: 'Epimenides is a knight.', f: ['is', 0, 'knight'], why: 'Then all Cretans — Epimenides too — would be liars.' },
          { t: 'Nothing: it is a paradox.', f: ['F'], why: 'It only looks like one: there is a way for everything to fit.' },
          { t: 'Epimenides is a knave, and at least one other Cretan is a knight.', f: ['and', ['is', 0, 'knave'], ['cnt', 'knight', [1, 2], 'ge', 1]] },
          { t: 'Every Cretan is a knave.', f: ['cnt', 'knave', 'all', 'eq', 3], why: 'Then Epimenides’ words would be true — and a knave cannot say something true.' }
        ],
        ans: 2, ok: 'Right: he is a liar, and so not every Cretan is.'
      }
    }
  }
];

// how many generated puzzles of each world at each level
const QUOTA = {
  1: { kk: 24 },
  2: { kk: 20, kkn: 4, lo: 6 },
  3: { kk: 16, kkn: 3, lo: 4, da: 4, spy: 3 },
  4: { kk: 14, kkn: 2, lo: 3, da: 3, spy: 4 },
  5: { kk: 10, kkn: 2, spy: 3, da: 2, lo: 1 }
};
const TAGS = { kk: ['knights'], kkn: ['knights', 'normals'], spy: ['knights', 'spies'], lo: ['larks', 'owls', 'day-night'], da: ['da-ja', 'language'] };

const rng = C.rng(19780101);
const usedTitles = new Set(classics.map((c) => c.title));
const placeLists = { kk: K.PLACES, kkn: K.MIXED_PLACES, spy: K.MIXED_PLACES, lo: K.TWILIGHT_PLACES, da: K.DAJA_PLACES };
const placeAt = { kk: 0, kkn: 0, spy: 0, lo: 0, da: 0 };
function nextPlace(wid) {
  const list = placeLists[wid];
  const key = list === K.MIXED_PLACES ? 'kkn' : wid;
  for (;;) {
    const pl = list[placeAt[key]++ % list.length];
    if (!usedTitles.has(pl[0])) { usedTitles.add(pl[0]); return pl; }
    if (placeAt[key] > list.length * 3) throw new Error('out of places for ' + wid);
  }
}
const seen = new Set();
const gen = [];
for (let level = 1; level <= 5; level++) {
  for (const wid of Object.keys(QUOTA[level])) {
    let got = 0, guard = 0;
    while (got < QUOTA[level][wid] && guard++ < 400) {
      const place = placeLists[wid][0];
      const r = K.makePuzzle(rng, level, wid, place);
      if (!r) continue;
      const key = JSON.stringify([r.data.types, r.data.says.map((s) => [s.s, s.f || s.q, s.w]), r.data.people.length]);
      if (seen.has(key)) continue;
      seen.add(key);
      const pl = nextPlace(wid);
      r.title = pl[0];
      r.text = K.dress(rng, r.data, wid, pl);
      gen.push(r);
      got++;
    }
    if (got < QUOTA[level][wid]) console.warn('only ' + got + ' of ' + QUOTA[level][wid] + ' for L' + level + ' ' + wid);
  }
}
gen.sort((a, b) => a.diff - b.diff || a.cost - b.cost);

const lines = [];
lines.push('/* The Puzzle Cabinet · data/knights-knaves.js — made by tools/gen/knaves.js */');
lines.push('Cabinet.family({');
lines.push("  id: 'knights-knaves', engine: 'knaves', cat: 'logic', name: 'Knights and knaves', order: 1,");
lines.push("  blurb: 'On the island, knights always tell the truth and knaves always lie. Listen to the islanders and work out who is who — then meet normals, spies, larks and owls, and natives who answer only da or ja.',");
lines.push("  origin: { year: 1978, who: 'Raymond Smullyan', note: 'Truth-tellers and liars are old: Epimenides the Cretan, the guards at the two doors. Raymond Smullyan built the island of knights and knaves in *What Is the Name of This Book?* (1978) and explored it for the rest of his life. The larks and owls of the Twilight Isle are a variation made for this cabinet; every generated puzzle has exactly one answer, checked by trying every possibility.' },");
lines.push("  concepts: ['truth-logic', 'deduction']");
lines.push('}, [');
const emit = (p) => {
  const keys = Object.keys(p).filter((k) => p[k] != null);
  lines.push('  { ' + keys.map((k) => k + ': ' + JSON.stringify(p[k])).join(',\n    ') + ' },');
};
// the classics with their stored answers
const all = [];
classics.forEach((c) => {
  const A = K.analyse(c.data);
  if (!c.data.ask) c.data.sol = A.ans;
  all.push(Object.assign({ concepts: ['truth-logic'], tags: ['classic'] }, c));
});
gen.forEach((r, i) => {
  all.push({ id: 'kk-' + String(i + 1).padStart(3, '0'), title: r.title, diff: r.diff, text: r.text, data: r.data, tags: TAGS[r.world], _cost: r.cost });
});
all.sort((a, b) => a.diff - b.diff || (a._cost == null ? -1 : 0) - (b._cost == null ? -1 : 0) || (a._cost || 0) - (b._cost || 0));
let bad = 0;
all.forEach((p) => {
  const v = eng.verify(p);
  if (!v.ok) { bad++; console.error('FAILS ' + p.id + ': ' + v.err); }
  delete p._cost;
  emit(p);
});
lines.push(']);');
fs.writeFileSync(path.join(ROOT, 'data/knights-knaves.js'), lines.join('\n') + '\n');
const byDiff = [1, 2, 3, 4, 5].map((d) => all.filter((p) => p.diff === d).length);
console.log('knights-knaves: ' + classics.length + ' classics + ' + gen.length + ' generated = ' + all.length + '; by difficulty ' + byDiff.join('/') + (bad ? '; ' + bad + ' FAIL' : ''));
