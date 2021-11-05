const fsSync = require("fs");
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

    if (srcs)
      srcs.forEach((src) => {
        const imageUrl = "public" + src.split("public")[1].slice(0, -2);
        imageList.push(imageUrl);
      });
    return imageList;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const emptyTemp = async () => {
  const baseUrl = `${process.cwd()}/public/uploads/temp`;
  await fs.rm(baseUrl, { recursive: true });
  await fs.mkdir(baseUrl);
};

const moveImages = async (imageList) => {
  if (imageList.length !== 0)
    imageList.forEach(async (url) => {
      const isExist = fsSync.existsSync(url);
      // 각 src에 대해, temp 에 해당 파일이 있으면
      if (isExist) {
        // 파일 이름 추출
        const fileName = url.split("/")[url.split("/").length - 1];
        // 다시 저장할 경로 지정 temp -> content
        await fs.rename(url, `public/uploads/content/${fileName}`);
      }
    });
};

module.exports = { removeImage, extractImageSrc, emptyTemp, moveImages };
