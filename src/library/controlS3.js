const aws = require("aws-sdk");
const s3 = new aws.S3();
/**
 * 여기서 할 일
 * - 파일 이동
 * - 파일 삭제
 * - 폴더 삭제
 */

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
module.exports = { removeS3Obj, listingS3Objs };
