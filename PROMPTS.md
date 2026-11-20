# Prompts

## Gemini Canvas: the solo game

Sent on 2026-11-20 in a new chat on gemini.google.com (free account, model picker on Auto, the
Canvas tool selected under "+"). The architecture part adds three lines learned from the ChatGPT
sample (empty `createWorld()`, a start spot per `addPlayer()`, `setInput()` for every player,
bots driven inside `step()`).

> Build a small browser game as a single HTML file called "Bomb Tag" (plain Canvas 2D, no
> frameworks, no external libraries) and show it in Canvas so I can play it in the preview.
> Gameplay: 4 round runners in a square arena (800x800 units) move with WASD/arrow keys with drift
> (velocity + friction). One random runner holds a bomb with a 12-second fuse. Touching another
> runner passes the bomb to them (the new holder can't pass it back for 0.6 s). When the fuse runs
> out, the holder explodes and is out; the bomb goes to a random remaining runner with a fresh
> fuse. Last runner standing wins, then a results screen and restart. The human plays against 3
> simple bots. VERY IMPORTANT architecture: put ALL game rules in one block between the exact
> lines /* RULES:BEGIN */ and /* RULES:END */, with NO window, document, canvas, audio,
> requestAnimationFrame or timers inside, and no export keyword. The world is plain data
> (objects, arrays, numbers, strings; no classes or Maps). The block defines createWorld() that
> returns a world with no players, addPlayer(world, id, name, isBot) that places each new player
> at its own free start spot (up to 4 players, any ids), removePlayer(world, id), setInput(world,
> id, {up,down,left,right}) that works for every player, step(world, dt) that moves bot players
> itself with botInput() and returns an array of events ({type:'pass', from, to}, {type:'boom',
> id} and {type:'win', winner}), and botInput(world, id) using only positions and who holds the
> bomb. Everything else (rendering, keyboard input, calling step() at 60 Hz) stays outside the
> block.

Gemini opened a Canvas (Code / Preview tabs) and wrote the game in one answer. It played in the
preview: the fuse counted down on the holder and the bots ran from it. **Export > Download code**
saved `bomb_tag.html` (1,198 lines), kept unchanged as `artifact/bomb-tag.html` (git tag
`before`). No follow-up prompt was needed: `createWorld()` returns no players, `addPlayer()` uses a
free corner, `setInput()` accepts every player and `step()` drives the bots, as asked.
