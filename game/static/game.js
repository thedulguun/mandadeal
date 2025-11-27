// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const WORLD_WIDTH = 384;
const WORLD_HEIGHT = 640;
const TILE_SIZE = 64;
const PLAYER_SIZE = 36;

// Physics constants
const GRAVITY = 1800;
const MAX_MOMENTUM = 1.0;
const MOMENTUM_CHARGE_TIME = 0.7;
const MIN_JUMP_MOMENTUM = 0.05;

// Jump velocity formula: vy = -(BASE_VY + SCALE_VY * momentum)
const BASE_VY = 420;
const SCALE_VY = 440;
const BASE_VX = 150;
const SCALE_VX = 280;

// Bounce and landing
const WALL_BOUNCE_FACTOR = 0.5;
const WALL_BOUNCE_NUDGE = -150;
const CEILING_PUSH_DOWN = 100;
const GROUND_FRICTION = 0.9;
const SLIDE_MIN = 0;
const SLIDE_MAX = 10;

// World generation
const SEGMENT_WIDTH = WORLD_WIDTH;
const VOID_Y = WORLD_HEIGHT + 100;

// Difficulty
const DIFFICULTY_TIME_RATE = 0.05;
const DIFFICULTY_CHECKPOINT_BONUS = 0.2;

// Oscillation after full charge
const OSCILLATION_MIN = 0.45;
const OSCILLATION_MAX = 1.0;
const OSCILLATION_PERIOD = 2.6;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function randomRange(min, max) {
    return min + Math.random() * (max - min);
}

function randomInt(min, max) {
    return Math.floor(randomRange(min, max + 1));
}

function aabbOverlap(a, b, epsilon = 1) {
    return a.x < b.x + b.w + epsilon &&
           a.x + a.w > b.x - epsilon &&
           a.y < b.y + b.h + epsilon &&
           a.y + a.h > b.y - epsilon;
}

// ============================================================================
// GAME STATE
// ============================================================================

const GameState = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    RESPAWNING: 'respawning'
};

const game = {
    state: GameState.MENU,
    canvas: null,
    ctx: null,
    scale: 1,
    lastTime: 0,
    deltaTime: 0,
    totalTime: 0,
    difficulty: 0,
    difficultyMultiplier: 1,
    currentScore: 0,
    bestScore: 0,
    hearts: 3,
    checkpointX: 0,
    lastCheckpointIndex: -1,
    lastCheckpointLevelIndex: 0,
    nextCheckpointIndex: 0,
    checkpointState: null,
    respawnTimer: 0,
    respawnFadeAlpha: 0,
    ghostBuffer: [],
    ghostPlayback: [],
    ghostIndex: 0,
    showGhost: false
};

const sprites = {
    player: new Image(),
    playerLoaded: false
};

sprites.player.onload = () => {
    sprites.playerLoaded = true;
};
sprites.player.src = '/static/wolf.png';

// ============================================================================
// PLAYER
// ============================================================================

const player = {
    x: 100,
    y: WORLD_HEIGHT - TILE_SIZE * 2 - PLAYER_SIZE,
    w: PLAYER_SIZE,
    h: PLAYER_SIZE,
    vx: 0,
    vy: 0,
    grounded: false,
    groundedGrace: 0,
    momentum: 0,
    charging: false,
    chargeStartTime: 0,
    lastX: 0,
    lastY: 0,
    trail: []
};

function resetPlayer() {
    player.x = 100;
    player.y = WORLD_HEIGHT - TILE_SIZE * 2 - PLAYER_SIZE - 4;
    player.vx = 0;
    player.vy = 0;
    player.grounded = true;
    player.groundedGrace = 0;
    player.momentum = 0;
    player.charging = false;
    player.chargeStartTime = 0;
    player.trail = [];
}

// ============================================================================
// CAMERA
// ============================================================================

const camera = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0
};

function updateCamera() {
    const targetX = player.x - WORLD_WIDTH * 0.3;
    camera.targetX = Math.max(0, targetX);
    camera.x = lerp(camera.x, camera.targetX, 0.1);

    const playerScreenY = player.y - camera.y;
    if (playerScreenY < WORLD_HEIGHT * 0.3) {
        camera.targetY = player.y - WORLD_HEIGHT * 0.3;
    } else if (playerScreenY > WORLD_HEIGHT * 0.7) {
        camera.targetY = player.y - WORLD_HEIGHT * 0.7;
    }
    camera.targetY = Math.max(0, camera.targetY);
    camera.y = lerp(camera.y, camera.targetY, 0.05);
}

// ============================================================================
// WORLD GENERATION - FLOATING PLATFORMS
// ============================================================================

const TileType = {
    GROUND: 'ground',
    PLATFORM: 'platform',
    WALL: 'wall',
    CHECKPOINT: 'checkpoint',
    MOVING: 'moving'
};

const GROUND_Y = WORLD_HEIGHT - TILE_SIZE * 2;
const HIGH_GROUND_Y = WORLD_HEIGHT - TILE_SIZE * 3;
const LOW_GROUND_Y = WORLD_HEIGHT - TILE_SIZE * 1.5;

const world = {
    tiles: [],
    checkpoints: [],
    levels: [],
    nextLevelStartX: 0,
    lastGroundY: GROUND_Y,
    lastChunkType: null
};

const ChunkType = {
    RUNWAY: 'runway',
    SMALL_HOP: 'small_hop',
    STEP_UP: 'step_up',
    STEP_DOWN: 'step_down',
    MEDIUM_GAP: 'medium_gap',
    DOUBLE_HOP: 'double_hop',
    STAIRCASE_UP: 'staircase_up',
    STAIRCASE_DOWN: 'staircase_down',
    PIT_JUMP: 'pit_jump',
    WALL_HOP: 'wall_hop',
    PRECISION_GAP: 'precision_gap',
    CEILING_RUN: 'ceiling_run',
    ZIGZAG_PLATFORMS: 'zigzag',
    MOVING_BRIDGE: 'moving_bridge',
    BOUNCE_CORRIDOR: 'bounce_corridor',
    GAUNTLET: 'gauntlet',
    TIMING_PLATFORMS: 'timing',
    NARROW_PATH: 'narrow_path',
    WALL_MAZE: 'wall_maze'
};

const chunkDefs = [
    { type: ChunkType.RUNWAY, minD: 0, weight: (D) => Math.max(1, 8 - D * 3) },
    { type: ChunkType.SMALL_HOP, minD: 0, weight: (D) => Math.max(2, 10 - D * 2) },
    { type: ChunkType.STEP_UP, minD: 0, weight: (D) => Math.max(2, 8 - D * 1.5) },
    { type: ChunkType.STEP_DOWN, minD: 0, weight: (D) => Math.max(2, 8 - D * 1.5) },
    { type: ChunkType.MEDIUM_GAP, minD: 0.3, weight: (D) => 6 + D * 0.5 },
    { type: ChunkType.DOUBLE_HOP, minD: 0.4, weight: (D) => 5 + D * 0.5 },
    { type: ChunkType.STAIRCASE_UP, minD: 0.5, weight: (D) => 5 + D * 0.3 },
    { type: ChunkType.STAIRCASE_DOWN, minD: 0.5, weight: (D) => 5 + D * 0.3 },
    { type: ChunkType.PIT_JUMP, minD: 0.6, weight: (D) => 5 + D * 0.4 },
    { type: ChunkType.WALL_HOP, minD: 0.7, weight: (D) => 4 + D * 0.5 },
    { type: ChunkType.PRECISION_GAP, minD: 1.2, weight: (D) => 3 + (D - 1.2) * 0.8 },
    { type: ChunkType.CEILING_RUN, minD: 1.0, weight: (D) => 4 + (D - 1.0) * 0.5 },
    { type: ChunkType.ZIGZAG_PLATFORMS, minD: 1.3, weight: (D) => 4 + (D - 1.3) * 0.6 },
    { type: ChunkType.MOVING_BRIDGE, minD: 1.5, weight: (D) => 3 + (D - 1.5) * 0.7 },
    { type: ChunkType.BOUNCE_CORRIDOR, minD: 1.5, weight: (D) => 3 + (D - 1.5) * 0.6 },
    { type: ChunkType.GAUNTLET, minD: 2.0, weight: (D) => 2 + (D - 2.0) * 0.8 },
    { type: ChunkType.TIMING_PLATFORMS, minD: 2.2, weight: (D) => 2 + (D - 2.2) * 0.7 },
    { type: ChunkType.NARROW_PATH, minD: 2.5, weight: (D) => 2 + (D - 2.5) * 0.6 },
    { type: ChunkType.WALL_MAZE, minD: 2.8, weight: (D) => 2 + (D - 2.8) * 0.5 }
];

function selectChunkType(D, lastType) {
    let available = chunkDefs.filter(c => D >= c.minD);
    if (available.length > 2 && lastType) {
        available = available.filter(c => c.type !== lastType);
    }
    const weighted = available.map(c => ({ type: c.type, weight: Math.max(0.5, c.weight(D)) }));
    const totalWeight = weighted.reduce((sum, c) => sum + c.weight, 0);
    let r = Math.random() * totalWeight;
    for (const c of weighted) {
        r -= c.weight;
        if (r <= 0) return c.type;
    }
    return ChunkType.RUNWAY;
}

// Helper: Create floating platform (no ground - everything floats!)
function makeGround(levelIndex, startX, endX, y) {
    const width = endX - startX;
    if (width <= 0) return [];
    return [{
        levelIndex,
        type: TileType.PLATFORM,
        x: startX,
        y: y,
        w: width,
        h: TILE_SIZE * 0.5
    }];
}

function makePlatform(levelIndex, x, y, width, height = TILE_SIZE * 0.5, isCeiling = false) {
    return { levelIndex, type: TileType.PLATFORM, x, y, w: width, h: height, isCeiling };
}

function makeWall(levelIndex, x, y, width, height) {
    return { levelIndex, type: TileType.WALL, x, y, w: width, h: height };
}

// ============================================================================
// CHUNK GENERATORS
// ============================================================================

function generateChunk(levelIndex, startX, entryY, D, chunkType) {
    entryY = clamp(entryY, HIGH_GROUND_Y, LOW_GROUND_Y);
    switch (chunkType) {
        case ChunkType.RUNWAY: return chunkRunway(levelIndex, startX, entryY, D);
        case ChunkType.SMALL_HOP: return chunkSmallHop(levelIndex, startX, entryY, D);
        case ChunkType.STEP_UP: return chunkStepUp(levelIndex, startX, entryY, D);
        case ChunkType.STEP_DOWN: return chunkStepDown(levelIndex, startX, entryY, D);
        case ChunkType.MEDIUM_GAP: return chunkMediumGap(levelIndex, startX, entryY, D);
        case ChunkType.DOUBLE_HOP: return chunkDoubleHop(levelIndex, startX, entryY, D);
        case ChunkType.STAIRCASE_UP: return chunkStaircaseUp(levelIndex, startX, entryY, D);
        case ChunkType.STAIRCASE_DOWN: return chunkStaircaseDown(levelIndex, startX, entryY, D);
        case ChunkType.PIT_JUMP: return chunkPitJump(levelIndex, startX, entryY, D);
        case ChunkType.WALL_HOP: return chunkWallHop(levelIndex, startX, entryY, D);
        case ChunkType.PRECISION_GAP: return chunkPrecisionGap(levelIndex, startX, entryY, D);
        case ChunkType.CEILING_RUN: return chunkCeilingRun(levelIndex, startX, entryY, D);
        case ChunkType.ZIGZAG_PLATFORMS: return chunkZigzag(levelIndex, startX, entryY, D);
        case ChunkType.MOVING_BRIDGE: return chunkMovingBridge(levelIndex, startX, entryY, D);
        case ChunkType.BOUNCE_CORRIDOR: return chunkBounceCorridor(levelIndex, startX, entryY, D);
        case ChunkType.GAUNTLET: return chunkGauntlet(levelIndex, startX, entryY, D);
        case ChunkType.TIMING_PLATFORMS: return chunkTimingPlatforms(levelIndex, startX, entryY, D);
        case ChunkType.NARROW_PATH: return chunkNarrowPath(levelIndex, startX, entryY, D);
        case ChunkType.WALL_MAZE: return chunkWallMaze(levelIndex, startX, entryY, D);
        default: return chunkRunway(levelIndex, startX, entryY, D);
    }
}

function chunkRunway(levelIndex, startX, entryY, D) {
    const width = TILE_SIZE * randomRange(1.5, 2.5);
    const tiles = makeGround(levelIndex, startX, startX + width, entryY);
    return { tiles, width: width + TILE_SIZE * 0.5, exitY: entryY };
}

function chunkSmallHop(levelIndex, startX, entryY, D) {
    const tiles = [];
    const gapSize = TILE_SIZE * randomRange(1.0, 1.4);
    const platWidth = TILE_SIZE * randomRange(1.0, 1.5);
    tiles.push(...makeGround(levelIndex, startX, startX + platWidth, entryY));
    const exitX = startX + platWidth + gapSize;
    tiles.push(...makeGround(levelIndex, exitX, exitX + platWidth, entryY));
    return { tiles, width: platWidth * 2 + gapSize, exitY: entryY };
}

function chunkStepUp(levelIndex, startX, entryY, D) {
    const tiles = [];
    const stepHeight = TILE_SIZE * randomRange(0.8, 1.4);
    const exitY = Math.max(HIGH_GROUND_Y, entryY - stepHeight);
    const platWidth = TILE_SIZE * randomRange(1.0, 1.5);
    tiles.push(...makeGround(levelIndex, startX, startX + platWidth, entryY));
    const exitX = startX + platWidth + TILE_SIZE * randomRange(0.8, 1.2);
    tiles.push(...makeGround(levelIndex, exitX, exitX + platWidth, exitY));
    return { tiles, width: exitX + platWidth - startX, exitY };
}

function chunkStepDown(levelIndex, startX, entryY, D) {
    const tiles = [];
    const dropHeight = TILE_SIZE * randomRange(0.6, 1.2);
    const exitY = Math.min(LOW_GROUND_Y, entryY + dropHeight);
    const platWidth = TILE_SIZE * randomRange(1.0, 1.5);
    tiles.push(...makeGround(levelIndex, startX, startX + platWidth, entryY));
    const exitX = startX + platWidth + TILE_SIZE * randomRange(0.6, 1.0);
    tiles.push(...makeGround(levelIndex, exitX, exitX + platWidth, exitY));
    return { tiles, width: exitX + platWidth - startX, exitY };
}

function chunkMediumGap(levelIndex, startX, entryY, D) {
    const tiles = [];
    const gapSize = TILE_SIZE * randomRange(1.6, 2.0);
    const platWidth = TILE_SIZE * randomRange(1.0, 1.4);
    tiles.push(...makeGround(levelIndex, startX, startX + platWidth, entryY));
    const exitX = startX + platWidth + gapSize;
    tiles.push(...makeGround(levelIndex, exitX, exitX + platWidth, entryY));
    return { tiles, width: platWidth * 2 + gapSize, exitY: entryY };
}

function chunkDoubleHop(levelIndex, startX, entryY, D) {
    const tiles = [];
    const gap1 = TILE_SIZE * randomRange(1.0, 1.3);
    const gap2 = TILE_SIZE * randomRange(1.1, 1.4);
    const platWidth = TILE_SIZE * randomRange(0.8, 1.2);
    let x = startX;
    tiles.push(...makeGround(levelIndex, x, x + platWidth, entryY));
    x += platWidth + gap1;
    tiles.push(...makeGround(levelIndex, x, x + platWidth, entryY));
    x += platWidth + gap2;
    tiles.push(...makeGround(levelIndex, x, x + platWidth, entryY));
    x += platWidth;
    return { tiles, width: x - startX, exitY: entryY };
}

function chunkStaircaseUp(levelIndex, startX, entryY, D) {
    const tiles = [];
    const stepH = TILE_SIZE * 0.5;
    let y = entryY;
    let x = startX;
    for (let i = 0; i < 4; i++) {
        const platWidth = TILE_SIZE * randomRange(0.8, 1.2);
        tiles.push(makePlatform(levelIndex, x, y, platWidth, TILE_SIZE * 0.4));
        x += platWidth + TILE_SIZE * randomRange(0.6, 1.0);
        y = Math.max(HIGH_GROUND_Y, y - stepH);
    }
    tiles.push(makePlatform(levelIndex, x, y, TILE_SIZE * randomRange(0.9, 1.3), TILE_SIZE * 0.4));
    return { tiles, width: x + TILE_SIZE - startX, exitY: y };
}

function chunkStaircaseDown(levelIndex, startX, entryY, D) {
    const tiles = [];
    const stepH = TILE_SIZE * 0.5;
    let y = entryY;
    let x = startX;
    for (let i = 0; i < 4; i++) {
        const platWidth = TILE_SIZE * randomRange(0.8, 1.2);
        tiles.push(makePlatform(levelIndex, x, y, platWidth, TILE_SIZE * 0.4));
        x += platWidth + TILE_SIZE * randomRange(0.5, 0.9);
        y = Math.min(LOW_GROUND_Y, y + stepH);
    }
    tiles.push(makePlatform(levelIndex, x, y, TILE_SIZE * randomRange(0.9, 1.3), TILE_SIZE * 0.4));
    return { tiles, width: x + TILE_SIZE - startX, exitY: y };
}

function chunkPitJump(levelIndex, startX, entryY, D) {
    const tiles = [];
    const gapSize = TILE_SIZE * randomRange(1.8, 2.3);
    const platWidth = TILE_SIZE * randomRange(1.0, 1.4);
    tiles.push(...makeGround(levelIndex, startX, startX + platWidth, entryY));
    const exitX = startX + platWidth + gapSize;
    tiles.push(...makeGround(levelIndex, exitX, exitX + platWidth, entryY));
    return { tiles, width: platWidth * 2 + gapSize, exitY: entryY };
}

function chunkWallHop(levelIndex, startX, entryY, D) {
    const tiles = [];
    const wallHeight = TILE_SIZE * randomRange(1.5, 2.0);
    const wallWidth = TILE_SIZE * 0.4;
    const platWidth = TILE_SIZE * randomRange(1.0, 1.4);
    tiles.push(...makeGround(levelIndex, startX, startX + platWidth, entryY));
    const wallX = startX + platWidth + TILE_SIZE * 0.8;
    tiles.push(makePlatform(levelIndex, wallX - TILE_SIZE * 0.3, entryY, TILE_SIZE * 1.0, TILE_SIZE * 0.4));
    tiles.push(makeWall(levelIndex, wallX, entryY - wallHeight, wallWidth, wallHeight));
    const exitX = wallX + TILE_SIZE * 1.2;
    tiles.push(...makeGround(levelIndex, exitX, exitX + platWidth, entryY));
    return { tiles, width: exitX + platWidth - startX, exitY: entryY };
}

function chunkPrecisionGap(levelIndex, startX, entryY, D) {
    const tiles = [];
    const gapSize = TILE_SIZE * randomRange(2.3, 2.6);
    const platWidth = TILE_SIZE * randomRange(0.9, 1.2);
    tiles.push(...makeGround(levelIndex, startX, startX + platWidth, entryY));
    const exitX = startX + platWidth + gapSize;
    tiles.push(...makeGround(levelIndex, exitX, exitX + platWidth, entryY));
    return { tiles, width: platWidth * 2 + gapSize, exitY: entryY };
}

function chunkCeilingRun(levelIndex, startX, entryY, D) {
    const tiles = [];
    const ceilingHeight = TILE_SIZE * 1.6;
    const platWidth = TILE_SIZE * randomRange(0.9, 1.2);
    let x = startX;
    for (let i = 0; i < 3; i++) {
        tiles.push(makePlatform(levelIndex, x, entryY, platWidth, TILE_SIZE * 0.4));
        x += platWidth + TILE_SIZE * randomRange(0.6, 0.9);
    }
    tiles.push(makePlatform(levelIndex, startX, entryY - ceilingHeight, x - startX, TILE_SIZE * 0.4, true));
    return { tiles, width: x - startX, exitY: entryY };
}

function chunkZigzag(levelIndex, startX, entryY, D) {
    const tiles = [];
    let x = startX;
    let high = true;
    for (let i = 0; i < 5; i++) {
        const yOffset = high ? -TILE_SIZE * 0.7 : TILE_SIZE * 0.4;
        const platY = clamp(entryY + yOffset, HIGH_GROUND_Y, LOW_GROUND_Y);
        const platWidth = TILE_SIZE * randomRange(0.7, 1.0);
        tiles.push(makePlatform(levelIndex, x, platY, platWidth, TILE_SIZE * 0.4));
        x += platWidth + TILE_SIZE * randomRange(0.9, 1.2);
        high = !high;
    }
    return { tiles, width: x - startX, exitY: entryY };
}

function chunkMovingBridge(levelIndex, startX, entryY, D) {
    const tiles = [];
    const platWidth = TILE_SIZE * randomRange(0.8, 1.1);
    tiles.push(...makeGround(levelIndex, startX, startX + platWidth, entryY));
    const moveRange = TILE_SIZE * 0.7;
    const moveSpeed = 1.8 + D * 0.25;
    const movingX = startX + platWidth + TILE_SIZE * 0.8;
    tiles.push({
        levelIndex, type: TileType.MOVING,
        x: movingX, y: entryY - TILE_SIZE * 0.2,
        w: TILE_SIZE * 1.3, h: TILE_SIZE * 0.4,
        baseX: movingX, moveRange, moveSpeed
    });
    const exitX = movingX + TILE_SIZE * 2.2;
    tiles.push(...makeGround(levelIndex, exitX, exitX + platWidth, entryY));
    return { tiles, width: exitX + platWidth - startX, exitY: entryY };
}

function chunkBounceCorridor(levelIndex, startX, entryY, D) {
    const tiles = [];
    const platWidth = TILE_SIZE * randomRange(0.8, 1.1);
    const wallH = TILE_SIZE * 1.6;
    let x = startX;
    tiles.push(makePlatform(levelIndex, x, entryY, platWidth, TILE_SIZE * 0.4));
    x += platWidth + TILE_SIZE * 0.5;
    tiles.push(makePlatform(levelIndex, x, entryY, TILE_SIZE * 0.8, TILE_SIZE * 0.4));
    tiles.push(makeWall(levelIndex, x + TILE_SIZE * 0.15, entryY - wallH, TILE_SIZE * 0.4, wallH));
    x += TILE_SIZE * 1.5;
    tiles.push(makePlatform(levelIndex, x, entryY, TILE_SIZE * 0.8, TILE_SIZE * 0.4));
    tiles.push(makeWall(levelIndex, x + TILE_SIZE * 0.15, entryY - wallH, TILE_SIZE * 0.4, wallH));
    x += TILE_SIZE * 1.5;
    tiles.push(makePlatform(levelIndex, x, entryY, platWidth, TILE_SIZE * 0.4));
    return { tiles, width: x + platWidth - startX, exitY: entryY };
}

function chunkGauntlet(levelIndex, startX, entryY, D) {
    const tiles = [];
    let x = startX;
    let y = entryY;
    for (let i = 0; i < 6; i++) {
        const platWidth = TILE_SIZE * randomRange(0.6, 0.9);
        const yOffset = randomRange(-TILE_SIZE * 0.4, TILE_SIZE * 0.4);
        y = clamp(y + yOffset, HIGH_GROUND_Y, LOW_GROUND_Y);
        tiles.push(makePlatform(levelIndex, x, y, platWidth, TILE_SIZE * 0.35));
        x += platWidth + TILE_SIZE * randomRange(0.8, 1.2);
    }
    return { tiles, width: x - startX, exitY: y };
}

function chunkTimingPlatforms(levelIndex, startX, entryY, D) {
    const tiles = [];
    const platWidth = TILE_SIZE * randomRange(0.7, 1.0);
    tiles.push(makePlatform(levelIndex, startX, entryY, platWidth, TILE_SIZE * 0.4));
    const baseSpeed = 2.0 + D * 0.2;
    const movingWidth = TILE_SIZE * 1.1;
    for (let i = 0; i < 3; i++) {
        const movX = startX + platWidth + TILE_SIZE * (1.8 * i + 1.0);
        tiles.push({
            levelIndex, type: TileType.MOVING,
            x: movX, y: entryY - TILE_SIZE * 0.15,
            w: movingWidth, h: TILE_SIZE * 0.4,
            baseX: movX,
            moveRange: TILE_SIZE * (0.5 + i * 0.15),
            moveSpeed: baseSpeed * (1 + i * 0.2)
        });
    }
    const exitX = startX + platWidth + TILE_SIZE * 6.5;
    tiles.push(makePlatform(levelIndex, exitX, entryY, platWidth, TILE_SIZE * 0.4));
    return { tiles, width: exitX + platWidth - startX, exitY: entryY };
}

function chunkNarrowPath(levelIndex, startX, entryY, D) {
    const tiles = [];
    let x = startX;
    let y = entryY;
    for (let i = 0; i < 5; i++) {
        const platWidth = TILE_SIZE * randomRange(0.5, 0.7);
        const yOffset = randomRange(-TILE_SIZE * 0.35, TILE_SIZE * 0.35);
        y = clamp(y + yOffset, HIGH_GROUND_Y, LOW_GROUND_Y);
        tiles.push(makePlatform(levelIndex, x, y, platWidth, TILE_SIZE * 0.35));
        x += platWidth + TILE_SIZE * randomRange(1.0, 1.4);
    }
    return { tiles, width: x - startX, exitY: y };
}

function chunkWallMaze(levelIndex, startX, entryY, D) {
    const tiles = [];
    let x = startX;
    for (let i = 0; i < 4; i++) {
        const platWidth = TILE_SIZE * randomRange(0.7, 1.0);
        const wallH = TILE_SIZE * randomRange(1.4, 2.0);
        tiles.push(makePlatform(levelIndex, x, entryY, platWidth, TILE_SIZE * 0.4));
        tiles.push(makeWall(levelIndex, x + platWidth * 0.3, entryY - wallH, TILE_SIZE * 0.35, wallH));
        x += platWidth + TILE_SIZE * randomRange(0.9, 1.3);
    }
    tiles.push(makePlatform(levelIndex, x, entryY, TILE_SIZE * randomRange(0.8, 1.1), TILE_SIZE * 0.4));
    return { tiles, width: x + TILE_SIZE - startX, exitY: entryY };
}

// ============================================================================
// LEVEL GENERATION
// ============================================================================

function levelAtX(x) {
    return world.levels.find(l => x >= l.startX && x < l.startX + l.length) || null;
}

function resetWorld() {
    world.tiles = [];
    world.checkpoints = [];
    world.levels = [];
    world.nextLevelStartX = 0;
    world.lastGroundY = GROUND_Y;
    world.lastChunkType = null;
}

function addCheckpoint(x, y, levelIndex) {
    world.checkpoints.push({ x, y, index: world.checkpoints.length, levelIndex, reached: false });
    world.tiles.push({
        levelIndex, type: TileType.CHECKPOINT,
        x: x, y: y - TILE_SIZE,
        w: TILE_SIZE * 0.3, h: TILE_SIZE,
        checkpointIndex: world.checkpoints.length - 1
    });
}

function generateLevel(levelIndex, startX) {
    const D = game.difficulty + levelIndex * 0.15;
    const baseLength = WORLD_WIDTH * (4 + Math.min(D * 0.3, 1.5));
    const targetLength = baseLength * randomRange(0.9, 1.1);

    const level = {
        index: levelIndex, startX, length: 0, tiles: [],
        checkpointIndex: null, generatedNext: false
    };

    let cursorX = startX;
    let groundY = world.lastGroundY;

    if (levelIndex === 0) {
        const intro = chunkRunway(levelIndex, cursorX, groundY, 0);
        intro.tiles.forEach(t => level.tiles.push(t));
        cursorX += intro.width;
    }

    let chunkCount = 0;
    while (cursorX - startX < targetLength) {
        const chunkType = selectChunkType(D, world.lastChunkType);
        const chunk = generateChunk(levelIndex, cursorX, groundY, D, chunkType);
        chunk.tiles.forEach(t => level.tiles.push(t));
        cursorX += chunk.width;
        groundY = chunk.exitY;
        world.lastChunkType = chunkType;
        chunkCount++;

        if (D > 2.5 && chunkCount % 5 === 0 && Math.random() < 0.3) {
            const breather = chunkRunway(levelIndex, cursorX, groundY, D);
            breather.tiles.forEach(t => level.tiles.push(t));
            cursorX += breather.width;
        }
    }

    const ending = chunkRunway(levelIndex, cursorX, groundY, D);
    ending.tiles.forEach(t => level.tiles.push(t));
    cursorX += ending.width;

    level.length = cursorX - startX;
    world.lastGroundY = groundY;

    const checkpointX = cursorX - TILE_SIZE;
    addCheckpoint(checkpointX, groundY, levelIndex);
    level.checkpointIndex = world.checkpoints.length - 1;

    world.tiles.push(...level.tiles);
    world.levels.push(level);
    world.nextLevelStartX = startX + level.length;
}

function pruneLevels() {
    const lastCpLevel = game.lastCheckpointLevelIndex;
    const keepThreshold = Math.max(0, lastCpLevel - 1);
    // Keep more levels ahead - at least 15 levels forward to prevent cliff edges
    world.levels = world.levels.filter(l => l.index >= keepThreshold && l.index <= lastCpLevel + 15);
    const keptLevels = new Set(world.levels.map(l => l.index));
    world.tiles = world.tiles.filter(t => keptLevels.has(t.levelIndex));
    world.checkpoints = world.checkpoints.filter(cp => keptLevels.has(cp.levelIndex));
    world.checkpoints.forEach((cp, i) => cp.index = i);
    const lastReached = [...world.checkpoints].filter(cp => cp.reached).pop();
    game.lastCheckpointIndex = lastReached ? lastReached.index : -1;
}

function ensureLevels() {
    if (world.levels.length === 0) generateLevel(0, 0);
    // Generate more levels ahead - ensure we always have terrain 6 screen widths ahead
    while (world.nextLevelStartX < camera.x + WORLD_WIDTH * 6) {
        generateLevel(world.levels.length, world.nextLevelStartX);
    }
}

function initWorld() {
    resetWorld();
    const initialLevels = 10;
    for (let i = 0; i < initialLevels; i++) {
        generateLevel(i, world.nextLevelStartX);
    }
}

// ============================================================================
// PARTICLES
// ============================================================================

const particles = { landing: [], trail: [] };

function spawnLandingParticles(x, y) {
    const count = randomInt(5, 10);
    for (let i = 0; i < count; i++) {
        particles.landing.push({
            x: x + randomRange(-20, 20), y: y,
            vx: randomRange(-50, 50), vy: randomRange(-100, -30),
            life: 0.4, maxLife: 0.4,
            size: randomRange(3, 6),
            color: Math.random() > 0.5 ? '#4ade80' : '#2dd4bf'
        });
    }
}

function addTrailParticle() {
    if (player.grounded) return;
    const speed = Math.sqrt(player.vx * player.vx + player.vy * player.vy);
    if (speed < 300) return;
    particles.trail.push({
        x: player.x + player.w / 2, y: player.y + player.h / 2,
        alpha: 0.6, size: player.w * 0.6, life: 0.2
    });
}

function updateParticles(dt) {
    for (let i = particles.landing.length - 1; i >= 0; i--) {
        const p = particles.landing[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += GRAVITY * 0.3 * dt;
        p.life -= dt;
        if (p.life <= 0) particles.landing.splice(i, 1);
    }
    for (let i = particles.trail.length - 1; i >= 0; i--) {
        const p = particles.trail[i];
        p.life -= dt;
        p.alpha = p.life / 0.2 * 0.5;
        if (p.life <= 0) particles.trail.splice(i, 1);
    }
}

// ============================================================================
// COLLISIONS
// ============================================================================

function resolveCollisions() {
    const playerBox = { x: player.x, y: player.y, w: player.w, h: player.h };
    const prevBox = { x: player.lastX, y: player.lastY, w: player.w, h: player.h };
    player.grounded = false;

    for (const tile of world.tiles) {
        if (tile.type === TileType.CHECKPOINT) continue;

        let tileX = tile.x;
        let prevTileX = tile.x;
        if (tile.type === TileType.MOVING) {
            tileX = tile.baseX + Math.sin(game.totalTime * tile.moveSpeed) * tile.moveRange;
            const prevTime = game.totalTime - game.deltaTime;
            prevTileX = tile.baseX + Math.sin(prevTime * tile.moveSpeed) * tile.moveRange;
        }

        const tileBox = { x: tileX, y: tile.y, w: tile.w, h: tile.h };
        const prevTileBox = { x: prevTileX, y: tile.y, w: tile.w, h: tile.h };

        if (!aabbOverlap(playerBox, tileBox)) continue;

        const playerBottom = playerBox.y + playerBox.h;
        const prevBottom = prevBox.y + prevBox.h;
        const playerTop = playerBox.y;
        const prevTop = prevBox.y;
        const playerRight = playerBox.x + playerBox.w;
        const prevRight = prevBox.x + prevBox.w;
        const playerLeft = playerBox.x;
        const prevLeft = prevBox.x;

        const landing = prevBottom <= prevTileBox.y + 0.1 && playerBottom >= tileBox.y;
        const hittingCeiling = prevTop >= prevTileBox.y + prevTileBox.h - 0.1 && playerTop < tileBox.y + tileBox.h;
        const hittingLeftWall = prevRight <= prevTileBox.x + 0.05 && playerRight > tileBox.x;
        const hittingRightWall = prevLeft >= prevTileBox.x + prevTileBox.w - 0.05 && playerLeft < tileBox.x + tileBox.w;
        const isWall = tile.type === TileType.WALL || tile.type === TileType.MOVING || (tile.type === TileType.PLATFORM && !tile.isCeiling);

        if (landing && player.vy >= 0) {
            player.y = tileBox.y - playerBox.h;
            if (!player.grounded) {
                spawnLandingParticles(player.x + player.w / 2, player.y + player.h);
                const speed = Math.abs(player.vx);
                const slide = clamp(speed * 0.02, SLIDE_MIN, SLIDE_MAX);
                player.vx = Math.sign(player.vx) * slide;
            }
            player.grounded = true;
            player.vy = 0;

            if (tile.type === TileType.MOVING) {
                const platformVx = Math.cos(game.totalTime * tile.moveSpeed) * tile.moveRange * tile.moveSpeed;
                player.x += platformVx * game.deltaTime;
            }

            playerBox.x = player.x;
            playerBox.y = player.y;

            const lvl = levelAtX(player.x + player.w / 2);
            if (lvl && !lvl.generatedNext) {
                generateLevel(world.levels.length, world.nextLevelStartX);
                lvl.generatedNext = true;
            }
            continue;
        } else if (hittingCeiling && player.vy < 0 && tile.isCeiling) {
            player.y = tileBox.y + tileBox.h;
            player.vy = CEILING_PUSH_DOWN;
        } else if (isWall && (hittingLeftWall || hittingRightWall)) {
            if (hittingLeftWall) {
                player.x = tileBox.x - playerBox.w;
            } else {
                player.x = tileBox.x + tileBox.w;
            }
            if (player.grounded) {
                player.vx = 0;
            } else {
                player.vx = -player.vx * WALL_BOUNCE_FACTOR;
                player.vy = Math.min(player.vy, WALL_BOUNCE_NUDGE);
            }
        }

        playerBox.x = player.x;
        playerBox.y = player.y;
    }
}

// ============================================================================
// CHECKPOINT LOGIC
// ============================================================================

function checkCheckpoints() {
    for (const cp of world.checkpoints) {
        if (!cp.reached && player.x > cp.x) {
            cp.reached = true;
            game.currentScore++;
            game.lastCheckpointIndex = cp.index;
            game.lastCheckpointLevelIndex = cp.levelIndex;
            game.difficulty += DIFFICULTY_CHECKPOINT_BONUS * game.difficultyMultiplier;

            game.checkpointState = {
                playerX: cp.x - player.w * 0.5,
                playerY: cp.y - player.h - 2,
                difficulty: game.difficulty,
                hearts: game.hearts,
                score: game.currentScore
            };

            game.ghostBuffer = [];

            if (game.currentScore > game.bestScore) {
                game.bestScore = game.currentScore;
                localStorage.setItem('momentumJumperBest', game.bestScore);
            }

            updateHUD();
        }
    }

    const nextCp = world.checkpoints.find(cp => !cp.reached);
    if (nextCp) game.nextCheckpointIndex = nextCp.index;
}

// ============================================================================
// INPUT HANDLING
// ============================================================================

const input = { isHolding: false, holdStartTime: 0 };

function startCharge() {
    const groundedEnough = player.grounded || player.groundedGrace > 0;
    if (!groundedEnough || game.state !== GameState.PLAYING) return;
    input.isHolding = true;
    input.holdStartTime = game.totalTime;
    player.charging = true;
    player.chargeStartTime = game.totalTime;
    player.momentum = 0;
}

function releaseCharge() {
    if (!input.isHolding) return;
    input.isHolding = false;
    if (game.state !== GameState.PLAYING) return;

    const groundedEnough = player.grounded || player.groundedGrace > 0;
    if (groundedEnough && player.momentum >= MIN_JUMP_MOMENTUM) {
        const v = player.momentum;
        player.vy = -(BASE_VY + SCALE_VY * v);
        player.vx = BASE_VX + SCALE_VX * v;
        player.grounded = false;
        player.groundedGrace = 0;
    }

    player.charging = false;
    player.momentum = 0;
}

function updateMomentum() {
    const groundedEnough = player.grounded || player.groundedGrace > 0;
    if (!player.charging || !groundedEnough) {
        player.momentum = 0;
        return;
    }

    const chargeTime = game.totalTime - player.chargeStartTime;

    if (chargeTime < MOMENTUM_CHARGE_TIME) {
        player.momentum = clamp(chargeTime / MOMENTUM_CHARGE_TIME, 0, MAX_MOMENTUM);
    } else {
        const oscTime = chargeTime - MOMENTUM_CHARGE_TIME;
        const p = (oscTime % OSCILLATION_PERIOD) / OSCILLATION_PERIOD;
        const wave = 1 - Math.abs(((p * 2 + 1) % 2) - 1);
        player.momentum = clamp(OSCILLATION_MIN + wave * (OSCILLATION_MAX - OSCILLATION_MIN), 0, MAX_MOMENTUM);
    }
}

function setupInput() {
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !e.repeat) {
            e.preventDefault();
            startCharge();
        }
        if (e.code === 'KeyD') {
            const panel = document.getElementById('debug-panel');
            panel.classList.toggle('hidden');
        }
        if (e.code === 'Escape' && game.state === GameState.PLAYING) {
            pauseGame();
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.code === 'Space') releaseCharge();
    });

    game.canvas.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        startCharge();
    });

    document.addEventListener('pointerup', (e) => {
        releaseCharge();
    });

    game.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
}

// ============================================================================
// GAME FLOW
// ============================================================================

const menuScreens = {
    shop: null,
    inventory: null,
    leaderboard: null
};

function closeAllMenuScreens() {
    Object.values(menuScreens).forEach(el => el?.classList.add('hidden'));
}

function openMenuScreen(key) {
    if (game.state !== GameState.MENU) return;
    closeAllMenuScreens();
    const screen = menuScreens[key];
    if (screen) screen.classList.remove('hidden');
}

function setupMenuScreens() {
    menuScreens.shop = document.getElementById('shop-screen');
    menuScreens.inventory = document.getElementById('inventory-screen');
    menuScreens.leaderboard = document.getElementById('leaderboard-screen');

    const bindings = [
        { id: 'shop-btn', screen: 'shop' },
        { id: 'inventory-btn', screen: 'inventory' },
        { id: 'leaderboard-btn', screen: 'leaderboard' }
    ];

    bindings.forEach(({ id, screen }) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', () => openMenuScreen(screen));
    });

    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => closeAllMenuScreens());
    });

    Object.values(menuScreens).forEach(el => {
        if (!el) return;
        el.addEventListener('click', (e) => {
            if (e.target === el) closeAllMenuScreens();
        });
    });
}

function startGame() {
    game.state = GameState.PLAYING;
    game.difficulty = 0;
    game.currentScore = 0;
    game.hearts = 3;
    game.lastCheckpointIndex = -1;
    game.lastCheckpointLevelIndex = 0;
    game.ghostBuffer = [];
    game.ghostPlayback = [];
    game.showGhost = false;

    resetPlayer();
    initWorld();
    camera.x = 0;
    camera.y = 0;

    // Initialize starting checkpoint so player can respawn even before first checkpoint
    game.checkpointState = {
        playerX: player.x,
        playerY: player.y,
        difficulty: 0,
        hearts: 3,
        score: 0
    };

    closeAllMenuScreens();
    updateHUD();
    updateHearts();

    document.getElementById('start-screen').classList.add('hidden');
}

function pauseGame() {
    if (game.state !== GameState.PLAYING) return;
    game.state = GameState.PAUSED;
    document.getElementById('pause-menu').classList.remove('hidden');
}

function resumeGame() {
    if (game.state !== GameState.PAUSED) return;
    game.state = GameState.PLAYING;
    document.getElementById('pause-menu').classList.add('hidden');
}

function returnToLobby() {
    document.getElementById('pause-menu').classList.add('hidden');
    game.state = GameState.MENU;
    document.getElementById('start-screen').classList.remove('hidden');
    updateStartScreen();
}

function playerDeath() {
    game.hearts--;

    if (game.hearts > 0 && game.checkpointState) {
        game.state = GameState.RESPAWNING;
        game.respawnTimer = 1.0;
        game.respawnFadeAlpha = 0;
        game.ghostPlayback = [...game.ghostBuffer];
        game.ghostIndex = 0;
        game.showGhost = game.ghostPlayback.length > 0;
        animateHeartLoss(game.hearts);
    } else {
        updateHearts();
        if (game.currentScore > game.bestScore) {
            game.bestScore = game.currentScore;
            localStorage.setItem('momentumJumperBest', game.bestScore);
        }
        closeAllMenuScreens();
        setTimeout(() => {
            game.state = GameState.MENU;
            document.getElementById('start-screen').classList.remove('hidden');
            updateStartScreen();
        }, 500);
    }
}

function respawnPlayer() {
    if (!game.checkpointState) return;
    const state = game.checkpointState;
    player.x = state.playerX;
    player.y = state.playerY;
    player.vx = 0;
    player.vy = 0;
    player.grounded = true;
    player.momentum = 0;
    player.charging = false;
    camera.x = player.x - WORLD_WIDTH * 0.3;
    camera.y = 0;
    game.state = GameState.PLAYING;
    updateHearts();
}

// ============================================================================
// HUD UPDATES
// ============================================================================

function updateHUD() {
    document.getElementById('current-score').textContent = game.currentScore;
    document.getElementById('best-score').textContent = game.bestScore;
    const level = Math.floor(game.difficulty) + 1;
    document.getElementById('difficulty-display').textContent = `Lv. ${level}`;
    updateProgressBar();
    document.getElementById('debug-d').textContent = game.difficulty.toFixed(2);
}

function updateProgressBar() {
    const checkpoints = [...world.checkpoints].sort((a, b) => a.x - b.x);
    const lastCp = checkpoints.find(cp => cp.index === game.lastCheckpointIndex) || null;
    const nextCp = checkpoints.find(cp => !cp.reached) || null;

    const startX = lastCp ? lastCp.x : 0;
    let endX;
    if (nextCp) {
        endX = nextCp.x;
    } else if (lastCp) {
        endX = startX + WORLD_WIDTH;
    } else {
        endX = WORLD_WIDTH;
    }

    const span = Math.max(1, endX - startX);
    const progress = nextCp ? clamp((player.x - startX) / span * 100, 0, 100) : 100;

    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('progress-marker').style.left = `${progress}%`;
}

function updateHearts() {
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach((heart, i) => {
        heart.classList.remove('lost', 'empty');
        if (i >= game.hearts) heart.classList.add('empty');
    });
}

function animateHeartLoss(index) {
    const hearts = document.querySelectorAll('.heart');
    if (hearts[index]) {
        hearts[index].classList.add('lost');
        setTimeout(() => {
            hearts[index].classList.remove('lost');
            hearts[index].classList.add('empty');
        }, 500);
    }
}

function updateStartScreen() {
    document.getElementById('start-best').textContent = game.bestScore;
    const lbBest = document.getElementById('lb-best-score');
    if (lbBest) lbBest.textContent = game.bestScore;
}

// ============================================================================
// RENDERING
// ============================================================================

function worldToScreen(worldX, worldY) {
    return {
        x: (worldX - camera.x) * game.scale,
        y: (worldY - camera.y) * game.scale
    };
}

function drawBackground() {
    const ctx = game.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, game.canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#B0E0E6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
}

function drawTile(tile) {
    const ctx = game.ctx;

    let tileX = tile.x;
    if (tile.type === TileType.MOVING) {
        tileX = tile.baseX + Math.sin(game.totalTime * tile.moveSpeed) * tile.moveRange;
    }

    const pos = worldToScreen(tileX, tile.y);
    const w = tile.w * game.scale;
    const h = tile.h * game.scale;

    if (pos.x + w < 0 || pos.x > game.canvas.width) return;

    switch (tile.type) {
        case TileType.GROUND:
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(pos.x, pos.y, w, h);
            ctx.fillStyle = '#654321';
            ctx.fillRect(pos.x, pos.y + h * 0.6, w, h * 0.4);
            ctx.fillStyle = '#4ade80';
            ctx.fillRect(pos.x, pos.y, w, h * 0.2);
            break;

        case TileType.PLATFORM:
            if (tile.isCeiling) {
                ctx.fillStyle = '#6B4423';
                ctx.fillRect(pos.x, pos.y, w, h);
            } else {
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(pos.x, pos.y, w, h);
                ctx.fillStyle = '#4ade80';
                ctx.fillRect(pos.x, pos.y, w, h * 0.3);
            }
            break;

        case TileType.WALL:
            ctx.fillStyle = '#696969';
            ctx.fillRect(pos.x, pos.y, w, h);
            ctx.fillStyle = '#808080';
            ctx.fillRect(pos.x + 2, pos.y + 2, w - 4, h - 4);
            break;

        case TileType.MOVING:
            ctx.fillStyle = '#DEB887';
            ctx.fillRect(pos.x, pos.y, w, h);
            ctx.fillStyle = '#4ade80';
            ctx.fillRect(pos.x, pos.y, w, h * 0.25);
            break;

        case TileType.CHECKPOINT:
            ctx.fillStyle = '#fff';
            ctx.fillRect(pos.x, pos.y, w * 0.2, h);
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.moveTo(pos.x + w * 0.2, pos.y);
            ctx.lineTo(pos.x + w, pos.y + h * 0.3);
            ctx.lineTo(pos.x + w * 0.2, pos.y + h * 0.6);
            ctx.fill();
            break;
    }
}

function drawPlayer() {
    const ctx = game.ctx;
    const pos = worldToScreen(player.x, player.y);
    const w = player.w * game.scale;
    const h = player.h * game.scale;

    if (sprites.playerLoaded) {
        ctx.drawImage(sprites.player, pos.x, pos.y, w, h);
        return;
    }

    // Fallback if image not loaded
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(pos.x, pos.y, w, h);

    const eyeSize = w * 0.2;
    const eyeY = pos.y + h * 0.25;

    ctx.fillStyle = '#fff';
    ctx.fillRect(pos.x + w * 0.2, eyeY, eyeSize, eyeSize);
    ctx.fillRect(pos.x + w * 0.55, eyeY, eyeSize, eyeSize);

    ctx.fillStyle = '#000';
    const pupilSize = eyeSize * 0.4;
    ctx.fillRect(pos.x + w * 0.25 + eyeSize * 0.3, eyeY + eyeSize * 0.3, pupilSize, pupilSize);
    ctx.fillRect(pos.x + w * 0.6 + eyeSize * 0.3, eyeY + eyeSize * 0.3, pupilSize, pupilSize);
}

function drawGhost() {
    if (!game.showGhost || game.ghostIndex >= game.ghostPlayback.length) return;
    const ghostState = game.ghostPlayback[game.ghostIndex];
    const ctx = game.ctx;
    const pos = worldToScreen(ghostState.x, ghostState.y);
    const w = player.w * game.scale;
    const h = player.h * game.scale;
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#888';
    ctx.fillRect(pos.x, pos.y, w, h);
    ctx.globalAlpha = 1;
    game.ghostIndex++;
}

function drawMomentumBar() {
    if (!player.charging || !player.grounded) return;
    const ctx = game.ctx;
    const pos = worldToScreen(player.x + player.w / 2, player.y - 20);
    const barWidth = 50 * game.scale;
    const barHeight = 8 * game.scale;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(pos.x - barWidth / 2, pos.y, barWidth, barHeight);

    const fillWidth = barWidth * player.momentum;
    const chargeTime = game.totalTime - player.chargeStartTime;

    if (chargeTime >= MOMENTUM_CHARGE_TIME) {
        ctx.fillStyle = '#fbbf24';
    } else {
        ctx.fillStyle = '#4ade80';
    }

    ctx.fillRect(pos.x - barWidth / 2, pos.y, fillWidth, barHeight);
}

function drawParticles() {
    const ctx = game.ctx;

    for (const p of particles.trail) {
        const pos = worldToScreen(p.x, p.y);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = '#ef4444';
        const size = p.size * game.scale;
        ctx.fillRect(pos.x - size / 2, pos.y - size / 2, size, size);
    }
    ctx.globalAlpha = 1;

    for (const p of particles.landing) {
        const pos = worldToScreen(p.x, p.y);
        const alpha = p.life / p.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        const size = p.size * game.scale;
        ctx.fillRect(pos.x - size / 2, pos.y - size / 2, size, size);
    }
    ctx.globalAlpha = 1;
}

function drawRespawnFade() {
    if (game.state !== GameState.RESPAWNING) return;
    const ctx = game.ctx;
    ctx.fillStyle = `rgba(0, 0, 0, ${game.respawnFadeAlpha})`;
    ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
}

function render() {
    const ctx = game.ctx;
    ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    drawBackground();

    for (const tile of world.tiles) {
        drawTile(tile);
    }

    drawParticles();
    drawGhost();
    drawPlayer();
    drawMomentumBar();
    drawRespawnFade();
}

// ============================================================================
// UPDATE LOOP
// ============================================================================

function update(dt) {
    if (game.state === GameState.PAUSED || game.state === GameState.MENU) return;

    if (game.state === GameState.RESPAWNING) {
        game.respawnTimer -= dt;
        if (game.respawnTimer > 0.5) {
            game.respawnFadeAlpha = (1 - game.respawnTimer) * 2;
        } else if (game.respawnTimer > 0) {
            game.respawnFadeAlpha = game.respawnTimer * 2;
            if (game.respawnTimer < 0.5 && player.x !== game.checkpointState?.playerX) {
                respawnPlayer();
            }
        } else {
            game.respawnFadeAlpha = 0;
            game.state = GameState.PLAYING;
        }
        return;
    }

    updateMomentum();

    if (!player.grounded) {
        player.vy += GRAVITY * dt;
    }

    if (player.grounded) {
        player.vx *= GROUND_FRICTION;
        if (Math.abs(player.vx) < 0.5) player.vx = 0;
    }

    player.lastX = player.x;
    player.lastY = player.y;

    player.x += player.vx * dt;
    player.y += player.vy * dt;

    resolveCollisions();

    if (player.grounded) {
        player.groundedGrace = 0.12;
    } else {
        player.groundedGrace = Math.max(0, player.groundedGrace - dt);
    }

    if (player.y > VOID_Y) {
        playerDeath();
        return;
    }

    updateCamera();
    ensureLevels();
    checkCheckpoints();
    pruneLevels();

    game.difficulty += DIFFICULTY_TIME_RATE * dt * game.difficultyMultiplier;

    addTrailParticle();
    updateParticles(dt);

    if (game.checkpointState && game.ghostBuffer.length < 500) {
        game.ghostBuffer.push({ x: player.x, y: player.y });
    }

    updateHUD();
}

// ============================================================================
// RESIZE HANDLING
// ============================================================================

function resizeCanvas() {
    const container = document.getElementById('game-container');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const targetRatio = WORLD_WIDTH / WORLD_HEIGHT;

    let canvasHeight = containerHeight;
    // let canvasWidth = canvasHeight * targetRatio;
    let canvasWidth = containerWidth;

    if (canvasWidth > containerWidth) {
        canvasWidth = containerWidth;
        canvasHeight = canvasWidth / targetRatio;
    }

    game.canvas.width = canvasWidth;
    game.canvas.height = canvasHeight;

    game.scale = (canvasHeight / WORLD_HEIGHT) * 0.75;
}

// ============================================================================
// MAIN GAME LOOP
// ============================================================================

function gameLoop(currentTime) {
    const time = currentTime / 1000;
    game.deltaTime = Math.min(time - game.lastTime, 0.1);
    game.lastTime = time;
    game.totalTime += game.deltaTime;

    update(game.deltaTime);
    render();

    requestAnimationFrame(gameLoop);
}

// ============================================================================
// INITIALIZATION
// ============================================================================

function init() {
    game.canvas = document.getElementById('game-canvas');
    game.ctx = game.canvas.getContext('2d');

    game.bestScore = parseInt(localStorage.getItem('momentumJumperBest')) || 0;

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    setupInput();
    setupMenuScreens();

    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('pause-btn').addEventListener('click', pauseGame);
    document.getElementById('resume-btn').addEventListener('click', resumeGame);
    document.getElementById('lobby-btn').addEventListener('click', returnToLobby);

    const dMultSlider = document.getElementById('d-multiplier');
    const dMultValue = document.getElementById('d-mult-value');
    dMultSlider.addEventListener('input', () => {
        game.difficultyMultiplier = parseFloat(dMultSlider.value);
        dMultValue.textContent = game.difficultyMultiplier.toFixed(1);
    });

    updateStartScreen();

    game.lastTime = performance.now() / 1000;
    requestAnimationFrame(gameLoop);
}

document.addEventListener('DOMContentLoaded', init);
