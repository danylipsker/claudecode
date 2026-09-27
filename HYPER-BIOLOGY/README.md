# Hyper Biology

Life from molecules to ecosystems — the eleventh Hyper app, on the same engine as the others
(`../HYPER-CORE`). The chemistry of life and enzymes; cells, membranes and the cell cycle; respiration
and photosynthesis; DNA, genes and their control; Mendelian and chromosomal genetics; biotechnology
and genomics; evolution and the history of life; the diversity of life; plants; animal physiology;
ecology; behaviour; microbes; and how biology is done. All text, questions and simulations are
original.

Open `index.html` in a browser, or from the repository root:

```bash
node scripts/serve.js 8172
```

then open <http://localhost:8172/HYPER-BIOLOGY/>. No installation, no network.

> The pages explain how living things work. They are not laboratory protocols: work with microbes,
> DNA or animals follows the rules of a supervised laboratory, and the medical pages of Hyper
> Medicine are for learning, not diagnosis.

## What is in it

**150 concepts** in 14 branches and 27 topics, with **396 formula calculators**,
**95 simulations** (used 142 times across the pages), **751 quiz questions**,
**381 worked examples** and **257 problems**.

| Branch | Concepts | Topics |
|---|---:|---|
| The Chemistry of Life | 13 | molecules of life · enzymes and energy |
| Cells | 18 | cell structure · membranes and transport · the life of a cell |
| Energy and Metabolism | 10 | cellular respiration · photosynthesis |
| Molecular Biology | 12 | from DNA to protein · controlling genes |
| Genetics | 13 | Mendelian genetics · chromosomes and inheritance |
| Biotechnology and Genomics | 11 | working with DNA · genomics and its uses |
| Evolution | 12 | how evolution works · species and the history of life |
| The Diversity of Life | 9 | classifying life · plants and animals |
| Plant Biology | 9 | plant structure and transport · plant growth and reproduction |
| Animal Form and Function | 12 | animal systems · movement, defence and reproduction |
| Ecology | 14 | ecosystems · populations and communities · people and the biosphere |
| Animal Behaviour | 6 | behaviour |
| Microbiology | 6 | microbes |
| How Biology Is Done | 5 | methods |

## Tools

- **Sequences** (Tools → Sequences): paste DNA or RNA (FASTA is fine) for its composition, GC along
  the sequence, melting temperature, molar mass, reverse complement and mRNA; the six reading frames
  with open reading frames and the genetic code table; a restriction digest with a map, fragment
  table and virtual agarose gel; primers checked against the template (Tm, GC clamp, self- and
  cross-pairing, product size) and PCR growth. The demo sequence is made up.
- **Genetics** (Tools → Genetics): crosses of up to four genes with the Punnett square, genotype and
  phenotype ratios and a χ² test of your counts; Hardy–Weinberg from genotype counts, and carriers
  from the frequency of a recessive condition; Wright–Fisher drift with selection; linkage mapping
  (Haldane and Kosambi); a general χ² goodness-of-fit test.
- **Cells & life** (Tools → Cells & life): a clickable animal cell, plant cell and bacterium; microbial
  growth curves and plate counts; Michaelis–Menten kinetics with four kinds of inhibitor and the
  Lineweaver–Burk plot; predator–prey and competition models; Shannon and Simpson diversity and
  mark–recapture; diffusion times and Kleiber's metabolic scaling.

The models are `HYPER-CORE/js/bio.js` (`kit.bio`), tested by `HYPER-CORE/tools/test-bio.js`; the
tools are `HYPER-CORE/js/ui/biotools.js`.

## Files and checks

Same layout as the other Hyper apps: `content/outline.js`, `content/reference.js` (enzyme kinetics:
the reference page the authors followed), `sims/reference.js` (enzymes and substrate as moving
particles, and genetic drift in replicate populations), one `content/*.js` per topic group, `sims/*.js`,
and a generated `catalog.js`. Run

```bash
node HYPER-CORE/tools/test-bio.js
node HYPER-CORE/tools/validate.js HYPER-BIOLOGY --final
node HYPER-CORE/tools/simtest.js HYPER-BIOLOGY
node HYPER-CORE/tools/catalog.js --all
```
