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

## Signaling and health aggregation (story 8)

Status and health flow bottom-up: use a **status overlay** (keyed by node id) to record status; the graph from `decompose()` stays read-only. Story 9 (execution) writes into the overlay; story 10 (Repair) reads via `aggregateHealth()`.

### createStatusOverlay()

Returns a new empty overlay (plain object) for storing status by node id. Caller owns it; typically one overlay per run.

```js
const { createStatusOverlay, setNodeStatus, aggregateHealth } = require('./lib/signaling');
const overlay = createStatusOverlay();
```

### setNodeStatus(overlay, nodeId, payload)

Records status for a node. **Payload shape:** `{ status: 'ok' | 'failed', message?: string }`. Does not validate that `nodeId` exists in the graph (v1).

```js
setNodeStatus(overlay, 'molecule:read_file', { status: 'ok' });
setNodeStatus(overlay, 'molecule:read_file', { status: 'failed', message: 'ENOENT' });
```

### aggregateHealth(root, overlay)

Walks the instance tree bottom-up: leaf nodes use the overlay entry or default `{ status: 'ok' }`; parent nodes are `failed` if any child is `failed`, else `ok`. Returns organism-level summary and organ-level health.

**Returns:**

- `organism`: `{ status: 'ok' | 'failed', message?, organs }` — organism-level summary; `organs` is the same array as below.
- `organs`: array of `{ id, status, message?, childrenFailed? }` — one entry per organ node.

```js
const genome = loadGenome();
const { root } = decompose(genome);
const overlay = createStatusOverlay();
setNodeStatus(overlay, 'molecule:read_file', { status: 'failed', message: 'timeout' });
const health = aggregateHealth(root, overlay);
// health.organism.status === 'failed'
// health.organs[0].id === 'organ:Build', health.organs[0].status === 'failed'
```

Graph is from `decompose(loadGenome())` and is read-only; the overlay is caller-owned and in-memory only.

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
