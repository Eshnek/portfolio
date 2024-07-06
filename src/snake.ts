// All rights reserved.

import * as PIXI from 'pixi.js';

//-//

type Vec2 = [number, number];
type Vec4 = [number, number, number, number];

//-//

const COLORS = {
    GREEN_0: 0xBDCC92,
    GREEN_1: 0x7CCB6C,
    GREEN_2: 0x55AA65,
    GREEN_3: 0x408458,
    GREEN_4: 0x29674F,

    FRUIT_0: 0xC95249,

    SNAKE_0: 0x274270,
    SNAKE_1: 0x0D3C69,
    SNAKE_2: 0x701E31,

    DARK_BLUE_0: 0x053C5E,
    WHITE_0: 0xcfcfcf,
};

const BACKGROUND_COLOR = COLORS.GREEN_4;

const BORDER_RADIUS = 4;
const EYE_RADIUS = 3;

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

    Target.appendChild(app.view as unknown as Node);

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
            renderGame(graphics, delta);
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
function renderGame(graphics: PIXI.Graphics, delta: number): void {
    graphics.clear();

    iterateSquares((square: Square) => {
        square.draw(graphics, delta);
    });
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
    if (CursorWasInside === inside) {
        return;
    }

    CursorWasInside = inside;

    console.log(`[snake] [${inside}]`);

    if (inside) {
        onCursorBeginInside();
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
    public static smallScale: number = 0.95;
    public static largeScale: number = 1.15;

    public x: number = 0;
    public y: number = 0;

    public color: number = 0;
    public eyeColor: number = COLORS.WHITE_0;
    public scaleMultiple: number = 1.;
    public eye: boolean = false;

    private scale: Ease = new Ease(16., 1., 0.5);

    private randomColor: number = 0x0;

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
        this.drawPrimary(graphics, delta);
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
    private drawPrimary(graphics: PIXI.Graphics, delta: number): void {
        const offsets = this.computeScaleOffsets(delta);
        const xywh = this.computeBlockXYWHOffsets(offsets);

        this.drawBody(graphics, xywh);
        this.drawEye(graphics, xywh);
    }
    private drawBody(graphics: PIXI.Graphics, xywh: Vec4): void {
        graphics.drawRoundedRect(
            this.x + xywh[0],
            this.y + xywh[1],
            xywh[2],
            xywh[3],
            BORDER_RADIUS
        );
    }
    private drawEye(graphics: PIXI.Graphics, xywh: Vec4): void {
        if (!this.eye) {
            return;
        }

        graphics.beginFill(this.eyeColor, 1);

        graphics.drawCircle(
            this.x + xywh[0] + 9,
            this.y + xywh[1] + 9,
            EYE_RADIUS * this.computeScale()
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
    private computeBlockXYWHOffsets(offsets: Vec2): Vec4 {
        return [
            EdgePadding[0] - offsets[0],
            EdgePadding[1] - offsets[0],
            SQUARE_SIZE + offsets[1],
            SQUARE_SIZE + offsets[1],
        ];
    }

    private get(delta: number): number {
        const r = this.computeScale(delta);

        this.progressInitialStage();

        return r;
    }
    private computeScale(delta: number = 0): number {
        return this.scale.get(delta) * this.scaleMultiple;
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

        this.addClampedProgress(change);

        this.storeProgressiveRange();

        return this.current_;
    }
    private addClampedProgress(change: number): void {
        this.progress_ += change;
        this.progress_ = Math.max(Math.min(this.progress_, 1.), 0.);
    }
    private storeProgressiveRange(): void {
        const range = this.target_ - this.start_;

        this.current_ = this.start_ + (range * Ease.curve(this.progress_));
    }
    private static curve(x: number): number {
        // https://easings.net/#easeInOutQuint

        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
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

    public static BlankColorA = COLORS.GREEN_2;
    public static BlankColorB = COLORS.GREEN_3;

    public static ScaleRate = 1.05;

    public fruit: Vec2 | null = null;
    public snake: any = [];

    private budget: number = 0;
    // Moves Per Second
    private mps: number = 24;

    constructor() {
        SnakeGame.clearSquareColors();
        SnakeGame.clearSquareScales();
        SnakeGame.clearSquareEyes();

        this.newFruit();
        this.newSnake();
    }

    public tick(delta: number): void {
        this.applyTickBudget(delta);

        this.applyTickMovements();
    }
    private applyTickBudget(delta: number): void {
        this.budget += delta;
    }
    private applyTickMovements(): void {
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

        this.unapplyHeadEye(oldSnake);
        this.unapplyHeadScale(oldSnake);
        this.unapplySnake(oldSnake);

        this.applyToSnake();
    }
    private applyToSnake(): void {
        this.applySnake();
        this.applyHeadScale();
        this.applyHeadEye();
    }
    private getSnakeMovement(): Vec2 {
        const snakeScreenXY = gridToScreen(this.snake![0]);
        let diff: Vec2 = [
            CursorPosition[0] - snakeScreenXY[0],
            CursorPosition[1] - snakeScreenXY[1]
        ];

        const positive = diff.map((v: number) => v >= 0) as unknown as Vec2;

        diff = diff.map((v: number) => Math.abs(v)) as Vec2;

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
            if (this.isSnakeOverlappingInner_(outerXY)) {
                return true;
            }
        }

        return false;
    }
    private isSnakeOverlappingInner_([outX, outY]: Vec2): boolean {
        let contents = -1;

        for(const [inX, inY] of this.snake) {
            if (outX === inX && outY === inY) {
                contents++;
            }
        }

        return contents !== 0;
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
        const [x, y] = this.fruit!;

        Squares[y][x].color = COLORS.FRUIT_0;
        Squares[y][x].scaleMultiple = Square.largeScale;
    }
    private unapplyFruit(oldFruit: any): void {
        if (oldFruit === null) {
            return;
        }

        const [oldX, oldY] = oldFruit;
        Squares[oldY][oldX].color = COLORS.FRUIT_0;
        Squares[oldY][oldX].scaleMultiple = 1.;
    }
    private isFruitOverlapping([gridX, gridY]: Vec2): boolean {
        const [fruitX, fruitY] = this.fruit!;

        return fruitX === gridX && fruitY === gridY;
    }

    private newSnake(): void {
        this.snake.push(this.generateRandomGridXY());

        this.applyToSnake();
    }
    private applySnake(): void {
        let index = [-1];

        for (const [x, y] of this.snake!) {
            Squares[y][x].color = SnakeGame.color(index);
        }
    }
    private static color(index: number[]): number {
        index[0]++;

        if (index[0] === 0) {
            return COLORS.SNAKE_0;
        } else if (index[0] % 2 === 0) {
            return COLORS.SNAKE_1;
        } else {
            return COLORS.SNAKE_2;
        }
    }
    private unapplySnake(oldSnake: any): void {
        for (const [x, y] of oldSnake) {
            Squares[y][x].color = SnakeGame.computeGrassColor(x, y);
        }
    }
    private static computeGrassColor(x: number, y: number): number {
        return x % 2 === 0 || y % 2 === 0 ? SnakeGame.BlankColorA : SnakeGame.BlankColorB;
    }

    private applyHeadScale(): void {
        const [x, y] = this.snake![0];

        Squares[y][x].scaleMultiple = Square.largeScale;
    }
    private unapplyHeadScale(oldSnake: any): void {
        const [x, y] = oldSnake![0];

        Squares[y][x].scaleMultiple = 1.;
    }

    private applyHeadEye(): void {
        const [x, y] = this.snake![0];

        Squares[y][x].eye = true;
    }
    private unapplyHeadEye(oldSnake: any): void {
        const [x, y] = oldSnake![0];

        Squares[y][x].eye = false;
    }

    private generateRandomGridXY(): Vec2 {
        do {
            const result: Vec2 = SnakeGame.randomGridXY();

            if (!SnakeGame.isSquareOccupied(result)) {
                return result;
            }
        } while(true);
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
        return Squares[y][x].color !== SnakeGame.computeGrassColor(x, y);
    }

    private static clearSquareColors(): void {
        iterateSquares((square: Square) => {
            square.color = SnakeGame.computeGrassColor(square.gridX, square.gridY);
        });
    }
    private static clearSquareScales(): void {
        iterateSquares((square: Square) => {
            square.scaleMultiple = 1.;
        });
    }
    private static clearSquareEyes(): void {
        iterateSquares((square: Square) => {
            square.eye = false;
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
