import { Shatter } from '../../src/index';

describe('Shatter Options', () => {
    it('generates 4 pieces by default', () => {
        const shattered = new Shatter('');
        expect(shattered.numPieces).toEqual(4);
    });
});
