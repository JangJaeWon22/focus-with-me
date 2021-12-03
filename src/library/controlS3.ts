// require("dotenv").config();
import "dotenv/config";
// const aws = require("aws-sdk");
import * as aws from "aws-sdk";

/**
 * - 파일 이동
 * - 파일 삭제
 * - 폴더 삭제
 */

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};
const s3 = new aws.S3(awsConfig);
class ControlS3 {
  public extractImageSrcS3(html: string) {
    try {
      const regexp: RegExp = /<img[^>]+src\s*=\s*['"]([^'"]+)['"][^>]*>/g;
      const srcs: string[] = html.match(regexp);
      const imageList: string[] = [];
      if (srcs) {
        srcs.forEach((src) => {
          const imageUrl: string =
            "uploads" + src.split("uploads")[1].slice(0, -2);
          imageList.push(imageUrl);
        });
      }
      return imageList;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  public async copyImagesS3(imageList: string[]) {
    try {
      /**
       * 이미지 리스트에서 파일 이름만 추출
       * 각 파일이 새로운 경로 key가 되고, copyObject 수행
       */
      for (const url of imageList) {
        const filename: string = url.split("temp/")[1];
        console.log(filename);
        await s3
          .copyObject({
            Bucket: process.env.S3_BUCKET_NAME,
            CopySource: `kkirri-images/${url}`,
            Key: `uploads/content/${filename}`,
            ACL: "public-read",
          })
          .promise();
      }
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  /**
   * root 이 후의 경로가 Key
   * temp/1636955398064_20170716_211848140_iOS.jpg
   */

  // 배열까지 처리할 수 있도록 만들어보기
  public async removeObjS3(src: string) {
    try {
      await s3
        .deleteObject({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: src,
        })
        .promise();
    } catch (error) {
      console.log(error);
      return;
    }
  }

  public async emptyTempS3() {
    const listParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Prefix: "uploads/temp",
    };

    const listedObjects = await s3.listObjectsV2(listParams).promise();

    // 폴더 내 파일이 없으면 함수 종료
    if (listedObjects.Contents.length === 0) return;

    const deleteParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Delete: { Objects: [] },
    };

    listedObjects.Contents.forEach(({ Key }) => {
      deleteParams.Delete.Objects.push({ Key });
    });

    await s3.deleteObjects(deleteParams).promise();

    if (listedObjects.IsTruncated) await this.emptyTempS3();
  }

  public async getObjS3(src: string) {
    try {
      const result = await s3
        .getObject({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: src,
        })
        .promise();

      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
// 다른 곳에서 import하면 여기서 인스턴스를 만들어준다?
export default new ControlS3();
