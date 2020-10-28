import loadImage from "./lib/loadImage";
import Bounds from "./lib/Bounds";

type ShatterOptions = {
    numPieces?: number;
};

export type Coordinate = [number, number]

export type Piece = Coordinate[];

type ShatteredImage = {
    image: HTMLImageElement;
    x: number;
    y: number;
};

class Shatter {
    url: string = "";
    numPieces: number = 4;
    originalImage: HTMLImageElement | undefined;
    pieces: Piece[] = [];
    images: ShatteredImage[] = [];

    constructor(url?: string, options?: ShatterOptions) {
        this.url = url ? url : "";
        this.numPieces = options?.numPieces ?? this.numPieces;
    }

    setImage(img: HTMLImageElement) {
        this.originalImage = img;
    }

    setPieces(pieces: Piece[]) {
        this.pieces = pieces;
    }

    async shatter() {
        if (!this.originalImage) {
            try {
                this.originalImage = await loadImage(this.url);
            } catch(e) {
                console.error(e);
                return;
            }
        }

        const results = this.pieces.map(async (piece) => {
            return new Promise<ShatteredImage>(async (res, rej) => {
                if (!this.originalImage) {
                    rej("Image not set");
                }

                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = this.originalImage?.width ?? 0;
                tempCanvas.height = this.originalImage?.height ?? 0;
                const tempCtx = tempCanvas.getContext("2d");
                const pieceBounds = new Bounds(piece[0]);

                for (let i = 0; i < piece.length; i++) {
                    if (i === 0) {
                        tempCtx?.beginPath();
                        tempCtx?.moveTo(piece[i][0], piece[i][1]);
                        continue;
                    } 

                    tempCtx?.lineTo(piece[i][0], piece[i][1])

                    if (i === piece.length - 1) {
                        tempCtx?.lineTo(piece[0][0], piece[0][1]);
                    }

                    pieceBounds.update(piece[i]);
                }

                tempCtx?.clip();
                tempCtx?.drawImage(this.originalImage ?? new Image(), 0, 0);

                let clippedImage = await loadImage(tempCanvas.toDataURL("image/png"));

                tempCtx?.clearRect(0,0,tempCanvas.width, tempCanvas.height);

                tempCanvas.height = pieceBounds.y.max - pieceBounds.y.min;
                tempCanvas.width = pieceBounds.x.max - pieceBounds.x.min;
                tempCtx?.drawImage(clippedImage, -pieceBounds.x.min, -pieceBounds.y.min);
                let croppedImage = await loadImage(tempCanvas.toDataURL("image/png"));

                res({
                    image: croppedImage,
                    x: pieceBounds.x.min,
                    y: pieceBounds.y.min
                });

            });
        });

        this.images = await Promise.all(results);


        return Promise.resolve(this.images);
    }
}

export default Shatter;