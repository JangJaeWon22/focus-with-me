const fs = require("fs/promises");
const removeImage = async (path) => {
  try {
    await fs.unlink(path);
    return "삭제 성공";
  } catch (error) {
    console.log(error);
    return "삭제 실패";
  }
};

const extractImageSrc = (html) => {
  try {
    const regexp = /<img[^>]+src\s*=\s*['"]([^'"]+)['"][^>]*>/g;
    const srcs = html.match(regexp);
    const imageList = [];

    srcs.forEach((src) => {
      const imageUrl = "public" + src.split("public")[1].slice(0, -2);
      imageList.push(imageUrl);
    });
    return imageList;
  } catch (error) {
    console.log(error);
    return "추출 실패";
  }
};

module.exports = { removeImage, extractImageSrc };
