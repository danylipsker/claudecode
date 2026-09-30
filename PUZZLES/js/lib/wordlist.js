/* The Puzzle Cabinet · js/lib/wordlist.js
 *
 * A family dictionary for the word puzzles: everyday English words of three
 * to seven letters, written out by hand (no obscure, archaic or rude words).
 *
 *   CORE   common words. Word ladders are built only from these, so every
 *          step of a par ladder is a word anyone knows.
 *   MORE   good words that are a little less common. They are accepted when
 *          you type them, and anagram answers are checked against them too.
 *   THEMES word lists for the anagram sets (animals, countries, …); the
 *          common nouns among them are accepted as words as well.
 *
 * A trailing + also adds the word's -s form: cat+ gives cats, box+ boxes,
 * city+ cities. Irregular forms are written out.
 *
 *   Cabinet.words.has('tail')  isCore(w)  list(n, coreOnly)  key(w)
 *   anagrams(letters)  theme(id)  themeIds  pairs()  clean(s)
 */
(function (root) {
  'use strict';
  const C = root.Cabinet = root.Cabinet || {};

  const CORE = [
    /* ---------- three letters ---------- */
    `ace+ act+ add+ age+ ago aid+ aim+ air+ ale all and ant+ any ape+ apt arc+ are ark+ arm+ art+ ash ask+ ate awe axe+
    bad bag+ ban+ bar+ bat+ bay+ bed+ bee+ beg+ bet+ bib+ bid+ big bin+ bit+ boa+ bog+ bow+ box+ boy+ bud+ bug+ bun+ bus+ but buy+ bye
    cab+ can+ cap+ car+ cat+ cod cog+ cot+ cow+ cry cub+ cue+ cup+ cut+
    dad+ dam+ day+ den+ dew did die+ dig+ dim+ dip+ doe+ dog+ dot+ dry dug due+ duo+ dye+
    ear+ eat+ ebb egg+ ego+ eel+ elf elk+ elm+ emu+ end+ era+ eve eye+
    fan+ far fat fed fee+ few fib+ fig+ fin+ fir+ fit+ fix fly foe+ fog fox for fry fun fur
    gap+ gas gel gem+ get+ gig+ gnu+ god+ got gum+ gun+ gut+ guy+ gym+
    had ham+ has hat+ hay hem+ hen+ her hey hid him hip+ his hit+ hog+ hop+ hot how hub+ hue+ hug+ hum+ hut+
    ice icy ill imp+ ink inn+ ion+ its ivy
    jab+ jam+ jar+ jaw+ jay+ jet+ jig+ job+ jog+ jot+ joy+ jug+
    keg+ key+ kid+ kin kit+
    lab+ lad+ lag lap+ law+ lay+ led leg+ let+ lid+ lie+ lip+ lit log+ lot+ low
    mad man map+ mat+ may men met mid mix mob+ mop+ mud mug+ mum+
    nag+ nap+ net+ new nib+ nil nip+ nod+ nor not now nun+ nut+
    oak+ oar+ oat+ odd off oil+ old one+ opt+ orb+ ore+ our out owe+ owl+ own+
    pad+ pal+ pan+ par pat+ paw+ pay+ pea+ peg+ pen+ pet+ pie+ pig+ pin+ pit+ pod+ pop+ pot+ pro+ pub+ pug+ pun+ pup+ put+
    rag+ ram+ ran rap+ rat+ raw ray+ red rib+ rid rig+ rim+ rip+ rob+ rod+ rot+ row+ rub+ rug+ run+ rut+ rye
    sad sap sat saw+ say+ sea+ see+ set+ sew+ she shy sip+ sir sit+ six ski+ sky sly sob+ son+ sow+ soy spa+ spy sty sub+ sum+ sun+
    tab+ tag+ tan tap+ tar tax tea+ ten+ the tie+ tin+ tip+ toe+ ton+ too top+ tot+ tow+ toy+ try tub+ tug+ two+
    urn+ use+ van+ vat+ vet+ via vow+
    wag+ war+ was wax way+ web+ wed wet who why wig+ win+ wit+ wok+ won wow
    yak+ yam+ yes yet yew+ you zip+ zoo+`,

    /* ---------- four letters ---------- */
    `able ache+ acid+ acre+ aged ajar ally also alto+ amid anew arch+ area+ aria+ arid army atom+ aunt+ auto+ avid away awry axis axle+
    baby back+ bait+ bake+ bald bale+ ball+ balm band+ bang+ bank+ bard+ bare bark+ barn+ base+ bash bass bath+ bead+ beak+ beam+ bean+ bear+ beat+ beef been beer+ beet+ bell+ belt+ bend+ bent best bias bike+ bill+ bind+ bird+ bite+ bled blew blot+ blow+ blue+ blur+ boar+ boat+ body bold bolt+ bomb+ bond+ bone+ book+ boom+ boot+ bore+ born boss both bout+ bowl+ brag+ bran bred brew+ brim+ brow+ buck+ bulb+ bulk bull+ bump+ bunk+ buoy+ burn+ bury bush bust busy buzz
    cafe+ cage+ cake+ calf calm+ came camp+ cane+ cape+ card+ care+ cart+ case+ cash cask+ cast+ cave+ cell+ cent+ chat+ chef+ chew+ chin+ chip+ chop+ cite+ city clad clam+ clan+ clap+ claw+ clay clip+ clog+ clot+ club+ clue+ coal+ coat+ coax code+ coil+ coin+ cola+ cold+ colt+ comb+ come+ cone+ cook+ cool+ cope+ copy cord+ core+ cork+ corn+ cost+ cosy cozy cove+ crab+ crew+ crib+ crop+ crow+ cube+ cuff+ cult+ curb+ cure+ curl+ cute
    dame+ damp dare+ dark dart+ dash data date+ dawn+ dead deaf deal+ dean+ dear+ debt+ deck+ deed+ deem+ deep deer dent+ deny desk+ dial+ dice diet+ dime+ dine+ dirt disc+ dish dive+ dock+ does doll+ dome+ done doom door+ dose+ dove+ down+ doze+ drab drag+ draw+ drew drip+ drop+ drug+ drum+ dual duck+ duel+ duet+ duke+ dull dump+ dune+ dusk dust duty
    each earl+ earn+ ease east easy echo edge+ edit+ else emit+ envy epic+ even ever evil exam+ exit+
    face+ fact+ fade+ fail+ fair+ fake+ fall+ fame fang+ fare+ farm+ fast+ fate+ fawn+ fear+ feat+ feed+ feel+ feet fell+ felt fern+ feud+ file+ fill+ film+ find+ fine+ fire+ firm+ fish fist+ five+ flag+ flap+ flat+ flaw+ flea+ fled flee+ flew flex flip+ flop+ flow+ foal+ foam foil+ fold+ folk+ fond font+ food+ fool+ foot fork+ form+ fort+ foul four+ fowl free fret frog+ from fuel+ full fume+ fund+ fury fuse+ fuss
    gain+ gale+ game+ gang+ gape gasp+ gate+ gave gaze gear+ gene+ germ+ gift+ girl+ gist give+ glad glee glow+ glue+ gnat+ gnaw+ goal+ goat+ goes gold golf gone good+ gown+ grab+ gram+ gray grew grey grid+ grim grin+ grip+ grit grow+ grub+ gulf+ gull+ gulp+ gust+
    hail hair+ half hall+ halo+ halt+ hand+ hang+ hard hare+ harm+ harp+ hate+ haul+ have hawk+ haze hazy head+ heal+ heap+ hear+ heat+ heel+ heir+ held helm+ help+ hemp herb+ herd+ here hero hers hide+ high hike+ hill+ hilt+ hind hint+ hire+ hiss hive+ hoax hold+ hole+ holy home+ hood+ hoof hook+ hoop+ hoot+ hope+ horn+ hose+ host+ hour+ howl+ huge hull+ hung hunt+ hurl+ hurt+ hush hymn+
    icon+ idea+ idle idol+ inch into iris iron+ isle+ itch item+
    jack+ jade jail+ jazz jeep+ jest+ join+ joke+ jolt+ judo jump+ junk jury just
    keel+ keen keep+ kept kick+ kill+ kiln+ kilt+ kind+ king+ kiss kite+ kiwi+ knee+ knew knit+ knob+ knot+ know+
    lace+ lack+ lady laid lake+ lamb+ lame lamp+ land+ lane+ lard lark+ lash last+ late lava lawn+ lazy lead+ leaf leak+ lean+ leap+ leek+ left lend+ lens less lest liar+ lick+ lied life lift+ like+ lily limb+ lime+ limp line+ link+ lion+ list+ live+ load+ loaf loan+ lobe+ lock+ loft+ logo+ lone long+ look+ loom+ loop+ loot lord+ lore lose+ loss lost loud love+ luck lull lump+ lung+ lure+ lurk+ lush lute+ lynx
    made maid+ mail+ main make+ male+ mall+ malt mane+ many mare+ mark+ mash mask+ mass mast+ mate+ math maze+ meal+ mean+ meat+ meek meet+ melt+ memo+ mend+ menu+ mere mesh mess mice mild mile+ milk mill+ mime+ mind+ mine+ mint+ miss mist+ mite+ moan+ moat+ mock+ mode+ mole+ monk+ mood+ moon+ moor+ moss most moth+ move+ much muck mule+ muse+ mush musk must mute myth+
    nail+ name+ navy near neat neck+ need+ nest+ newt+ news next nice nine+ node+ none nook+ noon norm+ nose+ note+ noun+ numb
    oath+ obey+ oboe+ odds ogre+ oily okay omen+ omit+ once only onto ooze opal+ open+ oral oval+ oven+ over
    pace+ pack+ pact+ page+ paid pail+ pain+ pair+ pale palm+ pane+ pang+ park+ part+ pass past+ path+ pave+ pawn+ peak+ peal+ pear+ peat peck+ peel+ peer+ pelt+ pest+ pick+ pier+ pike+ pile+ pill+ pine+ pink+ pint+ pipe+ pity plan+ play+ plea+ plod+ plot+ plow+ ploy+ plug+ plum+ plus poem+ poet+ poke+ pole+ poll+ polo pond+ pony pool+ poor pork port+ pose+ post+ pour+ pout+ pray+ prey prim prod+ prop+ puff+ pull+ pulp puma+ pump+ pure purr+ push putt+
    quay+ quit+ quiz
    race+ rack+ raft+ rage raid+ rail+ rain+ rake+ ramp+ rang rank+ rare rash rate+ rave+ read+ real reap+ rear+ reed+ reef+ reel+ rein+ rely rent+ rest+ rice rich ride+ rift+ ring+ rink+ riot+ ripe rise+ risk+ road+ roam+ roar+ robe+ rock+ rode role+ roll+ roof+ rook+ room+ root+ rope+ rose+ rosy ruby rude ruin+ rule+ rung+ rush rust
    sack+ safe+ saga+ sage sail+ sake sale+ salt+ same sand+ sane sang sank save+ scan+ scar+ seal+ seam+ seat+ seed+ seek+ seem+ seen seep+ self sell+ send+ sent sewn shed+ ship+ shoe+ shop+ shot+ show+ shut+ sick side+ sift+ sigh+ sign+ silk+ sill+ silt sing+ sink+ site+ size+ skid+ skin+ skip+ slab+ slam+ slap+ sled+ slid slim slip+ slit+ slot+ slow+ slug+ smog snap+ snip+ snob+ snow+ snug soak+ soap+ soar+ sock+ soda+ sofa+ soft soil+ sold sole+ some song+ soon soot sore+ sort+ soul+ soup+ sour sown span+ sped spin+ spit spot+ spun spur+ stab+ stag+ star+ stay+ stem+ step+ stew+ stir+ stop+ stub+ stud+ stun+ such suit+ sulk+ sung sunk sure surf swam swan+ swap+ sway+ swim+
    tack+ tact tail+ take+ tale+ talk+ tall tame tank+ tape+ task+ taxi+ teal team+ tear+ tell+ tend+ tent+ term+ test+ text+ than that thaw+ them then they thin this thud+ thus tick+ tide+ tidy tier+ tile+ till+ tilt+ time+ tiny tire+ toad+ toil+ told toll+ tomb+ tone+ took tool+ toss tour+ town+ tram+ trap+ tray+ tree+ trek+ trim+ trio+ trip+ trot+ true tube+ tuck+ tuna tune+ turf turn+ tusk+ twig+ twin+ type+
    ugly undo unit+ upon urge+ used user+
    vain vane+ vary vase+ vast veal veil+ vein+ vent+ verb+ very vest+ veto vice+ view+ vile vine+ visa+ void vole+ vote+
    wade+ wage+ wail+ wait+ wake+ walk+ wall+ wand+ want+ ward+ warm+ warn+ warp+ wart+ wary wash wasp+ wave+ wavy weak wear+ weed+ week+ weep+ weld+ well+ went wept were west what when whim+ whip+ whom wide wife wild will+ wilt+ wily wind+ wine+ wing+ wink+ wipe+ wire+ wise wish wisp+ with woke wolf wood+ wool word+ wore work+ worm+ worn wove wrap+ wren+
    yard+ yarn+ yawn+ year+ yell+ yoga yoke+ yolk+ your zero+ zest zinc zone+ zoom+
    more said torn tore ours`,

    /* ---------- five letters ---------- */
    `yours began begun cross going doing maybe
    abbey+ about above abuse+ actor+ acute adapt+ admit+ adopt+ adult+ after again agent+ agree+ ahead aisle+ alarm+ album+ alert+ alien+ alike alive alley+ allow+ alone along aloud alter+ amaze+ amber amend+ among ample angel+ anger angle+ angry ankle+ apart apple+ apply apron+ arena+ argue+ arise+ arrow+ aside atlas attic+ audio avoid+ awake award+ aware awful
    bacon badge+ badly bagel+ baker+ banjo+ basic basin+ basis batch beach beard+ beast+ begin+ being+ below bench berry birch birth+ black blade+ blame+ bland blank+ blast+ blaze+ bleak bleed+ blend+ bless blind+ blink+ bliss block+ blond blood bloom+ blown blunt blush board+ boast+ bonus boost+ booth+ bored bound+ boxer+ brain+ brake+ brand+ brass brave bread+ break+ breed+ brick+ bride+ brief+ bring+ brink brisk broad broke brook+ brood+ broom+ broth brown+ brush brute+ buddy build+ built bulky bunch bunny burst+ buyer+
    cabin+ cable+ camel+ candy canal+ canoe+ cargo carry carve+ catch cause+ chain+ chair+ chalk chant+ chaos charm+ chart+ chase+ cheap cheat+ check+ cheek+ cheer+ chess chest+ chick+ chief+ child chill+ chimp+ china chirp+ choir+ chord+ chose chunk+ cider civic civil claim+ clamp+ clash class clean+ clear+ clerk+ click+ cliff+ climb+ cling+ cloak+ clock+ clone+ close+ cloth cloud+ clown+ coach coast+ cobra+ cocoa comet+ comic+ comma+ coral cough+ could count+ court+ cover+ crack+ craft+ crane+ crash crate+ crawl+ crazy cream+ creek+ creep+ crest+ crime+ crisp crowd+ crown+ crude cruel crumb+ crush crust+ curly curry curve+ cycle+
    daily dairy daisy dance+ dealt death+ decay delay+ dense depth+ diary diner+ dirty ditch dizzy dodge donor+ doubt+ dough dozen+ draft+ drain+ drama+ drank drawn dread dream+ dress dried drier drill+ drink+ drive+ drove drown+ dwarf dying
    eager eagle+ early earth easel+ eaten eight+ elbow+ elder+ elect+ elves empty enemy enjoy+ enter+ entry equal+ error+ erupt+ essay+ event+ every exact exist+ extra
    fable+ faint+ fairy faith false fancy fatal fault+ feast+ fence+ ferry fetch fever+ fewer field+ fifth fifty fight+ final+ first flake+ flame+ flare+ flash flask+ fleet+ flesh flick+ fling+ flint float+ flock+ flood+ floor+ flour+ flown fluid+ flush flute+ focus foggy force+ forge+ forth forty found frame+ frank fraud fresh fried front+ frost+ frown+ froze fruit+ fudge fully funny fuzzy
    gecko+ ghost+ giant+ giddy given glass glaze gleam+ glide+ globe+ gloom glory glove+ gnome+ goose grace grade+ grain+ grand grant+ grape+ graph+ grasp+ grass grate+ grave+ gravy great greed green+ greet+ grief grill+ grind+ groan+ groom+ gross group+ grove+ growl+ grown guard+ guess guest+ guide+ guilt
    habit+ hairy handy happy hardy harsh hatch haste hasty haunt+ haven+ heard heart+ heavy hedge+ hello heron+ hinge+ hippo+ hobby honey horse+ hotel+ hound+ house+ hover+ human+ humid hurry hyena+
    icing ideal+ igloo+ image+ imply index inner input+ issue+ ivory
    jeans jelly jewel+ joint+ joker+ jolly judge+ juice+ juicy
    kayak+ knack knead+ kneel+ knelt knife known koala+
    label+ ladle+ large laser+ latch later laugh+ layer+ learn+ least leave+ ledge+ legal lemon+ level+ lever+ light+ limit+ linen liver+ llama+ lobby local lodge+ lofty logic lover+ lower+ loyal lucky lunar lunch lying
    magic major maker+ mango manor+ maple+ march marry marsh match mayor+ meant medal+ media melon+ mercy merge+ merit+ merry messy metal+ metre+ midst might mimic minor+ minus misty mixed mixer+ model+ moist money month+ moose moral+ motor+ motto mount+ mouse mouth+ movie+ muddy mural+ music
    naval nerve+ never newer newly niece+ night+ ninth noble noise+ noisy north notch novel+ nudge nurse+ nylon
    oasis ocean+ offer+ often olive+ onion+ opera+ orbit+ order+ organ+ other otter+ ought ounce+ outer owner+
    paint+ panda+ panel+ panic paper+ party pasta paste patch pause+ peace peach pearl+ pedal+ penny perch petal+ phase+ phone+ photo+ piano+ piece+ pilot+ pinch pitch pizza place+ plain+ plane+ plank+ plant+ plate+ pluck plump plush point+ polar poppy porch pouch pound+ power+ press price+ pride prime print+ prior prism+ prize+ probe+ prone proof+ proud prove+ prune+ pulse+ punch pupil+ puppy purse+
    quack+ quail+ quake queen+ query quest+ queue+ quick quiet quill+ quilt+ quite
    radar+ radio+ rainy raise+ rally ranch range+ rapid ratio raven+ razor+ reach react+ ready realm+ rebel+ refer+ reign+ relax relay+ renew+ reply rhino+ rhyme+ rider+ ridge+ rifle+ right+ rigid rinse+ risky rival+ river+ roast+ robin+ robot+ rocky rodeo+ rogue+ rough round+ route+ rover+ royal rugby ruler+ rural rusty
    sadly saint+ salad+ salty sandy sauce+ scale+ scarf scare+ scary scene+ scent+ scone+ scoop+ scope score+ scout+ scrap+ screw+ seize sense+ serve+ seven+ shade+ shady shaft+ shake+ shaky shall shame shape+ share+ shark+ sharp shave+ shawl+ sheep sheet+ shelf shell+ shift+ shine+ shiny shirt+ shock+ shone shoot+ shore+ short+ shout+ shown shrub+ shrug+ sight+ silly since siren+ sixth sixty skate+ skill+ skirt+ skull+ slack slang slate+ sleep+ sleet slept slice+ slide+ slope+ sloth+ small smart smash smell+ smile+ smoke+ snack+ snail+ snake+ sneak+ sniff+ snore+ snowy solar solid+ solve+ sorry sound+ south space+ spade+ spare+ spark+ speak+ spear+ speed+ spell+ spend+ spent spice+ spicy spike+ spill+ spine+ spite spoke spoon+ sport+ spout+ spray+ squad+ squid+ stack+ staff+ stage+ stain+ stair+ stake+ stale stalk+ stamp+ stand+ stare+ stark start+ state+ steak+ steal+ steam steel steep steer+ stern stick+ stiff still sting+ stock+ stole stone+ stony stood stool+ store+ stork+ storm+ story stout stove+ strap+ straw+ stray+ strip+ stuck study stuff stump+ stung stunt+ style+ sugar sunny super swamp+ swarm+ swear sweat sweep+ sweet+ swell+ swept swift swing+ sword+ swore sworn swung syrup
    table+ taken talon+ tango tasty taste+ teach teeth tempo tense tenth thank+ theft+ their theme+ there these thick thief thing+ think+ third thorn+ those three+ threw throw+ thumb+ tiger+ tight timer+ timid tired title+ toast+ today token+ tooth topic+ torch total+ touch tough towel+ tower+ toxic trace+ track+ trade+ trail+ train+ trait+ tramp+ trash tread+ treat+ trend+ trial+ tribe+ trick+ tried troop+ trout truck+ truly trunk+ trust+ truth+ tulip+ tunic+ tutor+ twice twist+
    uncle+ under union+ unite+ unity until upper upset urban usage usual
    vague valid value+ valve+ vault+ verse+ video+ viola+ virus visit+ vital vivid vocal voice+ vowel+
    wagon+ waist+ waltz waste+ watch water+ weary weave+ wedge+ weigh+ weird whale+ wheat wheel+ where which while whisk+ white whole whose widen+ widow+ width+ windy wiser witch woman women world+ worry worse worst worth would wound+ woven wreck+ wrist+ write+ wrong wrote
    yacht+ yearn+ yeast yield+ young youth+ zebra+
    acted added aimed asked baked cared dared dated dined faded hated hoped joked liked lived loved moved named paved raced rated saved timed tuned typed voted waded waved wiped ended aided eased freed hiked lined mined poked posed ruled tamed toned`,

    /* ---------- six letters ---------- */
    `should around matter+
    absent accept+ access across action+ active actual adjust+ admire+ advice advise+ affair+ afford+ afraid agency agenda almost always amount+ amused anchor+ animal+ annual answer+ anyone anyway appeal+ appear+ arcade+ arctic arrive+ artist+ asleep aspect+ assist+ attach attack+ attend+ autumn+ avenue+
    badger+ ballet+ ballot+ banana+ bandit+ banner+ barber+ barely barrel+ basket+ battle+ beacon+ beauty beaver+ became become+ before beggar+ behave+ behind belief+ belong+ beside better beyond bishop+ bitter blonde border+ borrow+ bottle+ bottom+ bought bounce+ branch breath breeze+ bridge+ bright broken bronze bubble+ bucket+ buckle+ budget+ bundle+ burden+ burger+ burrow+ butler+ butter button+
    cactus camera+ candle+ cannon+ canvas canyon+ carbon carpet+ carrot+ castle+ casual cattle caught celery cellar+ cement cereal+ chance+ change+ chapel+ charge+ cheery cheese+ cherry chilly chosen church circle+ circus citrus clever client+ cloudy clover coffee cobweb+ collar+ colony colour+ column+ combat comedy common cookie+ copper corner+ cosmic cotton county coupon+ course+ cousin+ coward+ cradle+ crayon+ create+ credit+ crisis crispy critic+ crunch cuddle+ cursor+ custom+
    dagger+ damage+ dancer+ danger+ daring debate+ decade+ decent decide+ deeply defeat+ defend+ define+ degree+ demand+ dental depart+ depend+ desert+ design+ detail+ detect+ device+ devote+ diesel dinner+ direct+ divide+ divine doctor+ dollar+ domain+ donkey+ double+ dragon+ drawer+ dreamy driver+ drowsy during
    easily eating editor+ effect+ effort+ eighty eleven emerge+ empire+ employ+ enable+ energy engine+ enough ensure+ entire escape+ estate+ excuse+ expand+ expect+ expert+ export+ extend+
    fabric+ factor+ fairly fallen family famous farmer+ father+ fellow+ female+ figure+ filter+ finger+ finish flight+ floppy flower+ fluffy flying folder+ follow+ forest+ forget+ forgot formal format+ fossil+ foster fourth freeze friend+ fright frozen fruity future
    gadget+ galaxy gallon+ gamble+ garage+ garden+ garlic gather+ gentle gently gerbil+ giggle+ ginger glance+ glider+ global glossy gloomy golden goblin+ gossip govern+ gravel greedy ground+ growth+ guitar+
    hammer+ handle+ happen+ hardly hatred hazard+ health heater+ heaven+ height+ helmet+ hermit+ hidden hiking hollow+ honest honour+ horror hunger hungry hunter+ hurdle+
    icicle+ ignore+ impact+ import+ inform+ injury insect+ inside insist+ intend+ invent+ invite+ island+ itself
    jacket+ jaguar+ jersey+ jigsaw+ jingle+ jockey+ joyful jumble+ jumper+ jungle+ junior+
    kennel+ kernel+ kettle+ kidney+ kindly kitten+ knight+ knives
    ladder+ lagoon+ laptop+ lately latter launch lavish lawyer+ leader+ league+ legend+ length+ lesson+ letter+ likely liquid+ listen+ litter+ little lively lizard+ locker+ locket+ lonely lovely lumber
    magnet+ mainly mammal+ manage+ manner+ marble+ margin+ marine market+ marrow meadow+ medium melody mellow member+ memory mental merely method+ middle mighty minute+ mirror+ misery mitten+ mobile modern modest moment+ monkey+ mostly mother+ motion+ muffin+ murmur+ muscle+ museum+ mutter+ myself
    napkin+ narrow nation+ native nature nearby nearly neatly needle+ nephew+ nettle+ nicely nickel+ nimble nobody noodle+ normal notice+ number+ nutmeg
    object+ oblong obtain+ office+ orange+ orchid+ origin+ others outfit+ output oxygen oyster+
    paddle+ palace+ parade+ parcel+ pardon parent+ parrot+ pastry pencil+ people pepper+ period+ person+ pickle+ picnic+ pigeon+ pillow+ pirate+ planet+ plenty pocket+ poetry polish police potato powder+ praise prefer+ pretty prince+ prison+ profit+ proper puddle+ puffin+ pulley+ puppet+ purple puzzle+
    quarry quiver+
    rabbit+ racket+ radish radius random rarely rather reader+ really reason+ recall+ recent recipe+ record+ reduce+ refuse+ region+ relief relish remain+ remark+ remedy remind+ remote remove+ repair+ repeat+ report+ rescue+ resort+ result+ retire+ return+ reveal+ review+ reward+ rhythm+ ribbon+ riddle+ ripple+ rocket+ rotten rubber runner+
    saddle+ safety sailor+ salmon salute+ sample+ sandal+ saucer+ scarce school+ scream+ screen+ script+ search season+ second+ secret+ select+ seller+ senior+ settle+ shadow+ shiver+ shower+ shrimp shrink+ signal+ silent silver simple singer+ single sister+ sketch skinny slight slogan+ smooth sneeze+ snooze soccer socket+ soften+ softly sorrow source+ speech spider+ spirit+ splash spoken spring+ sprout+ square+ squash squeak+ stable+ staple+ starch statue+ steady sticky stitch strain+ strand+ stream+ street+ stress strict stride+ strike+ string+ stripe+ strong studio+ submit+ sudden suffer+ summer+ summit+ sunset+ supper+ supply surely survey+ switch symbol+ system+
    tablet+ tackle+ talent+ tangle+ target+ teapot+ temple+ tender tennis thanks thirst thirty thorny though thread+ threat+ thrill+ throat+ throne+ ticket+ tickle+ timber tinsel tiptoe+ tissue+ toffee+ tomato tongue+ toucan+ toward travel+ treaty trophy tunnel+ turkey+ turnip+ turtle+ twelve twenty
    unfair unique united unless unlock+ unpack+ untidy unwrap+ upward urgent useful
    vacuum+ valley+ vanish velvet vendor+ vessel+ violet violin+ virtue+ vision+ visual volume+ voyage+
    waffle+ waiter+ wallet+ walnut+ walrus wander+ warmth wealth weapon+ weasel+ weekly weight+ wicked widely window+ winner+ winter+ wisdom within wizard+ wobble+ wonder+ wooden worker+ worthy writer+
    yellow yogurt zipper+`,

    /* ---------- seven letters ---------- */
    `because brought
    account achieve acrobat address advance against airport already amazing ancient another anxious anybody apricot archery article attempt attract auction average awkward
    baggage balance balcony bandage banquet bargain barrier battery bedroom believe beneath benefit between bicycle billion biscuit blanket blossom bonfire booklet boredom bracket breadth breathe brother brownie buffalo builder burglar butcher
    cabbage cabinet calcium camping capital captain capture caravan careful cartoon caution ceiling central century certain chamber channel chapter charity cheetah chicken chimney circuit citizen classic climate climber cluster collect college combine comfort command comment company compare compass complex concert conduct confuse connect contact contain content contest control convert correct costume cottage council counter country courage crystal culture cupcake curious current curtain cushion custard cycling
    daytime decimal declare decline defence deliver dentist deposit deserve dessert destroy develop diamond digital diploma disease dismiss display distant dolphin doorway drawing dresser drummer dungeon dynamic
    earlier earring eastern economy edition educate elegant element emerald emotion emperor endless episode equator evening evident exactly example excited exhibit expense explain explode explore express extinct extreme
    factory failure fantasy fashion feather feature federal feeling fiction fifteen fighter finally finance fishing fitness flavour foolish forever formula fortune forward founder fragile freedom furnace further
    gallery gateway general genuine gesture giraffe glacier glimpse glitter gorilla gradual grammar granite graphic grocery gymnast
    habitat haircut halfway hallway hamster handful harmony harvest healthy hearing heating heavily helpful heroine herself highway himself history holiday honesty hopeful horizon however hundred husband
    iceberg illness imagine impress improve include indoors inquiry insight instant install instead involve
    jasmine javelin journal journey jukebox justice kingdom kitchen knuckle
    lantern laundry leather lecture leisure lettuce library liberty lighter limited lobster lookout lottery luggage
    machine magical mailbox mammoth manager mansion married massive maximum meaning measure medical meeting message million mineral minimum miracle missing mission mistake mixture monitor monster monthly morning mustard mystery
    naughty neither network nothing nowhere numeral nursery
    oatmeal observe obvious octopus officer opinion orchard organic ostrich outdoor outline outside overall
    package painful painter palette pancake panther parking partner passage passion patient pattern payment peacock pelican penguin percent perfect perform perhaps picture pilgrim pioneer plastic pleased plumber pointer popcorn popular portion postage poultry poverty predict premium prepare present prevent primary printer privacy private problem proceed process produce product program project promise protect protein provide publish pudding pumpkin puzzled
    quality quarrel quarter quickly quietly
    raccoon radiant rainbow reality rebuild receipt receive recover reflect refresh regular related release reptile request require respect restore revenge reverse rhubarb rooster routine
    sadness sailing sardine satchel sausage scholar science scooter scratch seafood section serious servant service session setting seventy several shelter sheriff shortly shyness sibling silence similar sincere sixteen skating skilled slipper snowman soldier someone speaker special spinach squeeze stadium station sticker stomach storage strange stretch student subject succeed success suggest summary sunburn sunrise support suppose supreme surface surgeon surname survive suspect sweater swimmer
    tadpole teacher tension texture theatre thicket thirsty thought thunder through tighten toaster tonight tourist towards trailer trainer trapeze tribute trivial trouble trumpet tugboat turbine twelfth typical
    unhappy uniform unknown unusual upright utensil
    vampire vanilla variety various vehicle version veteran victory village vintage visitor voltage
    waiting warrior weather wedding weekend welcome western whisper whistle willing winning without witness worried writing written`,

    /* ---------- everyday forms: past tenses, comparisons, irregular plurals ---------- */
    `died tied lent
    geese wives crept burnt split cried spied flung risen arose awoke spelt spilt older nicer safer wider finer
    armed owned rowed sewed towed bowed mowed vowed boxed fixed taxed waxed opted inked oiled
    cured gazed hired laced noted paced piled raved sized waged wired
    halves wolves loaves calves bigger faster slower taller longer higher sadder hotter colder warmer cooler kinder larger oldest learnt dreamt seeing sprung
    shelves thieves biggest fastest shorter cheaper happier smaller taught`
  ];

  const MORE = [
    `ado err roe hoe+ woe ilk irk eon+ rue sue+ tee+ vie wry yen fez auk+ asp+ din gab gag+ hob+ jib lob+ lop mew moo+ nay pew+ pip+ vex wan cob+ cop+ don+ fen+ hew+ jut+ lax lug+ oaf tad wad+ dab nab yap pep sag zap fax sax hex coy ply wee boo woo awl+ ewe+ lee ode+ cud vim mow+ maw cad gin`,
    `abet acme+ agog ahoy airy alms aloe+ amok apex atop aura+ avow bail+ bane barb+ bask bawl+ bevy bide blip+ blob+ bode bony boon boor+ brat+ bray brig+ buff burr+ carp chap+ char chum+ clef+ coda+ coma+ coop+ crag+ cram curd+ cull cusp+ dale+ dank darn daub defy deft dewy dill dire dole dorm+ dote dour dram+ duct+ duly dunk+ dupe+ dyed eddy edgy etch eyed fend fife+ fizz floe+ flux fore fray fuzz gait+ gala+ gild gilt glen+ glib glum glut goad+ gong+ guru+ gush hack+ hale hark heed heft hewn hone honk+ hove huff hued hulk+ hump+ hunk+ husk+ ibex iced idly inky jamb+ jeer+ jerk+ jibe+ jinx kale kelp kilo+ kink+ lair+ lank lass levy lice lint lisp loam loch lode+ loin+ lyre+ mace+ mart+ maul mead meld mesa+ mink+ mire mitt+ molt moot mope mote+ morn mull murk mutt+ nape nave+ neon nigh nosy oink oust opus orca+ ouch oxen pall pant pare peep+ perk+ pert pied pith plop pomp pore+ posh posy prow+ puce puck+ punt puny pyre+ quip+ rant rapt rasp raze ream+ reek rend rick+ rife rile rind+ rite+ romp rote rove rune+ runt+ ruse sari+ sash sear+ seer+ sham shin+ shod shun silo+ skew skim skit+ slat+ slay slew slog slur smug snag+ snub spar+ spat spry spud+ stow swab+ tart+ taut teak teem tern+ tint+ toga+ tome+ trod tuba+ tuft+ tutu+ tyre+ veer vend vial+ volt+ waft wane watt+ wean weir+ wend whet whey wick+ wile+ wiry woof writ yank yelp yeti yore zany zeal`,
    `abide acorn+ adorn aglow alibi aloft alpha altar+ amble anvil+ aphid+ askew atoll+ audit+ avert baron+ baste baton+ beret+ berth+ binge bison blare bleat blimp+ bloat blurt boggy bough+ brawl+ brawn briar brine brunt budge bugle+ bulge+ burly cadet+ cairn+ caper+ carol+ chafe chaff chasm+ cheep+ chide chili chime+ chive+ churn+ cinch cleft clung covet cower crank+ crass crave creak+ creed+ cress crimp croak+ crone+ crook+ croon crypt+ cynic+ decor decoy+ delta+ delve denim derby deter disco ditty dowdy dross dwell eerie elite elope ember+ endow envoy+ epoch evade exalt exile+ expel facet+ farce feign feint+ fibre+ flail flair flank+ fleck+ flier+ flora floss fluff fluke+ folly foray+ foyer+ frail frill+ frisk frond+ froth gaily gaunt gauze gavel+ girth gloat glean glint gorge+ gouge gourd+ graze grime grimy gripe gruel gruff grunt guild+ guile guise gusto hazel+ heave hefty helix hence hoard+ hovel+ hunch husky hutch idiom+ inept inlet+ irate irony jaunt+ jiffy joust+ jumbo kitty knave+ knoll+ lance+ lapse+ lasso lathe+ leafy leaky leapt lease+ lilac+ limbo lithe lotus lucid lumpy lunge lurch lyric+ macaw+ mauve maxim+ mince mirth miser+ molar+ motif+ mound+ mourn+ mower+ mulch mummy munch murky musty naive nanny navel+ nifty nomad+ occur+ onset optic oxide+ outdo overt pansy parka+ parry patio+ pecan+ peony perky pesky petty picky piety pious pixie+ plaid plait+ plaza+ plead+ pleat+ plume+ poach polka+ pooch posse prank+ prawn+ preen prong+ prose prowl psalm+ puffy purge qualm+ quart+ quell quirk+ quota+ rabid rebus recap regal relic+ repay resin retro revel+ ripen+ rivet+ roomy roost+ rotor+ rouge rouse rowdy ruddy runny salon+ salve satin sauna+ savvy scald scalp+ scamp+ scant scoff scold+ scorn scour scowl+ scrub+ scuba scuff sedan+ serum sever+ shack+ shale shard+ shear+ sheen sheer shire+ shoal+ shorn shove showy shrew+ shunt sidle siege+ sieve+ sinew+ singe skiff+ skimp skulk slain slash sleek slink sloop+ slosh slump+ slung slurp+ slush smack+ smear+ smirk+ smith+ smock+ snare+ snarl+ sneer+ snipe+ snoop snout+ snuff soggy sonic spasm+ spawn speck+ spire+ spook+ spool+ spore+ spree sprig+ spurn spurt+ squat stead steed+ stile+ stink stint stoic stomp stoop+ strut+ suave suite+ sulky surge+ surly swish swoon swoop+ taboo+ taffy taint tapir+ tardy taunt+ tawny tease tepid terse thigh+ throb thyme tiara+ tidal titan+ torso+ totem+ tract+ trawl tress treed trite troll+ trove truce+ tuber+ tuner+ twang tweed twine twirl+ udder+ undue unfit unlit unzip usher+ usurp utter venom verge+ verve vicar+ vigil+ vinyl viper+ visor+ vista+ vixen+ vogue vouch wafer+ waive wares whack whiff whine+ whirl+ wield wince winch wispy wordy wrath yodel+ zesty`,
    `absorb accent+ aerial+ alcove+ allure almond+ amulet+ anthem+ antler+ ardent armour ashore aspire assert astray atomic attire auburn author+ awhile babble bakery bamboo banish banter barley barren bauble+ beetle+ bellow+ billow+ blazer+ blotch bonnet+ bounty brazen breach breezy bridle+ brooch brunch bubbly bumble bungle bushel+ bustle cackle camper+ canary candid canine cannot canter carton+ cashew+ cavern+ censor+ cheeky chisel+ choice+ chorus chrome chubby cinder+ clammy clergy clumsy coarse cocoon+ collie+ commit+ compel+ comply condor+ convoy+ cornet+ corral+ costly cougar+ coyote+ crafty cranky crater+ creamy crease+ creepy cruise+ crusty cuckoo+ curfew+ cutlet+ dainty dampen dangle dapper dazzle debris decree+ defect+ deluge denote depict deploy deputy derail desire+ detour+ devour digest dimple+ dismal divert doodle+ drafty drench dugout+ earthy elapse embark emblem+ embody enamel encore+ endure engulf enigma+ enlist enrage entice errand+ escort+ esteem evolve exceed exempt exhale exotic expire fathom faucet+ feeble fender+ ferret+ fiasco fickle fiddle+ fidget+ fierce fillet+ finale+ flagon+ flimsy flinch flurry fodder forage forbid fought frenzy fridge+ fringe+ frisky frolic+ frugal fumble fungus funnel+ furrow+ fusion gaggle gallop+ gander garnet+ gazebo+ geyser+ gibbon+ glitch goblet+ gobble gopher+ gospel grainy granny grassy grater+ grease grieve grotto grouch grudge+ grumpy guffaw gutter+ hamlet+ hanger+ harden hassle hearty heckle hectic heroic hiccup+ hinder hoarse hobble homage hoodie+ hooves horrid hubbub huddle+ humble humour hurray hustle hybrid+ hyphen+ iguana+ impala+ income+ indeed indigo infant+ inward jackal+ jagged jargon jester+ jiggle jostle jovial juggle kindle knotty lament larder+ lather launch+ leaves legacy lentil+ lesser lichen limber limpet+ linger locust+ lodger+ loiter lotion+ louder lounge+ lustre luxury magpie+ mallet+ mangle mantle+ marvel+ mascot+ meddle medley+ menace mentor+ meteor+ mildew mingle minnow+ mishap+ mister molten morsel+ mortar mosaic+ muddle mumble muster muzzle+ myriad nectar nibble novice+ nozzle+ nuance+ nugget+ nuzzle oblige ocelot+ octave+ oddity onward opaque ordeal+ osprey+ outcry outwit pamper pantry papaya+ parish parody pastel+ patrol+ patron+ pebble+ pellet+ pewter picket+ piglet+ pillar+ piston+ placid plaque+ please pledge+ plunge plural polite pollen ponder poodle+ poplar+ portal+ potion+ potter+ pounce prance priest+ prompt propel public punish purity pursue python+ quaint quartz quench rabble raffle+ raisin+ rancid ransom rascal+ rattle+ ravine+ recess recoil redeem refill+ reflex regret+ reject+ renown rental+ repent reside resign resist retort revive revolt ridden rising robust rodent+ roster+ rubble ruffle+ rumble rustic rustle sadden safari+ salary savage savour scenic scorch scrawl scribe+ scroll+ scurry scythe+ secure seldom sensor+ sequel+ serene sermon+ severe shabby shaggy shears sheath shield+ shrewd shriek+ shrill shrine+ shroud+ shrunk sickle+ simmer siphon+ sizzle skewer+ sleepy sleeve+ sleigh+ sliver+ sloppy slouch sludge smudge snatch snugly solace sonnet+ sorbet sphinx spiral+ splint+ sponge+ sprain+ sprawl sprint+ spruce squire+ squirm squirt stance+ stanza+ starve static steamy stench stereo stolen stormy strife stroll+ strung stubby sturdy subtle suburb+ sundae+ sunken superb surfer+ swerve swivel tactic+ tailor+ tandem tartan+ tassel+ tattoo+ tavern+ teeter temper tenant+ tendon+ terror tether thatch thrive throng thwart tinker toggle+ toilet+ topple trance trauma trench tribal trifle trudge truant+ tumble tundra turban+ turret+ tussle tuxedo tycoon+ umpire+ unfold+ unkind unlike unrest unseen untold unveil+ upbeat uphill uproar uproot utmost vacant valour vandal+ vanity vapour vector vermin victor vigour vortex waddle waggle warble+ warden+ wheeze whimsy whinny wholly wicker wiggle willow+ wintry wither wobbly wombat+ wrench yearly yonder zenith zigzag+ zodiac`,
    `admiral airline airship alchemy allergy almanac amateur amplify anagram anatomy anchovy angelic angrily anguish animate antenna antique anxiety apology apparel applaud appoint aquatic archway arrival artwork athlete aviator awesome bagpipe balloon bandana banking baroque barbell barking bashful bassoon bathtub beastly bedtime beehive beeline beloved bewitch biology bizarre blatant blemish blender blister blunder boulder bouquet bravado bravely bravery breaker brigade bristle broaden brusque buffoon bulldog bunting buzzard cadence calorie candour canteen caramel carrier cascade cashier caveman cavalry cellist centaur ceramic charade chariot chatter chemist chuckle citadel clarify clarity clatter clipper closure clothes cobbler coconut collage collide comical compost comrade concave concise conifer consent console consult cookery cordial courier crackle crevice cricket croquet crusade cuisine culprit cutlery cyclist cyclone dashing decency deflate delight density descend despair despite destiny devious diagram dilemma discard discuss dispute disturb dormant drastic draught dreamer drizzle droplet dryness duchess dustbin dwindle dynasty eardrum earnest eclipse ecology elastic elderly elevate embassy embrace empathy enchant enclose engrave enhance enlarge equinox essence estuary eternal exclaim exclude execute exhaust eyebrow eyelash fanfare fatigue fearful fertile festive fixture flannel flatten flatter flicker flipper florist flutter foghorn foliage forearm forfeit forgave forgive freckle freezer freight frantic furious furnish galleon gazelle gimmick glamour glisten gnarled gondola goodbye gravity greatly griddle grimace grizzly grumble haddock halibut handbag harbour harness hatchet haunted haywire heather herring hideout hilltop holster hostess housing humdrum hydrant hygiene imitate immense incense incline inflate inherit initial inkling inkwell inspire intense invader isolate jackdaw jackpot jealous jubilee juniper kestrel ketchup keyhole largely leaflet lengthy leopard lowland loyalty lullaby madness maestro magenta magnify majesty mallard mankind mariner meander melodic mermaid mindful minstrel monocle moonlit modesty moisten mundane musical mustang mutiny narrate natural necktie neglect nervous neutral newborn nightly nostril notable notepad nourish nurture obelisk obscure octagon odyssey ominous opossum optical orderly origami outcast outcome outpost outrage outward overdue overlap paddock padlock pageant papyrus paradox parasol parsley parsnip parting pasture pathway peasant penalty pendant pennant perfume persist petunia pharaoh phantom phoenix physics pianist piccolo pickaxe pigment pigtail pinball piranha pitcher pitfall plaster plateau platter playful plumage plummet polygon pompous postman pothole pottery prairie precise preface prelude pretend pretzel prodigy profile prolong promote pronoun propose prosper protest proverb prowess prudent pyramid quintet radiate railway rampart rapture ravioli rebound recital reclaim recruit redwood referee refugee regatta rejoice relieve remnant remorse removal renewal replace replica reserve residue resolve respond restful retreat reunion revival revolve roadway robotic romance rooftop rosebud rowboat royalty rubbish rummage saffron salvage sapling sarcasm satisfy saunter savanna sawdust scallop scalpel scamper scarlet scatter scenery screech scruffy scuffle seabird seagull seaside seaweed secrecy segment selfish serpent setback settler shackle shallow shampoo shatter shimmer shingle shopper shorten shrivel shudder shuffle shutter shuttle sidecar signpost silicon silvery sketchy skillet skipper skittle skylark skyline slender slither slumber smidgen smother smuggle sniffle snippet snorkel snuggle society somehow sorcery soulful sparkle sparrow spatula species spindle squeaky squelch stagger stamina stapler steamer steeple stellar steward stiffen stirrup stopper stories strudel stubble stumble stylish sulphur sultana sunbeam sundial sundown sunspot surplus swagger swallow sweeten swiftly symptom synonym tactful tangent tankard tantrum tapioca tarnish tedious tempest terrace terrain terrier terrify testify textile thicken thimble thinker thistle thrifty tightly tinfoil toddler toenail toolbox topsoil torment tornado torpedo totally tourism tractor trainee traitor transit trawler treacle treetop trellis tremble trilogy trinket trodden trolley trooper truffle trundle tsunami turmoil twiddle twinkle twister typhoon ukulele unaware uncanny unclear uncover unequal unicorn unravel unscrew usually utility utterly vacancy vaccine valiant varnish venison venture veranda verdict vibrant villain vinegar violent virtual visible vitamin volcano voucher vulture walkway wallaby warning warthog wayside wealthy weekday weighty welfare whereas whether whimper whisker whittle wildcat wishful wistful woollen worldly wrapper wrestle wriggle wrinkle younger`
  ];

  /* Anagram themes. Common nouns of 3-7 letters are also accepted as words. */
  const THEMES = {
    animal: { name: 'an animal', many: 'animals', words: `ape bat cat cow dog elk fox gnu hog pig rat yak bear boar deer goat hare lamb lion lynx mink mole mule newt puma seal toad wolf badger beaver bison camel chimp dingo donkey ferret gecko gerbil gibbon hippo horse hyena jackal jaguar koala lemur lizard llama marmot monkey moose mouse ocelot otter panda possum rabbit rhino skunk sloth snail squid tapir tiger turtle walrus weasel whale zebra alpaca baboon cougar coyote iguana impala wombat cheetah dolphin gorilla giraffe hamster leopard lobster octopus panther raccoon reindeer squirrel tortoise kangaroo elephant antelope hedgehog platypus crocodile armadillo chameleon porcupine` },
    bird: { name: 'a bird', many: 'birds', words: `emu hen jay owl crow dove duck gull hawk kiwi lark rook swan wren crane eagle egret finch goose heron macaw quail raven robin stork canary condor cuckoo falcon magpie osprey parrot pigeon puffin thrush toucan turkey ostrich peacock pelican penguin sparrow swallow vulture flamingo starling albatross` },
    food: { name: 'a fruit or vegetable', many: 'fruits and vegetables', words: `fig pea yam bean corn date kale kiwi leek lime okra pear plum apple berry grape guava lemon mango melon olive onion peach banana carrot celery cherry garlic orange papaya potato quince radish squash tomato turnip apricot avocado cabbage coconut lettuce parsnip pumpkin spinach broccoli cucumber beetroot pineapple blueberry raspberry strawberry` },
    country: { name: 'a country', many: 'countries', proper: true, words: `chad cuba fiji iran iraq laos mali oman peru togo chile china egypt ghana haiti india italy japan kenya libya malta nepal qatar spain sudan yemen brazil canada france greece israel jordan kuwait mexico monaco norway panama poland russia sweden turkey uganda zambia austria belgium bolivia denmark finland germany hungary iceland ireland jamaica morocco romania senegal somalia ukraine vietnam portugal thailand zimbabwe argentina australia indonesia singapore venezuela` },
    colour: { name: 'a colour', many: 'colours', words: `red tan blue gold grey jade navy pink ruby rust teal amber beige black brown coral cream green ivory khaki lilac mauve ochre white auburn bronze copper indigo maroon orange purple salmon silver violet yellow crimson emerald magenta scarlet lavender turquoise` },
    music: { name: 'a musical instrument', many: 'musical instruments', words: `drum gong harp horn lute oboe tuba banjo bugle cello flute organ piano viola sitar cornet fiddle guitar violin zither bagpipe bassoon trumpet ukulele clarinet trombone accordion harmonica saxophone xylophone` },
    puzzle: { name: 'a word about puzzles', many: 'puzzle words', words: `clue code dice hint maze quiz chess logic rebus solve trick answer cipher enigma jigsaw ladder puzzle riddle secret anagram mystery paradox tangram crossword labyrinth` },
    weather: { name: 'a kind of weather', many: 'kinds of weather', words: `fog gale hail mist rain snow wind cloud frost sleet storm breeze drizzle monsoon rainbow thunder tornado typhoon blizzard sunshine hurricane lightning` },
    body: { name: 'a part of the body', many: 'parts of the body', words: `arm ear eye hip leg lip rib toe back chin foot hand head heel knee neck nose palm shin skin ankle brain elbow heart liver mouth spine thigh thumb tooth wrist finger kidney muscle eyebrow eyelash stomach forehead shoulder skeleton` },
    kitchen: { name: 'something in the kitchen', many: 'things in the kitchen', words: `cup jar jug mug pan pot wok bowl dish fork oven sink tray glass knife ladle plate spoon whisk grater kettle saucer teapot blender toaster spatula colander` },
    space: { name: 'something in the sky or in space', many: 'things in the sky or in space', words: `sun moon star comet earth orbit venus pluto meteor nebula planet rocket saturn uranus galaxy eclipse jupiter mercury neptune asteroid universe astronaut satellite telescope` },
    sport: { name: 'a sport', many: 'sports', words: `golf judo polo darts rugby boxing hockey rowing skiing soccer tennis archery bowling cricket croquet cycling fencing netball sailing surfing baseball football swimming badminton` },
    job: { name: 'a job', many: 'jobs', words: `chef cook poet actor baker clerk guard judge nurse pilot artist author barber dancer doctor farmer lawyer sailor singer tailor waiter butcher dentist painter plumber soldier teacher engineer gardener architect carpenter detective librarian scientist` },
    clothes: { name: 'something to wear', many: 'things to wear', words: `cap hat tie belt boot cape coat gown kilt robe shoe sock vest apron dress glove jeans scarf shawl shirt skirt tunic blouse bonnet collar jacket jumper mitten poncho sandal slipper sweater uniform cardigan overcoat raincoat waistcoat` },
    plant: { name: 'a tree or a flower', many: 'trees and flowers', words: `ash elm fir oak yew fern iris lily moss palm pine rose aspen birch cedar daisy hazel larch lilac maple pansy peony poppy tulip orchid willow jasmine bluebell daffodil magnolia primrose snowdrop sycamore buttercup carnation dandelion sunflower` }
  };

  /* Famous pairs for two-word anagrams: "salt and pepper" */
  const PAIRS = `salt pepper, bread butter, fish chips, cat mouse, bow arrow, cup saucer, knife fork, lock key, pen ink, bat ball, sun moon, day night, king queen, black white, peace quiet, rise shine, safe sound, odds ends, hide seek, trial error, fair square, short sweet, horse cart, needle thread, rock roll, milk honey, nuts bolts, sticks stones, cloak dagger, pins needles, bits pieces, arts crafts, bricks mortar, stars stripes, law order, song dance, wear tear, heart soul, ebb flow, pots pans, beauty beast, pride prejudice, war peace, thunder lightning, salt vinegar, cheese pickle, bucket spade, table chair, hammer nails, apples pears, soap water, glove hand, shoes socks, rain shine`;

  /* Letter strings never shown as a scramble or a cipher (ROT13, so this file stays polite). */
  const BLOCK = 'shpx fuvg phag avtt avte snt fyhg juber qvpx pbpx cvff ovgpu phz nff gjng jnax penc qnza cbea frk encr anmv fcvp xvxr pbba cnxv qlxr ergneq onfgneq ohttre gheq sneg nefr wvmm qvyqb gvgf cevpx chffl jbt tbbx obbo nahf cravf';

  /* ---------- building the dictionary ---------- */

  function plural(w) {
    if (/(s|x|z|ch|sh)$/.test(w)) return w + 'es';
    if (/[^aeiou]y$/.test(w)) return w.slice(0, -1) + 'ies';
    return w + 's';
  }
  function tokens(text) { return String(text).split(/\s+/).filter(Boolean); }
  const rot13 = (s) => s.replace(/[a-z]/g, (c) => String.fromCharCode((c.charCodeAt(0) - 97 + 13) % 26 + 97));

  let D = null;
  function build() {
    if (D) return D;
    D = { core: new Set(), more: new Set(), base: new Set(), byLen: {}, coreByLen: {}, keys: new Map(), themes: {}, pairs: [], block: tokens(BLOCK).map(rot13) };
    const add = (set, w) => { if (w.length >= 3 && w.length <= 7 && /^[a-z]+$/.test(w)) set.add(w); };
    const load = (set, text) => tokens(text).forEach((t) => {
      const plus = t.endsWith('+'), w = plus ? t.slice(0, -1) : t;
      add(set, w);
      D.base.add(w);
      if (plus) add(set, plural(w));
    });
    CORE.forEach((t) => load(D.core, t));
    MORE.forEach((t) => load(D.more, t));
    for (const id in THEMES) {
      const T = THEMES[id];
      const words = tokens(T.words);
      D.themes[id] = { id, name: T.name, many: T.many, proper: !!T.proper, words, set: new Set(words) };
      if (!T.proper) words.forEach((w) => { if (!D.core.has(w)) add(D.more, w); });
    }
    D.core.forEach((w) => D.more.delete(w));
    D.pairs = PAIRS.split(',').map((s) => tokens(s)).filter((p) => p.length === 2);
    const all = [];
    D.core.forEach((w) => all.push(w));
    D.more.forEach((w) => all.push(w));
    all.sort();
    all.forEach((w) => {
      (D.byLen[w.length] = D.byLen[w.length] || []).push(w);
      if (D.core.has(w)) (D.coreByLen[w.length] = D.coreByLen[w.length] || []).push(w);
      const k = key(w);
      const l = D.keys.get(k);
      if (l) l.push(w); else D.keys.set(k, [w]);
    });
    return D;
  }
  function key(w) { return String(w).toLowerCase().replace(/[^a-z]/g, '').split('').sort().join(''); }

  C.words = {
    // is it a word? (core or more)
    has(w) { const d = build(); w = String(w).toLowerCase(); return d.core.has(w) || d.more.has(w); },
    isCore(w) { return build().core.has(String(w).toLowerCase()); },
    // a word written out in the list (not an -s form made by a +)
    isBase(w) { return build().base.has(String(w).toLowerCase()); },
    // every word of n letters (sorted); coreOnly: only the common ones
    list(n, coreOnly) { const d = build(); return ((coreOnly ? d.coreByLen : d.byLen)[n] || []).slice(); },
    count() { const d = build(); return { core: d.core.size, more: d.more.size }; },
    key,
    // dictionary words made of exactly these letters
    anagrams(letters) { return (build().keys.get(key(letters)) || []).slice(); },
    theme(id) { return build().themes[id] || null; },
    get themeIds() { return Object.keys(THEMES); },
    pairs() { return build().pairs.map((p) => p.slice()); },
    plural,
    // false if the string contains something rude (used on random scrambles and ciphers)
    clean(s) { const d = build(); s = String(s).toLowerCase(); return !d.block.some((b) => s.includes(b)); }
  };
})(typeof window !== 'undefined' ? window : globalThis);
