import { Shatter, VoronoiPieces } from "../../src/index";
import loadImage from "../../src/lib/loadImage";

async function run() {
    const exImagePath = "/img/BlueMarbleNasa.png";
    const originalImageContainer = document.querySelector(".js-original");
    const original = await loadImage(exImagePath);
    originalImageContainer.appendChild(original);
    const pieceMargin = "1rem";
    let wrap = document.querySelector('.js-result');
    let assembled = document.querySelector('.js-result-assembled');
    const formEl = document.querySelector('form');

    formEl.addEventListener('submit', event => {
        event.preventDefault();
        const pieces = event.target.elements?.pieces?.value;

        if (pieces && Number(pieces) !== NaN) {
            shatterExImage(Number(pieces));
        }
    });

    async function shatterExImage(num = 10) {

        while(wrap.firstChild) {
            wrap.firstChild.remove();
        }

        while(assembled.firstChild) {
            assembled.firstChild.remove();
        }

        const voropieces = VoronoiPieces({
            height: original.width,
            width: original.height,
            numPieces: num,
        });

        const vshatter = new Shatter(exImagePath);
        vshatter.setPieces(voropieces);
        let results = await vshatter.shatter();

        wrap.style.position = "relative";

        results.forEach((res, i) => {
            res.image.style.marginRight = pieceMargin;
            wrap.appendChild(res.image);

            const clone = res.image.cloneNode();
            clone.setAttribute(
                "style",
                `position: absolute; top: ${res.y}px; left: ${res.x}px;`
            );
            assembled.appendChild(clone);
        });
    }

    shatterExImage();

}

run();
