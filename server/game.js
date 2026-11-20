// Bomb Tag on the server. The rules are client/rules.js, generated from Gemini's Canvas file by
// tools/split-artifact.mjs: the same code the page runs for solo play. Here the server owns the
// world and players only send their four buttons.
// Implements the room.js game contract from the edgegap-threejs skill (assets/server/game.js).

import * as R from "../client/rules.js";
import { ranking } from "./util.js";

const r1 = (v) => Math.round(v * 10) / 10;

export function createGame() {
  let world = R.createWorld();
  let events = []; // passes, explosions and the win since the last snapshot, for client effects
  let outCount = 0;

  return {
    name: "bomb-tag",
    // Bots fill every empty seat, so 1 to 4 humans always play a 4-runner match.
    config: { tickHz: 60, sendHz: 20, maxPlayers: 4, botFill: 4, matchSeconds: 180 },
    info: () => ({ arena: world.width, fuse: world.fuseDuration }),

    addPlayer(p) {
      R.addPlayer(world, p.id, p.name, p.bot);
    },
    removePlayer(p) {
      R.removePlayer(world, p.id);
    },
    // Never trust the wire: four booleans, nothing else. step() drives the bots itself.
    input(p, msg) {
      R.setInput(world, p.id, { up: msg.up === true, down: msg.down === true, left: msg.left === true, right: msg.right === true });
    },
    // A fresh world for each match. Gemini's addPlayer() hands the bomb to the first player added,
    // so the room's players are seated in random order.
    start(room) {
      world = R.createWorld();
      const seats = [...room.players.values()].sort(() => Math.random() - 0.5);
      for (const p of seats) R.addPlayer(world, p.id, p.name, p.bot);
      events = [];
      outCount = 0;
    },
    reset() {
      world = R.createWorld();
    },

    // Score = finishing place: the first runner out gets 0, the winner 3.
    update(dt, room) {
      for (const e of R.step(world, dt)) {
        events.push(e);
        if (e.type === "boom") {
          const rp = room.players.get(e.id);
          if (rp) rp.score = outCount++;
        }
        if (e.type === "win") {
          const rp = room.players.get(e.winner);
          if (rp) rp.score = 3;
        }
      }
    },

    result(room) {
      if (!world.gameOver) return null;
      const w = room.players.get(world.winnerId);
      return { winner: w ? `${w.name} survives!` : "Nobody survives!", ranking: ranking(room) };
    },
    timeUp(room) {
      const alive = world.players.filter((p) => p.alive).map((p) => room.players.get(p.id)?.name).filter(Boolean);
      return { winner: `Time! Still standing: ${alive.join(", ") || "nobody"}`, ranking: ranking(room) };
    },

    // The world is plain data, so the snapshot is the world itself, rounded. The page draws it with
    // Gemini's own render(), and the test players feed it to botInput().
    snapshot() {
      const s = {
        ...world,
        fuse: r1(world.fuse),
        passCooldown: r1(world.passCooldown),
        players: world.players.map((p) => ({
          id: p.id, name: p.name, isBot: p.isBot, spotIndex: p.spotIndex, alive: p.alive,
          x: r1(p.x), y: r1(p.y), vx: r1(p.vx), vy: r1(p.vy), input: p.input,
        })),
        ev: events,
      };
      events = [];
      return s;
    },
  };
}
