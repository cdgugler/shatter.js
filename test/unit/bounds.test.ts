import Bounds from "../../src/lib/Bounds";

describe("Bounds", () => {
  it("initializes values to coords when instantiated", () => {
      const bound = new Bounds([10, 10]);

      expect(bound.x.min).toEqual(10);
      expect(bound.x.max).toEqual(10);
      expect(bound.y.min).toEqual(10);
      expect(bound.y.max).toEqual(10);
  });

  it("sets min y value when update called with lower y val", () => {
      const bound = new Bounds([10, 10]);
      bound.update([10, 5]);

      expect(bound.y.min).toEqual(5);
      expect(bound.x.min).toEqual(10);
      expect(bound.x.max).toEqual(10);
  });

  it("sets max y value when update called with higher y val", () => {
      const bound = new Bounds([10, 10]);
      bound.update([10, 20]);

      expect(bound.y.max).toEqual(20);
  });

  it("sets min x value when update called with lower x val", () => {
      const bound = new Bounds([10, 10]);
      bound.update([0, 10]);

      expect(bound.x.min).toEqual(0);
      expect(bound.x.max).toEqual(10);
  });

  it("sets max x value when update called with higher x val", () => {
      const bound = new Bounds([10, 10]);
      bound.update([20, 20]);

      expect(bound.x.min).toEqual(10);
      expect(bound.x.max).toEqual(20);
  });
});
