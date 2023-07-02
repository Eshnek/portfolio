// All rights reserved.

import * as PIXI from 'pixi.js';

//-//

type Vec2 = Vec2;

//-//

const COLORS = {
    GREEN_0: 0xBDCC92,
    GREEN_1: 0x7CCB6C,
    GREEN_2: 0x55AA65,
    GREEN_3: 0x408458,
    GREEN_4: 0x29674F,

    FRUIT_0: 0xE65247,

    SNAKE_0: 0x081336,

    DARK_BLUE: 0x053C5E,
};

const BACKGROUND_COLOR = COLORS.GREEN_4;

const BORDER_RADIUS = 4;

const SQUARE_SIZE = 22;
const SQUARE_GAP = 6;
const SQUARE_SIZE_PADDED = SQUARE_SIZE + SQUARE_GAP;

const HOVER_MARGIN = 8;

const MAX_FPS = 30;

//-//

let Target: HTMLElement;

let GridDimensions: Vec2 = [0, 0];
let TotalGridDimensions: number = 0;

let CursorPosition: Vec2 = [-1024, -1024];
let CursorWasInside: boolean = false;

const EdgePadding: Vec2 = [0, 0];
const Squares: Square[][] = [];

enum Stage {
    Initial,
    Waiting,
};
let CurrentStage: Stage = Stage.Initial;

let Game: SnakeGame | null = null;
let GameQueued: boolean = false;

//-//

export function go(target: HTMLElement): void {
    Target = target;

    const app: PIXI.Application = createApp();
    const graphics: PIXI.Graphics = createGraphics(app);

    // graphics.lineStyle(2, 0x00F, 1);

    generateSquares(app, graphics);

    hookMousePosition(app);
    addTicker(app, graphics);
}

//-//

function createApp(): PIXI.Application {
    const renderer = createRenderer();
    const app = new PIXI.Application({
        background: BACKGROUND_COLOR,
        resizeTo: Target,
        view: renderer.view,
    });

    Target.appendChild(app.view);

    return app;
}
function createRenderer(): PIXI.Renderer {
    const renderer = new PIXI.Renderer({ antialias: true });

    return renderer;
}
function createGraphics(app: PIXI.Application): PIXI.Graphics {
    const graphics = new PIXI.Graphics();

    app.stage.addChild(graphics);

    return graphics;
}

//-//

function generateSquares(app: PIXI.Application, graphics: PIXI.Graphics): void {
    storeGridDimensions(app);
    applyPadding(app);

    iterateGridDimensions(addSquare);
}
function storeGridDimensions(app: PIXI.Application): void {
    GridDimensions = computeGridDimensions(app);

    TotalGridDimensions = GridDimensions[0] * GridDimensions[1];
}
function computeGridDimensions(app: PIXI.Application): Vec2 {
    const width = Math.floor(app.view.width / SQUARE_SIZE_PADDED);
    const height = Math.floor(app.view.height / SQUARE_SIZE_PADDED);

    return [width, height];
}
function applyPadding(app: PIXI.Application): void {
    const [xCount, yCount] = GridDimensions;

    EdgePadding[0] = computeEdgePadding(xCount, app.view.width);
    EdgePadding[1] = computeEdgePadding(yCount, app.view.height);
}
// Width also means height.
function computeEdgePadding(squareCount: number, totalWidth: number): number {
    const length = (squareCount * SQUARE_SIZE_PADDED) - SQUARE_GAP;
    const padding = (totalWidth - length) / 2;

    return padding;
}

function addSquare(x: number, y: number): void {
    if (Squares[y] === undefined) {
        Squares[y] = [];
    }

    Squares[y][x] = makePaddedSquare(x, y);
}
function makePaddedSquare(x: number, y: number): Square {
    return new Square(x, y);
}

//-//

function addTicker(app: PIXI.Application, graphics: PIXI.Graphics): void {
    const ticker = app.ticker.add((deltaMs) => {
        const delta = deltaMs / 1000;

        if (shouldPlayGame()) {
            tickGame(delta);

            graphics.clear();

            iterateSquares((square: Square) => {
                square.draw(graphics, delta);
            });
        }
    })

    ticker.maxFPS = MAX_FPS;
    ticker.speed = 1;
}
function tickGame(delta: number): void {
    if (GameQueued) {
        newGame();
    }

    if (Game !== null) {
        Game.tick(delta);
    }
}

//-//

function hookMousePosition(app: PIXI.Application): void {
    addEventListener('mousemove', (event) => {
        const targetBounds = Target.getBoundingClientRect();

        const x = event.x - targetBounds.x;
        const y = event.y - targetBounds.y;

        CursorPosition = [x, y];
    });
}
function shouldPlayGame(): boolean {
    return cursorIsInside() || CurrentStage === Stage.Initial;
}
function cursorIsInside(): boolean {
    const xInside = isWithinView(0, Target.clientWidth);
    const yInside = isWithinView(1, Target.clientHeight);

    const inside = xInside && yInside;

    checkWasInside(inside);

    return inside;
}
function isWithinView(index: number, size: number): boolean {
    return CursorPosition[index] >= 0 && CursorPosition[index] < size;
}
function checkWasInside(inside: boolean): void {
    if (CursorWasInside !== inside) {
        CursorWasInside = inside;

        console.log(`[snake] [${inside}]`);

        if (inside) {
            onCursorBeginInside();
        }
    }
}
function onCursorBeginInside(): void {
    newGame();
}
function newGame(): void {
    console.log('[snake] [new game]')

    Game = new SnakeGame();
    GameQueued = false;
}
function queueNewGame(): void {
    GameQueued = true;
}

//-//

class Square {
    public x: number = 0;
    public y: number = 0;

    public color: number = 0;

    private scale: Ease = new Ease(16., 1., 0.5);

    private randomColor: number = 0x0;

    private static smallScale: number = 0.95;
    private static largeScale: number = 1.15;

    private static reached: number = 0;

    constructor(public gridX: number, public gridY: number) {
        this.storeXY();

        this.setColor();
    }
    private storeXY(): void {
        this.x = this.gridX * SQUARE_SIZE_PADDED;
        this.y = this.gridY * SQUARE_SIZE_PADDED;
    }
    private setColor(): void {
        this.storeRandomColor();

        this.color = this.randomColor;
    }
    private storeRandomColor(): void {
        const random = Math.floor(Math.random() * 4);

        this.randomColor = COLORS[`GREEN_${random}` as keyof typeof COLORS];
    }

    public draw(graphics: PIXI.Graphics, delta: number): void {
        this.adjustTargetScale();

        this.startFill(graphics);
        this.drawRectangle(graphics, delta);
        this.stopFill(graphics);
    }
    private adjustTargetScale(): void {
        if (this.isCursorOver()) {
            this.scale.setTarget(Square.largeScale);
        } else {
            this.scale.setTarget(1.);
        }
    }
    private startFill(graphics: PIXI.Graphics): void {
        graphics.beginFill(this.color, 1);
    }
    private drawRectangle(graphics: PIXI.Graphics, delta: number): void {
        const offsets = this.computeScaleOffsets(delta);
        const xywh = this.computeBlockXYWHOffsets(offsets);

        graphics.drawRoundedRect(
            this.x + xywh[0],
            this.y + xywh[1],
            xywh[2],
            xywh[3],
            BORDER_RADIUS
        );
    }
    private stopFill(graphics: PIXI.Graphics): void {
        graphics.endFill();
    }
    private computeScaleOffsets(delta: number = 0): Vec2 {
        const newScale = this.get(delta);

        const diff = SQUARE_SIZE * (1 - (1 / newScale));

        return [diff, diff * 2];
    }
    private computeBlockXYWHOffsets(offsets: Vec2): [number, number, number, number] {
        return [
            EdgePadding[0] - offsets[0],
            EdgePadding[1] - offsets[0],
            SQUARE_SIZE + offsets[1],
            SQUARE_SIZE + offsets[1],
        ];
    }

    private get(delta: number): number {
        const r = this.scale.get(delta);

        this.progressInitialStage();

        return r;
    }

    private progressInitialStage(): void {
        if (CurrentStage === Stage.Initial && this.scale.isComplete()) {
            Square.reached++;

            if (Square.reached === TotalGridDimensions) {
                Square.initialStageComplete();
            }
        }
    }
    private static initialStageComplete(): void {
        CurrentStage = Stage.Waiting;

        Square.increaseSquareScaleRates();

        console.log('Initial stage complete.');
    }
    private static increaseSquareScaleRates(): void {
        iterateSquares((square: Square) => {
            square.scale.rate *= 6;
        });
    }

    private isCursorOver(): boolean {
        return Square.getIsOverAxes(this.getPaddedXY(), HOVER_MARGIN);
    }
    private getPaddedXY(): Vec2 {
        return [
            this.x + EdgePadding[0],
            this.y + EdgePadding[1],
        ];
    }
    private static getIsOverAxes([xPos, yPos]: Vec2, extraMargin: number = 0): boolean {
        return Square.isCursorOverAxis(0, xPos, extraMargin) &&
            Square.isCursorOverAxis(1, yPos, extraMargin);
    }
    private static isCursorOverAxis(index: number, position: number, extraMargin: number = 0): boolean {
        return (CursorPosition[index] >= position - extraMargin) &&
            (CursorPosition[index] < position + SQUARE_SIZE + extraMargin);
    }

    private static isOnEdge(position: number, total: number): boolean {
        const atStart = position === 0;
        const atEnd = position === (total - 1);

        return atStart || atEnd;
    }
};

//-//

class Ease {
    private static SmallThreshold = 0.001;

    private start_: number = 0;
    private current_: number = 0;

    constructor(
        public rate: number,
        private target_: any,
        private progress_: number = 0
    ) {
    }

    public get(delta: number): any {
        if (delta === 0) {
            return this.getCurrent();
        }

        return this.get_(delta);
    }
    private get_(delta: number) {
        const change = delta * this.rate;

        this.progress_ += change;
        this.progress_ = Math.max(Math.min(this.progress_, 1.), 0.);

        const range = this.target_ - this.start_;
        this.current_ = this.start_ + (range * this.progress_);

        //TODO
        /*if (
            this.progress_ < Ease.SmallThreshold ||
            1. - this.progress_ < Ease.SmallThreshold
        ) {
            this.progress_ = 1.;
        }*/

        return this.current_;
    }
    public getCurrent(): any {
        return this.current_;
    }

    public setTarget(newTarget: any): void {
        if (this.target_ === newTarget) {
            return;
        }

        this.start_ = this.current_;
        this.target_ = newTarget;
        this.progress_ = 0;
    }

    public isComplete(): boolean {
        return this.progress_ === 1.;
    }
}

//-//

class SnakeGame {

    public static BlankColor = COLORS.GREEN_1;

    public static ScaleRate = 1.05;

    public fruit: Vec2 | null = null;
    public snake: any = [];

    private budget: number = 0;
    // Moves Per Second
    private mps: number = 24;

    constructor() {
        SnakeGame.clearSquareColors();

        this.newFruit();
        this.newSnake();
    }

    public tick(delta: number): void {
        this.applyTickBudget(delta);

        this.applyTickMovements(delta);
    }
    private applyTickBudget(delta: number): void {
        this.budget += delta;
    }
    private applyTickMovements(delta: number): void {
        const mps_ = 1 / this.mps;

        if (this.budget > mps_) {
            this.budget -= mps_;

            this.tick_();
        }
    }
    private tick_(): void {
        this.moveSnake();
    }

    public increaseDifficulty(): void {
        this.mps *= SnakeGame.ScaleRate;

        console.log('[snake] Increasing speed to ' + this.mps);
    }

    private moveSnake(): void {
        const oldSnake = structuredClone(this.snake);

        this.moveSnake_(this.getSnakeMovement());

        this.unapplySnake(oldSnake);
        this.applySnake();
    }
    private getSnakeMovement(): Vec2 {
        const snakeScreenXY = gridToScreen(this.snake![0]);
        let diff: Vec2 = [
            CursorPosition[0] - snakeScreenXY[0],
            CursorPosition[1] - snakeScreenXY[1]
        ];

        const positive = diff.map(v => v >= 0);

        diff = diff.map(v => Math.abs(v));

        return SnakeGame.computeSnakeMovement(diff, positive);
    }
    private static computeSnakeMovement(diff: Vec2, positive: Vec2): Vec2 {
        if (diff[0] > diff[1]) {
            if (positive[0]) {
                return [1,0];
            } else {
                return [-1,0];
            }
        } else {
            if (positive[1]) {
                return [0,1];
            } else {
                return [0,-1];
            }
        }
    }
    private moveSnake_(movement: Vec2): void {
        const oldHeadXY = this.snake![0];
        const newHeadXY: Vec2 = [oldHeadXY[0] + movement[0], oldHeadXY[1] + movement[1]];

        this.snake.unshift(newHeadXY);

        if (this.isSnakeOutOfBounds()) {
            this.snake.shift();

            return queueNewGame();
        }

        if (this.isFruitOverlapping(newHeadXY)) {
            this.newFruit();
            this.increaseDifficulty();
        } else {
            this.snake.pop();
        }

        if (
            this.isSnakeOverlapping()
        ) {
            queueNewGame();
        }
    }
    private isSnakeOverlapping(): boolean {
        for(const outerXY of this.snake) {
            let contents = -1;

            for(const innerXY of this.snake) {
                if (outerXY[0] === innerXY[0] && outerXY[1] === innerXY[1]) {
                    contents++;
                }
            }

            if (contents !== 0) {
                return true;
            }
        }

        return false;
    }
    private isSnakeOutOfBounds(): boolean {
        const [x, y] = this.snake![0];

        return (
            x < 0 || x >= GridDimensions[0] ||
            y < 0 || y >= GridDimensions[1]
        );
    }

    private newFruit(): void {
        const oldFruit = structuredClone(this.fruit);

        this.fruit = this.generateRandomGridXY();

        this.unapplyFruit(oldFruit);
        this.applyFruit();
    }
    private applyFruit(): void {
        Squares[this.fruit![1]][this.fruit![0]].color = COLORS.FRUIT_0;
    }
    private unapplyFruit(oldFruit: any): void {
        if (oldFruit === null) {
            return;
        }

        Squares[oldFruit![1]][oldFruit![0]].color = COLORS.FRUIT_0;
    }
    private isFruitOverlapping(gridXY: Vec2): boolean {
        return this.fruit![0] === gridXY[0] &&
            this.fruit![1] === gridXY[1];
    }

    private newSnake(): void {
        this.snake.push(this.generateRandomGridXY());

        this.applySnake();
    }
    private applySnake(): void {
        for (const xy of this.snake!) {
            Squares[xy![1]][xy![0]].color = COLORS.SNAKE_0;
        }
    }
    private unapplySnake(oldSnake: any): void {
        for (const xy of oldSnake) {
            Squares[xy![1]][xy![0]].color = SnakeGame.BlankColor;
        }
    }

    private generateRandomGridXY(): Vec2 {
        do {
            const result: Vec2 = SnakeGame.randomGridXY();

            if (!SnakeGame.isSquareOccupied(result)) {
                return result;
            }
        } while(true); // TODO
    }
    private static randomGridXY(): Vec2 {
        return [SnakeGame.randomGridX(), SnakeGame.randomGridY()];
    }
    private static randomGridX(): number {
        return SnakeGame.randomGrid_(0);
    }
    private static randomGridY(): number {
        return SnakeGame.randomGrid_(1);
    }
    private static randomGrid_(axis: number): number {
        return Math.floor(Math.random() * GridDimensions[axis]);
    }
    private static isSquareOccupied([x, y]: Vec2): boolean {
        return Squares[y][x].color !== SnakeGame.BlankColor;
    }

    private static clearSquareColors(): void {
        iterateSquares((square: Square) => {
            square.color = SnakeGame.BlankColor;
        });
    }

};

//-//

function iterateGridDimensions(functor: (x: number, y: number) => void): void {
    for (let y = 0; y < GridDimensions[1]; y++) {
        for (let x = 0; x < GridDimensions[0]; x++) {
            functor(x, y);
        }
    }
}
function iterateSquares(functor: (square: Square) => void): void {
    for (const squareY of Squares) {
        for (const square of squareY) {
            functor(square);
        }
    }
}

function gridToScreen(xy: Vec2): Vec2 {
    return [
        gridToScreenAxis(0, xy),
        gridToScreenAxis(1, xy),
    ]
}
function gridToScreenAxis(axis: number, xy: Vec2): number {
    return EdgePadding[axis] + (xy[axis] * SQUARE_SIZE_PADDED);
}
