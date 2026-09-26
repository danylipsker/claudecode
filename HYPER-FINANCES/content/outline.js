/* HYPER-FINANCES · content/outline.js
 *
 * The shape of the discipline: the root, its branches and their topics.
 * Concepts live in the topic files and hang under these topics with
 * `parent: '<topic id>'`. `plan` lists the concepts each topic is meant to hold.
 *
 * Hyper Finances is money for everyone: how interest, loans and mortgages really work,
 * how to budget, save, invest and build security, the language of the stock exchange,
 * leverage and its dangers, and the economics behind prices, rates and crises. It is
 * written for the whole world: amounts are in the reader's currency (¤), and where
 * countries differ (mortgage types, pensions, taxes) the pages explain the common
 * patterns rather than one country's rules. The mathematics (exponentials, logarithms,
 * series, statistics) lives in Hyper Math and is linked as math:<id>.
 */
Hyper.add(
  {
    id: 'finance', kind: 'root', title: 'Hyper Finances',
    short: 'Money without the fear: interest, loans and mortgages, budgeting and saving, investing and the stock exchange, risk and leverage, and the economics behind it all — every idea explained, every formula a calculator, every decision something you can try before you make it.',
    links: [['Money calculators', '#/tools/money', 'calc']],
    body: 'Money frightens people mostly because it is rarely explained. The rules underneath are few and learnable: interest grows on itself, a loan is repaid on a schedule you can calculate to the cent, risk and return travel together, costs compound as surely as returns, and time is the most powerful ingredient you have. Start anywhere — the map shows what each idea rests on — and use the Money calculators to try your own numbers.\n\n> [!note] Hyper Finances is for learning. It explains how things work and lets you calculate; it does not know your situation, your country\'s rules or tomorrow\'s markets, and it is not personal financial, legal or tax advice. For decisions that matter, check the terms of the actual product and consider a qualified, independent adviser.'
  },

  /* ================================================================ MONEY AND INTEREST */
  {
    id: 'money-interest', kind: 'branch', parent: 'finance', title: 'Money and Interest', icon: 'coin', hue: 48,
    short: 'What money is, why a sum today is worth more than the same sum later, and how interest — simple and compound — makes money grow or debts balloon.',
    body: 'Every financial product, from a savings account to a mortgage to a pension, is built from one idea: money has a price in time, and that price is interest. Interest paid on interest makes growth exponential — slow at first, then startling — which is why starting early matters more than almost anything else. Inflation works the same way in reverse, quietly eating what money can buy. Master these, and present value, annuities and the internal rate of return become simple tools for comparing any choices that involve money over time.'
  },
  { id: 'money-basics', kind: 'topic', parent: 'money-interest', title: 'What money is', short: 'The jobs money does, why prices rise, and the difference between numbers and what they buy.',
    plan: [['what-is-money', 'What money is'], ['inflation-purchasing-power', 'Inflation and purchasing power'], ['real-vs-nominal', 'Real and nominal values'], ['opportunity-cost', 'Opportunity cost']] },
  { id: 'interest', kind: 'topic', parent: 'money-interest', title: 'Interest and compounding', short: 'Simple and compound interest, how often it compounds, and a quick rule for doubling.',
    plan: [['simple-interest', 'Simple interest'], ['compound-interest', 'Compound interest'], ['effective-rate', 'Compounding frequency and the effective rate'], ['rule-of-72', 'The rule of 72']] },
  { id: 'time-value', kind: 'topic', parent: 'money-interest', title: 'The time value of money', short: 'Present and future value, regular payments, and deciding between cash flows with NPV and IRR.',
    plan: [['time-value-of-money', 'The time value of money'], ['present-value', 'Present and future value'], ['annuities', 'Annuities: regular payments'], ['perpetuities', 'Perpetuities'],
           ['npv', 'Net present value'], ['irr', 'The internal rate of return']] },

  /* ================================================================ PERSONAL FINANCE */
  {
    id: 'personal-finance', kind: 'branch', parent: 'finance', title: 'Personal Finance', icon: 'wallet', hue: 12,
    short: 'Running your own money: a budget that works, a safety cushion, debt kept under control, and protection against the risks that can undo years of saving.',
    body: 'Financial security is built less by clever investing than by a few habits: knowing where the money goes, spending less than you earn, keeping a cushion for the unexpected, avoiding expensive debt and insuring against the disasters you could not absorb. None of it is complicated, and the numbers are on your side once they are written down. This branch gives the tools — budgets, net worth, debt payoff plans, credit scores, insurance — and the reasoning behind each.'
  },
  { id: 'budgeting', kind: 'topic', parent: 'personal-finance', title: 'Budgeting and cash flow', short: 'Where the money goes, the cushion for emergencies, your net worth, and the saving rate.',
    plan: [['household-budget', 'Budgeting'], ['emergency-fund', 'The emergency fund'], ['net-worth', 'Net worth and the personal balance sheet'], ['saving-rate', 'Saving rate: the lever you control'], ['financial-goals', 'Financial goals and priorities']] },
  { id: 'debt', kind: 'topic', parent: 'personal-finance', title: 'Managing debt', short: 'Useful and harmful debt, credit cards, paying debts off, credit scores and affordability.',
    plan: [['good-and-bad-debt', 'Good debt and bad debt'], ['credit-cards', 'Credit cards and minimum payments'], ['debt-payoff', 'Paying off debt: avalanche and snowball'],
           ['credit-scores', 'Credit scores and credit reports'], ['debt-to-income', 'Debt-to-income and affordability']] },
  { id: 'protection', kind: 'topic', parent: 'personal-finance', title: 'Insurance and protection', short: 'Pooling risk, insuring your income, home and car, and not falling for fraud.',
    plan: [['insurance-basics', 'Insurance: pooling risk'], ['life-disability-insurance', 'Life and disability insurance'], ['property-insurance', 'Home, car and liability insurance'], ['scams-fraud', 'Scams and financial fraud']] },

  /* ================================================================ PSYCHOLOGY */
  {
    id: 'money-mind', kind: 'branch', parent: 'finance', title: 'Money and the Mind', icon: 'brain', hue: 290,
    short: 'Why smart people make poor money decisions, where money fear comes from, and the habits that turn good intentions into results.',
    body: 'Most financial mistakes are not failures of arithmetic. We feel losses twice as sharply as gains, anchor on the first number we see, follow the crowd into bubbles and out at the bottom, treat money differently depending on which mental jar it sits in, and prefer a small reward now to a large one later. Knowing these patterns does not make them go away, but it lets you design around them — with automation, rules decided in calm moments, and a plan that makes the right choice the easy one. Understanding is also the best cure for money anxiety: the unknown is always more frightening than the known.'
  },
  { id: 'behavioral', kind: 'topic', parent: 'money-mind', title: 'Behavioural finance', short: 'Money fears, loss aversion, the common biases, mental accounting, present bias and good habits.',
    plan: [['money-anxiety', 'Money fears and financial anxiety'], ['loss-aversion', 'Loss aversion'], ['cognitive-biases', 'Biases: anchoring, overconfidence and the herd'], ['mental-accounting', 'Mental accounting'],
           ['present-bias', 'Present bias and self-control'], ['lifestyle-inflation', 'Lifestyle inflation'], ['financial-habits', 'Habits and automation']] },

  /* ================================================================ BANKING */
  {
    id: 'banking', kind: 'branch', parent: 'finance', title: 'Banks and Banking', icon: 'bank', hue: 205,
    short: 'What banks actually do with your money, how they create money when they lend, what keeps deposits safe, and the accounts, fees and payments you use every day.',
    body: 'A bank borrows short and lends long: it takes deposits you can withdraw at any moment and turns them into mortgages that run for decades, earning the difference in interest. That business creates most of the money in the economy — every new loan puts new money in someone\'s account — and it is fragile, which is why banks are regulated, deposits are insured up to a limit, and central banks stand behind the system. Knowing how it works tells you where your savings are safe, what the fees on an account really cost, and why a bank run is possible at all.'
  },
  { id: 'banks', kind: 'topic', parent: 'banking', title: 'How banks work', short: 'Deposits and loans, money creation, deposit insurance and bank runs.',
    plan: [['how-banks-work', 'How banks work'], ['money-creation', 'How banks create money'], ['deposit-insurance', 'Deposit insurance and bank safety'], ['bank-runs', 'Bank runs and liquidity']] },
  { id: 'accounts', kind: 'topic', parent: 'banking', title: 'Accounts and payments', short: 'Current and savings accounts, term deposits, fees, payment methods and changing currency.',
    plan: [['bank-accounts', 'Current and savings accounts'], ['term-deposits', 'Term deposits and certificates of deposit'], ['bank-fees', 'Bank fees and the cost of convenience'],
           ['payments', 'Payments: cards, transfers and digital money'], ['currency-exchange', 'Currency exchange for individuals']] },

  /* ================================================================ LOANS */
  {
    id: 'loans-credit', kind: 'branch', parent: 'finance', title: 'Loans and Credit', icon: 'loan', hue: 356,
    short: 'How a loan is repaid, month by month; the true cost behind the headline rate; and how to compare, repay early, refinance and avoid the expensive kinds of credit.',
    body: 'A loan is a contract to exchange money now for more money later, on a schedule. The schedule — amortization — decides how much of each payment is interest and how much repays the debt, and it explains why the early years of a long loan pay mostly interest. The headline rate is only part of the price: fees, insurance and the repayment method change the true cost, which is why the APR exists. With the tools here you can read any loan offer, compare two of them honestly, and see exactly what paying a little extra, or refinancing, is worth.'
  },
  { id: 'loan-basics', kind: 'topic', parent: 'loans-credit', title: 'Borrowing', short: 'How loans work and are repaid, their true cost, comparing offers, repaying early and refinancing.',
    plan: [['how-loans-work', 'How a loan works'], ['amortization', 'Amortization: level payments'], ['equal-principal', 'Equal-capital repayment'], ['apr', 'APR: the true cost of a loan'],
           ['loan-comparison', 'Comparing loan offers'], ['early-repayment', 'Early repayment and prepayment penalties'], ['refinancing', 'Refinancing'],
           ['balloon-interest-only', 'Interest-only and balloon loans'], ['car-finance', 'Car loans and leasing'], ['high-cost-credit', 'Payday loans, buy-now-pay-later and other costly credit']] },

  /* ================================================================ MORTGAGES */
  {
    id: 'mortgages-property', kind: 'branch', parent: 'finance', title: 'Mortgages and Property', icon: 'house', hue: 30,
    short: 'The biggest loan most people ever take: how mortgages work, fixed, variable and inflation-linked rates, mixing tracks, what you can afford — and whether to rent or buy.',
    body: 'A home is usually bought mostly with borrowed money, repaid over twenty to thirty years, so small differences in the rate or the structure add up to the price of a car or more. Mortgages come in a few basic kinds — fixed for the whole term or for a period, variable and linked to a benchmark or the central bank\'s rate, linked to inflation — and many countries let you combine them in tracks to balance cost against risk. This branch explains each kind, shows how lenders decide how much you may borrow, counts the costs beyond the rate, and treats property as an investment with its own yields and leverage.'
  },
  { id: 'mortgages', kind: 'topic', parent: 'mortgages-property', title: 'Mortgages', short: 'How mortgages work, the deposit, fixed, variable and inflation-linked rates, tracks, affordability and costs.',
    plan: [['mortgage-basics', 'How a mortgage works'], ['down-payment-ltv', 'Down payment and loan-to-value'], ['fixed-rate-mortgages', 'Fixed-rate mortgages'], ['variable-rate-mortgages', 'Variable and adjustable-rate mortgages'],
           ['index-linked-mortgages', 'Inflation-linked mortgages'], ['mortgage-mix', 'Mixing mortgage tracks'], ['mortgage-affordability', 'How much mortgage can you afford?'], ['mortgage-costs', 'Closing costs, fees and mortgage insurance']] },
  { id: 'real-estate', kind: 'topic', parent: 'mortgages-property', title: 'Property', short: 'Renting against buying, rental yields, leverage in property and property funds.',
    plan: [['rent-vs-buy', 'Rent or buy?'], ['rental-yield', 'Rental yield and cap rate'], ['property-leverage', 'Leverage in property'], ['reits', 'REITs and property funds']] },

  /* ================================================================ INVESTING */
  {
    id: 'investing', kind: 'branch', parent: 'finance', title: 'Investing Fundamentals', icon: 'trend', hue: 150,
    short: 'Why investing beats saving over the long run, how risk and return travel together, diversification, costs, and the funds that make it simple.',
    body: 'Saving keeps money; investing puts it to work in businesses, loans and property, and asks you to accept ups and downs in return for growth that beats inflation. The rules that matter are few: expect higher returns only with higher risk, spread your money so no single failure can sink you, keep costs low because they compound as surely as returns, match investments to when you will need the money, and invest steadily rather than trying to time the market. Index funds and ETFs make all of this possible for anyone with a small monthly amount.'
  },
  { id: 'investing-basics', kind: 'topic', parent: 'investing', title: 'The basics', short: 'Why invest, risk and return, asset classes, diversification, horizon, regular investing and compound returns.',
    plan: [['why-invest', 'Why invest'], ['risk-and-return', 'Risk and return'], ['asset-classes', 'Asset classes'], ['diversification', 'Diversification'],
           ['time-horizon', 'Time horizon and liquidity'], ['dollar-cost-averaging', 'Investing regularly (cost averaging)'], ['compounding-returns', 'Compound returns and the CAGR']] },
  { id: 'funds', kind: 'topic', parent: 'investing', title: 'Funds and costs', short: 'Mutual funds and ETFs, index investing, fees, active against passive, and rebalancing.',
    plan: [['mutual-funds-etfs', 'Mutual funds and ETFs'], ['index-investing', 'Index funds and passive investing'], ['investment-fees', 'Fees: the silent drain'], ['active-vs-passive', 'Active or passive?'], ['rebalancing', 'Rebalancing']] },

  /* ================================================================ STOCK MARKET */
  {
    id: 'stock-market', kind: 'branch', parent: 'finance', title: 'The Stock Market', icon: 'candles', hue: 262,
    short: 'Shares and the exchanges where they trade, the vocabulary of the market, the kinds of order, indices, bulls and bears — and how to judge what a share is worth.',
    body: 'A share is a small piece of a company: a claim on its future profits and a vote in how it is run. Exchanges bring buyers and sellers together, and prices move all day as their views change. The market has its own language — bid and ask, market capitalisation, limit orders, indices, short selling, P/E — which sounds forbidding until each word is explained. This branch explains them, then turns to valuation: reading a company\'s accounts, earnings and dividends, and the discounted cash-flow thinking that underlies every serious estimate of what a business is worth.'
  },
  { id: 'stock-exchange', kind: 'topic', parent: 'stock-market', title: 'The exchange and its language', short: 'Shares, exchanges and IPOs, the vocabulary, spreads and liquidity, orders, indices, cycles, short selling and brokers.',
    plan: [['stocks-shares', 'Shares: owning a company'], ['stock-exchanges', 'Stock exchanges and IPOs'], ['stock-terminology', 'Stock market terminology'], ['bid-ask-liquidity', 'Bid, ask, spread and liquidity'],
           ['order-types', 'Order types'], ['market-indices', 'Market indices'], ['bull-bear-markets', 'Bull and bear markets'], ['short-selling', 'Short selling'], ['brokers', 'Brokers, custody and trading costs']] },
  { id: 'stock-valuation', kind: 'topic', parent: 'stock-market', title: 'What a share is worth', short: 'Financial statements, earnings, multiples, dividends, dividend discount and DCF models, and market efficiency.',
    plan: [['financial-statements', 'Reading financial statements'], ['earnings-eps', 'Earnings and EPS'], ['pe-ratio', 'The P/E ratio and other multiples'], ['dividends', 'Dividends and dividend yield'],
           ['dividend-discount-model', 'The dividend discount model'], ['dcf-valuation', 'Discounted cash-flow valuation'], ['market-efficiency', 'Efficient markets and technical analysis']] },

  /* ================================================================ BONDS */
  {
    id: 'fixed-income', kind: 'branch', parent: 'finance', title: 'Bonds and Fixed Income', icon: 'certificate', hue: 188,
    short: 'Lending to governments and companies: how bonds pay, why their prices fall when rates rise, yields, duration, credit risk and the yield curve.',
    body: 'A bond is a loan you make, packaged so it can be bought and sold: it pays a fixed coupon and returns its face value at maturity. Because the payments are fixed, the bond\'s price must move when market interest rates move — down when rates rise, up when they fall — and duration tells you by how much. Add the risk that the borrower cannot pay, the extra yield that risk demands, and the pattern of yields across maturities, and you can read the bond market, which quietly sets the price of mortgages and the value of pensions everywhere.'
  },
  { id: 'bonds', kind: 'topic', parent: 'fixed-income', title: 'Bonds', short: 'What bonds are, pricing, yield to maturity, duration, credit risk, the yield curve, inflation-linked bonds and money markets.',
    plan: [['bond-basics', 'What a bond is'], ['bond-pricing', 'Bond prices and interest rates'], ['yield-to-maturity', 'Yield to maturity'], ['duration', 'Duration and interest-rate risk'],
           ['credit-risk', 'Credit risk and ratings'], ['yield-curve', 'The yield curve'], ['inflation-linked-bonds', 'Inflation-linked bonds'], ['money-market', 'Money-market funds and treasury bills']] },

  /* ================================================================ LEVERAGE AND DERIVATIVES */
  {
    id: 'leverage-derivatives', kind: 'branch', parent: 'finance', title: 'Leverage, Margin and Derivatives', icon: 'lever', hue: 326,
    short: 'Borrowing to invest, buying on margin and the margin call, leveraged funds, futures and options — how they multiply gains, and how they multiply losses.',
    body: 'Leverage means investing with borrowed money, so that a small move in the price becomes a large move in what you own. It works in both directions: at two-to-one a 10 % gain becomes 20 %, and a 50 % fall wipes you out. Margin accounts, leveraged ETFs, CFDs and futures are all ways of getting leverage, each with its own traps — margin calls that force you to sell at the bottom, the volatility drag that erodes a leveraged fund, and retail products where most customers lose. Options, in contrast, can limit risk as well as multiply it. This branch explains the mechanics, with the numbers.'
  },
  { id: 'leverage', kind: 'topic', parent: 'leverage-derivatives', title: 'Leverage and margin', short: 'Leverage, margin accounts and margin calls, leveraged ETFs, CFDs and forex.',
    plan: [['leverage-basics', 'Leverage'], ['margin-trading', 'Buying on margin'], ['margin-calls', 'Margin calls and liquidation'], ['leveraged-etfs', 'Leveraged ETFs and volatility drag'], ['cfds-forex', 'CFDs, forex and retail leverage']] },
  { id: 'derivatives', kind: 'topic', parent: 'leverage-derivatives', title: 'Derivatives', short: 'Futures and forwards, options and their strategies, option prices, and hedging.',
    plan: [['futures-forwards', 'Futures and forwards'], ['options-basics', 'Options: calls and puts'], ['option-strategies', 'Option strategies and payoffs'], ['option-pricing', 'What an option is worth'], ['hedging', 'Hedging']] },

  /* ================================================================ PORTFOLIO */
  {
    id: 'portfolio-risk', kind: 'branch', parent: 'finance', title: 'Portfolio and Risk', icon: 'pie', hue: 228,
    short: 'Measuring return and risk, why correlation is the key to diversification, the efficient frontier, risk-adjusted returns, allocation and the risks of time itself.',
    body: 'An investor\'s real decision is not which share to buy but how to divide money among assets. Modern portfolio theory gives that decision numbers: expected return, volatility, and correlation — the ingredient that makes a mixture less risky than any of its parts. From there come the efficient frontier, the Sharpe ratio, beta and the CAPM, and practical allocation rules. The last pages turn to the risks averages hide: deep drawdowns that take years to recover, and the sequence-of-returns risk that can ruin a retirement plan with a good average.'
  },
  { id: 'portfolio-theory', kind: 'topic', parent: 'portfolio-risk', title: 'Building a portfolio', short: 'Expected return, volatility, correlation, the frontier, Sharpe, beta, allocation, drawdowns and sequence risk.',
    plan: [['expected-return', 'Expected return'], ['volatility', 'Volatility and standard deviation'], ['correlation', 'Correlation'], ['efficient-frontier', 'The efficient frontier'],
           ['sharpe-ratio', 'Risk-adjusted return: the Sharpe ratio'], ['capm-beta', 'Beta and the CAPM'], ['asset-allocation', 'Asset allocation'], ['drawdowns', 'Drawdowns and recovery'], ['sequence-risk', 'Sequence-of-returns risk']] },

  /* ================================================================ WEALTH */
  {
    id: 'wealth-retirement', kind: 'branch', parent: 'finance', title: 'Wealth and Retirement', icon: 'seedling', hue: 108,
    short: 'How wealth is really built, financial independence and the 4 % rule, planning for retirement, pensions, turning savings into income, taxes and passing wealth on.',
    body: 'Wealth is mostly the patient result of three things: the share of income you keep, the return you earn on it, and the years you give it. Financial independence is the point where your investments can pay your costs; retirement planning asks how to get there and how to spend the pot without outliving it. Pensions and tax-advantaged accounts, the choice between an annuity and drawing down, the drag of taxes, and planning for uncertainty with thousands of simulated futures complete the picture — for a goal that decades of steady effort make realistic for most people.'
  },
  { id: 'wealth-building', kind: 'topic', parent: 'wealth-retirement', title: 'Building and using wealth', short: 'Wealth strategies, independence, retirement, pensions, income in retirement, taxes, estates and Monte Carlo planning.',
    plan: [['wealth-strategies', 'How wealth is built'], ['financial-independence', 'Financial independence and the 4 % rule'], ['retirement-planning', 'Retirement planning'], ['pensions', 'Pensions and retirement accounts'],
           ['retirement-income', 'Retirement income: annuities and drawdown'], ['taxes-investing', 'Taxes and investing'], ['estate-planning', 'Passing wealth on'], ['monte-carlo-planning', 'Planning under uncertainty: Monte Carlo']] },

  /* ================================================================ MICROECONOMICS */
  {
    id: 'microeconomics', kind: 'branch', parent: 'finance', title: 'Microeconomics', icon: 'supply', hue: 78,
    short: 'How prices form: supply and demand, elasticity, surplus, price controls, thinking at the margin, costs and profit, competition, externalities, strategy and trade.',
    body: 'Microeconomics studies choices — of households, firms and markets — when resources are limited. Its central picture, supply meeting demand, explains why prices rise and fall, why rent controls cause shortages and why a tax on one side of a market is partly paid by the other. Add costs, revenue and competition and you see how firms decide what to produce and at what price; add externalities and game theory and you see where markets fail and why cooperation is hard. These are the tools behind every business plan and every price you pay.'
  },
  { id: 'markets', kind: 'topic', parent: 'microeconomics', title: 'Markets and prices', short: 'Supply and demand, equilibrium, elasticity, surplus, price controls and marginal thinking.',
    plan: [['supply-demand', 'Supply and demand'], ['market-equilibrium', 'Market equilibrium'], ['elasticity', 'Elasticity'], ['consumer-producer-surplus', 'Consumer and producer surplus'],
           ['price-controls', 'Price ceilings and floors'], ['marginal-thinking', 'Thinking at the margin']] },
  { id: 'firms-competition', kind: 'topic', parent: 'microeconomics', title: 'Firms and competition', short: 'Costs and profit, break-even, market structures, externalities, game theory and comparative advantage.',
    plan: [['costs-and-profit', 'Costs, revenue and profit'], ['break-even', 'Break-even analysis'], ['market-structures', 'Competition, monopoly and oligopoly'], ['externalities', 'Externalities and public goods'],
           ['game-theory', 'Game theory and strategy'], ['comparative-advantage', 'Trade and comparative advantage']] },

  /* ================================================================ MACROECONOMICS */
  {
    id: 'macroeconomics', kind: 'branch', parent: 'finance', title: 'Macroeconomics', icon: 'globe', hue: 170,
    short: 'The economy as a whole: GDP, inflation and unemployment, the business cycle, central banks and interest rates, government budgets, exchange rates and trade, bubbles and crises.',
    body: 'Macroeconomics explains the forces that move every personal finance decision: why interest rates rise and fall, why prices climb faster in some years, why jobs appear and disappear with the business cycle, and why currencies strengthen or weaken. Central banks set short-term rates to steer inflation; governments tax, spend and borrow; trade and capital flow across borders. And from time to time credit and optimism feed each other into a bubble that bursts into a crisis. Knowing the machinery lets you read the news — and your mortgage rate — with understanding instead of fear.'
  },
  { id: 'macro-measures', kind: 'topic', parent: 'macroeconomics', title: 'Measuring the economy', short: 'GDP, inflation and the price index, unemployment and the business cycle.',
    plan: [['gdp', 'GDP: the size of an economy'], ['inflation-cpi', 'Inflation and the price index'], ['unemployment', 'Unemployment'], ['business-cycle', 'The business cycle']] },
  { id: 'money-policy', kind: 'topic', parent: 'macroeconomics', title: 'Money, rates and governments', short: 'Central banks, monetary policy, quantitative easing, fiscal policy, exchange rates and trade.',
    plan: [['central-banks', 'Central banks'], ['monetary-policy', 'Interest rates and monetary policy'], ['quantitative-easing', 'Quantitative easing'], ['fiscal-policy', 'Fiscal policy, deficits and debt'],
           ['exchange-rates', 'Exchange rates'], ['trade-balance', 'Trade and the balance of payments']] },
  { id: 'crises', kind: 'topic', parent: 'macroeconomics', title: 'Booms and busts', short: 'Bubbles, financial crises, recessions and hyperinflation.',
    plan: [['bubbles', 'Bubbles'], ['financial-crises', 'Financial crises'], ['recessions', 'Recessions and recoveries'], ['hyperinflation', 'Hyperinflation']] }
);
