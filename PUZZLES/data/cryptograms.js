/* The Puzzle Cabinet · data/cryptograms.js — made by tools/gen/words.js
 * Public-domain quotations, quoted exactly, each enciphered with a seeded random derangement (no letter stands for itself). */
Cabinet.concepts([
  { id: 'frequency-analysis', name: 'Counting letters (frequency analysis)', see: ['deduction'],
    text: 'In a long enough English text the letters turn up in a fairly steady proportion: E most often, then T, A, O, I and N, while J, Q, X and Z are rare. A substitution cipher changes what each letter looks like but not how often it appears — so the commonest cipher letter is probably E.\n\nCounting is only the start. Short words give more away: a one-letter word is A or I, the commonest three-letter words are THE and AND, and a word like *XYZX* with its first and last letter the same narrows things down fast. Each good guess makes the next one easier, until the whole message falls open. The Arab scholar al-Kindi described the method in the ninth century.' }
]);
Cabinet.family({
  id: 'cryptograms', engine: 'words', cat: 'riddles', name: 'Cryptograms', order: 8,
  blurb: 'A famous line written in a secret alphabet: every letter stands for another. Crack it by counting letters and guessing the little words.',
  origin: { year: 1841, who: 'Edgar Allan Poe', note: 'Simple substitution ciphers are ancient, and the Arab scholar al-Kindi explained how to break them by counting letters in the ninth century. Edgar Allan Poe made a sport of it: writing in *Graham\'s Magazine* in 1841 he challenged readers to send him ciphers, and his story *The Gold-Bug* (1843) cracks one by letter counts. Cryptogram puzzles have run in newspapers since the late nineteenth century.' },
  concepts: ['deduction', 'frequency-analysis']
}, [
  {
    id: "cipher-181",
    title: "Old Saw I",
    diff: 1,
    text: "An old proverb, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"Every dog has his day.","c":"LSLJF VTA GNB GWB VNF.","key":"NOKVLQAGWRMDCHTIZJBUXSEYFP","given":"ADE","by":"Proverb","src":"traditional"},
    explain: "“Every dog has his day.”\n\n— A proverb.",
    concepts: ["deduction"],
    tags: ["cipher","proverb"]
  },
  {
    id: "cipher-089",
    title: "Boz I",
    diff: 1,
    text: "A line of **Charles Dickens**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"God bless Us, Every One!","c":"EZB QYCDD XD, CPCLH ZKC!","key":"UQWBCGEOJNRYVKZITLDMXPSAHF","given":"ESO","by":"Charles Dickens","src":"*A Christmas Carol* (1843)"},
    explain: "“God bless Us, Every One!”\n\n— Charles Dickens, *A Christmas Carol* (1843).\n\nTiny Tim has the last word of the book.",
    concepts: ["deduction"],
    tags: ["cipher","dickens"]
  },
  {
    id: "cipher-004",
    title: "The Bard I",
    diff: 1,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"Brevity is the soul of wit.","c":"AGUNXLS XV LYU VKPB KR FXL.","key":"IAOZURHYXCEBDJKMWGVLPNFTSQ","given":"ITE","by":"William Shakespeare","src":"*Hamlet*"},
    explain: "“Brevity is the soul of wit.”\n\n— William Shakespeare, *Hamlet*.\n\nPolonius says it — in one of the longest-winded speeches in the play.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-053",
    title: "Scripture I",
    diff: 1,
    text: "A verse of the King James Bible, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"How are the mighty fallen!","c":"TJG CNP ITP LHUTIF BCYYPZ!","key":"CMQWPBUTHAVYLZJXKNRIDOGSFE","given":"EHA","by":"The King James Bible","src":"2 Samuel 1:19"},
    explain: "“How are the mighty fallen!”\n\n— The King James Bible, 2 Samuel 1:19.",
    concepts: ["deduction"],
    tags: ["cipher","bible"]
  },
  {
    id: "cipher-162",
    title: "Old Saw II",
    diff: 1,
    text: "An old proverb, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"A watched pot never boils.","c":"E ZEIOYBJ AHI WBRBU NHDKG.","key":"ENOJBLMYDQPKXWHATUGIFRZVCS","given":"EAO","by":"Proverb","src":"traditional"},
    explain: "“A watched pot never boils.”\n\n— A proverb.",
    concepts: ["deduction"],
    tags: ["cipher","proverb"]
  },
  {
    id: "cipher-164",
    title: "Old Saw III",
    diff: 1,
    text: "An old proverb, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"Rome was not built in a day.","c":"NBVW GDZ RBU CKQAU QR D IDM.","key":"DCHIWSTLQXOAVRBJYNZUKFGPME","given":"AIN","by":"Proverb","src":"traditional"},
    explain: "“Rome was not built in a day.”\n\n— A proverb.",
    concepts: ["deduction"],
    tags: ["cipher","proverb"]
  },
  {
    id: "cipher-051",
    title: "Scripture II",
    diff: 1,
    text: "A verse of the King James Bible, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"Ye are the salt of the earth.","c":"RX WOX CDX VWBC LM CDX XWOCD.","key":"WGAYXMQDTIPBNHLKUOVCFJEZRS","given":"ETA","by":"The King James Bible","src":"Matthew 5:13"},
    explain: "“Ye are the salt of the earth.”\n\n— The King James Bible, Matthew 5:13.",
    concepts: ["deduction"],
    tags: ["cipher","bible"]
  },
  {
    id: "cipher-088",
    title: "Boz II",
    diff: 1,
    text: "A line of **Charles Dickens**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"Please, sir, I want some more.","c":"RGHWVH, VML, M FWOC VYXH XYLH.","key":"WJTEHIZBMNAGXOYRKLVCDPFQSU","given":"ESA","by":"Charles Dickens","src":"*Oliver Twist* (1838)"},
    explain: "“Please, sir, I want some more.”\n\n— Charles Dickens, *Oliver Twist* (1838).",
    concepts: ["deduction"],
    tags: ["cipher","dickens"]
  },
  {
    id: "cipher-154",
    title: "Old Saw IV",
    diff: 1,
    text: "An old proverb, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"A stitch in time saves nine.","c":"G ZNPNRM PF NPTX ZGHXZ FPFX.","key":"GYRJXKVMPIUSTFADWOZNCHQLEB","given":"IEN","by":"Proverb","src":"traditional"},
    explain: "“A stitch in time saves nine.”\n\n— A proverb.",
    concepts: ["deduction"],
    tags: ["cipher","proverb"]
  },
  {
    id: "cipher-161",
    title: "Old Saw V",
    diff: 1,
    text: "An old proverb, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"Many hands make light work.","c":"ZMLT PMLIO ZMJK REXPQ FBUJ.","key":"MCSIKDXPEYJRZLBAGUOQVNFWTH","given":"AHK","by":"Proverb","src":"traditional"},
    explain: "“Many hands make light work.”\n\n— A proverb.",
    concepts: ["deduction"],
    tags: ["cipher","proverb"]
  },
  {
    id: "cipher-126",
    title: "Wordsworth I",
    diff: 1,
    text: "A line of **William Wordsworth**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"I wandered lonely as a cloud.","c":"G ZTFWOMOW BIFOBU TR T XBIAW.","key":"TCXWOPSLGVJBQFIEYMRHADZKUN","given":"ADE","by":"William Wordsworth","src":"*I Wandered Lonely as a Cloud* (1807)"},
    explain: "“I wandered lonely as a cloud.”\n\n— William Wordsworth, *I Wandered Lonely as a Cloud* (1807).",
    concepts: ["deduction"],
    tags: ["cipher","wordsworth"]
  },
  {
    id: "cipher-177",
    title: "Old Saw VI",
    diff: 1,
    text: "An old proverb, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"Time and tide wait for no man.","c":"LKFR BSW LKWR MBKL QHY SH FBS.","key":"BPUWRQCNKTVJFSHDIYALGXMZEO","given":"AIN","by":"Proverb","src":"traditional"},
    explain: "“Time and tide wait for no man.”\n\n— A proverb.",
    concepts: ["deduction"],
    tags: ["cipher","proverb"]
  },
  {
    id: "cipher-018",
    title: "The Bard II",
    diff: 1,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"All that glisters is not gold.","c":"UGG PZUP EGDBPJLB DB QXP EXGS.","key":"UHISJYEZDTRGOQXKFLBPWMVANC","given":"LTS","by":"William Shakespeare","src":"*The Merchant of Venice*"},
    explain: "“All that glisters is not gold.”\n\n— William Shakespeare, *The Merchant of Venice*.\n\nShakespeare wrote *glisters*; the proverb usually says *glitters*.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-060",
    title: "Poor Richard I",
    diff: 1,
    text: "A line of **Benjamin Franklin**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"Eat to live, and not live to eat.","c":"BFA AM ZSWB, FKP KMA ZSWB AM BFA.","key":"FQYPBIUOSTCZRKMEHXVAJWLNDG","given":"TEA","by":"Benjamin Franklin","src":"*Poor Richard's Almanack*"},
    explain: "“Eat to live, and not live to eat.”\n\n— Benjamin Franklin, *Poor Richard's Almanack*.",
    concepts: ["deduction"],
    tags: ["cipher","franklin"]
  },
  {
    id: "cipher-062",
    title: "Poor Richard II",
    diff: 1,
    text: "A line of **Benjamin Franklin**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"The used key is always bright.","c":"SMH VRHF YHG AR ZTQZGR EKABMS.","key":"ZEJFHUBMALYTIOWNCKRSVXQDGP","given":"ESA","by":"Benjamin Franklin","src":"*Poor Richard's Almanack*"},
    explain: "“The used key is always bright.”\n\n— Benjamin Franklin, *Poor Richard's Almanack*.",
    concepts: ["deduction"],
    tags: ["cipher","franklin"]
  },
  {
    id: "cipher-090",
    title: "Boz III",
    diff: 1,
    text: "A line of **Charles Dickens**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"Marley was dead: to begin with.","c":"RJUNZE GJF TZJT: LQ CZYOP GOLI.","key":"JCVTZKYIOMXNRPQDWUFLAHGBES","given":"AED","by":"Charles Dickens","src":"*A Christmas Carol* (1843)"},
    explain: "“Marley was dead: to begin with.”\n\n— Charles Dickens, *A Christmas Carol* (1843).",
    concepts: ["deduction"],
    tags: ["cipher","dickens"]
  },
  {
    id: "cipher-127",
    title: "Wordsworth II",
    diff: 1,
    text: "A line of **William Wordsworth**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"The Child is father of the Man.","c":"WUO ZUBSG BH PXWUOL RP WUO QXM.","key":"XAZGOPVUBNFSQMRCJLHWYETKID","given":"HET","by":"William Wordsworth","src":"*My Heart Leaps Up* (1807)"},
    explain: "“The Child is father of the Man.”\n\n— William Wordsworth, *My Heart Leaps Up* (1807).",
    concepts: ["deduction"],
    tags: ["cipher","wordsworth"]
  },
  {
    id: "cipher-147",
    title: "Bulwer-Lytton I",
    diff: 1,
    text: "A line of **Edward Bulwer-Lytton**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"It was a dark and stormy night.","c":"GV YRO R IRED RZI OVUEQC ZGKXV.","key":"RHBIWJKXGLDPQZUFNEOVMAYSCT","given":"ATD","by":"Edward Bulwer-Lytton","src":"*Paul Clifford* (1830)"},
    explain: "“It was a dark and stormy night.”\n\n— Edward Bulwer-Lytton, *Paul Clifford* (1830).\n\nThe most mocked first line in English — the rest of the sentence goes on for another fifty words.",
    concepts: ["deduction"],
    tags: ["cipher","bulwer-lytton"]
  },
  {
    id: "cipher-169",
    title: "Old Saw VII",
    diff: 1,
    text: "An old proverb, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"Make hay while the sun shines.","c":"IGFD EGL MEZHD KED NBY NEZYDN.","key":"GJAODCXEZQFHIYRVPTNKBSMULW","given":"EHS","by":"Proverb","src":"traditional"},
    explain: "“Make hay while the sun shines.”\n\n— A proverb.",
    concepts: ["deduction"],
    tags: ["cipher","proverb"]
  },
  {
    id: "cipher-174",
    title: "Old Saw VIII",
    diff: 1,
    text: "An old proverb, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"Slow and steady wins the race.","c":"QDCT LAB QUXLBP TMAQ UJX SLNX.","key":"LINBXKEJMVZDGACWRSQUYFTHPO","given":"AES","by":"Proverb","src":"traditional"},
    explain: "“Slow and steady wins the race.”\n\n— A proverb.\n\nThe moral usually drawn from Aesop's fable of the hare and the tortoise.",
    concepts: ["deduction"],
    tags: ["cipher","proverb"]
  },
  {
    id: "cipher-182",
    title: "Old Saw IX",
    diff: 1,
    text: "An old proverb, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"Two heads are better than one.","c":"KVW JMFEP FYM UMKKMY KJFO WOM.","key":"FUDEMGQJRBXTHOWICYPKALVZNS","given":"ETA","by":"Proverb","src":"traditional"},
    explain: "“Two heads are better than one.”\n\n— A proverb.",
    concepts: ["deduction"],
    tags: ["cipher","proverb"]
  },
  {
    id: "cipher-160",
    title: "Old Saw X",
    diff: 1,
    text: "An old proverb, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"Too many cooks spoil the broth.","c":"ETT KLXN FTTQD DGTHV EPI RSTEP.","key":"LRFYIZOPHWQVKXTGUSDEJCBANM","given":"OTH","by":"Proverb","src":"traditional"},
    explain: "“Too many cooks spoil the broth.”\n\n— A proverb.",
    concepts: ["deduction"],
    tags: ["cipher","proverb"]
  },
  {
    id: "cipher-156",
    title: "Old Saw XI",
    diff: 1,
    text: "An old proverb, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"The early bird catches the worm.","c":"LXA AIEQF GMEP NILNXAH LXA OUEV.","key":"IGNPADTXMKYQVRUJBEHLWCOZFS","given":"EHR","by":"Proverb","src":"traditional"},
    explain: "“The early bird catches the worm.”\n\n— A proverb.",
    concepts: ["deduction"],
    tags: ["cipher","proverb"]
  },
  {
    id: "cipher-157",
    title: "Old Saw XII",
    diff: 1,
    text: "An old proverb, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"Every cloud has a silver lining.","c":"VNVCF JBTSQ IKO K OWBNVC BWMWMR.","key":"KGJQVPRIWUXBAMTHECOZSNDYFL","given":"EIL","by":"Proverb","src":"traditional"},
    explain: "“Every cloud has a silver lining.”\n\n— A proverb.",
    concepts: ["deduction"],
    tags: ["cipher","proverb"]
  },
  {
    id: "cipher-158",
    title: "Old Saw XIII",
    diff: 1,
    text: "An old proverb, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"Where there's a will, there's a way.","c":"BWIUI SWIUI'K Z BYHH, SWIUI'K Z BZC.","key":"ZEQMIORWYTNHPVLFXUKSJDBACG","given":"EAH","by":"Proverb","src":"traditional"},
    explain: "“Where there's a will, there's a way.”\n\n— A proverb.",
    concepts: ["deduction"],
    tags: ["cipher","proverb"]
  },
  {
    id: "cipher-017",
    title: "The Bard III",
    diff: 1,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"Lord, what fools these mortals be!","c":"QKXG, JDEB MKKQZ BDVZV OKXBEQZ RV!","key":"ERUGVMNDPIYQOHKCFXZBTLJWAS","given":"OEL","by":"William Shakespeare","src":"*A Midsummer Night's Dream*"},
    explain: "“Lord, what fools these mortals be!”\n\n— William Shakespeare, *A Midsummer Night's Dream*.\n\nPuck says it, watching the lovers in the wood.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-118",
    title: "Pope I",
    diff: 1,
    text: "A line of **Alexander Pope**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"To err is human, to forgive divine.","c":"IA LEE UB CYTGF, IA ZAENUJL OUJUFL.","key":"GDKOLZNCUXHPTFASREBIYJQMVW","given":"IEO","by":"Alexander Pope","src":"*An Essay on Criticism* (1711)"},
    explain: "“To err is human, to forgive divine.”\n\n— Alexander Pope, *An Essay on Criticism* (1711).",
    concepts: ["deduction"],
    tags: ["cipher","pope"]
  },
  {
    id: "cipher-123",
    title: "Keats I",
    diff: 1,
    text: "A line of **John Keats**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"A thing of beauty is a joy for ever.","c":"I YOUVA XN SDIGYH UC I PXH NXQ DZDQ.","key":"ISRJDNAOUPETWVXMFQCYGZBKHL","given":"AEO","by":"John Keats","src":"*Endymion* (1818)"},
    explain: "“A thing of beauty is a joy for ever.”\n\n— John Keats, *Endymion* (1818).",
    concepts: ["deduction"],
    tags: ["cipher","keats"]
  },
  {
    id: "cipher-155",
    title: "Old Saw XIV",
    diff: 1,
    text: "An old proverb, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"Actions speak louder than words.","c":"TUWLQYX XEFTH RQVSFI WZTY GQISX.","key":"TJUSFBNZLAHRDYQECIXWVPGOMK","given":"AOS","by":"Proverb","src":"traditional"},
    explain: "“Actions speak louder than words.”\n\n— A proverb.",
    concepts: ["deduction"],
    tags: ["cipher","proverb"]
  },
  {
    id: "cipher-005",
    title: "The Bard IV",
    diff: 1,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"Neither a borrower nor a lender be.","c":"ICSBLCG H QRGGRTCG IRG H ZCIPCG QC.","key":"HQAPCYJLSKOZNIRFXGWBDMTUVE","given":"ERN","by":"William Shakespeare","src":"*Hamlet*"},
    explain: "“Neither a borrower nor a lender be.”\n\n— William Shakespeare, *Hamlet*.\n\nPolonius's advice to his son Laertes.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-011",
    title: "The Bard V",
    diff: 1,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"If music be the food of love, play on.","c":"FN EBYFS AI KJI NHHT HN RHXI, QRGL HV.","key":"GASTINMJFUWREVHQDPYKBXCZLO","given":"OEF","by":"William Shakespeare","src":"*Twelfth Night*"},
    explain: "“If music be the food of love, play on.”\n\n— William Shakespeare, *Twelfth Night*.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-040",
    title: "Scripture III",
    diff: 1,
    text: "A verse of the King James Bible, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"There is no new thing under the sun.","c":"XZMOM UE KB KMJ XZUKW PKGMO XZM EPK.","key":"CALGMNWZUYDSRKBHFOEXPIJQVT","given":"ENH","by":"The King James Bible","src":"Ecclesiastes 1:9"},
    explain: "“There is no new thing under the sun.”\n\n— The King James Bible, Ecclesiastes 1:9.",
    concepts: ["deduction"],
    tags: ["cipher","bible"]
  },
  {
    id: "cipher-058",
    title: "Poor Richard III",
    diff: 1,
    text: "A line of **Benjamin Franklin**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"Well done is better than well said.","c":"MYOO HDEY VK FYRRYZ RPLE MYOO KLVH.","key":"LFUHYJNPVWIOBEDQXZKRCGMAST","given":"ELT","by":"Benjamin Franklin","src":"*Poor Richard's Almanack*"},
    explain: "“Well done is better than well said.”\n\n— Benjamin Franklin, *Poor Richard's Almanack*.",
    concepts: ["deduction"],
    tags: ["cipher","franklin"]
  },
  {
    id: "cipher-066",
    title: "Emerson I",
    diff: 1,
    text: "A line of **Ralph Waldo Emerson**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"To be great is to be misunderstood.","c":"AM DX TKXRA JV AM DX FJVBZLXKVAMML.","key":"RDGLXNTIJHEPFZMSUKVABOYQCW","given":"EOT","by":"Ralph Waldo Emerson","src":"*Self-Reliance* (1841)"},
    explain: "“To be great is to be misunderstood.”\n\n— Ralph Waldo Emerson, *Self-Reliance* (1841).",
    concepts: ["deduction"],
    tags: ["cipher","emerson"]
  },
  {
    id: "cipher-140",
    title: "Longfellow I",
    diff: 1,
    text: "A line of **Henry Wadsworth Longfellow**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"Into each life some rain must fall.","c":"RPCA FUIJ YRKF OAXF VURP XSOC KUYY.","key":"UQIGFKLJRTMYXPAZHVOCSDNBEW","given":"AEI","by":"Henry Wadsworth Longfellow","src":"*The Rainy Day*"},
    explain: "“Into each life some rain must fall.”\n\n— Henry Wadsworth Longfellow, *The Rainy Day*.",
    concepts: ["deduction"],
    tags: ["cipher","longfellow"]
  },
  {
    id: "cipher-146",
    title: "Bulwer-Lytton II",
    diff: 1,
    text: "A line of **Edward Bulwer-Lytton**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"The pen is mightier than the sword.","c":"UYH EHO XT RXMYUXHA UYSO UYH TZPAJ.","key":"SCKJHDMYXGNFROPELATUWIZVBQ","given":"EHT","by":"Edward Bulwer-Lytton","src":"*Richelieu* (1839)"},
    explain: "“The pen is mightier than the sword.”\n\n— Edward Bulwer-Lytton, *Richelieu* (1839).",
    concepts: ["deduction"],
    tags: ["cipher","bulwer-lytton"]
  },
  {
    id: "cipher-163",
    title: "Old Saw XV",
    diff: 1,
    text: "An old proverb, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Three letters are given to start you off.",
    data: {"kind":"crypto","q":"Birds of a feather flock together.","c":"SAZRC MY K YHKXDHZ YWMNP XMLHXDHZ.","key":"KSNRHYLDAEPWBVMTJZCXOUQGIF","given":"EFO","by":"Proverb","src":"traditional"},
    explain: "“Birds of a feather flock together.”\n\n— A proverb.",
    concepts: ["deduction"],
    tags: ["cipher","proverb"]
  },
  {
    id: "cipher-179",
    title: "Old Saw XVI",
    diff: 2,
    text: "An old proverb, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"Half a loaf is better than no bread.","c":"LNEW N EXNW VP MOUUOH ULNI IX MHONA.","key":"NMKAOWQLVGZERIXCYHPUTJDSBF","given":"EL","by":"Proverb","src":"traditional"},
    explain: "“Half a loaf is better than no bread.”\n\n— A proverb.",
    concepts: ["deduction"],
    tags: ["cipher","proverb"]
  },
  {
    id: "cipher-029",
    title: "The Bard VI",
    diff: 2,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"Love all, trust a few, do wrong to none.","c":"UBPA XUU, HMNDH X RAY, JB YMBFZ HB FBFA.","key":"XLSJARZQTWGUKFBOCMDHNPYIEV","given":"RA","by":"William Shakespeare","src":"*All's Well That Ends Well*"},
    explain: "“Love all, trust a few, do wrong to none.”\n\n— William Shakespeare, *All's Well That Ends Well*.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-122",
    title: "Donne I",
    diff: 2,
    text: "A line of **John Donne**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"No man is an island, entire of itself.","c":"HR QCH MV CH MVUCHA, WHFMXW RE MFVWUE.","key":"CPBAWEIZMYOUQHRDJXVFNLTSGK","given":"FE","by":"John Donne","src":"*Devotions upon Emergent Occasions* (1624)"},
    explain: "“No man is an island, entire of itself.”\n\n— John Donne, *Devotions upon Emergent Occasions* (1624).",
    concepts: ["deduction"],
    tags: ["cipher","donne"]
  },
  {
    id: "cipher-168",
    title: "Old Saw XVII",
    diff: 2,
    text: "An old proverb, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"Great oaks from little acorns grow.","c":"OALIX QISZ DAQR YEXXYL IJQAKZ OAQM.","key":"IFJHLDOWEUSYRKQCGAZXPBMTNV","given":"AT","by":"Proverb","src":"traditional"},
    explain: "“Great oaks from little acorns grow.”\n\n— A proverb.",
    concepts: ["deduction"],
    tags: ["cipher","proverb"]
  },
  {
    id: "cipher-176",
    title: "Old Saw XVIII",
    diff: 2,
    text: "An old proverb, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"A fool and his money are soon parted.","c":"D BVVQ DPG LHY RVPFM DCF YVVP SDCJFG.","key":"DTNGFBKLHZOQRPVSWCYJEUIAMX","given":"SR","by":"Proverb","src":"traditional"},
    explain: "“A fool and his money are soon parted.”\n\n— A proverb.",
    concepts: ["deduction"],
    tags: ["cipher","proverb"]
  },
  {
    id: "cipher-001",
    title: "The Bard VII",
    diff: 2,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"To be, or not to be: that is the question.","c":"EP VN, PJ OPE EP VN: EXCE DQ EXN KHNQEDPO.","key":"CVLSNBIXDGWUTOPFKJQEHRMZAY","given":"BH","by":"William Shakespeare","src":"*Hamlet*"},
    explain: "“To be, or not to be: that is the question.”\n\n— William Shakespeare, *Hamlet*.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-010",
    title: "The Bard VIII",
    diff: 2,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"A horse! a horse! my kingdom for a horse!","c":"L JTNDC! L JTNDC! VF OBRUZTV WTN L JTNDC!","key":"LMGZCWUJBSOPVRTXENDIYAHQFK","given":"SH","by":"William Shakespeare","src":"*Richard III*"},
    explain: "“A horse! a horse! my kingdom for a horse!”\n\n— William Shakespeare, *Richard III*.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-023",
    title: "The Bard IX",
    diff: 2,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"Is this a dagger which I see before me?","c":"PU SXPU K ZKWWAM HXPVX P UAA OARJMA EA?","key":"KOVZARWXPDYIEBJTFMUSNLHCQG","given":"SA","by":"William Shakespeare","src":"*Macbeth*"},
    explain: "“Is this a dagger which I see before me?”\n\n— William Shakespeare, *Macbeth*.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-057",
    title: "Poor Richard IV",
    diff: 2,
    text: "A line of **Benjamin Franklin**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"God helps them that help themselves.","c":"UTC SZVLH GSZJ GSDG SZVL GSZJHZVNZH.","key":"DQRCZBUSXMOVJFTLPKHGWNYAIE","given":"SP","by":"Benjamin Franklin","src":"*Poor Richard's Almanack*"},
    explain: "“God helps them that help themselves.”\n\n— Benjamin Franklin, *Poor Richard's Almanack*.",
    concepts: ["deduction"],
    tags: ["cipher","franklin"]
  },
  {
    id: "cipher-074",
    title: "Walden I",
    diff: 2,
    text: "A line of **Henry David Thoreau**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"Our life is frittered away by detail.","c":"UQP AZRY ZW RPZHHYPYE XMXC JC EYHXZA.","key":"XJIEYRLGZSNADBUVKPWHQTMOCF","given":"IA","by":"Henry David Thoreau","src":"*Walden* (1854)"},
    explain: "“Our life is frittered away by detail.”\n\n— Henry David Thoreau, *Walden* (1854).",
    concepts: ["deduction"],
    tags: ["cipher","thoreau"]
  },
  {
    id: "cipher-166",
    title: "Old Saw XIX",
    diff: 2,
    text: "An old proverb, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"Absence makes the heart grow fonder.","c":"ZYVAHBA GZRAV IJA JAZKI PKWX NWHUAK.","key":"ZYBUANPJLORMGHWQCKVIEFXSTD","given":"RO","by":"Proverb","src":"traditional"},
    explain: "“Absence makes the heart grow fonder.”\n\n— A proverb.",
    concepts: ["deduction"],
    tags: ["cipher","proverb"]
  },
  {
    id: "cipher-175",
    title: "Old Saw XX",
    diff: 2,
    text: "An old proverb, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"When the cat's away, the mice will play.","c":"KWLY UWL SEU'M EKEO, UWL JRSL KRPP DPEO.","key":"EZSNLIFWRTHPJYCDGXMUQAKBOV","given":"LE","by":"Proverb","src":"traditional"},
    explain: "“When the cat's away, the mice will play.”\n\n— A proverb.",
    concepts: ["deduction"],
    tags: ["cipher","proverb"]
  },
  {
    id: "cipher-021",
    title: "The Bard X",
    diff: 2,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"We few, we happy few, we band of brothers.","c":"DA QAD, DA SCYYR QAD, DA GCJE IQ GHIWSAHK.","key":"CGNEAQZSVLFUTJIYPHKWXBDMRO","given":"BA","by":"William Shakespeare","src":"*Henry V*"},
    explain: "“We few, we happy few, we band of brothers.”\n\n— William Shakespeare, *Henry V*.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-132",
    title: "Shelley I",
    diff: 2,
    text: "A line of **Percy Bysshe Shelley**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"Look on my works, ye Mighty, and despair!","c":"XBBC BJ KG ZBMCD, GS KHVQEG, IJA ASDLIHM!","key":"IROASNVQHWCXKJBLUMDEYPZFGT","given":"ID","by":"Percy Bysshe Shelley","src":"*Ozymandias* (1818)"},
    explain: "“Look on my works, ye Mighty, and despair!”\n\n— Percy Bysshe Shelley, *Ozymandias* (1818).",
    concepts: ["deduction"],
    tags: ["cipher","shelley"]
  },
  {
    id: "cipher-143",
    title: "Browning I",
    diff: 2,
    text: "A line of **Elizabeth Barrett Browning**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"How do I love thee? Let me count the ways.","c":"YEO JE V FEQN IYNN? FNI HN DECKI IYN OZWL.","key":"ZRDJNAMYVBXFHKEGPTLICQOUWS","given":"HA","by":"Elizabeth Barrett Browning","src":"*Sonnets from the Portuguese* (1850)"},
    explain: "“How do I love thee? Let me count the ways.”\n\n— Elizabeth Barrett Browning, *Sonnets from the Portuguese* (1850).",
    concepts: ["deduction"],
    tags: ["cipher","browning"]
  },
  {
    id: "cipher-167",
    title: "Old Saw XXI",
    diff: 2,
    text: "An old proverb, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"Necessity is the mother of invention.","c":"PFBFQQDGS DQ GZF CHGZFY HN DPMFPGDHP.","key":"IUBTFNWZDOXRCPHJAYQGVMKESL","given":"OS","by":"Proverb","src":"traditional"},
    explain: "“Necessity is the mother of invention.”\n\n— A proverb.",
    concepts: ["deduction"],
    tags: ["cipher","proverb"]
  },
  {
    id: "cipher-006",
    title: "The Bard XI",
    diff: 2,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"This above all: to thine own self be true.","c":"FSKM JZIUW JBB: FI FSKVW INV MWBQ ZW FEPW.","key":"JZRXWQLSKYOBCVITHEMFPUNADG","given":"AL","by":"William Shakespeare","src":"*Hamlet*"},
    explain: "“This above all: to thine own self be true.”\n\n— William Shakespeare, *Hamlet*.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-019",
    title: "The Bard XII",
    diff: 2,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"Uneasy lies the head that wears a crown.","c":"OGDMCH FSDC IJD JDMW IJMI ADMKC M VKNAG.","key":"MLVWDZQJSETFXGNYRKCIOUAPHB","given":"TR","by":"William Shakespeare","src":"*Henry IV, Part 2*"},
    explain: "“Uneasy lies the head that wears a crown.”\n\n— William Shakespeare, *Henry IV, Part 2*.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-025",
    title: "The Bard XIII",
    diff: 2,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"O Romeo, Romeo! wherefore art thou Romeo?","c":"M AMLNM, AMLNM! JPNANDMAN OAB BPMH AMLNM?","key":"OTKQNDFPUXYZLGMSIAVBHWJECR","given":"TM","by":"William Shakespeare","src":"*Romeo and Juliet*"},
    explain: "“O Romeo, Romeo! wherefore art thou Romeo?”\n\n— William Shakespeare, *Romeo and Juliet*.\n\n*Wherefore* means *why*, not *where*: Juliet is asking why he has to be a Montague.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-069",
    title: "Emerson II",
    diff: 2,
    text: "A line of **Ralph Waldo Emerson**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"The only way to have a friend is to be one.","c":"PGY DSUJ MBJ PD GBXY B QNZYSH ZF PD OY DSY.","key":"BOAHYQRGZTEUKSDVINFPCXMWJL","given":"TN","by":"Ralph Waldo Emerson","src":"*Friendship* (1841)"},
    explain: "“The only way to have a friend is to be one.”\n\n— Ralph Waldo Emerson, *Friendship* (1841).",
    concepts: ["deduction"],
    tags: ["cipher","emerson"]
  },
  {
    id: "cipher-119",
    title: "Pope II",
    diff: 2,
    text: "A line of **Alexander Pope**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"A little learning is a dangerous thing.","c":"I WLSSWV WVIDHLHP LA I XIHPVDKGA SZLHP.","key":"IEOXVUPZLMCWQHKFYDASGBNTJR","given":"GN","by":"Alexander Pope","src":"*An Essay on Criticism* (1711)"},
    explain: "“A little learning is a dangerous thing.”\n\n— Alexander Pope, *An Essay on Criticism* (1711).",
    concepts: ["deduction"],
    tags: ["cipher","pope"]
  },
  {
    id: "cipher-134",
    title: "Milton I",
    diff: 2,
    text: "A line of **John Milton**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"They also serve who only stand and wait.","c":"ERGT XHLS LGVKG JRS SPHT LEXPW XPW JXNE.","key":"XIYWGQORNFCHBPSMZVLEAKJUTD","given":"NT","by":"John Milton","src":"the sonnet *On His Blindness*"},
    explain: "“They also serve who only stand and wait.”\n\n— John Milton, the sonnet *On His Blindness*.",
    concepts: ["deduction"],
    tags: ["cipher","milton"]
  },
  {
    id: "cipher-007",
    title: "The Bard XIV",
    diff: 2,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"The lady doth protest too much, methinks.","c":"NDC AKPI PZND FGZNCEN NZZ YRSD, YCNDUVWE.","key":"KJSPCQODUBWAYVZFXGENRLTMIH","given":"MH","by":"William Shakespeare","src":"*Hamlet*"},
    explain: "“The lady doth protest too much, methinks.”\n\n— William Shakespeare, *Hamlet*.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-026",
    title: "The Bard XV",
    diff: 2,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"The better part of valour is discretion.","c":"CUZ WZCCZJ MXJC TB NXDTEJ VA KVAFJZCVTH.","key":"XWFKZBIUVOLDQHTMRJACENPYGS","given":"AR","by":"William Shakespeare","src":"*Henry IV, Part 1*"},
    explain: "“The better part of valour is discretion.”\n\n— William Shakespeare, *Henry IV, Part 1*.\n\nFalstaff's excuse for playing dead on the battlefield.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-052",
    title: "Scripture IV",
    diff: 2,
    text: "A verse of the King James Bible, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"A merry heart doeth good like a medicine.","c":"E YZMMB XZEMV KAZVX QAAK JPUZ E YZKPFPSZ.","key":"ERFKZNQXPIUJYSAWOMHVCGTLBD","given":"IO","by":"The King James Bible","src":"Proverbs 17:22"},
    explain: "“A merry heart doeth good like a medicine.”\n\n— The King James Bible, Proverbs 17:22.",
    concepts: ["deduction"],
    tags: ["cipher","bible"]
  },
  {
    id: "cipher-120",
    title: "Pope III",
    diff: 2,
    text: "A line of **Alexander Pope**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"Fools rush in where angels fear to tread.","c":"BXXRD ZFDL MC QLYZY PCOYRD BYPZ HX HZYPE.","key":"PTKEYBOLMNARGCXWUZDHFIQSJV","given":"HA","by":"Alexander Pope","src":"*An Essay on Criticism* (1711)"},
    explain: "“Fools rush in where angels fear to tread.”\n\n— Alexander Pope, *An Essay on Criticism* (1711).",
    concepts: ["deduction"],
    tags: ["cipher","pope"]
  },
  {
    id: "cipher-130",
    title: "Tennyson I",
    diff: 2,
    text: "A line of **Alfred, Lord Tennyson**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"To strive, to seek, to find, and not to yield.","c":"QF UQCXIL, QF ULLE, QF ZXKM, BKM KFQ QF NXLVM.","key":"BDRMLZSYXAEVPKFJTCUQOIHGNW","given":"IS","by":"Alfred, Lord Tennyson","src":"*Ulysses* (1842)"},
    explain: "“To strive, to seek, to find, and not to yield.”\n\n— Alfred, Lord Tennyson, *Ulysses* (1842).",
    concepts: ["deduction"],
    tags: ["cipher","tennyson"]
  },
  {
    id: "cipher-133",
    title: "Shelley II",
    diff: 2,
    text: "A line of **Percy Bysshe Shelley**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"If Winter comes, can Spring be far behind?","c":"SR MSGKPN FYTPI, FLG IENSGJ CP RLN CPDSGO?","key":"LCFOPRJDSZUQTGYEANIKHBMVXW","given":"RB","by":"Percy Bysshe Shelley","src":"*Ode to the West Wind* (1820)"},
    explain: "“If Winter comes, can Spring be far behind?”\n\n— Percy Bysshe Shelley, *Ode to the West Wind* (1820).",
    concepts: ["deduction"],
    tags: ["cipher","shelley"]
  },
  {
    id: "cipher-173",
    title: "Old Saw XXII",
    diff: 2,
    text: "An old proverb, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"A bird in the hand is worth two in the bush.","c":"B ZLTJ LG MYI YBGJ LW NATMY MNA LG MYI ZVWY.","key":"BZFJIEKYLHDSPGAXRTWMVUNOQC","given":"BI","by":"Proverb","src":"traditional"},
    explain: "“A bird in the hand is worth two in the bush.”\n\n— A proverb.",
    concepts: ["deduction"],
    tags: ["cipher","proverb"]
  },
  {
    id: "cipher-178",
    title: "Old Saw XXIII",
    diff: 2,
    text: "An old proverb, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"The proof of the pudding is in the eating.","c":"UTA XPVVL VL UTA XZIIEOQ EC EO UTA AFUEOQ.","key":"FGRIALQTEWDSYOVXNPCUZMBKJH","given":"NI","by":"Proverb","src":"traditional"},
    explain: "“The proof of the pudding is in the eating.”\n\n— A proverb.\n\nNot *in the pudding*: to *prove* here means to test.",
    concepts: ["deduction"],
    tags: ["cipher","proverb"]
  },
  {
    id: "cipher-034",
    title: "The Bard XVI",
    diff: 2,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"O brave new world, that has such people in't!","c":"K DCTOP XPJ JKCUV, YGTY GTE EHAG IPKIUP BX'Y!","key":"TDAVPSFGBMRUZXKILCEYHOJQNW","given":"LO","by":"William Shakespeare","src":"*The Tempest*"},
    explain: "“O brave new world, that has such people in't!”\n\n— William Shakespeare, *The Tempest*.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-106",
    title: "Wilde Card I",
    diff: 2,
    text: "A line of **Oscar Wilde**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"The truth is rarely pure and never simple.","c":"XIQ XTAXI PD TLTQMU OATQ LHG HQKQT DPVOMQ.","key":"LFRGQEYIPZNMVHBOCTDXAKJWUS","given":"LT","by":"Oscar Wilde","src":"*The Importance of Being Earnest* (1895)"},
    explain: "“The truth is rarely pure and never simple.”\n\n— Oscar Wilde, *The Importance of Being Earnest* (1895).",
    concepts: ["deduction"],
    tags: ["cipher","wilde"]
  },
  {
    id: "cipher-121",
    title: "Pope IV",
    diff: 2,
    text: "A line of **Alexander Pope**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"Hope springs eternal in the human breast.","c":"BAFK MFZJTWM KSKZTLC JT SBK BXNLT UZKLMS.","key":"LUQHKOWBJGVCNTAFYZMSXEDPRI","given":"AT","by":"Alexander Pope","src":"*An Essay on Man*"},
    explain: "“Hope springs eternal in the human breast.”\n\n— Alexander Pope, *An Essay on Man*.",
    concepts: ["deduction"],
    tags: ["cipher","pope"]
  },
  {
    id: "cipher-003",
    title: "The Bard XVII",
    diff: 2,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"The course of true love never did run smooth.","c":"SGD LMXPND MI SPXD UMOD BDODP HAH PXB NWMMSG.","key":"CZLHDIKGAETUWBMYRPNSXOFVJQ","given":"TH","by":"William Shakespeare","src":"*A Midsummer Night's Dream*"},
    explain: "“The course of true love never did run smooth.”\n\n— William Shakespeare, *A Midsummer Night's Dream*.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-008",
    title: "The Bard XVIII",
    diff: 2,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"Something is rotten in the state of Denmark.","c":"AGLVUWHZM HA BGUUVZ HZ UWV AUIUV GQ PVZLIBO.","key":"IFTPVQMWHDOKLZGJYBAUEXNCRS","given":"AS","by":"William Shakespeare","src":"*Hamlet*"},
    explain: "“Something is rotten in the state of Denmark.”\n\n— William Shakespeare, *Hamlet*.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-103",
    title: "Wilde Card II",
    diff: 2,
    text: "A line of **Oscar Wilde**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"I can resist everything except temptation.","c":"W ROM QSLWLV SBSQFVPWMZ STRSKV VSNKVOVWXM.","key":"OYRHSEZPWDJUNMXKCQLVGBITFA","given":"NC","by":"Oscar Wilde","src":"*Lady Windermere's Fan* (1892)"},
    explain: "“I can resist everything except temptation.”\n\n— Oscar Wilde, *Lady Windermere's Fan* (1892).",
    concepts: ["deduction"],
    tags: ["cipher","wilde"]
  },
  {
    id: "cipher-114",
    title: "Twain I",
    diff: 2,
    text: "A line of **Mark Twain**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"When angry, count four; when very angry, swear.","c":"QWOI MIDSL, AFKIB UFKS; QWOI XOSL MIDSL, HQOMS.","key":"MRAYOUDWZENCPIFTGSHBKXQJLV","given":"GY","by":"Mark Twain","src":"*Pudd'nhead Wilson* (1894)"},
    explain: "“When angry, count four; when very angry, swear.”\n\n— Mark Twain, *Pudd'nhead Wilson* (1894).",
    concepts: ["deduction"],
    tags: ["cipher","twain"]
  },
  {
    id: "cipher-012",
    title: "The Bard XIX",
    diff: 2,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"Friends, Romans, countrymen, lend me your ears.","c":"YGHBSEV, GPWMSV, UPXSDGCWBS, OBSE WB CPXG BMGV.","key":"MRUEBYJKHQNOWSPZLGVDXITACF","given":"SO","by":"William Shakespeare","src":"*Julius Caesar*"},
    explain: "“Friends, Romans, countrymen, lend me your ears.”\n\n— William Shakespeare, *Julius Caesar*.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-056",
    title: "Poor Richard V",
    diff: 2,
    text: "A line of **Benjamin Franklin**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"Three may keep a secret, if two of them are dead.","c":"FPVAA LUH CAAW U MADVAF, TI FOJ JI FPAL UVA SAUS.","key":"UGDSAIBPTECQLXJWNVMFZROYHK","given":"RD","by":"Benjamin Franklin","src":"*Poor Richard's Almanack*"},
    explain: "“Three may keep a secret, if two of them are dead.”\n\n— Benjamin Franklin, *Poor Richard's Almanack*.",
    concepts: ["deduction"],
    tags: ["cipher","franklin"]
  },
  {
    id: "cipher-077",
    title: "Walden II",
    diff: 2,
    text: "A line of **Henry David Thoreau**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"It is never too late to give up our prejudices.","c":"PR PN DQKQA RMM YXRQ RM SPKQ HF MHA FAQEHGPZQN.","key":"XJZGQVSLPEUYBDMFIANRHKOWCT","given":"OR","by":"Henry David Thoreau","src":"*Walden* (1854)"},
    explain: "“It is never too late to give up our prejudices.”\n\n— Henry David Thoreau, *Walden* (1854).",
    concepts: ["deduction"],
    tags: ["cipher","thoreau"]
  },
  {
    id: "cipher-078",
    title: "Lincoln I",
    diff: 2,
    text: "A line of **Abraham Lincoln**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. Two letters are given to start you off.",
    data: {"kind":"crypto","q":"A house divided against itself cannot stand.","c":"H YSBNG QZPZQGQ HDHZMNO ZONGXW IHMMSO NOHMQ.","key":"HFIQGWDYZACXRMSEVJNOBPKTUL","given":"NT","by":"Abraham Lincoln","src":"the \"House Divided\" speech (1858)"},
    explain: "“A house divided against itself cannot stand.”\n\n— Abraham Lincoln, the \"House Divided\" speech (1858).\n\nLincoln was quoting the Gospel of Mark.",
    concepts: ["deduction"],
    tags: ["cipher","lincoln"]
  },
  {
    id: "cipher-079",
    title: "Lincoln II",
    diff: 3,
    text: "A line of **Abraham Lincoln**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"With malice toward none, with charity for all.","c":"ENYO QZJNWP YUEZKF IUIP, ENYO WOZKNYC SUK ZJJ.","key":"ZDWFPSXONGTJQIUBHKVYAMERCL","given":"W","by":"Abraham Lincoln","src":"the Second Inaugural Address (1865)"},
    explain: "“With malice toward none, with charity for all.”\n\n— Abraham Lincoln, the Second Inaugural Address (1865).",
    concepts: ["deduction"],
    tags: ["cipher","lincoln"]
  },
  {
    id: "cipher-131",
    title: "Coleridge I",
    diff: 3,
    text: "A line of **Samuel Taylor Coleridge**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"Water, water, every where, nor any drop to drink.","c":"BYMGI, BYMGI, GQGIP BDGIG, RHI YRP UIHO MH UILRC.","key":"YEAUGVNDLWCTSRHOKIJMXQBZPF","given":"O","by":"Samuel Taylor Coleridge","src":"*The Rime of the Ancient Mariner* (1798)"},
    explain: "“Water, water, every where, nor any drop to drink.”\n\n— Samuel Taylor Coleridge, *The Rime of the Ancient Mariner* (1798).",
    concepts: ["deduction"],
    tags: ["cipher","coleridge"]
  },
  {
    id: "cipher-149",
    title: "Payne I",
    diff: 3,
    text: "A line of **John Howard Payne**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"Be it ever so humble, there's no place like home.","c":"ZH YA HUHK QC GEBZJH, AGHKH'Q XC NJVTH JYFH GCBH.","key":"VZTRHIOGYLFJBXCNSKQAEUDPMW","given":"B","by":"John Howard Payne","src":"*Home! Sweet Home!* (1823)"},
    explain: "“Be it ever so humble, there's no place like home.”\n\n— John Howard Payne, *Home! Sweet Home!* (1823).",
    concepts: ["deduction"],
    tags: ["cipher","payne"]
  },
  {
    id: "cipher-027",
    title: "The Bard XX",
    diff: 3,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"Though this be madness, yet there is method in't.","c":"GQTVFQ GQAP HL BNOKLPP, ULG GQLJL AP BLGQTO AK'G.","key":"NHYOLMFQAWRSBKTDIJPGVCEZUX","given":"I","by":"William Shakespeare","src":"*Hamlet*"},
    explain: "“Though this be madness, yet there is method in't.”\n\n— William Shakespeare, *Hamlet*.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-110",
    title: "Twain II",
    diff: 3,
    text: "A line of **Mark Twain**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"Man is the only animal that blushes. Or needs to.","c":"EYS WP ALC BSMU YSWEYM ALYA ZMJPLCP. BD SCCKP AB.","key":"YZXKCONLWVGMESBITDPAJRHFUQ","given":"S","by":"Mark Twain","src":"*Following the Equator* (1897)"},
    explain: "“Man is the only animal that blushes. Or needs to.”\n\n— Mark Twain, *Following the Equator* (1897).",
    concepts: ["deduction"],
    tags: ["cipher","twain"]
  },
  {
    id: "cipher-136",
    title: "Johnson I",
    diff: 3,
    text: "A line of **Samuel Johnson**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"When a man is tired of London, he is tired of life.","c":"MUKG J IJG OH ZOQKN LB DLGNLG, UK OH ZOQKN LB DOBK.","key":"JVYNKBCUOWRDIGLAEQHZFTMPXS","given":"L","by":"Samuel Johnson","src":"in James Boswell's *Life of Samuel Johnson* (1791)"},
    explain: "“When a man is tired of London, he is tired of life.”\n\n— Samuel Johnson, in James Boswell's *Life of Samuel Johnson* (1791).",
    concepts: ["deduction"],
    tags: ["cipher","johnson"]
  },
  {
    id: "cipher-049",
    title: "Scripture V",
    diff: 3,
    text: "A verse of the King James Bible, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"Whatsoever a man soweth, that shall he also reap.","c":"KWDXARLSLG D CDZ ARKLXW, XWDX AWDOO WL DOAR GLDI.","key":"DUTFLQPWJVHOCZRIYGAXNSKMBE","given":"S","by":"The King James Bible","src":"Galatians 6:7"},
    explain: "“Whatsoever a man soweth, that shall he also reap.”\n\n— The King James Bible, Galatians 6:7.",
    concepts: ["deduction"],
    tags: ["cipher","bible"]
  },
  {
    id: "cipher-072",
    title: "Walden III",
    diff: 3,
    text: "A line of **Henry David Thoreau**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"The mass of men lead lives of quiet desperation.","c":"UKP RCTT SQ RPL ZPCE ZNHPT SQ JVNPU EPTAPOCUNSL.","key":"CYXEPQWKNIDZRLSAJOTUVHBFMG","given":"F","by":"Henry David Thoreau","src":"*Walden* (1854)"},
    explain: "“The mass of men lead lives of quiet desperation.”\n\n— Henry David Thoreau, *Walden* (1854).",
    concepts: ["deduction"],
    tags: ["cipher","thoreau"]
  },
  {
    id: "cipher-086",
    title: "Boz IV",
    diff: 3,
    text: "A line of **Charles Dickens**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"It was the best of times, it was the worst of times.","c":"SE ZMY EPJ DJYE GI ESXJY, SE ZMY EPJ ZGWYE GI ESXJY.","key":"MDQLJIUPSFNBXAGTVWYEHRZCOK","given":"S","by":"Charles Dickens","src":"*A Tale of Two Cities* (1859)"},
    explain: "“It was the best of times, it was the worst of times.”\n\n— Charles Dickens, *A Tale of Two Cities* (1859).",
    concepts: ["deduction"],
    tags: ["cipher","dickens"]
  },
  {
    id: "cipher-129",
    title: "Tennyson II",
    diff: 3,
    text: "A line of **Alfred, Lord Tennyson**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"Theirs not to reason why, theirs but to do and die.","c":"YDFNUA RCY YC UFOACR MDS, YDFNUA GPY YC WC ORW WNF.","key":"OGVWFHXDNKJIZRCLBUAYPTMESQ","given":"N","by":"Alfred, Lord Tennyson","src":"*The Charge of the Light Brigade* (1854)"},
    explain: "“Theirs not to reason why, theirs but to do and die.”\n\n— Alfred, Lord Tennyson, *The Charge of the Light Brigade* (1854).",
    concepts: ["deduction"],
    tags: ["cipher","tennyson"]
  },
  {
    id: "cipher-020",
    title: "The Bard XXI",
    diff: 3,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"Once more unto the breach, dear friends, once more.","c":"MDJN LMON HDUM UIN PONCJI, GNCO TOVNDGW, MDJN LMON.","key":"CPJGNTBIVQZFLDMEXOWUHAKRSY","given":"A","by":"William Shakespeare","src":"*Henry V*"},
    explain: "“Once more unto the breach, dear friends, once more.”\n\n— William Shakespeare, *Henry V*.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-033",
    title: "The Bard XXII",
    diff: 3,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"Misery acquaints a man with strange bedfellows.","c":"HYMZTI VGOJVYDAM V HVD NYAX MATVDEZ SZUCZQQLNM.","key":"VSGUZCEXYBRQHDLWOTMAJPNFIK","given":"L","by":"William Shakespeare","src":"*The Tempest*"},
    explain: "“Misery acquaints a man with strange bedfellows.”\n\n— William Shakespeare, *The Tempest*.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-076",
    title: "Walden IV",
    diff: 3,
    text: "A line of **Henry David Thoreau**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"Heaven is under our feet as well as over our heads.","c":"ZRCURT FH OTQRX NOX GRRW CH ARSS CH NURX NOX ZRCQH.","key":"CIEQRGLZFBPSKTNYJXHWOUAMDV","given":"R","by":"Henry David Thoreau","src":"*Walden* (1854)"},
    explain: "“Heaven is under our feet as well as over our heads.”\n\n— Henry David Thoreau, *Walden* (1854).",
    concepts: ["deduction"],
    tags: ["cipher","thoreau"]
  },
  {
    id: "cipher-117",
    title: "Twain III",
    diff: 3,
    text: "A line of **Mark Twain**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"Work consists of whatever a body is obliged to do.","c":"ZDKW JDMNRNEN DL ZQTEIFIK T HDGO RN DHYRCIG ED GD.","key":"THJGILCQRPWYSMDUBKNEAFZVOX","given":"I","by":"Mark Twain","src":"*The Adventures of Tom Sawyer* (1876)"},
    explain: "“Work consists of whatever a body is obliged to do.”\n\n— Mark Twain, *The Adventures of Tom Sawyer* (1876).\n\nTom has just talked his friends into paying him for the privilege of whitewashing his fence. Play, Twain goes on, is whatever a body is not obliged to do.",
    concepts: ["deduction"],
    tags: ["cipher","twain"]
  },
  {
    id: "cipher-142",
    title: "Shelley III",
    diff: 3,
    text: "A line of **Mary Shelley**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"Beware; for I am fearless, and therefore powerful.","c":"LXTYIX; DQI U YZ DXYICXVV, YHG SPXIXDQIX WQTXIDKC.","key":"YLOGXDAPURMCZHQWBIVSKNTJFE","given":"W","by":"Mary Shelley","src":"*Frankenstein* (1818)"},
    explain: "“Beware; for I am fearless, and therefore powerful.”\n\n— Mary Shelley, *Frankenstein* (1818).\n\nThe creature, to Victor Frankenstein.",
    concepts: ["deduction"],
    tags: ["cipher","shelley"]
  },
  {
    id: "cipher-036",
    title: "The Bard XXIII",
    diff: 3,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"Better three hours too soon than a minute too late.","c":"HRUURD UGDRR GBFDX UBB XBBA UGIA I YQAFUR UBB TIUR.","key":"IHKWRMVGQSZTYABCNDXUFOPLJE","given":"R","by":"William Shakespeare","src":"*The Merry Wives of Windsor*"},
    explain: "“Better three hours too soon than a minute too late.”\n\n— William Shakespeare, *The Merry Wives of Windsor*.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-139",
    title: "Poe I",
    diff: 3,
    text: "A line of **Edgar Allan Poe**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"All that we see or seem is but a dream within a dream.","c":"ZRR GOZG VW TWW BQ TWWL UT AFG Z KQWZL VUGOUP Z KQWZL.","key":"ZANKWJXOUEIRLPBDMQTGFYVHCS","given":"I","by":"Edgar Allan Poe","src":"*A Dream Within a Dream* (1849)"},
    explain: "“All that we see or seem is but a dream within a dream.”\n\n— Edgar Allan Poe, *A Dream Within a Dream* (1849).",
    concepts: ["deduction"],
    tags: ["cipher","poe"]
  },
  {
    id: "cipher-152",
    title: "Hale I",
    diff: 3,
    text: "A line of **Sarah Josepha Hale**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"Mary had a little lamb, its fleece was white as snow.","c":"RBJE SBW B ZACCZT ZBRO, ACY PZTTVT GBY GSACT BY YMNG.","key":"BOVWTPQSAUFZRMNIDJYCXLGHEK","given":"T","by":"Sarah Josepha Hale","src":"*Mary's Lamb* (1830)"},
    explain: "“Mary had a little lamb, its fleece was white as snow.”\n\n— Sarah Josepha Hale, *Mary's Lamb* (1830).",
    concepts: ["deduction"],
    tags: ["cipher","hale"]
  },
  {
    id: "cipher-159",
    title: "Old Saw XXIV",
    diff: 3,
    text: "An old proverb, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"Don't count your chickens before they are hatched.","c":"SVQ'W KVPQW UVPL KGBKYXQR NXHVLX WGXU OLX GOWKGXS.","key":"ONKSXHEGBIYZCQVJTLRWPAMDUF","given":"A","by":"Proverb","src":"traditional"},
    explain: "“Don't count your chickens before they are hatched.”\n\n— A proverb.\n\nThe moral usually drawn from Aesop's fable of the milkmaid who daydreams about what her milk will buy — and spills it.",
    concepts: ["deduction"],
    tags: ["cipher","proverb"]
  },
  {
    id: "cipher-059",
    title: "Poor Richard VI",
    diff: 3,
    text: "A line of **Benjamin Franklin**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"He that lies down with dogs, shall rise up with fleas.","c":"PG CPJC VFGH WUYS YFCP WUOH, HPJVV TFHG AB YFCP LVGJH.","key":"JIDWGLOPFERVQSUBKTHCAXYMZN","given":"D","by":"Benjamin Franklin","src":"*Poor Richard's Almanack*"},
    explain: "“He that lies down with dogs, shall rise up with fleas.”\n\n— Benjamin Franklin, *Poor Richard's Almanack*.",
    concepts: ["deduction"],
    tags: ["cipher","franklin"]
  },
  {
    id: "cipher-064",
    title: "Poor Richard VII",
    diff: 3,
    text: "A line of **Benjamin Franklin**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"Genius without education is like silver in the mine.","c":"SYHZPN QZCVAPC YXPIRCZAH ZN MZTY NZMUYD ZH CVY WZHY.","key":"RKIXYGSVZFTMWHALJDNCPUQBOE","given":"T","by":"Benjamin Franklin","src":"*Poor Richard's Almanack*"},
    explain: "“Genius without education is like silver in the mine.”\n\n— Benjamin Franklin, *Poor Richard's Almanack*.",
    concepts: ["deduction"],
    tags: ["cipher","franklin"]
  },
  {
    id: "cipher-080",
    title: "Lincoln III",
    diff: 3,
    text: "A line of **Abraham Lincoln**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"We are not enemies, but friends. We must not be enemies.","c":"UZ NKZ BJV ZBZILZE, CWV RKLZBGE. UZ IWEV BJV CZ ZBZILZE.","key":"NCYGZRMQLXDSIBJOAKEVWTUPFH","given":"N","by":"Abraham Lincoln","src":"the First Inaugural Address (1861)"},
    explain: "“We are not enemies, but friends. We must not be enemies.”\n\n— Abraham Lincoln, the First Inaugural Address (1861).",
    concepts: ["deduction"],
    tags: ["cipher","lincoln"]
  },
  {
    id: "cipher-115",
    title: "Twain IV",
    diff: 3,
    text: "A line of **Mark Twain**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"Nothing so needs reforming as other people's habits.","c":"TFLMSTC QF TOOPQ GONFGZSTC JQ FLMOG UOFUVO'Q MJISLQ.","key":"JIEPONCMSHAVZTFUYGQLDKRWBX","given":"S","by":"Mark Twain","src":"*Pudd'nhead Wilson* (1894)"},
    explain: "“Nothing so needs reforming as other people's habits.”\n\n— Mark Twain, *Pudd'nhead Wilson* (1894).",
    concepts: ["deduction"],
    tags: ["cipher","twain"]
  },
  {
    id: "cipher-137",
    title: "Stevenson I",
    diff: 3,
    text: "A line of **Robert Louis Stevenson**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"To travel hopefully is a better thing than to arrive.","c":"EU ESRZCG QUACOFGGH NB R DCEECS EQNXW EQRX EU RSSNZC.","key":"RDPLCOWQNITGKXUAYSBEFZMVHJ","given":"R","by":"Robert Louis Stevenson","src":"*Virginibus Puerisque* (1881)"},
    explain: "“To travel hopefully is a better thing than to arrive.”\n\n— Robert Louis Stevenson, *Virginibus Puerisque* (1881).",
    concepts: ["deduction"],
    tags: ["cipher","stevenson"]
  },
  {
    id: "cipher-037",
    title: "Scripture VI",
    diff: 3,
    text: "A verse of the King James Bible, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"In the beginning God created the heaven and the earth.","c":"QP MXS USTQPPQPT TCK LOSIMSK MXS XSIFSP IPK MXS SIOMX.","key":"IULKSGTXQHWRYPCVEOAMBFDZJN","given":"R","by":"The King James Bible","src":"Genesis 1:1"},
    explain: "“In the beginning God created the heaven and the earth.”\n\n— The King James Bible, Genesis 1:1.",
    concepts: ["deduction"],
    tags: ["cipher","bible"]
  },
  {
    id: "cipher-063",
    title: "Poor Richard VIII",
    diff: 3,
    text: "A line of **Benjamin Franklin**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"He that falls in love with himself, will have no rivals.","c":"YQ LYCL TCAAD EI ARSQ XELY YEODQAT, XEAA YCSQ IR HESCAD.","key":"CZKPQTBYEUGAOIRJMHDLWSXNFV","given":"E","by":"Benjamin Franklin","src":"*Poor Richard's Almanack*"},
    explain: "“He that falls in love with himself, will have no rivals.”\n\n— Benjamin Franklin, *Poor Richard's Almanack*.",
    concepts: ["deduction"],
    tags: ["cipher","franklin"]
  },
  {
    id: "cipher-065",
    title: "Poor Richard IX",
    diff: 3,
    text: "A line of **Benjamin Franklin**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"Having been poor is no shame, but being ashamed of it, is.","c":"FDHSXW QZZX UMMV SP XM PFDTZ, QNI QZSXW DPFDTZJ ME SI, SP.","key":"DQKJZEWFSGCATXMUBVPINHROLY","given":"B","by":"Benjamin Franklin","src":"*Poor Richard's Almanack*"},
    explain: "“Having been poor is no shame, but being ashamed of it, is.”\n\n— Benjamin Franklin, *Poor Richard's Almanack*.",
    concepts: ["deduction"],
    tags: ["cipher","franklin"]
  },
  {
    id: "cipher-068",
    title: "Emerson III",
    diff: 3,
    text: "A line of **Ralph Waldo Emerson**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"Nothing great was ever achieved without enthusiasm.","c":"RHUOFRI IBAVU JVG ALAB VPOFALAK JFUOHEU ARUOEGFVGX.","key":"VDPKAZIOFWQSXRHNYBGUELJTCM","given":"H","by":"Ralph Waldo Emerson","src":"*Circles* (1841)"},
    explain: "“Nothing great was ever achieved without enthusiasm.”\n\n— Ralph Waldo Emerson, *Circles* (1841).",
    concepts: ["deduction"],
    tags: ["cipher","emerson"]
  },
  {
    id: "cipher-151",
    title: "Taylor I",
    diff: 3,
    text: "A line of **Jane Taylor**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"Twinkle, twinkle, little star, how I wonder what you are!","c":"MCKQOUL, MCKQOUL, UKMMUL JMHT, RSC K CSQVLT CRHM NSG HTL!","key":"HIEVLBFRKPOUDQSWYTJMGZCANX","given":"W","by":"Jane Taylor","src":"*The Star* (1806)"},
    explain: "“Twinkle, twinkle, little star, how I wonder what you are!”\n\n— Jane Taylor, *The Star* (1806).",
    concepts: ["deduction"],
    tags: ["cipher","taylor"]
  },
  {
    id: "cipher-171",
    title: "Old Saw XXV",
    diff: 3,
    text: "An old proverb, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"You can lead a horse to water, but you can't make it drink.","c":"IAC HPU QOPJ P RAWGO LA KPLOW, VCL IAC HPU'L TPFO NL JWNUF.","key":"PVHJOZBRNMFQTUAXYWGLCSKDIE","given":"N","by":"Proverb","src":"traditional"},
    explain: "“You can lead a horse to water, but you can't make it drink.”\n\n— A proverb.",
    concepts: ["deduction"],
    tags: ["cipher","proverb"]
  },
  {
    id: "cipher-041",
    title: "Scripture VII",
    diff: 3,
    text: "A verse of the King James Bible, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"The race is not to the swift, nor the battle to the strong.","c":"ISP ZHAP LN WCI IC ISP NDLUI, WCZ ISP GHIIXP IC ISP NIZCWO.","key":"HGAFPUOSLBJXKWCMTZNIQEDYRV","given":"R","by":"The King James Bible","src":"Ecclesiastes 9:11"},
    explain: "“The race is not to the swift, nor the battle to the strong.”\n\n— The King James Bible, Ecclesiastes 9:11.",
    concepts: ["deduction"],
    tags: ["cipher","bible"]
  },
  {
    id: "cipher-083",
    title: "Miss Austen I",
    diff: 3,
    text: "A line of **Jane Austen**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"I declare after all there is no enjoyment like reading!","c":"J HKSANTK NGUKT NAA UQKTK JM IR KIVROZKIU AJWK TKNHJIY!","key":"NLSHKGYQJVWAZIRBCTMUEFXDOP","given":"I","by":"Jane Austen","src":"*Pride and Prejudice* (1813)"},
    explain: "“I declare after all there is no enjoyment like reading!”\n\n— Jane Austen, *Pride and Prejudice* (1813).\n\nCaroline Bingley says it — while pretending to read, to impress Mr Darcy.",
    concepts: ["deduction"],
    tags: ["cipher","austen"]
  },
  {
    id: "cipher-150",
    title: "Watts I",
    diff: 3,
    text: "A line of **Isaac Watts**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"How doth the little busy bee improve each shining hour.","c":"OBT EBLO LOU MVLLMU SJCW SUU VYZQBAU UDGO COVPVPK OBJQ.","key":"DSGEUIKOVXHMYPBZRQCLJATFWN","given":"B","by":"Isaac Watts","src":"*Against Idleness and Mischief* (1715)"},
    explain: "“How doth the little busy bee improve each shining hour.”\n\n— Isaac Watts, *Against Idleness and Mischief* (1715).\n\nLewis Carroll turned it into *How doth the little crocodile improve his shining tail* in *Alice*.",
    concepts: ["deduction"],
    tags: ["cipher","watts"]
  },
  {
    id: "cipher-044",
    title: "Scripture VIII",
    diff: 3,
    text: "A verse of the King James Bible, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"Go to the ant, thou sluggard; consider her ways, and be wise.","c":"HL PL PVC RBP, PVLY ZOYHHREK; ULBZFKCE VCE QRMZ, RBK DC QFZC.","key":"RDUKCXHVFWTOABLSGEZPYJQNMI","given":"N","by":"The King James Bible","src":"Proverbs 6:6"},
    explain: "“Go to the ant, thou sluggard; consider her ways, and be wise.”\n\n— The King James Bible, Proverbs 6:6.",
    concepts: ["deduction"],
    tags: ["cipher","bible"]
  },
  {
    id: "cipher-067",
    title: "Emerson IV",
    diff: 3,
    text: "A line of **Ralph Waldo Emerson**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"A foolish consistency is the hobgoblin of little minds.","c":"F IAATYGS VAHGYGEDHVL YG ESD SAZPAZTYH AI TYEETD RYHKG.","key":"FZVKDIPSYMJTRHABOWGENQCULX","given":"L","by":"Ralph Waldo Emerson","src":"*Self-Reliance* (1841)"},
    explain: "“A foolish consistency is the hobgoblin of little minds.”\n\n— Ralph Waldo Emerson, *Self-Reliance* (1841).",
    concepts: ["deduction"],
    tags: ["cipher","emerson"]
  },
  {
    id: "cipher-087",
    title: "Boz V",
    diff: 3,
    text: "A line of **Charles Dickens**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"It is a far, far better thing that I do, than I have ever done.","c":"PX PQ I TIA, TIA DWXXWA XNPYU XNIX P CF, XNIY P NIJW WJWA CFYW.","key":"IDGCWTUNPHOSLYFEKAQXMJZRVB","given":"A","by":"Charles Dickens","src":"*A Tale of Two Cities* (1859)"},
    explain: "“It is a far, far better thing that I do, than I have ever done.”\n\n— Charles Dickens, *A Tale of Two Cities* (1859).",
    concepts: ["deduction"],
    tags: ["cipher","dickens"]
  },
  {
    id: "cipher-172",
    title: "Old Saw XXVI",
    diff: 3,
    text: "An old proverb, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"People who live in glass houses should not throw stones.","c":"OBGOTB CAG TRMB RP LTYKK AGVKBK KAGVTN PGQ QAUGC KQGPBK.","key":"YDHNBWLARFJTZPGOEUKQVMCIXS","given":"T","by":"Proverb","src":"traditional"},
    explain: "“People who live in glass houses should not throw stones.”\n\n— A proverb.",
    concepts: ["deduction"],
    tags: ["cipher","proverb"]
  },
  {
    id: "cipher-048",
    title: "Scripture IX",
    diff: 3,
    text: "A verse of the King James Bible, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"For now we see through a glass, darkly; but then face to face.","c":"DJS IJC CT NTT WOSJPXO V XGVNN, FVSBGA; MPW WOTI DVLT WJ DVLT.","key":"VMLFTDXOKRBGZIJQUSNWPECYAH","given":"T","by":"The King James Bible","src":"1 Corinthians 13:12"},
    explain: "“For now we see through a glass, darkly; but then face to face.”\n\n— The King James Bible, 1 Corinthians 13:12.",
    concepts: ["deduction"],
    tags: ["cipher","bible"]
  },
  {
    id: "cipher-073",
    title: "Walden V",
    diff: 3,
    text: "A line of **Henry David Thoreau**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"I went to the woods because I wished to live deliberately.","c":"B LXIG GQ GWX LQQNF SXHUYFX B LBFWXN GQ EBMX NXEBSXCUGXED.","key":"USHNXRJWBZVEKIQTPCFGYMLODA","given":"L","by":"Henry David Thoreau","src":"*Walden* (1854)"},
    explain: "“I went to the woods because I wished to live deliberately.”\n\n— Henry David Thoreau, *Walden* (1854).",
    concepts: ["deduction"],
    tags: ["cipher","thoreau"]
  },
  {
    id: "cipher-108",
    title: "Wilde Card III",
    diff: 3,
    text: "A line of **Oscar Wilde**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"Experience is the name every one gives to their mistakes.","c":"VBWVTYVONV YA EGV OKQV VUVTD XOV JYUVA EX EGVYT QYAEKHVA.","key":"KCNSVZJGYPHRQOXWMTAEIULBDF","given":"M","by":"Oscar Wilde","src":"*Lady Windermere's Fan* (1892)"},
    explain: "“Experience is the name every one gives to their mistakes.”\n\n— Oscar Wilde, *Lady Windermere's Fan* (1892).",
    concepts: ["deduction"],
    tags: ["cipher","wilde"]
  },
  {
    id: "cipher-050",
    title: "Scripture X",
    diff: 3,
    text: "A verse of the King James Bible, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"Can the Ethiopian change his skin, or the leopard his spots?","c":"XNC MLY YMLJSKJNC XLNCEY LJZ ZIJC, SO MLY RYSKNOQ LJZ ZKSMZ?","key":"NVXQYBELJWIRGCSKFOZMAPDTUH","given":"N","by":"The King James Bible","src":"Jeremiah 13:23"},
    explain: "“Can the Ethiopian change his skin, or the leopard his spots?”\n\n— The King James Bible, Jeremiah 13:23.",
    concepts: ["deduction"],
    tags: ["cipher","bible"]
  },
  {
    id: "cipher-102",
    title: "Wonderland I",
    diff: 3,
    text: "A line of **Lewis Carroll**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"It takes all the running you can do, to keep in the same place.","c":"WC CYSQB YEE CMQ URVVWVP DKR AYV XK, CK SQQZ WV CMQ BYLQ ZEYAQ.","key":"YJAXQHPMWISELVKZGUBCRTFODN","given":"C","by":"Lewis Carroll","src":"*Through the Looking-Glass* (1871)"},
    explain: "“It takes all the running you can do, to keep in the same place.”\n\n— Lewis Carroll, *Through the Looking-Glass* (1871).\n\nThe Red Queen explains her country to Alice.",
    concepts: ["deduction"],
    tags: ["cipher","carroll"]
  },
  {
    id: "cipher-124",
    title: "Blake I",
    diff: 3,
    text: "A line of **William Blake**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"To see a world in a grain of sand, and a heaven in a wild flower.","c":"RQ OGG V IQWJC XM V NWVXM QA OVMC, VMC V TGVDGM XM V IXJC AJQIGW.","key":"VZPCGANTXHBJSMQKUWORFDIELY","given":"L","by":"William Blake","src":"*Auguries of Innocence*"},
    explain: "“To see a world in a grain of sand, and a heaven in a wild flower.”\n\n— William Blake, *Auguries of Innocence*.",
    concepts: ["deduction"],
    tags: ["cipher","blake"]
  },
  {
    id: "cipher-028",
    title: "The Bard XXIV",
    diff: 3,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself. One letter is given to start you off.",
    data: {"kind":"crypto","q":"There is nothing either good or bad, but thinking makes it so.","c":"VRDND SU XGVRSXM DSVRDN MGGI GN KYI, KCV VRSXFSXM OYFDU SV UG.","key":"YKQIDBMRSTFHOXGWZNUVCPJLAE","given":"G","by":"William Shakespeare","src":"*Hamlet*"},
    explain: "“There is nothing either good or bad, but thinking makes it so.”\n\n— William Shakespeare, *Hamlet*.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-104",
    title: "Wilde Card IV",
    diff: 4,
    text: "A line of **Oscar Wilde**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"We are all in the gutter, but some of us are looking at the stars.","c":"QK LIK LNN JV BRK YZBBKI, WZB CPHK PG ZC LIK NPPAJVY LB BRK CBLIC.","key":"LWDTKGYRJMANHVPEFICBZUQOSX","given":"","by":"Oscar Wilde","src":"*Lady Windermere's Fan* (1892)"},
    explain: "“We are all in the gutter, but some of us are looking at the stars.”\n\n— Oscar Wilde, *Lady Windermere's Fan* (1892).",
    concepts: ["deduction"],
    tags: ["cipher","wilde"]
  },
  {
    id: "cipher-145",
    title: "Cowper I",
    diff: 4,
    text: "A line of **William Cowper**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Variety's the very spice of life, that gives it all its flavour.","c":"LPBECJI'F JUC LCBI FNEKC GA XEAC, JUPJ OELCF EJ PXX EJF AXPLGZB.","key":"PYKRCAOUEWDXSMGNTBFJZLVQIH","given":"","by":"William Cowper","src":"*The Task* (1785)"},
    explain: "“Variety's the very spice of life, that gives it all its flavour.”\n\n— William Cowper, *The Task* (1785).",
    concepts: ["deduction"],
    tags: ["cipher","cowper"]
  },
  {
    id: "cipher-002",
    title: "The Bard XXV",
    diff: 4,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"All the world's a stage, and all the men and women merely players.","c":"RNN QGP UHWNE'T R TQRCP, RVE RNN QGP SPV RVE UHSPV SPWPNZ DNRZPWT.","key":"RFXEPICGKMBNSVHDJWTQLYUOZA","given":"","by":"William Shakespeare","src":"*As You Like It*"},
    explain: "“All the world's a stage, and all the men and women merely players.”\n\n— William Shakespeare, *As You Like It*.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-022",
    title: "The Bard XXVI",
    diff: 4,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Double, double toil and trouble; fire burn and cauldron bubble.","c":"ADXUSL, ADXUSL CDMS FPA CGDXUSL; QMGL UXGP FPA ZFXSAGDP UXUUSL.","key":"FUZALQNWMIBSOPDVRGECXTJHKY","given":"","by":"William Shakespeare","src":"*Macbeth*"},
    explain: "“Double, double toil and trouble; fire burn and cauldron bubble.”\n\n— William Shakespeare, *Macbeth*.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-113",
    title: "Twain V",
    diff: 4,
    text: "A line of **Mark Twain**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Cauliflower is nothing but cabbage with a college education.","c":"GSPHYIHLKTE YV MLBUYMZ DPB GSDDSZT KYBU S GLHHTZT TWPGSBYLM.","key":"SDGWTIZUYCAHXMLNJEVBPRKOQF","given":"","by":"Mark Twain","src":"*Pudd'nhead Wilson* (1894)"},
    explain: "“Cauliflower is nothing but cabbage with a college education.”\n\n— Mark Twain, *Pudd'nhead Wilson* (1894).",
    concepts: ["deduction"],
    tags: ["cipher","twain"]
  },
  {
    id: "cipher-107",
    title: "Wilde Card V",
    diff: 4,
    text: "A line of **Oscar Wilde**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"A man who knows the price of everything and the value of nothing.","c":"Q NQO UIJ EOJUW ZIS XAFMS JY SRSATZIFOD QOC ZIS RQBLS JY OJZIFOD.","key":"QKMCSYDIFGEBNOJXVAWZLRUHTP","given":"","by":"Oscar Wilde","src":"*Lady Windermere's Fan* (1892)"},
    explain: "“A man who knows the price of everything and the value of nothing.”\n\n— Oscar Wilde, *Lady Windermere's Fan* (1892).\n\nLord Darlington's answer to the question *What is a cynic?*",
    concepts: ["deduction"],
    tags: ["cipher","wilde"]
  },
  {
    id: "cipher-128",
    title: "Tennyson III",
    diff: 4,
    text: "A line of **Alfred, Lord Tennyson**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"'Tis better to have loved and lost than never to have loved at all.","c":"'NRQ VYNNYG NT FPWY KTWYJ PSJ KTQN NFPS SYWYG NT FPWY KTWYJ PN PKK.","key":"PVHJYDXFRCZKBSTIUGQNOWEMAL","given":"","by":"Alfred, Lord Tennyson","src":"*In Memoriam A.H.H.* (1850)"},
    explain: "“'Tis better to have loved and lost than never to have loved at all.”\n\n— Alfred, Lord Tennyson, *In Memoriam A.H.H.* (1850).",
    concepts: ["deduction"],
    tags: ["cipher","tennyson"]
  },
  {
    id: "cipher-144",
    title: "Browning II",
    diff: 4,
    text: "A line of **Robert Browning**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Ah, but a man's reach should exceed his grasp, or what's a heaven for?","c":"WI, RPB W CWG'L XDWAI LIMPFJ DSADDJ IYL OXWLK, MX QIWB'L W IDWTDG VMX?","key":"WRAJDVOIYZEFCGMKUXLBPTQSHN","given":"","by":"Robert Browning","src":"*Andrea del Sarto* (1855)"},
    explain: "“Ah, but a man's reach should exceed his grasp, or what's a heaven for?”\n\n— Robert Browning, *Andrea del Sarto* (1855).",
    concepts: ["deduction"],
    tags: ["cipher","browning"]
  },
  {
    id: "cipher-030",
    title: "The Bard XXVII",
    diff: 4,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"How sharper than a serpent's tooth it is to have a thankless child!","c":"LDH QLWZNFZ GLWM W QFZNFMG'Q GDDGL AG AQ GD LWKF W GLWMSEFQQ OLAEB!","key":"WXOBFYILAVSECMDNPZQGTKHRJU","given":"","by":"William Shakespeare","src":"*King Lear*"},
    explain: "“How sharper than a serpent's tooth it is to have a thankless child!”\n\n— William Shakespeare, *King Lear*.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-096",
    title: "Wonderland II",
    diff: 4,
    text: "A line of **Lewis Carroll**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Begin at the beginning, and go on till you come to the end: then stop.","c":"EJITF GY YSJ EJITFFTFI, GFQ IU UF YTAA OUD HUVJ YU YSJ JFQ: YSJF NYUW.","key":"GEHQJPISTZRAVFUWBXNYDKMLOC","given":"","by":"Lewis Carroll","src":"*Alice's Adventures in Wonderland* (1865)"},
    explain: "“Begin at the beginning, and go on till you come to the end: then stop.”\n\n— Lewis Carroll, *Alice's Adventures in Wonderland* (1865).\n\nThe King of Hearts, instructing the White Rabbit.",
    concepts: ["deduction"],
    tags: ["cipher","carroll"]
  },
  {
    id: "cipher-043",
    title: "Scripture XI",
    diff: 4,
    text: "A verse of the King James Bible, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"A soft answer turneth away wrath: but grievous words stir up anger.","c":"P OYQJ PXOCRE JFEXRJD PCPN CEPJD: IFJ UEVRKYFO CYETO OJVE FL PXURE.","key":"PIZTRQUDVWHSAXYLBEOJFKCGNM","given":"","by":"The King James Bible","src":"Proverbs 15:1"},
    explain: "“A soft answer turneth away wrath: but grievous words stir up anger.”\n\n— The King James Bible, Proverbs 15:1.",
    concepts: ["deduction"],
    tags: ["cipher","bible"]
  },
  {
    id: "cipher-055",
    title: "Poor Richard X",
    diff: 4,
    text: "A line of **Benjamin Franklin**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Early to bed and early to rise, makes a man healthy, wealthy and wise.","c":"TZEMW YV RTU ZAU TZEMW YV EHBT, SZDTB Z SZA LTZMYLW, NTZMYLW ZAU NHBT.","key":"ZRGUTCJLHODMSAVIXEBYPKNQWF","given":"","by":"Benjamin Franklin","src":"*Poor Richard's Almanack*"},
    explain: "“Early to bed and early to rise, makes a man healthy, wealthy and wise.”\n\n— Benjamin Franklin, *Poor Richard's Almanack*.",
    concepts: ["deduction"],
    tags: ["cipher","franklin"]
  },
  {
    id: "cipher-100",
    title: "Wonderland III",
    diff: 4,
    text: "A line of **Lewis Carroll**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Take care of the sense, and the sounds will take care of themselves.","c":"SRNY PRTY ZO SFY EYGEY, RGM SFY EZLGME IJCC SRNY PRTY ZO SFYUEYCAYE.","key":"RHPMYOQFJWNCUGZXDTESLAIKBV","given":"","by":"Lewis Carroll","src":"*Alice's Adventures in Wonderland* (1865)"},
    explain: "“Take care of the sense, and the sounds will take care of themselves.”\n\n— Lewis Carroll, *Alice's Adventures in Wonderland* (1865).",
    concepts: ["deduction"],
    tags: ["cipher","carroll"]
  },
  {
    id: "cipher-085",
    title: "Miss Austen II",
    diff: 4,
    text: "A line of **Jane Austen**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"One half of the world cannot understand the pleasures of the other.","c":"MWU PCDS MS BPU HMNDK ACWWMB RWKUNLBCWK BPU XDUCLRNUL MS BPU MBPUN.","key":"CQAKUSIPJOZDVWMXYNLBREHGFT","given":"","by":"Jane Austen","src":"*Emma* (1815)"},
    explain: "“One half of the world cannot understand the pleasures of the other.”\n\n— Jane Austen, *Emma* (1815).",
    concepts: ["deduction"],
    tags: ["cipher","austen"]
  },
  {
    id: "cipher-042",
    title: "Scripture XII",
    diff: 4,
    text: "A verse of the King James Bible, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Pride goeth before destruction, and an haughty spirit before a fall.","c":"FNYQJ MHJGC XJTHNJ QJEGNVDGYHR, LRQ LR CLVMCGK EFYNYG XJTHNJ L TLSS.","key":"LXDQJTMCYPOSZRHFWNEGVIUBKA","given":"","by":"The King James Bible","src":"Proverbs 16:18"},
    explain: "“Pride goeth before destruction, and an haughty spirit before a fall.”\n\n— The King James Bible, Proverbs 16:18.",
    concepts: ["deduction"],
    tags: ["cipher","bible"]
  },
  {
    id: "cipher-045",
    title: "Scripture XIII",
    diff: 4,
    text: "A verse of the King James Bible, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Cast thy bread upon the waters: for thou shalt find it after many days.","c":"SYZO OUB IQNYA XCMF OUN PYONQZ: DMQ OUMX ZUYHO DEFA EO YDONQ GYFB AYBZ.","key":"YISANDRUEVWHGFMCTQZOXKPJBL","given":"","by":"The King James Bible","src":"Ecclesiastes 11:1"},
    explain: "“Cast thy bread upon the waters: for thou shalt find it after many days.”\n\n— The King James Bible, Ecclesiastes 11:1.",
    concepts: ["deduction"],
    tags: ["cipher","bible"]
  },
  {
    id: "cipher-153",
    title: "Nursery I",
    diff: 4,
    text: "A nursery rhyme, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Hey diddle diddle, the cat and the fiddle, the cow jumped over the moon.","c":"SGI FRFFYG FRFFYG, ESG MUE UPF ESG JRFFYG, ESG MCO BAXDGF CNGV ESG XCCP.","key":"UWMFGJHSRBTYXPCDKVLEANOZIQ","given":"","by":"Nursery rhyme","src":"traditional"},
    explain: "“Hey diddle diddle, the cat and the fiddle, the cow jumped over the moon.”\n\n— Nursery rhyme.",
    concepts: ["deduction"],
    tags: ["cipher","rhyme"]
  },
  {
    id: "cipher-148",
    title: "Jefferson I",
    diff: 4,
    text: "A line of **Thomas Jefferson**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"We hold these truths to be self-evident, that all men are created equal.","c":"YT JPVS MJTCT MBIMJC MP HT CTVW-TANSTZM, MJKM KVV FTZ KBT EBTKMTS TLIKV.","key":"KHESTWDJNUOVFZPGLBCMIAYQXR","given":"","by":"Thomas Jefferson","src":"the Declaration of Independence (1776)"},
    explain: "“We hold these truths to be self-evident, that all men are created equal.”\n\n— Thomas Jefferson, the Declaration of Independence (1776).",
    concepts: ["deduction"],
    tags: ["cipher","jefferson"]
  },
  {
    id: "cipher-054",
    title: "Scripture XIV",
    diff: 4,
    text: "A verse of the King James Bible, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Iron sharpeneth iron; so a man sharpeneth the countenance of his friend.","c":"NUAO EDTUFCOCWD NUAO; EA T HTO EDTUFCOCWD WDC PABOWCOTOPC AG DNE GUNCOL.","key":"TJPLCGRDNIYVHOAFSUEWBQZKMX","given":"","by":"The King James Bible","src":"Proverbs 27:17"},
    explain: "“Iron sharpeneth iron; so a man sharpeneth the countenance of his friend.”\n\n— The King James Bible, Proverbs 27:17.",
    concepts: ["deduction"],
    tags: ["cipher","bible"]
  },
  {
    id: "cipher-095",
    title: "Wonderland IV",
    diff: 4,
    text: "A line of **Lewis Carroll**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"It's no use going back to yesterday, because I was a different person then.","c":"TD'U KZ JUR NZTKN OHPI DZ QRUDRGCHQ, ORPHJUR T LHU H CTVVRGRKD ERGUZK DFRK.","key":"HOPCRVNFTWIBAKZESGUDJXLYQM","given":"","by":"Lewis Carroll","src":"*Alice's Adventures in Wonderland* (1865)"},
    explain: "“It's no use going back to yesterday, because I was a different person then.”\n\n— Lewis Carroll, *Alice's Adventures in Wonderland* (1865).",
    concepts: ["deduction"],
    tags: ["cipher","carroll"]
  },
  {
    id: "cipher-112",
    title: "Twain VI",
    diff: 4,
    text: "A line of **Mark Twain**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Few things are harder to put up with than the annoyance of a good example.","c":"VIC PNBLDT EMI NEMWIM PK JYP YJ CBPN PNEL PNI ELLKZELOI KV E DKKW IQEUJRI.","key":"EAOWIVDNBXSRULKJFMTPYHCQZG","given":"","by":"Mark Twain","src":"*Pudd'nhead Wilson* (1894)"},
    explain: "“Few things are harder to put up with than the annoyance of a good example.”\n\n— Mark Twain, *Pudd'nhead Wilson* (1894).",
    concepts: ["deduction"],
    tags: ["cipher","twain"]
  },
  {
    id: "cipher-101",
    title: "Wonderland V",
    diff: 4,
    text: "A line of **Lewis Carroll**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"When I use a word, it means just what I choose it to mean, neither more nor less.","c":"VSWL J EPW C VBTN, JO UWCLP FEPO VSCO J RSBBPW JO OB UWCL, LWJOSWT UBTW LBT IWPP.","key":"CARNWMYSJFDIULBGXTPOEKVZQH","given":"","by":"Lewis Carroll","src":"*Through the Looking-Glass* (1871)"},
    explain: "“When I use a word, it means just what I choose it to mean, neither more nor less.”\n\n— Lewis Carroll, *Through the Looking-Glass* (1871).\n\nHumpty Dumpty.",
    concepts: ["deduction"],
    tags: ["cipher","carroll"]
  },
  {
    id: "cipher-009",
    title: "The Bard XXVIII",
    diff: 4,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Now is the winter of our discontent made glorious summer by this sun of York.","c":"VZX GJ WRY XGVWYM ZP ZEM OGJLZVWYVW BUOY KTZMGZEJ JEBBYM IN WRGJ JEV ZP NZMQ.","key":"UILOYPKRGFQTBVZCSMJWEHXDNA","given":"","by":"William Shakespeare","src":"*Richard III*"},
    explain: "“Now is the winter of our discontent made glorious summer by this sun of York.”\n\n— William Shakespeare, *Richard III*.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-039",
    title: "Scripture XV",
    diff: 4,
    text: "A verse of the King James Bible, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"To every thing there is a season, and a time to every purpose under the heaven.","c":"XK DZDHG XNLTB XNDHD LE U EDUEKT, UTY U XLVD XK DZDHG JSHJKED STYDH XND NDUZDT.","key":"UAWYDPBNLCIMVTKJFHEXSZQRGO","given":"","by":"The King James Bible","src":"Ecclesiastes 3:1"},
    explain: "“To every thing there is a season, and a time to every purpose under the heaven.”\n\n— The King James Bible, Ecclesiastes 3:1.",
    concepts: ["deduction"],
    tags: ["cipher","bible"]
  },
  {
    id: "cipher-031",
    title: "The Bard XXIX",
    diff: 4,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Shall I compare thee to a summer's day? Thou art more lovely and more temperate.","c":"JELFF S ADRXLIU NEUU ND L JQRRUI'J YLB? NEDQ LIN RDIU FDTUFB LWY RDIU NURXUILNU.","key":"LOAYUVCESMZFRWDXGIJNQTHKBP","given":"","by":"William Shakespeare","src":"Sonnet 18"},
    explain: "“Shall I compare thee to a summer's day? Thou art more lovely and more temperate.”\n\n— William Shakespeare, Sonnet 18.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-071",
    title: "Emerson V",
    diff: 4,
    text: "A line of **Ralph Waldo Emerson**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Here once the embattled farmers stood, and fired the shot heard round the world.","c":"UMFM KTJM YUM MGXPYYIMA WPFGMFZ ZYKKA, PTA WDFMA YUM ZUKY UMPFA FKSTA YUM OKFIA.","key":"PXJAMWNUDVQIGTKRBFZYSHOELC","given":"","by":"Ralph Waldo Emerson","src":"*Concord Hymn* (1837)"},
    explain: "“Here once the embattled farmers stood, and fired the shot heard round the world.”\n\n— Ralph Waldo Emerson, *Concord Hymn* (1837).",
    concepts: ["deduction"],
    tags: ["cipher","emerson"]
  },
  {
    id: "cipher-094",
    title: "Wonderland VI",
    diff: 4,
    text: "A line of **Lewis Carroll**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Why, sometimes I've believed as many as six impossible things before breakfast.","c":"VQK, JBWRYGWRJ G'NR LRMGRNRP CJ WCIK CJ JGD GWZBJJGLMR YQGIFJ LRXBUR LURCEXCJY.","key":"CLTPRXFQGAEMWIBZOUJYHNVDKS","given":"","by":"Lewis Carroll","src":"*Through the Looking-Glass* (1871)"},
    explain: "“Why, sometimes I've believed as many as six impossible things before breakfast.”\n\n— Lewis Carroll, *Through the Looking-Glass* (1871).\n\nThe White Queen, to Alice.",
    concepts: ["deduction"],
    tags: ["cipher","carroll"]
  },
  {
    id: "cipher-014",
    title: "The Bard XXX",
    diff: 4,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"The fault, dear Brutus, is not in our stars, but in ourselves, that we are underlings.","c":"CFG OYTIC, JGYD ZDTCTN, RN EKC RE KTD NCYDN, ZTC RE KTDNGIUGN, CFYC QG YDG TEJGDIREMN.","key":"YZSJGOMFRWXIBEKLHDNCTUQPVA","given":"","by":"William Shakespeare","src":"*Julius Caesar*"},
    explain: "“The fault, dear Brutus, is not in our stars, but in ourselves, that we are underlings.”\n\n— William Shakespeare, *Julius Caesar*.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-016",
    title: "The Bard XXXI",
    diff: 4,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"We are such stuff as dreams are made on, and our little life is rounded with a sleep.","c":"SF VXF MEOP MKEZZ VM YXFVBM VXF BVYF TU, VUY TEX RWKKRF RWZF WM XTEUYFY SWKP V MRFFJ.","key":"VCOYFZHPWQNRBUTJIXMKEDSGAL","given":"","by":"William Shakespeare","src":"*The Tempest*"},
    explain: "“We are such stuff as dreams are made on, and our little life is rounded with a sleep.”\n\n— William Shakespeare, *The Tempest*.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-046",
    title: "Scripture XVI",
    diff: 4,
    text: "A verse of the King James Bible, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Consider the lilies of the field, how they grow; they toil not, neither do they spin.","c":"UCFDNVZS LKZ WNWNZD CQ LKZ QNZWV, KCR LKZI ASCR; LKZI LCNW FCL, FZNLKZS VC LKZI DJNF.","key":"EPUVZQAKNBXWOFCJTSDLGHRYIM","given":"","by":"The King James Bible","src":"Matthew 6:28"},
    explain: "“Consider the lilies of the field, how they grow; they toil not, neither do they spin.”\n\n— The King James Bible, Matthew 6:28.",
    concepts: ["deduction"],
    tags: ["cipher","bible"]
  },
  {
    id: "cipher-084",
    title: "Miss Austen III",
    diff: 4,
    text: "A line of **Jane Austen**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"For what do we live, but to make sport for our neighbours, and laugh at them in our turn?","c":"GCJ VWIN YC VT RQET, LFN NC XIMT OKCJN GCJ CFJ ZTQPWLCFJO, IZY RIFPW IN NWTX QZ CFJ NFJZ?","key":"ILUYTGPWQDMRXZCKHJONFEVBAS","given":"","by":"Jane Austen","src":"*Pride and Prejudice* (1813)"},
    explain: "“For what do we live, but to make sport for our neighbours, and laugh at them in our turn?”\n\n— Jane Austen, *Pride and Prejudice* (1813).\n\nMr Bennet, of course.",
    concepts: ["deduction"],
    tags: ["cipher","austen"]
  },
  {
    id: "cipher-111",
    title: "Twain VII",
    diff: 4,
    text: "A line of **Mark Twain**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Let us endeavor so to live that when we come to die even the undertaker will be sorry.","c":"EHN AO HXKHIYGZ OG NG EDYH NPIN UPHX UH BGVH NG KDH HYHX NPH AXKHZNILHZ UDEE JH OGZZW.","key":"IJBKHTSPDMLEVXGQFZONAYURWC","given":"","by":"Mark Twain","src":"*Pudd'nhead Wilson* (1894)"},
    explain: "“Let us endeavor so to live that when we come to die even the undertaker will be sorry.”\n\n— Mark Twain, *Pudd'nhead Wilson* (1894).",
    concepts: ["deduction"],
    tags: ["cipher","twain"]
  },
  {
    id: "cipher-013",
    title: "The Bard XXXII",
    diff: 4,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Cowards die many times before their deaths; the valiant never taste of death but once.","c":"UKIYTLE LRS NYWV ORNSE ASQKTS OGSRT LSYOGE; OGS ZYBRYWO WSZST OYEOS KQ LSYOG ACO KWUS.","key":"YAULSQJGRHXBNWKMDTEOCZIPVF","given":"","by":"William Shakespeare","src":"*Julius Caesar*"},
    explain: "“Cowards die many times before their deaths; the valiant never taste of death but once.”\n\n— William Shakespeare, *Julius Caesar*.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-024",
    title: "The Bard XXXIII",
    diff: 4,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Life's but a walking shadow, a poor player that struts and frets his hour upon the stage.","c":"ZDQB'C WVS I EIZHDUJ CMIRPE, I LPPN LZIFBN SMIS CSNVSC IUR QNBSC MDC MPVN VLPU SMB CSIJB.","key":"IWKRBQJMDAHZXUPLONCSVGETFY","given":"","by":"William Shakespeare","src":"*Macbeth*"},
    explain: "“Life's but a walking shadow, a poor player that struts and frets his hour upon the stage.”\n\n— William Shakespeare, *Macbeth*.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-091",
    title: "Boz VI",
    diff: 4,
    text: "A line of **Charles Dickens**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"There is nothing in the world so irresistibly contagious as laughter and good-humour.","c":"SZVYV JI PKSZJPX JP SZV MKYAO IK JYYVIJISJLAH GKPSBXJKDI BI ABDXZSVY BPO XKKO-ZDQKDY.","key":"BLGOVNXZJEFAQPKWUYISDCMRHT","given":"","by":"Charles Dickens","src":"*A Christmas Carol* (1843)"},
    explain: "“There is nothing in the world so irresistibly contagious as laughter and good-humour.”\n\n— Charles Dickens, *A Christmas Carol* (1843).",
    concepts: ["deduction"],
    tags: ["cipher","dickens"]
  },
  {
    id: "cipher-135",
    title: "Bacon I",
    diff: 4,
    text: "A line of **Francis Bacon**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Some books are to be tasted, others to be swallowed, and some few to be chewed and digested.","c":"LRWY GRRDL OHY VR GY VOLVYI, RVPYHL VR GY LZOTTRZYI, OJI LRWY CYZ VR GY EPYZYI OJI IXBYLVYI.","key":"OGEIYCBPXADTWJRFKHLVNQZMUS","given":"","by":"Francis Bacon","src":"the essay *Of Studies*"},
    explain: "“Some books are to be tasted, others to be swallowed, and some few to be chewed and digested.”\n\n— Francis Bacon, the essay *Of Studies*.",
    concepts: ["deduction"],
    tags: ["cipher","bacon"]
  },
  {
    id: "cipher-099",
    title: "Wonderland VII",
    diff: 4,
    text: "A line of **Lewis Carroll**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"If everybody minded their own business, the world would go round a deal faster than it does.","c":"BD IFIKPNHRP XBARIR WGIBK HUA NEQBAIQQ, WGI UHKJR UHEJR SH KHEAR Z RIZJ DZQWIK WGZA BW RHIQ.","key":"ZNORIDSGBLTJXAHYCKQWEFUVPM","given":"","by":"Lewis Carroll","src":"*Alice's Adventures in Wonderland* (1865)"},
    explain: "“If everybody minded their own business, the world would go round a deal faster than it does.”\n\n— Lewis Carroll, *Alice's Adventures in Wonderland* (1865).\n\nThe Duchess, who is not minding her own business at all.",
    concepts: ["deduction"],
    tags: ["cipher","carroll"]
  },
  {
    id: "cipher-116",
    title: "Twain VIII",
    diff: 4,
    text: "A line of **Mark Twain**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"One of the most striking differences between a cat and a lie is that a cat has only nine lives.","c":"CUJ CH YBJ PCMY MYGVNVUF EVHHJGJUIJM LJYDJJU T ITY TUE T KVJ VM YBTY T ITY BTM CUKO UVUJ KVQJM.","key":"TLIEJHFBVXNKPUCZRGMYWQDAOS","given":"","by":"Mark Twain","src":"*Pudd'nhead Wilson* (1894)"},
    explain: "“One of the most striking differences between a cat and a lie is that a cat has only nine lives.”\n\n— Mark Twain, *Pudd'nhead Wilson* (1894).",
    concepts: ["deduction"],
    tags: ["cipher","twain"]
  },
  {
    id: "cipher-092",
    title: "Boz VII",
    diff: 4,
    text: "A line of **Charles Dickens**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Annual income twenty pounds, annual expenditure nineteen nineteen and six, result happiness.","c":"DUUNDS JUAVGC HPCUHX MVNUFE, DUUNDS CZMCUFJHNYC UJUCHCCU UJUCHCCU DUF EJZ, YCENSH QDMMJUCEE.","key":"DOAFCIKQJLBSGUVMRYEHNWPZXT","given":"","by":"Charles Dickens","src":"*David Copperfield* (1850)"},
    explain: "“Annual income twenty pounds, annual expenditure nineteen nineteen and six, result happiness.”\n\n— Charles Dickens, *David Copperfield* (1850).\n\nMr Micawber's rule of money. Nineteen pounds, nineteen shillings and sixpence is sixpence less than twenty pounds; sixpence more, he goes on, and the result is misery.",
    concepts: ["deduction"],
    tags: ["cipher","dickens"]
  },
  {
    id: "cipher-075",
    title: "Walden VI",
    diff: 4,
    text: "A line of **Henry David Thoreau**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"If a man does not keep pace with his companions, perhaps it is because he hears a different drummer.","c":"RX T STM LKJD MKY EJJH HTQJ GRYA ARD QKSHTMRKMD, HJCATHD RY RD WJQTPDJ AJ AJTCD T LRXXJCJMY LCPSSJC.","key":"TWQLJXUARVENSMKHOCDYPIGBZF","given":"","by":"Henry David Thoreau","src":"*Walden* (1854)"},
    explain: "“If a man does not keep pace with his companions, perhaps it is because he hears a different drummer.”\n\n— Henry David Thoreau, *Walden* (1854).",
    concepts: ["deduction"],
    tags: ["cipher","thoreau"]
  },
  {
    id: "cipher-109",
    title: "Wilde Card VI",
    diff: 4,
    text: "A line of **Oscar Wilde**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"I never travel without my diary. One should always have something sensational to read in the train.","c":"A MVZVF NFEZVH RANQLDN GC BAEFC. LMV KQLDHB EHRECK QEZV KLGVNQAMJ KVMKENALMEH NL FVEB AM NQV NFEAM.","key":"EWXBVUJQASIHGMLTOFKNDZRPCY","given":"","by":"Oscar Wilde","src":"*The Importance of Being Earnest* (1895)"},
    explain: "“I never travel without my diary. One should always have something sensational to read in the train.”\n\n— Oscar Wilde, *The Importance of Being Earnest* (1895).",
    concepts: ["deduction"],
    tags: ["cipher","wilde"]
  },
  {
    id: "cipher-105",
    title: "Wilde Card VII",
    diff: 4,
    text: "A line of **Oscar Wilde**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"There is only one thing in the world worse than being talked about, and that is not being talked about.","c":"DBAJA YH KRXE KRA DBYRW YR DBA NKJXV NKJHA DBQR CAYRW DQXPAV QCKGD, QRV DBQD YH RKD CAYRW DQXPAV QCKGD.","key":"QCZVAMWBYTPXORKSFJHDGINLEU","given":"","by":"Oscar Wilde","src":"*The Picture of Dorian Gray* (1890)"},
    explain: "“There is only one thing in the world worse than being talked about, and that is not being talked about.”\n\n— Oscar Wilde, *The Picture of Dorian Gray* (1890).",
    concepts: ["deduction"],
    tags: ["cipher","wilde"]
  },
  {
    id: "cipher-098",
    title: "Wonderland VIII",
    diff: 4,
    text: "A line of **Lewis Carroll**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"The time has come, the Walrus said, to talk of many things: of shoes and ships and sealing-wax, of cabbages and kings.","c":"KIX KPTX IHY EJTX, KIX GHQVZY YHPU, KJ KHQO JD THAB KIPAFY: JD YIJXY HAU YIPWY HAU YXHQPAF-GHN, JD EHRRHFXY HAU OPAFY.","key":"HREUXDFIPCOQTAJWLVYKZMGNBS","given":"","by":"Lewis Carroll","src":"*Through the Looking-Glass* (1871)"},
    explain: "“The time has come, the Walrus said, to talk of many things: of shoes and ships and sealing-wax, of cabbages and kings.”\n\n— Lewis Carroll, *Through the Looking-Glass* (1871).",
    concepts: ["deduction"],
    tags: ["cipher","carroll"]
  },
  {
    id: "cipher-082",
    title: "Miss Austen IV",
    diff: 4,
    text: "A line of **Jane Austen**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.","c":"DX DJ W XFRXN RADYKFJWGGC WTLAMQGKUIKU, XNWX W JDAIGK HWA DA BMJJKJJDMA MS W IMMU SMFXRAK, HRJX OK DA QWAX MS W QDSK.","key":"WOTUKSINDPLGHAMBZFJXRYQVCE","given":"","by":"Jane Austen","src":"*Pride and Prejudice* (1813)"},
    explain: "“It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.”\n\n— Jane Austen, *Pride and Prejudice* (1813).",
    concepts: ["deduction"],
    tags: ["cipher","austen"]
  },
  {
    id: "cipher-081",
    title: "Lincoln IV",
    diff: 4,
    text: "A line of **Abraham Lincoln**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal.","c":"EYRG WJYGI TBQ WIMIB PITGW TAY YRG ETZOIGW FGYRAOZ EYGZO YB ZONW JYBZNBIBZ, T BIS BTZNYB, JYBJINMIQ NB KNFIGZP, TBQ QIQNJTZIQ ZY ZOI XGYXYWNZNYB ZOTZ TKK CIB TGI JGITZIQ IHRTK.","key":"TFJQIEAONUDKCBYXHGWZRMSLPV","given":"","by":"Abraham Lincoln","src":"the Gettysburg Address (1863)"},
    explain: "“Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal.”\n\n— Abraham Lincoln, the Gettysburg Address (1863).\n\nA *score* is twenty: four score and seven years before 1863 is 1776.",
    concepts: ["deduction"],
    tags: ["cipher","lincoln"]
  },
  {
    id: "cipher-141",
    title: "Brontë I",
    diff: 5,
    text: "A line of **Charlotte Brontë**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Reader, I married him.","c":"OCSQCO, L PSOOLCQ BLP.","key":"SFNQCWHBLYMZPGTREOAXVJUIDK","given":"","by":"Charlotte Brontë","src":"*Jane Eyre* (1847)"},
    explain: "“Reader, I married him.”\n\n— Charlotte Brontë, *Jane Eyre* (1847).",
    concepts: ["deduction"],
    tags: ["cipher","brontë"]
  },
  {
    id: "cipher-165",
    title: "Old Saw XXVII",
    diff: 5,
    text: "An old proverb, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Look before you leap.","c":"YWWO NBAWSB LWZ YBEQ.","key":"ENMJBAFXTHOYRGWQISCKZPVDLU","given":"","by":"Proverb","src":"traditional"},
    explain: "“Look before you leap.”\n\n— A proverb.\n\nThe moral usually drawn from Aesop's fable of the fox who talks a goat into jumping down a well.",
    concepts: ["deduction"],
    tags: ["cipher","proverb"]
  },
  {
    id: "cipher-035",
    title: "The Bard XXXIV",
    diff: 5,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Exit, pursued by a bear.","c":"IQXH, WFZDFIT JA Y JIYZ.","key":"YJKTISENXUVCBGPWLZDHFOMQAR","given":"","by":"William Shakespeare","src":"*The Winter's Tale*"},
    explain: "“Exit, pursued by a bear.”\n\n— William Shakespeare, *The Winter's Tale*.\n\nNot a line anyone speaks: it is the most famous stage direction in English.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-170",
    title: "Old Saw XXVIII",
    diff: 5,
    text: "An old proverb, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Still waters run deep.","c":"OLMKK CELVIO IYZ XVVT.","key":"EFNXVDRSMQPKAZJTHIOLYUCBWG","given":"","by":"Proverb","src":"traditional"},
    explain: "“Still waters run deep.”\n\n— A proverb.",
    concepts: ["deduction"],
    tags: ["cipher","proverb"]
  },
  {
    id: "cipher-038",
    title: "Scripture XVII",
    diff: 5,
    text: "A verse of the King James Bible, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Am I my brother's keeper?","c":"VU C US PDIFXAD'O BAALAD?","key":"VPYKATWXCGBEUHILMDOFJNQZSR","given":"","by":"The King James Bible","src":"Genesis 4:9"},
    explain: "“Am I my brother's keeper?”\n\n— The King James Bible, Genesis 4:9.",
    concepts: ["deduction"],
    tags: ["cipher","bible"]
  },
  {
    id: "cipher-015",
    title: "The Bard XXXV",
    diff: 5,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Beware the ides of March.","c":"SXZHUX PWX VFXY QD BHUKW.","key":"HSKFXDEWVTJIBGQMCUYPLAZNRO","given":"","by":"William Shakespeare","src":"*Julius Caesar*"},
    explain: "“Beware the ides of March.”\n\n— William Shakespeare, *Julius Caesar*.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-047",
    title: "Scripture XVIII",
    diff: 5,
    text: "A verse of the King James Bible, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Physician, heal thyself.","c":"FSZWJBJXL, SNXU OSZWNUV.","key":"XQBTNVRSJIAUHLPFMGWODECYZK","given":"","by":"The King James Bible","src":"Luke 4:23"},
    explain: "“Physician, heal thyself.”\n\n— The King James Bible, Luke 4:23.",
    concepts: ["deduction"],
    tags: ["cipher","bible"]
  },
  {
    id: "cipher-183",
    title: "Old Saw XXIX",
    diff: 5,
    text: "An old proverb, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Hunger is the best sauce.","c":"TMCOYU ZN PTY JYNP NXMDY.","key":"XJDBYROTZWQEFCAGSUNPMKIVLH","given":"","by":"Proverb","src":"traditional"},
    explain: "“Hunger is the best sauce.”\n\n— A proverb.",
    concepts: ["deduction"],
    tags: ["cipher","proverb"]
  },
  {
    id: "cipher-070",
    title: "Emerson VI",
    diff: 5,
    text: "A line of **Ralph Waldo Emerson**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Hitch your wagon to a star.","c":"IMDYI EZQG JPWZH DZ P NDPG.","key":"PSYBLAWIMRXVKHZOTGNDQUJCEF","given":"","by":"Ralph Waldo Emerson","src":"*Civilization* (1870)"},
    explain: "“Hitch your wagon to a star.”\n\n— Ralph Waldo Emerson, *Civilization* (1870).",
    concepts: ["deduction"],
    tags: ["cipher","emerson"]
  },
  {
    id: "cipher-093",
    title: "Wonderland IX",
    diff: 5,
    text: "A line of **Lewis Carroll**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Curiouser and curiouser!","c":"UYHVSYOCH BWX UYHVSYOCH!","key":"BQUXCKJGVMFNLWSRZHOEYITPDA","given":"","by":"Lewis Carroll","src":"*Alice's Adventures in Wonderland* (1865)"},
    explain: "“Curiouser and curiouser!”\n\n— Lewis Carroll, *Alice's Adventures in Wonderland* (1865).",
    concepts: ["deduction"],
    tags: ["cipher","carroll"]
  },
  {
    id: "cipher-138",
    title: "Poe II",
    diff: 5,
    text: "A line of **Edgar Allan Poe**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Quoth the Raven, Nevermore.","c":"AITCU CUG LYJGE, EGJGLKTLG.","key":"YXRQGPVUHMWZKETOALNCIJFSBD","given":"","by":"Edgar Allan Poe","src":"*The Raven* (1845)"},
    explain: "“Quoth the Raven, Nevermore.”\n\n— Edgar Allan Poe, *The Raven* (1845).\n\nPoe loved ciphers too: writing in *Graham's Magazine* in 1841, he challenged readers to send him substitution ciphers and claimed he could break them all.",
    concepts: ["deduction"],
    tags: ["cipher","poe"]
  },
  {
    id: "cipher-180",
    title: "Old Saw XXX",
    diff: 5,
    text: "An old proverb, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Familiarity breeds contempt.","c":"IETSPSEDSUA LDWWJR KGHUWTYU.","key":"ELKJWIZQSCXPTHGYFDRUMONVAB","given":"","by":"Proverb","src":"traditional"},
    explain: "“Familiarity breeds contempt.”\n\n— A proverb.\n\nThe moral usually drawn from Aesop's fable of the fox who, meeting a lion for the third time, strolls up and chats with him.",
    concepts: ["deduction"],
    tags: ["cipher","proverb"]
  },
  {
    id: "cipher-061",
    title: "Poor Richard XI",
    diff: 5,
    text: "A line of **Benjamin Franklin**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Little strokes fell great oaks.","c":"NVCCNM WCPDGMW RMNN XPMUC DUGW.","key":"UTELMRXJVQGNIYDFAPWCOBKZHS","given":"","by":"Benjamin Franklin","src":"*Poor Richard's Almanack*"},
    explain: "“Little strokes fell great oaks.”\n\n— Benjamin Franklin, *Poor Richard's Almanack*.",
    concepts: ["deduction"],
    tags: ["cipher","franklin"]
  },
  {
    id: "cipher-032",
    title: "The Bard XXXVI",
    diff: 5,
    text: "A line of **William Shakespeare**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Who steals my purse steals trash.","c":"FMP XBKJNX RV ZSIXK XBKJNX BIJXM.","key":"JEQHKLUMWCYNRTPZGIXBSOFAVD","given":"","by":"William Shakespeare","src":"*Othello*"},
    explain: "“Who steals my purse steals trash.”\n\n— William Shakespeare, *Othello*.",
    concepts: ["deduction"],
    tags: ["cipher","shakespeare"]
  },
  {
    id: "cipher-125",
    title: "Blake II",
    diff: 5,
    text: "A line of **William Blake**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"Tyger Tyger, burning bright, in the forests of the night.","c":"GKEFO GKEFO, DAOVNVE DONEJG, NV GJF PQOFZGZ QP GJF VNEJG.","key":"YDMCFPEJNHTIWVQBXOZGALUSKR","given":"","by":"William Blake","src":"*The Tyger* (1794)"},
    explain: "“Tyger Tyger, burning bright, in the forests of the night.”\n\n— William Blake, *The Tyger* (1794).",
    concepts: ["deduction"],
    tags: ["cipher","blake"]
  },
  {
    id: "cipher-097",
    title: "Wonderland X",
    diff: 5,
    text: "A line of **Lewis Carroll**, enciphered: every letter has been swapped for another — the same one every time — and no letter stands for itself.",
    data: {"kind":"crypto","q":"'Twas brillig, and the slithy toves did gyre and gimble in the wabe.","c":"'QIPV ZUJOOJY, PSA QNM VOJQNF QGBMV AJA YFUM PSA YJEZOM JS QNM IPZM.","key":"PZLAMRYNJWDOESGCXUVQKBIHFT","given":"","by":"Lewis Carroll","src":"*Through the Looking-Glass* (1871)"},
    explain: "“'Twas brillig, and the slithy toves did gyre and gimble in the wabe.”\n\n— Lewis Carroll, *Through the Looking-Glass* (1871).\n\nFrom *Jabberwocky*. Humpty Dumpty later explains that *slithy* means lithe and slimy, and that a *tove* is something like a badger.",
    concepts: ["deduction"],
    tags: ["cipher","carroll"]
  }
]);
