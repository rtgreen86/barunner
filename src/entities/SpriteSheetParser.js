export const createAnimationConfig = spriteSheetJson => {
  const frameTags = spriteSheetJson.meta.frameTags;
  const image = spriteSheetJson.meta.image;

  const createFrames = function *(name, from, to) {
    for (let i = from; i <= to; i++) {
      yield {
        key: image,
        frame: i
      };
    }
  }

  return frameTags.map(animation => ({
    frameRate: 30,
    key: animation.name,
    repeat: -1,
    frames: [...createFrames(animation.name, animation.from, animation.to)]
  }));
};
