#!/usr/bin/env node
/**
 * Derive expression profiles from .genome/ and optionally emit to .genome/expression_profiles/.
 * Validates that every role id referenced in decomposition_rules and contracts exists in role_library.
 * Run from repo root: node scripts/derive-expression-profiles.js [--emit]
 * --emit: write markdown profile files to .genome/expression_profiles/
 * GENOME_DIR: optional env override for testing (default: .genome at repo root).
 */

const fs = require('fs');
const path = require('path');

const GENOME_DIR = process.env.GENOME_DIR || path.join(__dirname, '..', '.genome');
const ROLE_LIB = path.join(GENOME_DIR, 'role_library');
const CONTRACTS_DIR = path.join(GENOME_DIR, 'contracts');

function readFile(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch (e) {
    if (process.env.DEBUG) console.error(`Read failed: ${p}`, e.code || e.message);
    return null;
  }
}

function roleIdsInRoleLibrary(content) {
  const ids = [];
  const re = /^##\s+(.+)$/gm;
  let m;
  while ((m = re.exec(content)) !== null) {
    const name = m[1].trim();
    if (name && !name.toLowerCase().startsWith('role') && !name.toLowerCase().endsWith('roles')) {
      ids.push(name);
    }
  }
  return ids;
}

function parseRoleIdsFromDecomposition(content) {
  const ids = new Set();
  const organMatch = content.match(/\*\*Organ:\*\*\s*(\w+)/);
  const tissueMatch = content.match(/\*\*Tissue:\*\*\s*(\w+)/);
  const cellMatch = content.match(/\*\*Cell:\*\*\s*(\w+)/);
  const moleculeMatch = content.match(/\*\*Molecule:\*\*\s*(\w+)/);
  if (organMatch) ids.add(organMatch[1].trim());
  if (tissueMatch) ids.add(tissueMatch[1].trim());
  if (cellMatch) ids.add(cellMatch[1].trim());
  if (moleculeMatch) ids.add(moleculeMatch[1].trim());
  if (content.includes('Build')) ids.add('Build');
  if (content.includes('Implementation')) ids.add('Implementation');
  if (content.includes('Worker')) ids.add('Worker');
  if (content.includes('read_file')) ids.add('read_file');
  return ids;
}

function parseRoleIdsFromContract(content) {
  const ids = new Set();
  const fromMatch = content.match(/\*\*From:\*\*\s*([^(]+)/g);
  const toMatch = content.match(/\*\*To:\*\*\s*([^(]+)/g);
  if (fromMatch) fromMatch.forEach(l => { const n = l.replace(/\*\*From:\*\*\s*/, '').trim().split(/\s/)[0]; if (n) ids.add(n); });
  if (toMatch) toMatch.forEach(l => { const n = l.replace(/\*\*To:\*\*\s*/, '').trim().split(/\s/)[0]; if (n) ids.add(n); });
  return ids;
}

function main() {
  const emit = process.argv.includes('--emit');

  const decompositionPath = path.join(GENOME_DIR, 'decomposition_rules.md');
  const decomposition = readFile(decompositionPath);
  if (!decomposition) {
    console.error('Missing .genome/decomposition_rules.md');
    process.exit(1);
  }

  const handoffsPath = path.join(CONTRACTS_DIR, 'handoffs.md');
  const handoffs = readFile(handoffsPath);
  if (!handoffs) {
    console.error('Missing .genome/contracts/handoffs.md');
    process.exit(1);
  }

  const organsContent = readFile(path.join(ROLE_LIB, 'organs.md'));
  const tissuesContent = readFile(path.join(ROLE_LIB, 'tissues.md'));
  const cellsContent = readFile(path.join(ROLE_LIB, 'cells.md'));
  const moleculesContent = readFile(path.join(ROLE_LIB, 'molecules.md'));

  const organIdsInLib = organsContent ? roleIdsInRoleLibrary(organsContent) : [];
  const tissueIdsInLib = tissuesContent ? roleIdsInRoleLibrary(tissuesContent) : [];
  const cellIdsInLib = cellsContent ? roleIdsInRoleLibrary(cellsContent) : [];
  const moleculeIdsInLib = moleculesContent ? roleIdsInRoleLibrary(moleculesContent) : [];

  const refsFromDecomp = parseRoleIdsFromDecomposition(decomposition);
  const refsFromContract = parseRoleIdsFromContract(handoffs);
  const allRefs = new Set([...refsFromDecomp, ...refsFromContract]);

  const missing = [];
  for (const id of allRefs) {
    if (organIdsInLib.includes(id)) continue;
    if (tissueIdsInLib.includes(id)) continue;
    if (cellIdsInLib.includes(id)) continue;
    if (moleculeIdsInLib.includes(id)) continue;
    missing.push(id);
  }

  if (missing.length > 0) {
    console.error('Validation failed: the following role ids are referenced but not found in role_library:', missing.join(', '));
    process.exit(1);
  }

  console.log('Validation passed: all referenced role ids exist in role_library.');

  if (emit) {
    const outDir = path.join(GENOME_DIR, 'expression_profiles');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const mission = readFile(path.join(GENOME_DIR, 'mission.md')) || '';
    const constraints = readFile(path.join(GENOME_DIR, 'constraints.md')) || '';

    const write = (filename, body) => fs.writeFileSync(path.join(outDir, filename), body, 'utf8');

    write('organism.md', `# Organism expression profile\n\nDerived from .genome/ per EXPRESSION_DERIVATION.md.\n\n## Active subset\n\n- mission.md (full)\n- decomposition_rules.md (full)\n- constraints.md (full)\n- role_library/ (organs, tissues, cells, molecules)\n- contracts/ (all)\n`);
    write('organ-Build.md', `# Organ: Build expression profile\n\n- Mission slice: full (v1 single organ)\n- Decomposition: organs→tissues and below\n- Role library: Build (organs), Implementation (tissues), Worker (cells), read_file (molecules)\n- Contracts: Build → Implementation\n`);
    write('tissue-Implementation.md', `# Tissue: Implementation expression profile\n\n- Mission slice: full (v1)\n- Decomposition: tissues→cells, cells→molecules\n- Role library: Implementation (tissues), Worker (cells), read_file (molecules)\n- Contracts: Build → Implementation\n`);
    write('cell-Worker.md', `# Cell: Worker expression profile\n\n- Mission slice: full (v1)\n- Role library: Worker (cells), read_file (molecules)\n- Contracts: handoffs involving Worker\n`);
    write('molecule-read_file.md', `# Molecule: read_file expression profile\n\nSingle primitive definition only — see .genome/role_library/molecules.md section ## read_file\n`);

    console.log('Emitted profile files to .genome/expression_profiles/');
  }
}

main();
