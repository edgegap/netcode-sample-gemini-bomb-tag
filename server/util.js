// Small helpers for the server. From the edgegap-threejs skill (assets/server/util.js), trimmed to
// what Star Snatch uses.

/** Players sorted by score, the shape Room.finish() expects in result.ranking. */
export function ranking(room) {
  return [...room.players.values()]
    .sort((a, b) => b.score - a.score)
    .map((p) => ({ id: p.id, name: p.name, score: p.score }));
}
