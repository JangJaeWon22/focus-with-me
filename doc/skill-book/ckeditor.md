## ckEditor5 백엔드 구현

### ckEditor?

ckEditor는 게시물 작성자가 게시물을 쉽게 편집할 수 있도록 도와주는 도구이다. 본문에 이미지를 삽입할 수도 있고, 유튜브 링크같은 url을 embed할 수도 있다.
![](https://images.velog.io/images/goatyeonje/post/75cc654e-27da-47b3-9312-37ac292733c7/image.png)

### 문제점 1 - 본문에 이미지 업로드

https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/upload-adapter.html
본문에 이미지를 업로드 할 때마다, 콜백이 실행되면서 upload Adapter를 실행한다. Adapter는 공식 Adapter를 사용해도 되고, 직접 구현해서 사용 가능하다. 나는 돈이 없으므로 직접 구현을 하기로 했다.

- Work flow
  이미지를 본문에 업로드 ➡️ 해당 이미지를 서버 로컬 스토리지에 저장하는 api 호출 ➡️ 파일 저장 후 해당 경로를 응답으로 보내줌

```jsx
// 라우터 생성
postsRouter
  .route("/posts/ckUpload")
  .post(authMiddleware, uploadContents.single("content"), ckUpload);

// Multer 미들웨어
uploadContents: multer({
    dest: "public/uploads/content",
    limits: { fileSize: 1000000 },
  }),

// 컨트롤러
ckUpload: (req, res) => {
    const { user } = res.locals.user;
    const { path } = req.file;
    return res.status(201).send({ path });
  },
```

### 문제점 2 - 본문 제출 시 어떻게 처리하지?

우선 본문 양식이 어떻게 오는지 확인을 해야 했다. 확인해보니, ckEditor가 본문을 HTML으로 변환해준 뒤 보내주더라.
우리의 페이지는 커버 사진, 카테고리 3종류, 에디터 본문이 전송된다. 커버 사진 이미지를 또 업로드 해야하기 때문에 이번에도 multer를 사용했다.

```jsx
// 라우터
postsRouter
  .route("/posts")
  .get(notAuth, main, filter, followingPostMW, getPosts)
  .post(authMiddleware, uploadCover.single("imageCover"), postPosts);

// 컨트롤러
postPosts: async (req, res) => {
    // 사용자 인증 미들웨어 사용할 경우
    const { userId } = res.locals.user;
    // 여기서 받는 파일은 cover image
    const { path } = { path: "" } || req.file;
    //multipart 에서 json 형식으로 변환
    const body = JSON.parse(JSON.stringify(req.body));
    const {
      title,
      categorySpace,
      categoryStudyMate,
      categoryInterest,
      contentEditor,
    } = body;

    ...

    const post = {
      userId,
      imageCover: path,
      title: encodedTitle,
      categoryInterest,
      categorySpace,
      categoryStudyMate,
      contentEditor: encodedHTML,
      date,
    };
    try {
      console.log(post);
      await Post.create(post);
      return res.status(201).send({ message: "게시물 작성 성공!" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "DB 저장에 실패했습니다." });
    }
  },
```

여기서, 커버 이미지때문에 http request contents type을 multipart/form-data로 설정했는데, 다른 데이터들은 req.body로 받아 올 수 없고, 약간의 변환 작업이 필요했다. JSON.parse(JSON.stringify(req.body)); 부분.

### 문제점 3 - 작성자가 본문에 사진을 올렸다가 지운 채로 업로드를 한다면??! 🤬

여기서 가장 고생을 많이 한 것 같다. 아래는 고민의 흔적....
https://www.notion.so/CKEditor5-9ee9137a168b4d07878b468c3cea319d
프론트엔드 분들과 의기투합해서 나름 문제를 해결할 수 있었다.

- Work flow
  사용자가 이미지를 업로드한다 ➡️ 이미지를 임시 폴더에 저장한 뒤 응답으로 해당 경로를 반환한다. ➡️ 본문에 들어가는 img 태그의 src는 서버의 임시 폴더를 가리킨다. ➡️ 작성 제출 후 백엔드에서 : img 태그가 있을 경우, src에서 파일 이름을 추출한다. ➡️ 임시 폴더에서 해당 파일이 있는지 검색 후, 존재하면 파일을 content 폴더로 이동시킨다. ➡️ _~~**임시 폴더를 삭제한다.**~~_

여기서 바보같은 문제가 발생했다. 여러 명이 동시에 이미지를 업로드한다면??!! temp 폴더에 여러 사람의 임시 이미지가 올라가 있는데, 다른 한명이 게시물 작성을 제출하면 temp 폴더가 삭제되는데? 그럼 이미지 파일이 제대로 이동하지 않을 건데...???!. 정말 간단히 해결할 수 있는 문제였다. 게시물 작성 시 temp폴더를 지우지 말고, 나중에 지우면 해결되는 문제였다. temp 폴더는, node-schedule을 사용해서 매일 자정에 지우도록 만들었다.

```jsx
//router
postsRouter
  .route("/posts")
  .get(notAuth, main, filter, followingPostMW, getPosts)
  .post(authMiddleware, uploadCover.single("imageCover"), postPosts);

// multer middleware
uploadCover: multer({
    dest: "public/uploads/cover",
    limits: { fileSize: 1000000 },

// 게시물 작성 api
postPosts: async (req, res) => {
    // 사용자 인증 미들웨어 사용할 경우
    const { userId } = res.locals.user;
    // 여기서 받는 파일은 cover image
    const { path } = { path: "" } || req.file;
    //multipart 에서 json 형식으로 변환
    const body = JSON.parse(JSON.stringify(req.body));
    const {
      title,
      categorySpace,
      categoryStudyMate,
      categoryInterest,
      contentEditor,
    } = body;
    // image list 추출
    const imageList = extractImageSrc(contentEditor);
    // 비교 후 이동
    await moveImages(imageList);
    // 모든 temp 경로를 content로 바꾸기
    const innerHtml = contentEditor.replace(/temp/g, "content");
    const date = new Date();
    const post = {
      userId,
      imageCover: path,
      title: encodedTitle,
      categoryInterest,
      categorySpace,
      categoryStudyMate,
      contentEditor: encodedHTML,
      date,
    };
    try {
      console.log(post);
      await Post.create(post);
      return res.status(201).send({ message: "게시물 작성 성공!" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "DB 저장에 실패했습니다." });
    }
  },
```

추가로, 프론트엔드에서 받은 html의 img src는 ..../temp/filename의 경로를 가지고 있으므로, 파일을 temp에서 content로 이동 후, src 또한 바꿔 주어야 한다. 이미지 src 추출, 파일 이동 등은 별도 모듈을 만들어 사용했다.

### 문제점 4 - 서버 resource 관리 (사용하지 않는 이미지 파일)

이는 매우 쉽게 해결이 되었다. 프론트엔드 동료분이 알려주신 node-schedule이라는 모듈을 활용했다. 이 모듈은 특정 시간에 특정 작업을 할 수 있도록 해주었다. 사용하지 않는 이미지를 모아둔 temp 폴더는 매일 자정에 폴더를 삭제하고 다시 생성해주도록 하였다.

```jsx
// app.js
const job = schedule.scheduleJob("0 0 0 * * *", () => {
  emptyTemp();
  console.log("temp 폴더 삭제 후 다시 생성");
});

// emptyTemp 정의
const emptyTemp = async () => {
  const baseUrl = `${process.cwd()}/public/uploads/temp`;
  await fs.rm(baseUrl, { recursive: true });
  await fs.mkdir(baseUrl);
};
```
