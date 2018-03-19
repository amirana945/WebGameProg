
export enum ScreenOrientation {
    PORTRAIT,
    LANDSCAPE
}

export class ScreenMetrics {
    windowWidth: number;
    windowHeight: number;

    defaultGameWidth: number;
    defaultGameHeight: number;

    maxGameWidth: number;
    maxGameHeight: number;

    gameWidth: number;
    gameHeight: number;

    scaleX: number;
    scaleY: number;

    offsetX: number;
    offsetY: number;
}

export class ScreenUtils {
    public static screenMetrics: ScreenMetrics;

    public static calculateScreenMetrics(defaultWidth: number, defaultHeight: number, orientation: ScreenOrientation = ScreenOrientation.LANDSCAPE, maxGameWidth?: number, maxGameHeight?: number): ScreenMetrics {
       
        this.screenMetrics = new ScreenMetrics();

        this.screenMetrics.windowWidth = window.innerWidth;
        this.screenMetrics.windowHeight = window.innerHeight;

        this.screenMetrics.defaultGameWidth = defaultWidth;
        this.screenMetrics.defaultGameHeight = defaultHeight;

        // Swap width and height if necessary to match the specified orientation
        let dimensionsOppositeForLandscape: boolean = ((this.screenMetrics.windowWidth < this.screenMetrics.windowHeight) && orientation === ScreenOrientation.LANDSCAPE);
        let dimensionsOppositeForPortrait: boolean = ((this.screenMetrics.windowHeight < this.screenMetrics.windowWidth) && orientation === ScreenOrientation.PORTRAIT);

        if (dimensionsOppositeForLandscape || dimensionsOppositeForPortrait) {
            [this.screenMetrics.windowWidth, this.screenMetrics.windowHeight] = [this.screenMetrics.windowHeight, this.screenMetrics.windowWidth];
        }

        // Calculate the max width and max height if not provided; ratios are based off iPad (4:3) and iPhone 5+ (16:9) as the extremes in both width and height
        if (!maxGameWidth || !maxGameHeight) {
            if (orientation === ScreenOrientation.LANDSCAPE) {
                this.screenMetrics.maxGameWidth = Math.round(this.screenMetrics.defaultGameWidth * (MAX_GAME_WIDTH / DEFAULT_GAME_WIDTH));
                this.screenMetrics.maxGameHeight = Math.round(this.screenMetrics.defaultGameHeight * (MAX_GAME_HEIGHT / DEFAULT_GAME_HEIGHT));
            } else {
                this.screenMetrics.maxGameWidth = Math.round(this.screenMetrics.defaultGameWidth * (MAX_GAME_HEIGHT / DEFAULT_GAME_HEIGHT));
                this.screenMetrics.maxGameHeight = Math.round(this.screenMetrics.defaultGameHeight * (MAX_GAME_WIDTH / DEFAULT_GAME_WIDTH));
            }
        } else {
            this.screenMetrics.maxGameWidth = maxGameWidth;
            this.screenMetrics.maxGameHeight = maxGameHeight;
        }

        let defaultAspectRatio: number = ((orientation === ScreenOrientation.LANDSCAPE) ? (DEFAULT_GAME_WIDTH / DEFAULT_GAME_HEIGHT) : (DEFAULT_GAME_HEIGHT / DEFAULT_GAME_WIDTH));
        let windowAspectRatio: number = (this.screenMetrics.windowWidth / this.screenMetrics.windowHeight);

        if (windowAspectRatio > defaultAspectRatio) {
            this.screenMetrics.gameHeight = this.screenMetrics.defaultGameHeight;
            this.screenMetrics.gameWidth = (Math.ceil((this.screenMetrics.gameHeight * windowAspectRatio) * 0.5) * 2);
            this.screenMetrics.gameWidth = Math.min(this.screenMetrics.gameWidth, this.screenMetrics.maxGameWidth);

            this.screenMetrics.offsetX = ((this.screenMetrics.gameWidth - this.screenMetrics.defaultGameWidth) * 0.5);
            this.screenMetrics.offsetY = 0;
        } else {
            this.screenMetrics.gameWidth = this.screenMetrics.defaultGameWidth;
            this.screenMetrics.gameHeight = (Math.ceil((this.screenMetrics.gameWidth / windowAspectRatio) * 0.5) * 2);
            this.screenMetrics.gameHeight = Math.min(this.screenMetrics.gameHeight, this.screenMetrics.maxGameHeight);

            this.screenMetrics.offsetX = 0;
            this.screenMetrics.offsetY = ((this.screenMetrics.gameHeight - this.screenMetrics.defaultGameHeight) * 0.5);
        }

        // Calculate scaling
        this.screenMetrics.scaleX = (this.screenMetrics.windowWidth / this.screenMetrics.gameWidth);
        this.screenMetrics.scaleY = (this.screenMetrics.windowHeight / this.screenMetrics.gameHeight);

        return this.screenMetrics;
    }
}

export class StringUtils {
    public static toCamelCase(str: string) {
        return str.replace(/[^A-Za-z0-9]/g, ' ').replace(/^\w|[A-Z]|\b\w|\s+/g, function (match, index) {
            if (+match === 0 || match === '-' || match === '.') {
                return '';
            }
            return (index === 0 ? match.toLowerCase() : match.toUpperCase());
        });
    }

    public static toPascalCase(str: string) {
        let camelCase: string = StringUtils.toCamelCase(str);

        return (camelCase[0].toUpperCase() + camelCase.substr(1));
    }
}
