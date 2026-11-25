/**
 * Content for "The Way of Everyday Living" course post.
 * Fields documented as "inline HTML" are authored here, never user input, and are rendered with set:html.
 */

export type ConceptGroup = 'seeing' | 'time' | 'work' | 'things' | 'others' | 'body' | 'ikigai';

export interface Concept {
  id: string;
  group: ConceptGroup;
  kanji: string;
  romaji: string;
  /** Literal translation, shown under the romaji. */
  literal: string;
  /** Inline HTML. */
  what: string;
  /** Inline HTML. */
  roots: string;
  /** Inline HTML. */
  daily: string;
  /** Inline HTML. */
  care: string;
  tryThis: string;
}

export interface Root {
  id: string;
  tab: string;
  heading: string;
  /** Inline HTML paragraphs. */
  paragraphs: string[];
  note: string;
}

export interface Sekki {
  /** Month the term begins, 1-12. */
  month: number;
  day: number;
  kanji: string;
  romaji: string;
  meaning: string;
}

export interface QuizQuestion {
  prompt: string;
  options: string[];
  /** Index into options. */
  answer: number;
  explanation: string;
}

export interface Practice {
  id: string;
  label: string;
  concept: string;
  timesPerWeek: number;
  /** Ticked the first time a reader opens the planner. */
  suggested: boolean;
}

/** The lesson of the post each group of concepts belongs to. */
export const conceptLessons: Record<ConceptGroup, number> = {
  seeing: 2,
  time: 3,
  work: 4,
  things: 5,
  others: 6,
  body: 7,
  ikigai: 8,
};

export const concepts: Concept[] = [
  {
    id: 'wabisabi',
    group: 'seeing',
    kanji: '侘寂',
    romaji: 'wabi-sabi',
    literal: '"Rustic solitude" + "the patina of age"',
    what: 'Beauty in things that are imperfect, impermanent and incomplete: a lopsided handmade bowl, moss on stone, a weathered wooden gate. <i>Wabi</i> originally described the loneliness of living apart from society, later reframed as quiet, simple refinement; <i>sabi</i> (related to the verb for rusting or withering) is the beauty that comes with age and use.',
    roots: 'Developed in the 15th–16th-century tea ceremony by Murata Jukō, Takeno Jōō and above all Sen no Rikyū, who replaced ornate Chinese tea wares with rough local pottery and tiny, plain tea rooms.',
    daily: 'Choosing handmade over mass-produced; letting a wooden table show its scratches; leaving a garden slightly wild; arranging a single flower rather than a bouquet.',
    care: 'In Japan the term is rarely said as a compound and many people find it hard to define; it\'s felt more than stated. It is not a licence for messiness or a style to be bought — "wabi-sabi décor" is close to a contradiction.',
    tryThis: 'Find one object you own that has grown more beautiful with use. Spend two minutes just looking at it.',
  },
  {
    id: 'mono',
    group: 'seeing',
    kanji: '物の哀れ',
    romaji: 'mono no aware',
    literal: '"The pathos of things"',
    what: 'A gentle, bittersweet sensitivity to the passing of things — the feeling of watching cherry blossoms fall, knowing that their brevity is exactly what makes them beautiful. It is not grief and not despair, but a deepened appreciation born of transience.',
    roots: 'The phrase is old, but the scholar Motoori Norinaga (1730–1801) made it a central concept, arguing it was the very heart of <i>The Tale of Genji</i> and of Japanese literature. Underneath it is the Buddhist idea of <i>mujō</i>, impermanence.',
    daily: 'Hanami, the springtime custom of picnicking under cherry blossoms; autumn leaf-viewing (<i>momijigari</i>); savoring last days of a season, of a job, of children being small.',
    care: 'Not the same as nostalgia, which longs for the past. Mono no aware is attention to the present precisely because it is passing.',
    tryThis: 'Notice one "last" today: the last warm afternoon, the last page of a book, the last time you\'ll do something in this exact way.',
  },
  {
    id: 'yugen',
    group: 'seeing',
    kanji: '幽玄',
    romaji: 'yūgen',
    literal: '"Dim, deep, mysterious"',
    what: 'A profound grace that is suggested rather than shown — the sense that there is more beyond what can be seen or said. Watching the sun set behind a flower-clad hill; wandering in a forest without thought of return; geese disappearing into clouds.',
    roots: 'From Chinese Buddhist texts, adopted in medieval Japanese poetics, and made the highest ideal of Noh theatre by the actor-playwright Zeami (c. 1363–1443). The poet and recluse Kamo no Chōmei also wrote about it.',
    daily: 'Leaving things unsaid in a letter; preferring a garden path that curves out of sight; a misty morning; art that suggests rather than explains.',
    care: 'Easy to make pretentious. Yūgen is a quality of experience, not a mood you can force. It usually arrives when you stop trying.',
    tryThis: "Next time you're tempted to explain something fully — a photo caption, a gift note — leave one thing unexplained.",
  },
  {
    id: 'ma',
    group: 'time',
    kanji: '間',
    romaji: 'ma',
    literal: '"Interval, gap, space between"',
    what: "The meaningful emptiness between things: the pause between notes in music, the silence in a conversation, the bare space in a room or painting that lets the objects in it breathe. Ma isn't nothing; it is the space that gives form to everything else.",
    roots: 'The character combines "gate" (門) and "sun" (日) — older forms used "moon" — suggesting light seen through a gap. It shapes Japanese architecture (sliding screens, empty alcoves), Noh and kabuki timing, flower arranging, garden design and everyday speech.',
    daily: 'Not filling every silence; leaving gaps between meetings; a bow, a pause, then speaking; uncluttered shelves; ending a conversation slightly early.',
    care: 'A word with ordinary uses too: <i>ma ni au</i> means "to be in time," and <i>manuke</i> (missing the ma) means a fool, someone with bad timing. Ma is about timing and relation, not just minimalism.',
    tryThis: 'In your next conversation, after the other person finishes, wait one full breath before answering.',
  },
  {
    id: 'ichigo',
    group: 'time',
    kanji: '一期一会',
    romaji: 'ichigo ichie',
    literal: '"One time, one meeting"',
    what: 'Every encounter happens only once. Even if you meet the same friend in the same place tomorrow, this meeting will never come again — so host it, and attend to it, with your whole heart.',
    roots: "Rooted in the tea ceremony. Yamanoue Sōji recorded his teacher Sen no Rikyū's advice to treat each gathering as a once-in-a-lifetime occasion; the four-character phrase was popularized by the tea master and statesman Ii Naosuke (1815–1860).",
    daily: 'Putting your phone away at dinner; treating a routine meeting with a colleague as unrepeatable; writing it on a scroll in the entryway, which many tea rooms and restaurants still do.',
    care: 'Not a call for intensity or "making every moment count." It is calmer than that: simple presence and sincerity, because this is the only time this will happen.',
    tryThis: "Choose one ordinary meeting today and treat it as the only one you'll ever have with that person.",
  },
  {
    id: 'shoshin',
    group: 'time',
    kanji: '初心',
    romaji: 'shoshin',
    literal: '"Beginner\'s mind"',
    what: "Approaching even familiar things with the openness, eagerness and lack of preconceptions of a beginner. The expert's mind sees few possibilities; the beginner's sees many.",
    roots: 'Zen Buddhist. Zeami, the Noh master, taught <i>shoshin wasuru bekarazu</i>, "never forget the beginner\'s mind." Sōtō Zen teacher Shunryu Suzuki made it widely known in the West with <i>Zen Mind, Beginner\'s Mind</i> (1970).',
    daily: 'Asking a "stupid" question in a field you know; re-reading a favorite book as if for the first time; letting a junior colleague teach you their way.',
    care: 'Not the same as ignorance or false modesty. The skilled person keeps the skill but loses the arrogance and the assumptions.',
    tryThis: "Pick a task you've done a thousand times. Do it today as if someone just showed you how.",
  },
  {
    id: 'ikigai',
    group: 'ikigai',
    kanji: '生き甲斐',
    romaji: 'ikigai',
    literal: '"Worth of living"',
    what: 'Whatever makes life feel worth living: a reason to get up in the morning. In Japanese usage it can be very small and needs no connection to work or income — a grandchild, a morning walk, a garden.',
    roots: 'An everyday Japanese word for centuries. Studied seriously by psychiatrist Mieko Kamiya (1966). The four-circle Venn diagram is a 2014 Western blog creation.',
    daily: 'Older Japanese people in particular often speak of their ikigai: a hobby circle, a vegetable plot, caring for family, volunteering.',
    care: 'The Western version turns it into a career-optimization tool. The Japanese meaning is gentler: you can have many ikigai, they can be modest, and they can change.',
    tryThis: 'Write down three of your ikigai that have nothing to do with your job.',
  },
  {
    id: 'kaizen',
    group: 'work',
    kanji: '改善',
    romaji: 'kaizen',
    literal: '"Change for the better"',
    what: 'Continuous, incremental improvement by everyone, every day. Instead of dramatic overhauls, you make small, low-risk changes, observe, and adjust. Small changes compound.',
    roots: "An ordinary word meaning improvement. As a management philosophy it grew out of Japan's post-war quality movement — influenced by American trainers such as W. Edwards Deming — and became central to the Toyota Production System. Masaaki Imai's 1986 book made it famous worldwide.",
    daily: 'One small change to a morning routine per week; tidying one drawer, not the house; the habit of asking "what made this harder than it needed to be?"',
    care: "In factories it's team- and process-based, not a lone self-improvement grind. It also rests on respect for people doing the work: kaizen imposed from above, without listening, isn't kaizen.",
    tryThis: 'Find the most annoying small friction in your day. Make one tiny change to it, and check in a week.',
  },
  {
    id: 'shokunin',
    group: 'work',
    kanji: '職人',
    romaji: 'shokunin',
    literal: '"Artisan, craftsperson"',
    what: 'The craftsperson who devotes a lifetime to one craft, seeking not fame but perfection of skill — and, with it, a sense of social obligation to do the work right for the people who will use it. The attitude is called <i>shokunin kishitsu</i>, "artisan spirit."',
    roots: 'Edo-period craft traditions and long apprenticeships: swordsmiths, carpenters, lacquerers, potters, sushi chefs. Many family workshops are many generations old.',
    daily: 'Sharpening your own knives; taking the time to do a thing properly even if no one will notice; staying with one skill for years.',
    care: 'Traditional apprenticeships can be harsh and hierarchical; the romantic picture leaves that out. Not every craftsperson is a shokunin, and the spirit is about service, not just obsession.',
    tryThis: "Do one piece of work today to a standard nobody asked for, because it's the right way to do it.",
  },
  {
    id: 'kodawari',
    group: 'work',
    kanji: '拘り',
    romaji: 'kodawari',
    literal: '"Persistence, fussiness, particular commitment"',
    what: "An uncompromising, personal attention to detail in something you care about: the ramen shop that spends eight hours on its broth; a person's exacting taste in coffee or stationery.",
    roots: 'An ordinary verb, <i>kodawaru</i>. It originally had a negative sense — to be hung up on trivial things — but has shifted to a largely positive meaning of passionate standards. Usually written in kana, こだわり.',
    daily: 'Shops proudly advertising their <i>kodawari</i> ingredients; anyone with a cherished personal way of doing something.',
    care: "Still carries a hint of its old meaning: kodawari that won't bend can be rigidity. Choose your kodawari deliberately — you can't have one about everything.",
    tryThis: 'Name your kodawari — the one thing you care about getting exactly right. Give it ten deliberate minutes today.',
  },
  {
    id: 'shuhari',
    group: 'work',
    kanji: '守破離',
    romaji: 'shuhari',
    literal: '"Protect, break, leave"',
    what: 'Three stages of mastery. <b>Shu</b>: follow the form exactly, imitating the teacher. <b>Ha</b>: break from the form, experiment, understand the principles. <b>Ri</b>: leave the form, creating naturally from your own understanding.',
    roots: 'Used in the tea ceremony, Noh and martial arts; often traced to Edo-period tea teaching (the tea master Kawakami Fuhaku is usually credited), later central to aikido and other budō.',
    daily: "Learning a recipe exactly before improvising; copying a master calligrapher's strokes; agile software teams have even adopted the term.",
    care: 'The order matters: "ri" without "shu" is just doing what you like. It is a long path, measured in years.',
    tryThis: "In something you're learning, ask honestly: am I in shu, ha or ri? What would the next stage look like?",
  },
  {
    id: 'mottainai',
    group: 'things',
    kanji: '勿体無い',
    romaji: 'mottainai',
    literal: '"What a waste!"',
    what: "A feeling of regret when something's value isn't used — food, objects, time, talent. More than thrift, it expresses respect for the thing itself and for the effort that went into it.",
    roots: 'Buddhist: <i>mottai</i> refers to the dignity or essential nature of a thing, and <i>nai</i> means its lack. Kenyan Nobel laureate Wangari Maathai adopted <i>mottainai</i> in 2005 as a global environmental slogan.',
    daily: 'Finishing every grain of rice in the bowl; <i>furoshiki</i> cloths instead of wrapping paper; mending clothes; reusing bath water for laundry.',
    care: 'Can tip into hoarding — everything feels too mottainai to discard. That is exactly why it pairs with danshari.',
    tryThis: 'Before you throw anything out today, ask: could this be eaten, mended, reused or given?',
  },
  {
    id: 'danshari',
    group: 'things',
    kanji: '断捨離',
    romaji: 'danshari',
    literal: '"Refuse, discard, separate"',
    what: "Decluttering as a mental discipline. <b>Dan</b>: refuse what you don't need from entering your life. <b>Sha</b>: dispose of the clutter you have. <b>Ri</b>: separate yourself from attachment to material things.",
    roots: "Popularized by Hideko Yamashita in her 2009 book, taking the three characters from yoga ideas of renunciation. A modern movement, a cousin of Marie Kondo's method.",
    daily: 'Declining freebies; one-in, one-out rules; clearing a shelf until only what you use and love remains.',
    care: 'Not about owning as little as possible for its own sake. The aim is a lighter relationship with things — and, with mottainai, passing on what you no longer need rather than trashing it.',
    tryThis: '"Dan" first: today, refuse one thing you\'d normally accept — a receipt, a bag, a free sample, a subscription.',
  },
  {
    id: 'kintsugi',
    group: 'things',
    kanji: '金継ぎ',
    romaji: 'kintsugi',
    literal: '"Golden joinery"',
    what: "Mending broken pottery with urushi lacquer dusted with gold, so the repair is highlighted rather than hidden. The break becomes part of the object's history and often its most admired feature.",
    roots: 'Associated with the 15th century. A popular story says the shogun Ashikaga Yoshimasa sent a cracked Chinese tea bowl for repair, got it back crudely stapled, and Japanese craftsmen found a more beautiful way. It grew alongside the wabi aesthetic of tea.',
    daily: 'Mending rather than replacing; visible mending (sashiko stitching) of clothes; the metaphor of honoring your own scars and recoveries.',
    care: 'Real kintsugi uses urushi, which is a skin irritant and takes weeks to cure; "kintsugi kits" with epoxy are a modern shortcut. The metaphor is lovely but shouldn\'t become a demand to find gold in every wound.',
    tryThis: 'Repair something this week instead of replacing it — and leave the repair visible.',
  },
  {
    id: 'wa',
    group: 'others',
    kanji: '和',
    romaji: 'wa',
    literal: '"Harmony, peace, Japan itself"',
    what: 'Group harmony: the effort to keep relationships smooth, avoid open conflict and put the group\'s cohesion ahead of individual self-assertion. The character is also used to mean "Japanese," as in <i>washoku</i> (Japanese food).',
    roots: "The first article of Prince Shōtoku's Seventeen-Article Constitution (traditionally dated 604) makes harmony the highest value. Strongly Confucian in flavor.",
    daily: 'Reading the room (<i>kūki wo yomu</i>, "reading the air"); careful consensus-building before meetings (<i>nemawashi</i>); indirect refusals.',
    care: 'The most double-edged idea here. Wa can mean peaceful cooperation, or suppressed dissent, conformity and "the nail that sticks up gets hammered down." Harmony should not cost honesty.',
    tryThis: 'In a disagreement this week, try stating your view clearly and kindly, while also naming what you share with the other person.',
  },
  {
    id: 'omotenashi',
    group: 'others',
    kanji: '御持て成し',
    romaji: 'omotenashi',
    literal: '"Wholehearted hospitality"',
    what: 'Hospitality that anticipates a guest\'s needs before they are expressed, offered sincerely and without expectation of reward. Often glossed as "omote-nashi": with no front, no pretense.',
    roots: 'The tea ceremony, where the host prepares every detail — the flower, the scroll, the sweets, the season — for the guest\'s experience. It became famous worldwide after Tokyo\'s 2013 Olympic bid presentation. (The "no front" etymology is popular but debated.)',
    daily: 'The warm towel at a restaurant; an umbrella left at the door when it rains; ryokan staff who remember your preferences; no tipping.',
    care: "For workers it can mean exhausting emotional labor, and it can feel scripted. At its best it's attention, not performance.",
    tryThis: 'Prepare one small thing for someone before they need it: a glass of water, a charged cable, a printed map.',
  },
  {
    id: 'gaman',
    group: 'others',
    kanji: '我慢',
    romaji: 'gaman',
    literal: '"Enduring with patience and dignity"',
    what: 'Bearing the seemingly unbearable with patience, self-control and grace, often so as not to burden others. Admired, for example, in the orderly calm of survivors after the 2011 Tōhoku earthquake and tsunami.',
    roots: 'Buddhist — but surprisingly, the original Buddhist term meant pride or self-conceit, an attachment to the self. Over centuries it shifted to mean self-restraint. Also famously associated with Japanese Americans in the WWII internment camps, whose handmade objects were shown in the exhibition "The Art of Gaman."',
    daily: 'Parents saying <i>gaman shite</i> ("bear with it") to children; patience in queues and crowded trains.',
    care: "Gaman can make people endure overwork, illness or mistreatment in silence. Endurance is a virtue when the situation can't be changed — not when it can.",
    tryThis: 'Notice the difference today between something you should endure and something you should change.',
  },
  {
    id: 'shinrin',
    group: 'body',
    kanji: '森林浴',
    romaji: 'shinrin-yoku',
    literal: '"Forest bathing"',
    what: 'Being in a forest slowly and attentively, taking in the atmosphere through all the senses. No hiking goals, no fitness tracking: just being among trees.',
    roots: "Coined in 1982 by Japan's Forestry Agency (its director Tomohide Akiyama is usually credited) as a public-health campaign. Researchers such as Qing Li have studied effects on stress markers; results are promising, though many studies are small.",
    daily: 'Designated "forest therapy" trails in Japan; a slow lunchtime walk in a park; sitting under a tree.',
    care: "Modern, not ancient — though rooted in Shinto reverence for forests and sacred trees. And you don't need a guide or a fee; a local park counts.",
    tryThis: 'Walk among trees for 20 minutes, slower than feels natural. Count five things you can hear.',
  },
  {
    id: 'hara',
    group: 'body',
    kanji: '腹八分目',
    romaji: 'hara hachi bu',
    literal: '"Belly eight parts (of ten)"',
    what: 'An old saying advising people to stop eating before they are completely full. It is associated with the long-lived elders of Okinawa, who traditionally said it before meals.',
    roots: 'A Confucian-influenced teaching on moderation; the Edo-period scholar Kaibara Ekiken wrote similar advice in his health classic <i>Yōjōkun</i> (1713).',
    daily: 'Eating slowly from small dishes; pausing mid-meal to check in; Japanese set meals with many small portions.',
    care: 'Best understood as mindful, unhurried eating — not a diet rule or something to measure. If food and restriction are fraught for you, skip this one.',
    tryThis: 'At one meal today, eat slowly and pause halfway to notice how you actually feel.',
  },
  {
    id: 'itadaki',
    group: 'body',
    kanji: '頂きます',
    romaji: 'itadakimasu',
    literal: '"I humbly receive"',
    what: 'The phrase said with hands together before every meal, paired with <i>gochisōsama deshita</i> after. It thanks not only the cook but the farmers, the fishermen, and the plants and animals whose lives became the meal.',
    roots: 'From the humble verb for receiving something from a superior; often linked to Buddhist and Shinto gratitude for life given.',
    daily: 'Said by nearly everyone in Japan, at home, in school lunches, even alone. Perhaps the most universally practiced idea in this course.',
    care: "It's not a religious grace in the Western sense, and it's said casually — but the gratitude in it is real.",
    tryThis: 'Before each meal today, pause for one breath and think of one person or thing that made it possible.',
  },
];

export const roots: Root[] = [
  {
    id: 'shinto',
    tab: 'Shinto 神道',
    heading: 'Shinto: the sacred in the ordinary world',
    paragraphs: ["Japan's indigenous tradition has no founder and little doctrine. It centers on <i>kami</i> — the sacred presences in mountains, rivers, old trees, ancestors and natural forces — and on <b>purity</b> (cleansing what is soiled) and <b>gratitude</b>.", '<b>What it gives everyday life:</b> reverence for nature and the seasons; the habit of cleaning as a quasi-spiritual act (Japanese schoolchildren clean their own classrooms); rope-wrapped sacred trees; washing hands and mouth before entering a shrine; New Year shrine visits; the sense that materials — wood, paper, stone — have their own life.'],
    note: 'Concepts with Shinto roots in this course: shinrin-yoku, itadakimasu, the care for materials behind mottainai.',
  },
  {
    id: 'buddhism',
    tab: 'Buddhism 仏教',
    heading: 'Buddhism, especially Zen: impermanence and attention',
    paragraphs: ['Buddhism arrived from Korea and China in the 6th century. Its teaching of <i>mujō</i> — that everything is impermanent — runs under the whole Japanese aesthetic. <b>Zen</b>, which flourished from the 12th–13th centuries, made ordinary acts (sitting, sweeping, cooking, serving tea) into practice, and shaped the arts of tea, ink painting, gardens and calligraphy.', '<b>What it gives everyday life:</b> appreciation of transience; meditation; simplicity; the idea that enlightenment is found in "chopping wood, carrying water"; respect for the dignity of all things; a gentle humility before what we don\'t control.'],
    note: 'Concepts with Buddhist roots: wabi-sabi, mono no aware, yūgen, ma, shoshin, ichigo ichie, mottainai, gaman.',
  },
  {
    id: 'confucianism',
    tab: 'Confucianism 儒教',
    heading: 'Confucianism: roles, relationships and self-cultivation',
    paragraphs: ['Confucian thought came from China alongside Buddhism, and became the official ethic of the Tokugawa shogunate (1603–1868). It is less a religion than a social philosophy of right relationships: parent and child, teacher and student, senior and junior, ruler and subject.', '<b>What it gives everyday life:</b> respect for elders and teachers; the senpai–kōhai (senior–junior) relationship at school and work; emphasis on education and diligent self-improvement; moderation; group harmony and duty to family and community.'],
    note: 'Concepts with Confucian roots: wa, hara hachi bu, shuhari and the master–apprentice road of the shokunin, and much of the ethic behind kaizen.',
  },
  {
    id: 'ways',
    tab: 'The arts of the Way 道',
    heading: 'The "Ways": where the three traditions meet',
    paragraphs: ['Medieval and early-modern Japan blended these roots into practical arts called <i>-dō</i>, "ways": <b>sadō</b> (tea), <b>kadō</b> (flower arranging), <b>shodō</b> (calligraphy), <b>kōdō</b> (incense), and the martial <b>budō</b>. Each is a skill — and also a lifelong discipline of attention, etiquette and self-cultivation.', 'The tea ceremony is the great meeting point: Zen simplicity and presence, Shinto purity (the host cleans each utensil in front of the guest), Confucian etiquette and respect. A remarkable share of the ideas in this course, from wabi-sabi to ichigo ichie to omotenashi, come from the tea room.'],
    note: 'The lesson of the Ways for everyday life: any repeated act, done with full attention and care, can become a practice.',
  },
];

/** The 24 solar terms, in order from the beginning of spring. Six per season. */
export const sekki: Sekki[] = [
  { month: 2, day: 4, kanji: '立春', romaji: 'Risshun', meaning: 'Beginning of spring' },
  { month: 2, day: 19, kanji: '雨水', romaji: 'Usui', meaning: 'Rain water' },
  { month: 3, day: 5, kanji: '啓蟄', romaji: 'Keichitsu', meaning: 'Insects awaken' },
  { month: 3, day: 20, kanji: '春分', romaji: 'Shunbun', meaning: 'Spring equinox' },
  { month: 4, day: 4, kanji: '清明', romaji: 'Seimei', meaning: 'Pure and clear' },
  { month: 4, day: 20, kanji: '穀雨', romaji: 'Kokuu', meaning: 'Grain rain' },
  { month: 5, day: 5, kanji: '立夏', romaji: 'Rikka', meaning: 'Beginning of summer' },
  { month: 5, day: 21, kanji: '小満', romaji: 'Shōman', meaning: 'Lesser ripening' },
  { month: 6, day: 5, kanji: '芒種', romaji: 'Bōshu', meaning: 'Grain in ear' },
  { month: 6, day: 21, kanji: '夏至', romaji: 'Geshi', meaning: 'Summer solstice' },
  { month: 7, day: 7, kanji: '小暑', romaji: 'Shōsho', meaning: 'Lesser heat' },
  { month: 7, day: 22, kanji: '大暑', romaji: 'Taisho', meaning: 'Greater heat' },
  { month: 8, day: 7, kanji: '立秋', romaji: 'Risshū', meaning: 'Beginning of autumn' },
  { month: 8, day: 23, kanji: '処暑', romaji: 'Shosho', meaning: 'Heat retreats' },
  { month: 9, day: 7, kanji: '白露', romaji: 'Hakuro', meaning: 'White dew' },
  { month: 9, day: 23, kanji: '秋分', romaji: 'Shūbun', meaning: 'Autumn equinox' },
  { month: 10, day: 8, kanji: '寒露', romaji: 'Kanro', meaning: 'Cold dew' },
  { month: 10, day: 23, kanji: '霜降', romaji: 'Sōkō', meaning: 'Frost descends' },
  { month: 11, day: 7, kanji: '立冬', romaji: 'Rittō', meaning: 'Beginning of winter' },
  { month: 11, day: 22, kanji: '小雪', romaji: 'Shōsetsu', meaning: 'Lesser snow' },
  { month: 12, day: 7, kanji: '大雪', romaji: 'Taisetsu', meaning: 'Greater snow' },
  { month: 12, day: 21, kanji: '冬至', romaji: 'Tōji', meaning: 'Winter solstice' },
  { month: 1, day: 5, kanji: '小寒', romaji: 'Shōkan', meaning: 'Lesser cold' },
  { month: 1, day: 20, kanji: '大寒', romaji: 'Daikan', meaning: 'Greater cold' },
];

export const quizQuestions: QuizQuestion[] = [
  {
    prompt: 'Your favorite mug cracks. Instead of gluing it invisibly, you have the crack filled with lacquer and gold powder.',
    options: ['Wabi-sabi', 'Kintsugi', 'Mottainai', 'Kaizen'],
    answer: 1,
    explanation: 'Kintsugi — golden joinery — makes the repair visible and beautiful. It expresses wabi-sabi and mottainai, but the practice itself is kintsugi.',
  },
  {
    prompt: 'On the last evening of cherry-blossom season you feel a quiet sadness that makes the flowers more beautiful, not less.',
    options: ['Yūgen', 'Gaman', 'Mono no aware', 'Ichigo ichie'],
    answer: 2,
    explanation: 'Mono no aware: the gentle pathos of things passing.',
  },
  {
    prompt: "A tea host prepares as though this gathering with old friends will never happen again — because, in this exact form, it won't.",
    options: ['Ichigo ichie', 'Omotenashi', 'Wa', 'Shoshin'],
    answer: 0,
    explanation: 'Ichigo ichie: one time, one meeting. (Omotenashi describes the host\'s anticipating care — close, but the "only once" idea is ichigo ichie.)',
  },
  {
    prompt: 'Your team makes one small improvement to its workflow every week, tests it, and keeps what works.',
    options: ['Shokunin', 'Kaizen', 'Danshari', 'Kodawari'],
    answer: 1,
    explanation: 'Kaizen: continuous, incremental, everyone-involved improvement.',
  },
  {
    prompt: 'A senior surgeon watches a new technique demonstration as eagerly and openly as a first-year student.',
    options: ['Shuhari', 'Shoshin', 'Gaman', 'Ikigai'],
    answer: 1,
    explanation: "Shoshin, beginner's mind: expertise without the closed mind.",
  },
  {
    prompt: "The silence after a Noh actor's movement feels as meaningful as the movement itself.",
    options: ['Ma', 'Yūgen', 'Wa', 'Mujō'],
    answer: 0,
    explanation: 'Ma: the meaningful interval. (The mysterious depth it can evoke is yūgen — but the pause itself is ma.)',
  },
  {
    prompt: "A calligraphy student spends three years copying her teacher's strokes exactly before beginning to develop her own style.",
    options: ['Kodawari', 'Shuhari', 'Kaizen', 'Shokunin'],
    answer: 1,
    explanation: 'Shuhari: protect the form, break the form, leave the form. She is in "shu."',
  },
  {
    prompt: 'Where did the famous four-circle "ikigai" Venn diagram come from?',
    options: ["Okinawan elders' teaching", "Mieko Kamiya's 1966 book", 'A 2014 Western blog post that merged an existing purpose diagram with the word', "Toyota's training manual"],
    answer: 2,
    explanation: 'Marc Winn\'s 2014 blog post placed "ikigai" in Andrés Zuzunaga\'s purpose diagram. Japanese ikigai is broader and gentler.',
  },
  {
    prompt: 'Who coined "shinrin-yoku" (forest bathing)?',
    options: ['A Zen monk in the 13th century', "Japan's Forestry Agency in 1982", 'The poet Bashō', 'Sen no Rikyū'],
    answer: 1,
    explanation: 'It was a 1982 government public-health campaign — a modern idea with Shinto-flavored roots.',
  },
  {
    prompt: 'Which scholar made mono no aware a central concept of Japanese literature, using it to explain The Tale of Genji?',
    options: ['Motoori Norinaga', 'Zeami', 'Yoshida Kenkō', 'Okakura Kakuzō'],
    answer: 0,
    explanation: 'Motoori Norinaga (1730–1801), the great scholar of the National Learning movement.',
  },
  {
    prompt: 'In its original Buddhist usage, what did "gaman" mean?',
    options: ['Endurance', 'Compassion', 'Pride or self-conceit', 'Emptiness'],
    answer: 2,
    explanation: 'Surprisingly, it meant pride or attachment to the self. It later shifted to mean self-restraint and endurance.',
  },
  {
    prompt: 'Before discarding a half-used notebook, you stop and think: someone made this, and it still has value.',
    options: ['Danshari', 'Mottainai', 'Wabi-sabi', 'Itadakimasu'],
    answer: 1,
    explanation: 'Mottainai: regret at wasting the worth of a thing. Danshari would say to let it go — ideally by passing it on.',
  },
];

export const practices: Practice[] = [
  { id: 'ma', label: 'One-minute ma pause between tasks', concept: 'Ma', timesPerWeek: 7, suggested: true },
  { id: 'ichigo', label: 'Phone-free meal with one person', concept: 'Ichigo ichie', timesPerWeek: 3, suggested: false },
  { id: 'itadaki', label: 'One breath of thanks before eating', concept: 'Itadakimasu', timesPerWeek: 7, suggested: true },
  { id: 'shinrin', label: '20-minute slow walk among trees', concept: 'Shinrin-yoku', timesPerWeek: 2, suggested: true },
  { id: 'kaizen', label: 'One tiny improvement to a routine', concept: 'Kaizen', timesPerWeek: 1, suggested: false },
  { id: 'danshari', label: 'Clear one drawer or shelf', concept: 'Danshari', timesPerWeek: 1, suggested: false },
  { id: 'mottainai', label: 'Use up, mend or give away one thing', concept: 'Mottainai', timesPerWeek: 2, suggested: false },
  { id: 'shoshin', label: 'Do a familiar task as a beginner', concept: 'Shoshin', timesPerWeek: 2, suggested: false },
  { id: 'mono', label: 'Note one passing thing of the season', concept: 'Mono no aware', timesPerWeek: 7, suggested: false },
  { id: 'omote', label: 'Anticipate one need for someone', concept: 'Omotenashi', timesPerWeek: 3, suggested: false },
  { id: 'shokunin', label: 'Ten minutes of careful craft', concept: 'Shokunin', timesPerWeek: 3, suggested: false },
  { id: 'ikigai', label: 'Write down one small ikigai', concept: 'Ikigai', timesPerWeek: 2, suggested: false },
];
