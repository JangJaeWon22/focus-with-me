현재 프로젝트 서버는 EC2 내에서 서버와 DB가 모두 구동되고 있다. EC2가 다운되더라도 DB 내 데이터는 보존하기 위해 DB를 분리하는 작업을 진행하였다. 플랫폼은 RDS로 결정하였다. RDS로 결정한 이유는 S3와 마찬가지로 검색할 수 있는 리소스가 많아서.....

https://developer111.tistory.com/52

위의 링크를 많이 참고하였다. 과정에 대한 설명이 천천히 이루어져서 이해하기 쉬웠다. 다만 보안 설정은 위 링크 방법을 따르지 않았다.

# 1. RDS DB 생성

자세한 생성 과정은 위 링크를 참고할 것. RDS에 DB 생성은 약 5-10분정도 걸린다.

# 2. 보안 그룹 설정

위 링크를 따라 보안 그룹을 설정할 경우, 본인의 EC2에서만 RDS에 접속할 수 있다. 나는 MySQL Workbench, 터미널 등 다양한 방법으로 접속하기 위해 DB 생성 시 퍼블릭 액세스를 허용했다.
![](https://images.velog.io/images/goatyeonje/post/5509a0e5-f6fb-423e-b9e4-5d598491f75c/image.png)
아래 그림과 같이 보안 그룹을 하나 생성해주고, RDS 보안 그룹에 추가한다.
![](https://images.velog.io/images/goatyeonje/post/6643e55d-b8e1-4e2d-b5cd-74baaec0e4e0/image.png)
모든 IPv4 소스에 대해 3306 포트를 개방한다.

# 3. 프로젝트에서 DB 생성

### (1) DB configuration 수정

이번 프로젝트는 DB 설정용 config.js 파일을 만들고 그 안에 DB 연결 정보를 저장했다.

```jsx
require("dotenv").config();
module.exports = {
  rds: {
    username: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB_NAME,
    host: process.env.RDS_END_POINT,
    dialect: "mysql",
  },
};
```

보안을 위해 위 변수들은 환경변수로 지정해두었다.
username, password는 DB 생성시 입력한 정보.
database는 생성할 DB 이름.
host는 엔드포인트 정보를 입력하면 된다. RDS DB 콘솔에서 확인 가능.

### (2) DB 생성

기존 사용하던 명령어에 설정 정보만 넣어서 간단하게 DB 생성 가능하다.

```jsx
$ npx sequelize db:create --env rds

$ npm run dev
```

# DB 접속

### (1) MySQL 명령어 사용

```jsx
$ mysql -u 계정이름 -p -h 엔드포인트 -P 포트번호

$ mysql> SHOW DATABASES;

```

### (2) MySQL Workbench 사용

![](https://images.velog.io/images/goatyeonje/post/c2af75c0-ceb9-4c8f-8820-844bbee5f602/image.png)

hostname에는 DB 엔드포인트, username, password는 DB 생성시 입력했던 내용을 작성하면 된다.
