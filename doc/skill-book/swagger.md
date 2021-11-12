### Swagger 구현

Api 명세서를 작성할 때, 초기에는 Google SpreadSheet를 통해 작성했지만, 시간적인 문제를 단축시키고자 Rest Api를 설계, 빌드, 문서화 및 사용하는데 사용하는 오픈소스 프레임워크 도구이다

### 1. Swagger 패키지 설치
npm install swagger-ui-express
npm install swagger-autogen

### 2. server.js 수정
```jsx
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output");

...
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
```

### 3. swagger.js

### root 디렉토리에 추가시키고 endpointsFiles에 라우터의 js들을 각각 적용해준다
```jsx
const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "API",
    description: "Description",
  },
  host: "localhost:8080",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = [
  "./app.js",
  "./routes/users.js",
  "./routes/posts.js",
  "./routes/postlike.js",
  "./routes/comments.js",
  "./routes/bookmark.js",
  "./routes/myinfo.js",
];

swaggerAutogen(outputFile, endpointsFiles, doc);
```

### 4. swagger 문서 모델 예시

### 스웨거의 모든 양식은 아래와 같은 양식으로 이루어져 있으며, API 에 대한 일반적인 정보가 나타나 있다. 특히나 security를 설정한 이유는 사용자의 권한을 동적으로 제어하기 위한 의도이며 admin을 가진 사용자만 요청할 수 있도록 했다. JWT 또는  OAuth 와 같은 API 인증을 사용하는 경우, 인증을 수행할 수 있도록 역할을 하고 있다.

```jsx 
  "swagger": "",
  "info": {
    "title": 제목,
    "description": 어떤 것을 만들고자 하는지 요약
    "version": swagger 버전
  },
  "host": 호스트 주소
  "basePath": "/api",
  "tags": [], 
  "schemes": http버전 혹은 https 에 사용되는 프로토콜
  "components": {
    "securitySchemes": {
      "Bearer": {
        "type": "http",
        "schema": "bearer",
        "bearerFormat": "JWT"
      }
    }
  },
  "security": [
    {
      "Bearer": []
    }
  ],
  "securityDefinitions": {
    "Bearer": {
      "type": "apiKey",
      "name": "Authorization",
      "in": "header",
      "description": "token"
    }
  },
  "responses":{}
```

### 5. swagger 의 문제점 및 사용한 이유

swagger는 API문서를 자동화할 수 있는 역할 및 API를 테스트하기에 좋지만, swagger 문서를 보고 연동 시스템을 만들기에 부족한 점이 있고, production 코드가 주석처리 형태로 오염될 수 있다. 그럼에도 불구하고, swagger 를 택한 이유는 testcode 및 tdd 와 같은 처리 방식을 하기엔 익숙하지 않았고, 가장 빠르게 처리할 수 있는 방식이라 선택하게 되었다.

### 6. swagger 사용하면서 어려웠던 점, 발생하는 문제점 및 해결

swagger를 사용하면서 발생하는 문제점은 눈에 띄게 보이지는 않았지만, 
이전에 yaml 형식으로 썼다면, 현 프로젝트에서는 autogen 방식으로 해서 쓰는 형태가 달랐다. 더불어 주석처리 형식의 띄어쓰기가 민감한 swagger 형태라 작성하는데 소요되는 시간이 많이 걸렸다. 하지만, 그 부분에 대해서는 백엔드 팀원들끼리 함께 작업했고, 같이 프론트 분들과 결과 공유하면서 문제 해결을 해 나갈 수 있었다.