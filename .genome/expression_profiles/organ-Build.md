# Organ: Build expression profile

- Mission slice: full (v1 single organ)
- Decomposition: organs→tissues and below
- Role library: Build (organs), Implementation (tissues), Worker (cells), read_file (molecules)
- Contracts: Build → Implementation
- **Handoff gate:** Before declaring implementation complete, verify the smallest user-visible happy path in the target environment (or document exact commands for the human to do so).
