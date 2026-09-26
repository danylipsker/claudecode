/* HYPER-FINANCES · content/banks.js — how banks work: deposits and loans on a balance
 * sheet, how lending creates money, deposit insurance, and bank runs and liquidity. */
Hyper.add(

{
  id: 'how-banks-work', parent: 'banks', title: 'How banks work', level: 1,
  short: 'A bank takes deposits that can be withdrawn at any moment and lends them out for years, earning the gap between the interest it charges and the interest it pays. The business is useful, profitable and fragile, which is why banks are so closely regulated.',
  keywords: ['bank', 'commercial bank', 'deposits', 'loans', 'balance sheet', 'net interest margin', 'maturity transformation', 'bank capital', 'leverage', 'Basel III', 'liquidity', 'reserves', 'return on equity', 'capital ratio'],
  prereq: ['what-is-money', 'simple-interest', 'how-loans-work'],
  related: ['money-creation', 'deposit-insurance', 'bank-runs', 'central-banks', 'bank-accounts', 'credit-risk', 'leverage-basics', 'monetary-policy', 'credit-scores'],
  body: `
When you deposit ¤1,000, the bank does not put your notes in a box with your name on it. It records that it owes you ¤1,000, payable whenever you ask, and it uses its funds to make loans: a mortgage to a family, a credit line to a bakery, repaid over many years. That is the heart of banking: **borrowing short and lending long**, which economists call *maturity transformation*. It gives savers instant access and borrowers long, stable loans at the same time, something the two could hardly arrange with each other directly.

### The balance sheet
Like any business, a bank lists what it owns (its **assets**) and what it owes (its **liabilities**); the difference is its **capital**, the owners' stake. Here is a simple bank with ¤1 billion of assets:

| Owns (assets) | ¤ million | Owes (liabilities) and capital | ¤ million |
|---|---:|---|---:|
| Cash and central-bank reserves | 50 | Customers' deposits | 800 |
| Government and other bonds | 200 | Borrowing from other lenders | 120 |
| Loans to households and firms | 750 | Capital (shareholders' equity) | 80 |
| **Total** | **1,000** | **Total** | **1,000** |

Two things surprise people. Your deposit is the bank's *liability*, a debt it owes you, while your mortgage is its *asset*. And the capital is thin: 8 % of assets. The bank runs on borrowed money, twelve and a half times its own capital ([[leverage-basics]]).

### How a bank earns
Suppose its loans earn 6 %, its bonds 3 % and its reserves 2 %, while it pays 1.5 % on deposits and 3.5 % on other borrowing. Interest received is $45 + 6 + 1 = ¤52$ million; interest paid is $12 + 4.2 = ¤16.2$ million. The **net interest income** of ¤35.8 million is about 3.6 % of its assets, its *net interest margin*. Take away running costs of ¤20 million (staff, branches, systems) and ¤4 million of loans that go bad, and ¤11.8 million of profit remains before tax. That is a return on assets of only 1.18 %, but a **return on equity of 14.75 %**, because each ¤1 of capital supports ¤12.50 of assets:

$$\\mathrm{ROE} = \\mathrm{ROA} \\times \\frac{A}{E} = 1.18\\,\\% \\times 12.5 = 14.75\\,\\%$$

Fees on accounts, cards and transfers add to the income ([[bank-fees]]).

### Why banks are fragile
- **Leverage.** A loss of 8 % of assets wipes out the capital. Loans that go bad ([[credit-risk]]) eat into capital first.
- **Liquidity.** Deposits can leave in a day; loans cannot be sold quickly without a loss. If too many depositors ask at once, even a sound bank can fail: a [[bank-runs|bank run]].
- **Interest rates.** Long fixed-rate loans and bonds lose value when rates rise, while the bank may have to pay more on deposits to keep them.

### The safety net
- **Capital rules.** International standards set by the Basel Committee on Banking Supervision ("Basel III", agreed after the 2008 crisis) require at least 4.5 % of *risk-weighted* assets in common equity plus a 2.5 % buffer, more for the largest banks, and a leverage ratio of at least 3 % of total exposures. Risk weights count a well-secured mortgage for less than an unsecured business loan.
- **Liquidity rules**: enough high-quality liquid assets to survive thirty days of heavy withdrawals.
- **Supervision and stress tests**: regulators check how each bank would cope with a deep recession.
- **[[deposit-insurance|Deposit insurance]]** protects ordinary depositors up to a limit.
- **The central bank** lends to sound banks in a panic ([[central-banks]]).
- **Resolution rules** let authorities wind down a failing bank, making shareholders and some creditors bear losses before taxpayers do.

### What it means for you
Your deposit is, in effect, a loan to your bank: very safe up to the insured limit, less so above it. The interest a bank pays you is set by competition and by the central bank's rate, not by fairness, so staying with a bank that pays little costs real money ([[bank-accounts]]). And knowing how the lending side thinks, about your income, your existing debts and any collateral, helps you borrow on better terms ([[credit-scores]]).
`,
  ideas: [
    'Banks borrow short (deposits) and lend long (loans): maturity transformation.',
    'Your deposit is the bank\'s liability; your loan is its asset; the difference is its capital.',
    'A bank earns the gap between the rates it charges and pays; thin margins become healthy returns on equity through leverage.',
    'Leverage and illiquidity make banks fragile, hence capital rules, liquidity rules, deposit insurance and a lender of last resort.'
  ],
  pitfalls: [
    'The bank keeps my money in its vault — It keeps only a small share as cash and reserves; the rest is lent or invested. Your deposit is a claim on the bank.',
    'A profitable bank cannot fail — Profit does not protect against a sudden loss of deposits or a large loss on loans, because capital is only a few per cent of assets.',
    'Bank capital is money set aside in a safe — Capital is the owners\' stake: the part of the assets funded by shareholders rather than borrowed, which absorbs losses first.'
  ],
  formulas: [
    {
      name: 'Net interest income',
      expr: 'NII = L*rL - D*rD', tex: '\\mathrm{NII} = L\\,r_L - D\\,r_D',
      vars: {
        NII: { name: 'net interest income (a year)', q: 'money', unit: '$M', tex: '\\mathrm{NII}', signed: true },
        L: { name: 'loans', q: 'money', unit: '$M', value: 750 },
        rL: { name: 'average rate on loans', q: 'ratio', unit: '%', value: 6, min: 0, max: 20, tex: 'r_L' },
        D: { name: 'deposits', q: 'money', unit: '$M', value: 800 },
        rD: { name: 'average rate paid on deposits', q: 'ratio', unit: '%', value: 1.5, min: 0, max: 15, tex: 'r_D' }
      },
      note: 'A simplified bank with only loans and deposits; a real one adds interest on bonds and reserves and pays interest on other borrowing.',
      practice: { unknowns: ['NII', 'rD'] },
      stories: {
        NII: 'A bank has {L} of loans at {rL} and {D} of deposits costing {rD}. What is its net interest income for a year?',
        rD: 'A bank with {L} of loans at {rL} and {D} of deposits wants net interest income of {NII}. What is the most it can pay on deposits?'
      }
    },
    {
      name: 'Return on equity through leverage',
      expr: 'ROE = ROA*A/E', tex: '\\mathrm{ROE} = \\mathrm{ROA}\\,\\frac{A}{E}',
      vars: {
        ROE: { name: 'return on equity', q: 'ratio', unit: '%', tex: '\\mathrm{ROE}', signed: true },
        ROA: { name: 'return on assets', q: 'ratio', unit: '%', tex: '\\mathrm{ROA}', value: 1.18, signed: true },
        A: { name: 'total assets', q: 'money', unit: '$M', value: 1000 },
        E: { name: 'capital (equity)', q: 'money', unit: '$M', value: 80 }
      },
      note: 'Leverage multiplies returns in both directions: a loss of 1 % of assets is a loss of 12.5 % of equity when capital is 8 % of assets.',
      practice: { unknowns: ['ROE', 'E'] },
      stories: {
        ROE: 'A bank earns {ROA} on assets of {A}, with capital of {E}. What is its return on equity?',
        E: 'A bank with assets of {A} earns {ROA} on them and reports a return on equity of {ROE}. How much capital does it have?'
      }
    },
    {
      name: 'Capital ratio',
      expr: 'K = E/RWA', tex: 'K = \\frac{E}{\\mathrm{RWA}}',
      vars: {
        K: { name: 'capital ratio', q: 'ratio', unit: '%' },
        E: { name: 'common equity capital', q: 'money', unit: '$M', value: 80 },
        RWA: { name: 'risk-weighted assets', q: 'money', unit: '$M', tex: '\\mathrm{RWA}', value: 600 }
      },
      note: 'Risk-weighted assets count each asset by its riskiness, so they are usually well below total assets. Basel III asks for at least 7 % of common equity (4.5 % plus a 2.5 % buffer), more for the largest banks.',
      practice: { unknowns: ['K', 'E'] },
      stories: {
        K: 'A bank has {E} of common equity and {RWA} of risk-weighted assets. What is its capital ratio?',
        E: 'A bank with {RWA} of risk-weighted assets must hold a capital ratio of {K}. How much equity does it need?'
      }
    }
  ],
  examples: [
    {
      title: 'A bank\'s year in numbers',
      q: 'The bank in the table earns 6 % on loans, 3 % on bonds and 2 % on reserves, pays 1.5 % on deposits and 3.5 % on other borrowing, has ¤20 million of running costs and loses ¤4 million on bad loans. Find its profit before tax, its return on assets and its return on equity.',
      steps: [
        'Interest received: $750 \\times 0.06 + 200 \\times 0.03 + 50 \\times 0.02 = 45 + 6 + 1 = ¤52$ million.',
        'Interest paid: $800 \\times 0.015 + 120 \\times 0.035 = 12 + 4.2 = ¤16.2$ million. Net interest income ¤35.8 million.',
        'Profit before tax: $35.8 - 20 - 4 = ¤11.8$ million.',
        'Return on assets $11.8/1{,}000 = 1.18\\,\\%$; return on equity $11.8/80 = 14.75\\,\\%$.'
      ],
      a: '¤11.8 million: 1.18 % on assets, 14.75 % on equity.'
    },
    {
      title: 'How much loss can the capital take?',
      q: 'In a recession, 10 % of the bank\'s ¤750 million of loans default and only half of those is recovered. What happens to its capital?',
      steps: [
        'Loans defaulting: ¤75 million; loss after recovering half: ¤37.5 million.',
        'Capital falls from ¤80 million to ¤42.5 million, and assets from ¤1,000 million to ¤962.5 million.',
        'Capital is now $42.5/962.5 = 4.4\\,\\%$ of assets instead of 8 %. The bank is still solvent, but below what regulators require, so it must raise new capital or shrink its lending. Many banks doing the same at once is a *credit crunch*.'
      ],
      a: 'Capital falls to ¤42.5 million, 4.4 % of assets: solvent, but it must rebuild capital, often by lending less.'
    }
  ],
  quiz: [
    { q: 'On the bank\'s balance sheet, the ¤5,000 in your current account is…', choices: ['an asset of the bank', 'a liability of the bank', 'part of the bank\'s capital', 'cash held in a vault in your name'], a: 1,
      why: 'The bank owes you the money on demand, so it is a liability. Your loan from the bank, by contrast, is its asset.' },
    { q: 'A bank earns 1 % on its assets and its capital is 5 % of its assets. What is its return on equity, in per cent?', answer: 20,
      why: 'ROE = ROA × A/E = 1 % × 20 = 20 %. The same leverage would turn a 1 % loss on assets into a 20 % loss of equity.' },
    { q: 'Banks keep most of their customers\' deposits as cash in their vaults.', a: false,
      why: 'Only a small share is held as cash and central-bank reserves; most funds loans and bonds.' },
    { q: 'Why can a sound, profitable bank still get into trouble?', choices: ['Deposits can be withdrawn at once, while loans take years to repay', 'Interest rates are fixed by law', 'Its capital is too large', 'Deposit insurance forbids it to pay out'], a: 0,
      why: 'Maturity transformation is the service banks provide and also their weak point: they are never liquid enough to repay everyone at once.' },
    { q: 'Other things equal, which change makes a bank safer?', choices: ['More capital relative to its assets', 'Longer fixed-rate loans funded by instant-access deposits', 'Less cash and more loans', 'Paying out all its profits as dividends'], a: 0,
      why: 'More capital means more losses can be absorbed before depositors and other creditors are at risk.' }
  ],
  applications: ['Reading the headline figures in a bank\'s annual report.', 'Understanding why savings rates lag behind loan rates.', 'Seeing why banks lend less after heavy losses.', 'Choosing where to keep your savings.'],
  history: 'Deposit banking grew from money-changers and goldsmiths who held coin for customers and lent part of it out. Modern capital rules began with the Basel Committee on Banking Supervision, set up by central banks in 1974: Basel I (1988), Basel II (2004) and, after the 2008 crisis, Basel III (from 2010).',
  sim: 'mb-money-creation'
},

{
  id: 'money-creation', parent: 'banks', title: 'How banks create money', level: 2,
  short: 'Most money today is not notes and coins but bank deposits, and most deposits were created by banks when they made loans. Repaying loans destroys money. The textbook money multiplier is a good exercise in geometric series but a poor description of what limits lending.',
  keywords: ['money creation', 'money multiplier', 'fractional reserve banking', 'reserves', 'broad money', 'base money', 'loans create deposits', 'central bank reserves', 'reserve requirement', 'endogenous money', 'deposit creation', 'money supply'],
  prereq: ['how-banks-work', 'what-is-money', 'math:geometric-series'],
  related: ['central-banks', 'monetary-policy', 'quantitative-easing', 'inflation-cpi', 'bank-runs', 'financial-crises', 'hyperinflation', 'bubbles'],
  body: `
Where does money come from? The natural guess is the government's printing press. But look at how you actually pay: by card, by transfer, with a phone. All of these move **bank deposits**, and bank deposits are most of the money in a modern economy. In 2014 the Bank of England estimated that about 97 % of the broad money in the UK was bank deposits, and only about 3 % notes and coins. And most of those deposits were created by ordinary commercial banks, each time they made a loan.

### Loans create deposits
When a bank grants Ana a ¤10,000 loan, it does not take ¤10,000 out of other customers' accounts. It adds two entries to its balance sheet: a new asset (Ana's promise to repay) and a new liability (¤10,000 in Ana's account). Nobody else's balance goes down, and the money in the economy has grown by ¤10,000.

When Ana spends it, the deposit moves to the seller's bank. The money moves; it is not destroyed. Behind the scenes, Ana's bank must transfer the same amount of **central-bank reserves** (the money banks hold at the central bank) to the seller's bank. When Ana repays the loan, both entries disappear together, and the money ceases to exist.

The Bank of England set this out plainly in a 2014 article, *Money creation in the modern economy*, and it is how central banks describe the system today. The simulation below lets you press the buttons yourself.

> [!key] Lending creates money; repayment destroys it. Most of the money you use is a bank's promise to pay.

### What stops banks creating unlimited money?
- **Borrowers and profit.** A bank lends only when it expects to be repaid with interest, and only to people who want to borrow.
- **Capital requirements.** Every loan must be backed by a slice of the bank's own capital ([[how-banks-work]]).
- **Reserves and the price of money.** A bank that lends much faster than its competitors keeps losing reserves to them as its borrowers spend, and must borrow reserves back, at a rate set by the central bank.
- **The central bank's interest rate** ([[monetary-policy]]) shapes what loans cost, and so how much people want to borrow.
- **Repayments** destroy money continually, so the money supply grows only when new lending outpaces repayment.

### The textbook multiplier
Many textbooks tell a different story. New reserves $B$ arrive at a bank, which keeps a fraction $r_r$ and lends out the rest; the loan is deposited at another bank, which keeps $r_r$ and lends the rest; and so on. The deposits form a [[math:geometric-series|geometric series]]:

$$D = B\\,(1 + q + q^{2} + \\dots) = \\frac{B}{1 - q} = \\frac{B}{r_r}, \\qquad q = 1 - r_r$$

With a 10 % reserve ratio, ¤1,000 of new reserves supports ¤10,000 of deposits: a multiplier of 10. After ten rounds of lending the deposits have reached ¤6,513. If the public also keeps cash equal to a share $c$ of its deposits, the multiplier falls to $(1 + c)/(r_r + c)$, which is 4 when $c = 20\\,\\%$.

The arithmetic is right, but in modern systems the causation mostly runs the other way. Central banks set an interest rate and supply the reserves banks need at that rate, and many have no binding reserve requirement at all: the US Federal Reserve cut its requirement to zero in March 2020, the UK has none for this purpose, and the euro area's has been 1 % since 2012. When central banks created enormous amounts of reserves through [[quantitative-easing]] after 2008, broad money did not rise anywhere near tenfold. The multiplier is at best a ceiling that rarely binds, not the engine of lending.

### Why it matters to you
- **Credit booms create money quickly**, and in a bust, when loans are repaid or written off and new lending stops, money can shrink. That is part of why [[financial-crises]] are so damaging.
- **Inflation** depends on how fast spending grows, and bank lending feeds spending ([[inflation-cpi]]).
- **Your deposit is a claim on a private bank**, not a note from the central bank, which is why [[deposit-insurance]] matters.
`,
  ideas: [
    'Most money is bank deposits, not notes and coins.',
    'When a bank lends, it creates a new deposit: money is created. When a loan is repaid, money is destroyed.',
    'Lending is limited by creditworthy borrowers, capital rules and the central bank\'s interest rate, far more than by reserves.',
    'The textbook multiplier 1/r is a geometric series: an upper bound, not a description of how banks decide to lend.'
  ],
  pitfalls: [
    'Banks lend out the money that savers deposit — In the aggregate it is the other way round: loans create deposits. A bank does not need a saver to walk in before it can lend.',
    'The central bank controls the amount of money through the multiplier — It mainly sets the price of reserves (the interest rate); the amount of money follows from how much people and firms borrow.',
    'Money created by banks is not real money — Bank deposits are what almost everyone uses to pay; that is exactly what makes them money.'
  ],
  formulas: [
    {
      name: 'The money multiplier, with cash',
      expr: 'M = B*(1 + c)/(rr + c)', tex: 'M = B\\,\\frac{1 + c}{r_r + c}',
      vars: {
        M: { name: 'most broad money the reserves can support', q: 'money', unit: '$' },
        B: { name: 'new base money (reserves and cash)', q: 'money', unit: '$', value: 1000 },
        c: { name: 'cash the public keeps, as a share of deposits', q: 'ratio', unit: '%', value: 20, min: 0, max: 50 },
        rr: { name: 'reserve ratio', q: 'ratio', unit: '%', value: 10, min: 0.5, max: 50, tex: 'r_r' }
      },
      note: 'The textbook upper limit. With no cash holdings ($c = 0$) it is simply $B/r_r$. Real lending rarely approaches it, because other limits bind first.',
      practice: { unknowns: ['M', 'rr'] },
      stories: {
        M: 'Banks keep {rr} of deposits as reserves and the public holds cash worth {c} of its deposits. What is the most broad money that {B} of new base money can support?',
        rr: 'With the public holding cash worth {c} of deposits, {B} of base money supports at most {M}. What reserve ratio is that?'
      }
    },
    {
      name: 'Deposits after n rounds of lending',
      expr: 'D = B*(1 - (1 - rr)^n)/rr', tex: 'D = B\\,\\frac{1 - (1 - r_r)^{n}}{r_r}',
      vars: {
        D: { name: 'total deposits after n rounds', q: 'money', unit: '$' },
        B: { name: 'first deposit of new reserves', q: 'money', unit: '$', value: 1000 },
        rr: { name: 'reserve ratio', q: 'ratio', unit: '%', value: 10, min: 0.5, max: 50, tex: 'r_r' },
        n: { name: 'rounds of lending and re-depositing', int: true, value: 10 }
      },
      note: 'The partial sum of the geometric series; as $n$ grows it approaches $B/r_r$.',
      practice: { unknowns: ['D'] },
      stories: { D: 'A deposit of {B} of new reserves goes round the banking system {n} times, with {rr} kept as reserves each time. How much have deposits grown by?' }
    }
  ],
  examples: [
    {
      title: 'A loan, a payment and a repayment',
      q: 'Two banks each hold ¤27,000 of deposits and ¤3,000 of reserves. Bank A lends Ana ¤10,000; Ana pays Ben, who banks at B; later Ben pays Ana ¤10,000 for her work and she repays the loan. Follow the money.',
      steps: [
        'The loan: A\'s assets gain a ¤10,000 loan, its liabilities a ¤10,000 deposit for Ana. Deposits in the two banks rise from ¤54,000 to ¤64,000: money has been created.',
        'Ana pays Ben: her deposit at A becomes his deposit at B, so the total is still ¤64,000. A must send B ¤10,000 of reserves; it has only ¤3,000, so it borrows ¤7,000 of reserves from the central bank.',
        'Ben pays Ana: the deposit and the reserves travel back, and A repays its central-bank borrowing.',
        'Ana repays: her ¤10,000 deposit and the ¤10,000 loan cancel out. Deposits are back to ¤54,000: the money has been destroyed.'
      ],
      a: 'Money rose by ¤10,000 when the loan was made, moved between banks when it was spent, and vanished when the loan was repaid.'
    },
    {
      title: 'The textbook multiplier',
      q: 'With a 10 % reserve ratio, ¤1,000 of new reserves is lent and re-deposited round after round. How large are the deposits after ten rounds and in the limit? What if the public holds cash equal to 20 % of its deposits?',
      steps: [
        'After ten rounds: $1{,}000 \\times (1 - 0.9^{10})/0.1 = 1{,}000 \\times 6.513 = ¤6{,}513$.',
        'In the limit: $1{,}000/0.1 = ¤10{,}000$, a multiplier of 10.',
        'With cash: $(1 + 0.2)/(0.1 + 0.2) = 4$, so broad money reaches at most ¤4,000.'
      ],
      a: '¤6,513 after ten rounds and ¤10,000 in the limit; with cash holdings, at most ¤4,000.'
    }
  ],
  quiz: [
    { q: 'A bank makes a ¤20,000 loan to a customer. The total amount of money in the economy…', choices: ['is unchanged: the bank lent other customers\' deposits', 'rises by ¤20,000: a new deposit has been created', 'falls by ¤20,000', 'rises only if the central bank prints notes'], a: 1,
      why: 'The loan and the new deposit appear together on the bank\'s balance sheet; nobody else\'s balance went down.' },
    { q: 'When the customer repays the loan, the money…', choices: ['returns to the bank\'s vault', 'is destroyed', 'becomes the bank\'s profit', 'is sent to the central bank'], a: 1,
      why: 'The repayment cancels the deposit against the loan. Only the interest paid becomes the bank\'s income.' },
    { q: 'With a 10 % reserve requirement, a bank that receives ¤1,000 of new reserves can itself immediately lend ¤10,000.', a: false,
      why: 'Even in the textbook story one bank lends only its excess reserves, ¤900, and ¤10,000 is reached across the whole system after many rounds. In practice lending is limited mainly by capital, borrowers and the price of reserves.' },
    { q: 'With a reserve ratio of 5 % and no cash holdings, what is the textbook multiplier?', answer: 20,
      why: '$1/r_r = 1/0.05 = 20$.' },
    { q: 'Which most limits how much a modern bank lends?', choices: ['The notes in its vault', 'Creditworthy borrowers, capital rules and the central bank\'s interest rate', 'The central bank\'s gold', 'Nothing at all'], a: 1,
      why: 'Reserves are supplied by the central bank at its chosen rate; what binds is profitable demand for loans and the capital each loan requires.' }
  ],
  applications: ['Understanding news about credit growth and the money supply.', 'Seeing why lending booms and busts move the whole economy.', 'Reading central banks\' explanations of their policy.', 'Knowing what a bank deposit really is.'],
  history: 'Economists argued for more than a century over whether banks lend out existing savings or create new money. The multiplier became a textbook staple in the 20th century; in 2014 the Bank of England\'s article "Money creation in the modern economy" described lending as creating deposits, the view most central banks now state.',
  sim: ['mb-money-creation', { id: 'mb-money-creation', params: { mode: 'multiplier' }, title: 'The textbook money multiplier' }]
},

{
  id: 'deposit-insurance', parent: 'banks', title: 'Deposit insurance and bank safety', level: 1,
  short: 'Most countries guarantee bank deposits up to a limit per person per bank, paid from a fund the banks finance. Knowing the limit, what it covers and what it does not is the simplest way to make sure your savings are safe.',
  keywords: ['deposit insurance', 'deposit guarantee', 'deposit protection', 'insured limit', 'FDIC', 'FSCS', 'bank failure', 'bail-in', 'uninsured deposits', 'safe savings', 'deposit guarantee scheme', 'temporary high balance'],
  prereq: ['how-banks-work', 'bank-accounts'],
  related: ['bank-runs', 'central-banks', 'financial-crises', 'term-deposits', 'money-market', 'brokers', 'scams-fraud'],
  body: `
If your bank failed tomorrow, would you lose your savings? In most countries, for most people, the answer is no, because of **deposit insurance**. A public or industry-run scheme guarantees deposits up to a limit per depositor, per bank. If a bank fails, the scheme pays depositors or moves their accounts to a healthy bank, usually within days. Since the United States introduced nationwide deposit insurance in 1934, the idea has spread to more than a hundred countries.

### Why it exists
Before deposit insurance, a rumour could empty a perfectly sound bank ([[bank-runs]]), because every depositor knew that those at the back of the queue might get nothing. In the early 1930s around 9,000 US banks failed. The Federal Deposit Insurance Corporation, created in 1933, began insuring deposits in 1934, and bank failures fell dramatically. With insured deposits, ordinary savers no longer have a reason to rush.

### How much is covered
Limits differ between countries and change over time. Some examples, approximately as they stood in the mid-2020s; always check your own country's scheme for the current limit and rules:

| Where | Limit per depositor, per bank |
|---|---|
| United States | USD 250,000 per ownership category |
| European Union | EUR 100,000 |
| United Kingdom | GBP 85,000 (a rise was proposed in 2025) |
| Canada | CAD 100,000 per eligible category |
| Australia | AUD 250,000 |
| Japan | JPY 10 million |
| India | INR 500,000 |
| Switzerland | CHF 100,000 |

Some countries have no formal scheme and rely on the expectation that the government would step in, which is weaker than a legal guarantee.

### The details that matter
- **Per depositor, per bank, not per account.** Your savings account and your current account at the same bank are added together. Several brands may share one banking licence and then count as a single bank.
- **Joint accounts** usually count as a share for each holder.
- **What is covered:** current accounts, savings accounts and term deposits at a licensed bank. **What is not:** shares, bonds and funds (a separate investor-compensation scheme may protect you if a broker fails or loses your assets, but never against market falls), most crypto-assets, and often money held with payment or e-money firms, which may be *safeguarded* instead: kept apart from the firm's own money but not insured.
- **Temporary high balances.** Some schemes protect larger sums for a few months after events such as a house sale or an inheritance: in the UK up to GBP 1 million for six months, while EU countries protect such balances for 3 to 12 months with national limits.
- **Speed.** EU rules require payment within seven working days (since 2024); in the US, insured depositors usually have access the next business day.
- **Who pays.** Schemes are funded by levies on banks, and governments normally stand behind them.

### Above the limit
Uninsured deposits can lose money when a bank fails. In Cyprus in 2013, large uninsured depositors at the two biggest banks lost a large part of their balances; at one, 47.5 % of uninsured deposits was converted into the bank's shares. Modern resolution rules deliberately put uninsured deposits and bondholders at risk (*bail-in*) before taxpayers. In March 2023 Silicon Valley Bank in California, where around nine-tenths of deposits were above the insured limit, faced withdrawal requests of about USD 42 billion in one day and was closed; the authorities then chose to protect all its depositors, an exceptional decision that nobody can count on in advance.

With a large sum you can spread it across banks with separate licences so that each part stays under the limit, check for temporary protection, or look at short-term government bills and [[money-market|money-market funds]], which carry different, generally small, risks.

### What insurance does not do
It does not protect you from inflation, from an investment falling, or from a payment you were tricked into making yourself ([[scams-fraud]]). And it has a cost for the system: depositors who are fully protected stop watching how risky their bank is, which is why insurance comes with regulation.
`,
  ideas: [
    'Deposits are insured up to a limit per depositor, per bank (not per account).',
    'Insurance removes the reason for ordinary depositors to run, which protects banks as well as savers.',
    'Shares, funds, bonds and most crypto-assets are not deposits and are not covered by deposit insurance.',
    'Sums above the limit can lose money in a failure; spreading them across separately licensed banks keeps them covered.'
  ],
  pitfalls: [
    'Two accounts at the same bank are each insured up to the limit — The limit is usually per depositor per bank, so balances at one bank are added together.',
    'My investment account at a bank is covered by deposit insurance — Investments are not deposits. Investor-compensation schemes may help if a firm fails or loses your assets, never against market losses.',
    'Big depositors are always rescued in the end — Sometimes they are, as in 2023; often they are not, as in Cyprus in 2013. Rules are designed to put uninsured money at risk.'
  ],
  formulas: [
    {
      name: 'Banks needed to keep a sum fully insured',
      expr: 'n = D/L', tex: 'n = \\frac{D}{L}',
      vars: {
        n: { name: 'separately licensed banks needed (round up)' },
        D: { name: 'sum to deposit', q: 'money', unit: '$', value: 300000 },
        L: { name: 'insured limit per bank', q: 'money', unit: '$', value: 100000 }
      },
      note: 'Round up to a whole number of banks. Check that the banks really hold separate licences, and whether your scheme offers temporary protection for large one-off sums.',
      practice: false,
      stories: { n: 'You receive {D} from selling a house. With an insured limit of {L} per bank, across how many banks would you spread it to keep it all insured?' }
    },
    {
      name: 'What an uninsured depositor could lose',
      expr: 'X = (D - L)*(1 - q)', tex: 'X = (D - L)\\,(1 - q)',
      vars: {
        X: { name: 'loss if the bank fails', q: 'money', unit: '$' },
        D: { name: 'deposit at the bank', q: 'money', unit: '$', value: 250000 },
        L: { name: 'insured limit', q: 'money', unit: '$', value: 100000 },
        q: { name: 'share of the uninsured part eventually recovered', q: 'ratio', unit: '%', value: 60, min: 0, max: 100 }
      },
      note: 'The uninsured part is repaid only from what the failed bank\'s assets fetch, often over months or years; recoveries vary widely from one failure to another.',
      practice: { unknowns: ['X'] },
      stories: { X: 'You hold {D} at a bank that fails. The insured limit is {L}, and {q} of uninsured claims is eventually recovered. How much do you lose?' }
    }
  ],
  examples: [
    {
      title: 'The money from a house sale',
      q: 'You sell a flat and receive ¤300,000. The insured limit is ¤100,000 per depositor per bank. How can you keep it all protected?',
      steps: [
        '$n = 300{,}000/100{,}000 = 3$ separately licensed banks, with ¤100,000 in each.',
        'Check that the banks do not share a licence under different brand names.',
        'Check whether your scheme protects temporary high balances after a property sale; if so, a single account may be covered for a few months.'
      ],
      a: 'Spread it across at least three separately licensed banks, or rely on temporary high-balance protection where it exists.'
    },
    {
      title: 'Above the limit',
      q: 'A business keeps ¤250,000 at one bank, which fails. The limit is ¤100,000 and uninsured claims eventually recover 60 %. What is the loss?',
      steps: [
        'Insured and paid quickly: ¤100,000.',
        'Uninsured: $250{,}000 - 100{,}000 = ¤150{,}000$, of which 60 % comes back, slowly.',
        'Loss: $150{,}000 \\times (1 - 0.6) = ¤60{,}000$, and the recovered part may take a long time to arrive.'
      ],
      a: '¤60,000 lost, and ¤90,000 tied up until the bank\'s assets are sold.'
    }
  ],
  quiz: [
    { q: 'You have ¤70,000 in a savings account and ¤50,000 in a current account at the same bank, and the limit is ¤100,000 per depositor per bank. How much is insured?', choices: ['¤120,000', '¤100,000', '¤70,000', '¤50,000'], a: 1,
      why: 'Balances at the same bank are added together (¤120,000) and covered up to the ¤100,000 limit.' },
    { q: 'Which of these is normally protected by deposit insurance?', choices: ['Shares held through a broker', 'A fixed-term deposit at a licensed bank', 'A crypto-asset held on an exchange', 'A bond fund'], a: 1,
      why: 'Only deposits at licensed banks are covered. Investments may have other protections, never against market losses.' },
    { q: 'Deposit insurance means that large depositors never lose money when a bank fails.', a: false,
      why: 'Only the amount up to the limit is guaranteed. Above it, depositors are creditors of the failed bank and can lose part of their money, as in Cyprus in 2013.' },
    { q: 'Why does deposit insurance make bank runs less likely?', choices: ['It forbids withdrawals during a crisis', 'Insured depositors are paid whatever happens, so they have no reason to rush', 'It makes banks keep all deposits as cash', 'It guarantees banks\' profits'], a: 1,
      why: 'A run is driven by the fear of being last in the queue. Insurance removes that fear for insured depositors, so most of them stay calm.' },
    { q: '¤450,000 must stay fully insured with a limit of ¤100,000 per bank. What is the smallest number of separately licensed banks you need?', answer: 5,
      why: '450,000 ÷ 100,000 = 4.5, rounded up to 5.' }
  ],
  applications: ['Checking whether your savings are fully protected.', 'Handling a large sum from a house sale, an inheritance or a business.', 'Telling deposits apart from investments that only look similar.', 'Judging how worrying news about a bank really is for you.'],
  history: 'The United States created the Federal Deposit Insurance Corporation in 1933, after thousands of bank failures; its cover began in 1934. The European Union set a common minimum in 1994 and raised it to EUR 100,000 by 2010, after the 2008 crisis. The International Association of Deposit Insurers was founded in 2002.',
  sim: { id: 'mb-bank-run', params: { ins: true }, title: 'A bank run, with deposit insurance switched on' }
},

{
  id: 'bank-runs', parent: 'banks', title: 'Bank runs and liquidity', level: 2,
  short: 'A bank run happens when many depositors try to withdraw at once. Because banks lend most deposits for years, even a sound bank can be forced to fail, and the mere fear of a run can cause one. Deposit insurance and central banks exist to break that loop.',
  keywords: ['bank run', 'liquidity', 'solvency', 'Diamond-Dybvig', 'lender of last resort', 'Bagehot', 'fire sale', 'Northern Rock', 'Silicon Valley Bank', 'panic', 'self-fulfilling', 'contagion', 'interest-rate risk', 'digital bank run'],
  prereq: ['how-banks-work', 'deposit-insurance', 'bond-pricing'],
  related: ['central-banks', 'financial-crises', 'duration', 'money-creation', 'game-theory', 'bubbles', 'monetary-policy', 'leverage-basics'],
  body: `
In September 2007 long queues formed outside the branches of Northern Rock, a large British mortgage lender, as savers tried to take out their money: the first run on a British bank in well over a century. In March 2023 customers of Silicon Valley Bank in California tried to withdraw about USD 42 billion in a single day, mostly from their phones and computers, and the bank was closed the next morning. Runs are as old as banking, and the mechanism has hardly changed.

### Liquid and solvent are different things
- A bank is **solvent** when its assets are worth more than its debts: it has positive capital.
- It is **liquid** when it can pay whatever is asked of it today.

Because a bank lends most of its deposits out for years, even a very solvent bank is never liquid enough to repay all its depositors at once. That is fine as long as only a few ask on any one day, which in normal times is what happens.

### A run feeds on itself
If you fear that others will withdraw, the sensible thing is to withdraw first: if the bank runs out of cash, those at the front of the queue are paid in full and those at the back wait, or lose. Douglas Diamond and Philip Dybvig showed in 1983 that a bank with perfectly good loans has two possible outcomes, calm or a run, and which one happens depends only on what depositors expect of each other. It is a coordination problem of the kind studied in [[game-theory]]. They shared the 2022 Nobel memorial prize in economics with Ben Bernanke, who studied the bank failures of the 1930s.

A run also turns a liquidity problem into a solvency problem. To raise cash quickly the bank must sell assets at fire-sale prices, and those losses eat its capital.

### How much can a bank pay out before it fails?
Take a bank with deposits $D$, cash $C$, and bonds $S$ that it can sell quickly only at a discount $h$. Without outside help, it can pay out a share

$$w^{*} = \\frac{C + (1 - h)\\,S}{D}$$

of its deposits. With ¤90 million of deposits, ¤8 million of cash and ¤30 million of bonds selling at a 15 % discount: $(8 + 25.5)/90 = 37\\,\\%$. If more than about a third of the money wants out, the bank cannot pay without help. Its loans, the largest part of its assets, cannot be turned into cash in days at any sensible price.

### Rising rates and the runs of 2023
When market interest rates rise, the prices of existing bonds fall ([[bond-pricing]]); [[duration]] measures by how much, approximately:

$$\\Delta P \\approx -D_{m}\\,\\Delta y\\,P$$

Bonds with a modified duration of 6 lose about 18 % when yields rise by 3 percentage points. A bank holding ¤100 million of them, with ¤8 million of capital, has lost more than twice its capital if it is forced to sell. Silicon Valley Bank had invested much of a flood of deposits in long-dated bonds while rates were low; when rates rose sharply in 2022 their value fell, and when the bank announced a loss on selling some of them to raise cash, its depositors (mostly businesses far above the insured limit, many of them talking to each other) ran.

### Stopping runs
- **Deposit insurance** removes the reason for insured depositors to run ([[deposit-insurance]]).
- **A lender of last resort.** In 1873 Walter Bagehot set out the classic rule for a central bank in a panic: lend freely, to solvent banks, against good collateral, at a high rate. A solvent bank can then turn its loans into cash and pay everyone who asks ([[central-banks]]).
- **Liquidity rules** require banks to hold enough liquid assets for thirty days of heavy withdrawals and to fund long loans with stable money.
- **Capital** absorbs fire-sale losses.
- **Resolution**: authorities can take over a failing bank over a weekend and move its deposits to a healthy one.

None of these can save a bank that is truly insolvent; they buy time and calm for one that is not.

### Faster runs
With banking apps, withdrawals take seconds and news spreads through social media. The runs of 2023 were far faster than those of the past, and regulators have been reviewing liquidity rules with that speed in mind.

### What it means for you
Keep savings within the insured limit at each bank. If your deposits are insured, a rumour about your bank is no reason to join a queue; queuing out of fear is exactly how runs happen. For sums above the limit, spread them or consider very short-term government debt ([[money-market]]).
`,
  ideas: [
    'Solvent (assets exceed debts) and liquid (able to pay today) are different; no bank is liquid enough to repay everyone at once.',
    'A run can be self-fulfilling: fearing that others will run makes it rational to run first.',
    'Fire sales during a run turn a liquidity problem into losses of capital.',
    'Deposit insurance and a lender of last resort stop runs on sound banks; neither can save an insolvent one.'
  ],
  pitfalls: [
    'Only badly run banks suffer runs — A run can topple a sound bank if enough depositors expect others to run. Weakness makes runs more likely, but is not required.',
    'If a bank has enough assets, it can always pay its depositors — Assets must be turned into cash in time; loans cannot be sold quickly without heavy losses.',
    'Central-bank lending in a panic is a bail-out — Lending to solvent banks against good collateral at a penalty rate is repaid; the classic rule is to lend freely, but not to insolvent banks.'
  ],
  formulas: [
    {
      name: 'How much a bank can pay out quickly',
      expr: 'w = (C + (1 - h)*S)/D', tex: 'w^{*} = \\frac{C + (1 - h)\\,S}{D}',
      vars: {
        w: { name: 'share of deposits it can pay without help', q: 'ratio', unit: '%', tex: 'w^{*}' },
        C: { name: 'cash and central-bank reserves', q: 'money', unit: '$M', value: 8 },
        h: { name: 'discount when selling bonds in a hurry', q: 'ratio', unit: '%', value: 15, min: 0, max: 60 },
        S: { name: 'bonds it can sell', q: 'money', unit: '$M', value: 30 },
        D: { name: 'deposits', q: 'money', unit: '$M', value: 90 }
      },
      note: 'Loans are left out because they cannot be sold quickly. A central bank lending against the loans raises this share; so does holding more cash, at the cost of lower profits.',
      practice: { unknowns: ['w', 'C'] },
      stories: {
        w: 'A bank has {D} of deposits, {C} of cash and {S} of bonds that sell at a {h} discount in a hurry. What share of its deposits can it pay out without help?',
        C: 'A bank with {D} of deposits and {S} of bonds (sold at a {h} discount) wants to be able to pay out {w} of its deposits. How much cash must it hold?'
      }
    },
    {
      name: 'Loss on bonds when interest rates rise',
      expr: 'dP = -Dm*dy*P', tex: '\\Delta P \\approx -D_{m}\\,\\Delta y\\,P',
      vars: {
        dP: { name: 'change in the bonds\' value', q: 'money', unit: '$M', tex: '\\Delta P', signed: true },
        Dm: { name: 'modified duration (years)', tex: 'D_{m}', value: 6 },
        dy: { name: 'rise in yields', q: 'ratio', unit: '%', tex: '\\Delta y', value: 3, signed: true },
        P: { name: 'value of the bonds', q: 'money', unit: '$M', value: 100 }
      },
      note: 'A first-order approximation, good for small changes; for large ones the true loss is a little smaller because of convexity. Compare the loss with the bank\'s capital.',
      practice: { unknowns: ['dP'] },
      stories: { dP: 'A bank holds {P} of bonds with a modified duration of {Dm} years. Yields rise by {dy}. Roughly how much value do the bonds lose?' }
    }
  ],
  examples: [
    {
      title: 'Where the bank runs out, and what a central bank changes',
      q: 'A bank has ¤90 million of deposits, ¤8 million of cash, ¤30 million of bonds that sell at a 15 % discount in a hurry, and ¤60 million of loans. What share of deposits can it pay out? What if the central bank will lend 90 % of the loans\' value?',
      steps: [
        'Alone: $w^{*} = (8 + 0.85 \\times 30)/90 = 33.5/90 = 37\\,\\%$.',
        'With the central bank: it can also borrow $0.9 \\times 60 = ¤54$ million, so $w^{*} = (8 + 25.5 + 54)/90 = 97\\,\\%$.',
        'Knowing that the bank can pay almost everyone, depositors have far less reason to run in the first place.'
      ],
      a: '37 % on its own; about 97 % with a lender of last resort.'
    },
    {
      title: 'When rates jump',
      q: 'A bank holds ¤100 million of bonds with a modified duration of 6 and has ¤8 million of capital. Yields rise 3 percentage points. What happens if it must sell the bonds?',
      steps: [
        '$\\Delta P \\approx -6 \\times 0.03 \\times 100 = -¤18$ million.',
        'Selling turns this into a realised loss of ¤18 million, more than twice the ¤8 million of capital.',
        'Held to maturity, the bonds would still pay in full; the danger comes from being forced to sell, which is exactly what a run does.'
      ],
      a: 'A loss of about ¤18 million: the bank would be insolvent if forced to sell.'
    }
  ],
  quiz: [
    { q: 'A solvent bank can fail in a run because…', choices: ['its loans are worth less than its deposits', 'its loans cannot be turned into cash as fast as depositors can withdraw', 'deposit insurance forbids it to pay', 'its capital is too large'], a: 1,
      why: 'Solvency is about value; a run is about timing. Fire sales to meet the timing can then destroy the value.' },
    { q: 'In the Diamond–Dybvig model, a run can happen even when nothing is wrong with the bank\'s loans.', a: true,
      why: 'If depositors expect others to run, it pays each of them to run first, and the expectation fulfils itself.' },
    { q: 'A bank has ¤200 million of deposits, ¤20 million of cash and ¤50 million of bonds it can sell at a 20 % discount. What share of its deposits can it pay out without help, in per cent?', answer: 30,
      why: '(20 + 0.8 × 50) ÷ 200 = 60 ÷ 200 = 30 %.' },
    { q: 'Bagehot\'s rule for a central bank in a panic is to lend…', choices: ['to any bank, cheaply, without collateral', 'freely to solvent banks, against good collateral, at a high rate', 'only to banks that are already insolvent', 'nothing, so that banks learn discipline'], a: 1,
      why: 'Lending freely stops the panic; good collateral and solvency protect the central bank; a high rate discourages banks that do not really need it.' },
    { q: 'Which depositor has the strongest reason to join a run?', choices: ['A household with ¤20,000 in an insured account', 'A company with ¤5 million in one bank, far above the insured limit', 'A borrower with a mortgage from the bank', 'A shareholder of a different bank'], a: 1,
      why: 'Only uninsured money is at risk if the bank fails, so large uninsured depositors gain most from getting out first; that is why they led the runs of 2023.' }
  ],
  applications: ['Reading news about troubled banks without panicking.', 'Deciding where to keep money above the insured limit.', 'Understanding why central banks lend in a crisis.', 'Seeing why rising interest rates can put pressure on banks.'],
  history: 'Bank runs recur through the history of banking, from 19th-century panics to the waves of the early 1930s. Walter Bagehot described the lender of last resort in "Lombard Street" (1873); Diamond and Dybvig modelled runs in 1983. Northern Rock (2007) and Silicon Valley Bank (2023) are recent examples, the second showing how much faster a run can be with online banking.',
  sim: 'mb-bank-run'
}

);
