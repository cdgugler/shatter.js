export default async function loadImage(url: string) {
    const img = document.createElement('img');

    return new Promise<HTMLImageElement>((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}
