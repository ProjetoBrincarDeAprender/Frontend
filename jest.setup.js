jest.mock("phaser", () => {
  return {
    Scene: class {},
    GameObjects: {
      Container: class {},
      Image: class {},
    },
  };
});
