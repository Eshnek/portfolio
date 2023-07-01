import * as PIXI from 'pixi.js';

//-//

const COLORS = {
    GREEN_0: 0xBDCC92,
    GREEN_1: 0x7CCB6C,
    GREEN_2: 0x55AA65,
    GREEN_3: 0x408458,
    GREEN_4: 0x29674F,

    DARK_BLUE: 0x053C5E,
};

const BACKGROUND_COLOR = COLORS.GREEN_4;

const BORDER_RADIUS = 4;

const SQUARE_SIZE = 22;
const SQUARE_GAP = 6;
const SQUARE_SIZE_PADDED = SQUARE_SIZE + SQUARE_GAP;

const MAX_FPS = 30;

//-//

let Target: HTMLElement;

let GridDimensions: [number, number] = [0, 0];
let TotalGridDimensions: number = 0;

let CursorPosition: [number, number] = [-1, -1];
let CursorWasInside: boolean = false;

const EdgePadding: [number, number] = [0, 0];
const Squares: Square[][] = [];

enum Stage {
    Initial,
    Waiting,
};
let stage: Stage = Stage.Initial;

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
function computeGridDimensions(app: PIXI.Application): [number, number] {
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
    app.ticker.add((deltaMs) => {
        const delta = deltaMs / 1000;

        if (shouldIterateSquares()) {
            iterateSquares((square: Square) => {
                square.draw(graphics, delta);
            });
        }
    }).maxFPS = MAX_FPS;
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
function shouldIterateSquares(): boolean {
    return cursorIsInside() || stage === Stage.Initial;
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

        console.log(`Cursor inside: ${inside}`);
    }
}

//-//

class Square {
    public x: number = 0;
    public y: number = 0;

    private scale: Ease = new Ease(16., 1., 0.5);

    private randomColor: number = 0x0;

    private static smallScale: number = 0.95;
    private static largeScale: number = 1.10;

    private static reached: number = 0;

    constructor(public gridX: number, public gridY: number) {
        this.storeXY();
        this.storeRandomColor();
    }
    private storeXY(): void {
        this.x = this.gridX * SQUARE_SIZE_PADDED;
        this.y = this.gridY * SQUARE_SIZE_PADDED;
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
            console.log('To large');
            this.scale.setTarget(Square.largeScale);
        } else {
            // this.scale.setTarget(1.);
        }
    }
    private startFill(graphics: PIXI.Graphics): void {
        // graphics.beginFill(COLORS.GREEN_0, 1);

        graphics.beginFill(this.randomColor, 1);
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
    private computeScaleOffsets(delta: number = 0): [number, number] {
        const newScale = this.get(delta);

        const diff = SQUARE_SIZE * (1 - (1 / newScale));

        return [diff, diff * 2];
    }
    private computeBlockXYWHOffsets(offsets: [number, number]): [number, number, number, number] {
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
        if (stage === Stage.Initial && this.scale.isComplete()) {
            Square.reached++;

            if (Square.reached === TotalGridDimensions) {
                Square.initialStageComplete();
            }
        }
    }
    private static initialStageComplete(): void {
        stage = Stage.Waiting;

        console.log('Initial stage complete.');
    }

    private isCursorOver(): boolean {
        const offsets = this.computeScaleOffsets();
        const xywh = this.computeBlockXYWHOffsets(offsets);

        // console.log(`${CursorPosition[0]}, ${xywh[0]}, ${xywh[2]}`);
        // console.log(`(${CursorPosition[0]}, ${CursorPosition[1]})`);

        const xPos = this.x - xywh[0];
        const yPos = this.y - xywh[1];

        const xOver = CursorPosition[0] >= xPos && CursorPosition[0] < xPos + xywh[2];
        const yOver = CursorPosition[1] >= yPos && CursorPosition[1] < yPos + xywh[3];

        /*if (xOver || yOver){
            console.log(`Mouse over: (${this.gridX}, ${this.gridY})`);
        }*/

        return xOver && yOver;
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

        console.log(`Target is ${this.target_}, progress is ${this.progress_}. Returning ${this.current_}`);

        return this.current_;
    }
    public getCurrent(): any {
        return this.current_;
    }

    public setTarget(newTarget: any): void {
        if (this.target_ === newTarget) {
            return;
        }

        // console.log(`Reassign target to ${this.target_}`);

        this.start_ = this.current_;
        this.target_ = newTarget;
        this.progress_ = 0;
    }

    public isComplete(): boolean {
        return this.progress_ === 1.;
    }
}

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
