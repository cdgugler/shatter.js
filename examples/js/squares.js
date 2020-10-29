import { Shatter, VoronoiPieces } from '../../src/index';
import loadImage from '../../src/lib/loadImage';

async function run() {
    const originalImageContainer = document.querySelector('.js-original');
    const fourContainer = document.querySelector('.js-four');
    const twoContainer = document.querySelector('.js-two');
    const assembleContainer = document.querySelector('.js-assemble');
    const original = await loadImage('/img/square.png');
    originalImageContainer.appendChild(original);
    const squareSize = '100px';
    const pieceMargin = '1rem';

    const shattered = new Shatter('/img/square.png');
    shattered.setPieces([
        [
            [0, 0],
            [50, 0],
            [50, 100],
            [0, 100],
        ],
        [
            [50, 0],
            [100, 0],
            [100, 100],
            [50, 100],
        ],
    ]);

    let res1 = await shattered.shatter();
    res1.forEach((res, i) => {
        res.image.style.marginRight = pieceMargin;
        twoContainer.appendChild(res.image);
    });

    const shatter2 = new Shatter('/img/square.png');
    shatter2.setPieces([
        [
            [0, 0],
            [50, 0],
            [50, 50],
            [0, 50],
        ],
        [
            [50, 0],
            [100, 0],
            [100, 50],
            [50, 50],
        ],
        [
            [0, 50],
            [50, 50],
            [50, 100],
            [0, 100],
        ],
        [
            [50, 50],
            [100, 50],
            [100, 100],
            [50, 100],
        ],
    ]);
    let results = await shatter2.shatter();

    let wrap = document.createElement('div');
    wrap.style.position = 'relative';
    wrap.style.height = squareSize;

    results.forEach((res, i) => {
        let cloned = res.image.cloneNode();

        cloned.style.marginRight = pieceMargin;
        fourContainer.appendChild(cloned);
        res.image.setAttribute('style', `position: absolute; top: ${res.y}px; left: ${res.x}px;`);
        wrap.appendChild(res.image);
    });

    assembleContainer.appendChild(wrap);
}

run();
