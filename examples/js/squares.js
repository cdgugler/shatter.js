import { Shatter, VoronoiPieces } from "../../src/index";
import loadImage from "../../src/lib/loadImage";

async function run() {
    const originalImageContainer = document.querySelector('.js-original');
    const original = await loadImage('/img/square.png');
    originalImageContainer.appendChild(original);

    const shattered = new Shatter('/img/square.png');
    shattered.setPieces([
        [
            [ 0, 0 ],
            [ 50, 0 ],
            [ 50, 100 ],
            [ 0, 100 ]
        ],
        [
            [ 50, 0 ],
            [ 100, 0 ],
            [ 100, 100 ],
            [ 50, 100 ]
        ],
    ]);
    shattered.shatter();

    const shatter2 = new Shatter('/img/square.png');
    shatter2.setPieces([
        [
            [  0, 0 ],
            [  50, 0 ],
            [  50, 50 ],
            [  0, 50 ]
        ],
        [
            [ 50, 0 ],
            [ 100, 0 ],
            [ 100, 50 ],
            [ 50, 50 ]
        ],
        [
            [ 0, 50 ],
            [ 50, 50 ],
            [ 50, 100 ],
            [ 0, 100 ]
        ],
        [ 
            [ 50, 50 ],
            [ 100, 50 ],
            [ 100, 100 ],
            [ 50, 100 ]
  ],
    ]);
    let results = await shatter2.shatter();


    let wrap = document.createElement('div');
    wrap.style.position = 'relative';
    wrap.style.height = '100px';

    results[0].image.setAttribute('style', `position: absolute; top: ${results[0].y}px; left: ${results[0].x}px;`);
    results[1].image.setAttribute('style', `position: absolute; top: ${results[1].y}px; left: ${results[1].x}px;`);
    results[2].image.setAttribute('style', `position: absolute; top: ${results[2].y}px; left: ${results[2].x}px;`);
    results[3].image.setAttribute('style', `position: absolute; top: ${results[3].y}px; left: ${results[3].x}px;`);

    wrap.appendChild(results[0].image);
    wrap.appendChild(results[1].image);
    wrap.appendChild(results[2].image);
    wrap.appendChild(results[3].image);

    document.body.appendChild(wrap);

    document.body.appendChild(document.createElement('br'));
    document.body.appendChild(document.createElement('br'));
    document.body.appendChild(document.createElement('br'));


    const voropieces = VoronoiPieces({ height: 100, width: 100, numPieces: 10 });

    const shatter3 = new Shatter('/img/square.png');
    shatter3.setPieces(voropieces);
    results = await shatter3.shatter();

    wrap = document.createElement('div');
    wrap.style.position = 'relative';

    results.forEach((res, i) => {
        res.image.setAttribute('style', `position: absolute; top: ${res.y}px; left: ${res.x}px;`);
        wrap.appendChild(res.image);
    });

    document.body.appendChild(wrap);

}

run();