const aws = require("aws-sdk");
const s3 = new aws.S3();
/**
 * - 파일 이동
 * - 파일 삭제
 * - 폴더 삭제
 */

const extractImageSrcS3 = (html) => {
  try {
    const regexp = /src\s*=\s*"([^"]+)"/g;

    const srcs = html.match(regexp);
    const imageList = [];
    if (srcs.length > 0) {
      srcs.forEach((src) => {
        const imageUrl = src.split('"')[1];
        imageList.push(imageUrl);
      });
    }
    return imageList;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const copyImagesS3 = async (imageList) => {
  try {
    /**
     * 이미지 리스트에서 파일 이름만 추출
     * 각 파일이 새로운 경로 key가 되고, copyObject 수행
     */
    for (const url of imageList) {
      const filename = url.split("temp/")[1];
      console.log(filename);
      await s3
        .copyObject({
          Bucket: "kkirri-images",
          CopySource: `kkirri-images/temp/${filename}`,
          Key: `content/${filename}`,
          ACL: "public-read",
        })
        .promise();
    }
    return;
  } catch (error) {
    console.log(error);
    return;
  }
};

const removeS3Obj = (path) => {
  const params = {
    Bucket: "kkirri-images",
    Key: path,
  };

  s3.deleteObject(params, function (err, data) {
    if (err) console.log(err, err.stack);
    // an error occurred
    else console.log(data); // successful response
    /*
     data = {
     }
     */
  });
};

const moveS3Objs = () => {};

const listingS3Objs = async () => {
  console.log("여기로 와라");
  const list = await s3.listObjects({ Bucket: "kkirri-images" }).promise();
  console.log(list);
};
module.exports = {
  removeS3Obj,
  listingS3Objs,
  extractImageSrcS3,
  copyImagesS3,
};
