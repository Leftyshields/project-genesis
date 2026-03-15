# lib — Runtime support

Shared modules for organism loader, genome validation, and decomposition engine (story 6, 7 and downstream).

## loadGenome(options?)

Loads the genome from disk, validates minimum completeness, and returns an object of raw file contents (strings). Use this when you need a validated genome in memory (e.g. decomposition engine, defense organ).

- **Options:** `{ genomeDir?: string }` — optional. If omitted, uses `process.env.GENOME_DIR` or `.genome` under the current working directory.
- **Returns:** `{ mission, constraints, decomposition_rules, role_library: { organs, tissues, cells, molecules }, contracts: { handoffs } }` (all string values).
- **Throws:** If required files are missing or validation fails (referenced role ids not found in role_library). Message lists missing files and/or missing role ids.

Example:

```js
const { loadGenome } = require('./lib/loadGenome');
const genome = loadGenome();
// or: loadGenome({ genomeDir: '/path/to/.genome' });
```

## decompose(genome)

Decomposition engine (story 7): takes a **loaded genome** (the object returned by `loadGenome()`) and returns an organ/tissue/cell/molecule **instance graph**. No execution; output is data only. Downstream (signaling, execution, defense) use the graph to walk the hierarchy.

- **Argument:** `genome` — object returned by `loadGenome()`. Must have `decomposition_rules` (string). Engine does not read from disk.
- **Returns:** `{ root }` where `root` is the organism node. Each node has:
  - `id` — stable id (e.g. `organism`, `organ:Build`, `tissue:Implementation`, `cell:Worker`, `molecule:read_file`)
  - `layer` — `organism` | `organ` | `tissue` | `cell` | `molecule`
  - `roleId` — role id from the role library (string), or `null` for organism
  - `children` — array of child nodes (empty for molecule)
- **Throws:** If `genome` is missing, `genome.decomposition_rules` is missing/empty, or the "Example chain" in decomposition_rules cannot be parsed (expected **Organ:**, **Tissue:**, **Cell:**, **Molecule:**).

Molecule nodes carry `roleId` only (e.g. `read_file`); no implementation path. Story 9 resolves the implementation when executing.

Example:

```js
const { loadGenome } = require('./lib/loadGenome');
const { decompose } = require('./lib/decompose');
const genome = loadGenome();
const { root } = decompose(genome);
// root.id === 'organism', root.children[0].roleId === 'Build'
// root.children[0].children[0].roleId === 'Implementation'
// ... down to molecule with roleId 'read_file', children: []
```

## validateGenome(genomeDir?)

Validation-only: checks that required genome files exist and every role id referenced in `decomposition_rules.md` and contracts exists in the corresponding `role_library` file. Used by the loader and by `scripts/derive-expression-profiles.js`.

- **Argument:** Optional `genomeDir`. If omitted, uses `process.env.GENOME_DIR` or `path.join(process.cwd(), '.genome')`.
- **Returns:** `{ valid: boolean, errors: string[] }`.

Required files under the genome directory:

- `mission.md`, `constraints.md`, `decomposition_rules.md`
- `role_library/organs.md`, `role_library/tissues.md`, `role_library/cells.md`, `role_library/molecules.md`
- `contracts/handoffs.md`

## GENOME_DIR

Set `GENOME_DIR` to point at a genome directory (e.g. for tests or alternate genomes). Same convention as `scripts/derive-expression-profiles.js`.
