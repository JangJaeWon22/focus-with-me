# TIL

## Passport

### Passport를 이용한 local login, kakao login, jwt(jsonwebtoken) 발급

### 1. Passport 모듈 설치

```jsx
npm i express-session passport passport-local passport-kakao passport-jwt jwt bcrypt
```

---

### 2. server.js

```jsx
const passport = require("passport");
const passportConfig = require("./passport")

...
passportConfig();
app.use(
  session({
    // false, 변경사항도 없는 session이 매번 다시 저장되는 걸 막아 작동 효율을 높임
    resave: false,
    // saveUninitialized: true => uninitialized 상태의 session을 강제로 저장,
    // false => empty session obj가 쌓이는 걸 방지해 서버 스토리지를 아낄 수 있습니다.
    saveUninitialized: false,
    secret: "secret",
    // 세션 쿠키 설정 (세션 관리 시 클라이언트에 보내는 쿠키)
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session)
```

- passport.initialize 미들웨어의 역활
    
    요청(req 객체)에 passport 설정을 심고, passport.session 미들웨어는 req.session 객체에 passport 정보를 저장합니다.
    
- passport.session 미들웨어의 역활
    
    passport.session 미들웨어는 req.session 객체에 passport 정보를 저장합니다. req.session 객체는 express-session에서 생성하는 것이므로 passport 미들웨어는 express-session 미들웨어보다 뒤에 연결해야됨
    

---

### 3. passport/index.js

```jsx
const passport = require("passport");
const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const { User } = require("../models");
const jwt = require("./jwt");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.userId);
  });

  passport.deserializeUser((userId, done) => {
    User.findOne({where: { userId }})
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });

  local();
  kakao();
  jwt();
};
```

모듈 내부엔 passport.serializeUser와 passport.deserializeUser가 있음.

server가 실행 될 때, server.js에 작성한 passportConfig()로 인해 같이 실행 됩니다.

- passport.serializeUser
    
    로그인 시 실행되며, req.session(세션) 객체에 어떤 데이터를 저장할지 정하는 메서드
    
    **매개변수로 user를 받고 나서, done 함수에 두 번째 인수로 user.id를 넘기고 있음.**
    
    - done 함수
        
        첫 번째 인수는 에러 발생 시 사용
        
        두 번째 인수로 user.userId를 넘김 (로그인 시 사용자 데이터를 세션에 저장)
        
        - 세션에 사용자 정보를 모두 담으면 세션의 용량이 너무 커짐
- passport.deserializeUser
    
    매 요청 시 실행 됨.
    
    passport.session 미들웨어가 이 메서드를 호출
    
    passport.serializeUser 메서드의 done 함수 2번째 인수로 넣었던 데이터가 deserializeUser의 매개변수
    
    위 메서드로 req.user를 통해 사용자의 정보를 가져올 수 있게 됨.
    

<aside>
💡 요약
 - serializeUser는 사용자 정보 객체를 세션에 userId로 저장하는것,
 - deserializeUser 세션에 저장한 아이디를 통해 사용자 정보 객체를 불러오는 것
    (즉, userId를 가지고 데이터를 추출할때 원하는 데이터로 가지고 다닐 수도 있음)

</aside>

---

### 4. Local login 구현

### passport/localStrategy.js

```jsx
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { User } = require("../models");

const passportConfig = { usernameField: "email", passwordField: "password" };
const passportVerify = async (email, password, done) => {
  try {
    // 유저 아이디로 일치하는 유저 데이터 검색
    const user = await User.findOne({ where: { email: email } });
    // 검색된 유저 데이터가 없다면 에러 표시
    if (!user) {
      done(null, false, { message: "잘못된 아이디 또는 패스워드입니다." });
      return;
    }
    // 검색된 유저 데이터가 있다면 유저 해쉬된 비밀번호 비교
    const compareResult = await bcrypt.compare(password, user.password);

    // 해쉬된 비밀번호가 같다면 유저 데이터 객체 전송
    if (compareResult) {
      done(null, user);
      return;
    }
    // 비밀번호가 다를경우 에러 표시
    done(null, false, { message: "잘못된 아이디 또는 패스워드입니다." });
  } catch (error) {
    console.error(error);
    done(error);
  }
};

module.exports = () => {
  passport.use("local", new LocalStrategy(passportConfig, passportVerify));
};
```

passport-local 모듈에서 Strategy 생성자를 불러오고 그 다음 로그인 전략을 구현함.

done 함수는 이 다음 작성할 passport.authenticate의 콜백 함수

### routes/users.js

```jsx
router.post("/users/login",async (req, res, next) => {
    // local 로그인
    try {
      // passport/index.js로 실행 됨
      passport.authenticate("local", (passportError, user, info) => {
        // 인증이 실패했을 경우 passportError 
        if (passportError) {
          console.error("passportError:", passportError);
          return res.send({ message: passportError });
        }
				// user를 조회하지 못할 경우
        if (!user) {
          res.status(400).send({ message: info.message });
          return;
        }
        // user데이터를 통해 로그인 진행
        req.login(user, { session: false }, (loginError) => {
          if (loginError) {
            res.send(loginError);
            return;
          }
          //회원정보 암호화
          const token = Jwt.sign(
            { userId: user.userId },
            process.env.TOKEN_KEY,
            { expiresIn: "1d" }
          );
          res
            .status(201)
            .send({ token, user, message: "로그인에 성공하셨습니다." });
        });
      })(req, res, next);
    } catch (error) {
      console.error(error);
      next(error);
    }
  });
```

로그인 요청이 들어오면 passport.authenitcate('local') 미들웨어가 로컬 로그인 전략을 수행함.

- 미들웨어 라우터 안 미들웨어
    
    **미들웨어에 사용자 정의 기능을 추가 하고 싶을 경우 이렇게 사용가능**
    
    - 내부 미들웨어에 (req, res, next)를 인수로 제공해서 호출하면 됨.

로그인 전략 미들웨어가 성공하거나 실패하면 authenitcate 메서드의 콜백 함수가 실행 됨.

- 콜백 함수 (passportError, user, info) ⇒ { ...... }
    - passportError
        
        passportError로 데이터가 들어오면 실패함
        그에 따른 메세지를 보내줌
        
    - user
        
        user에 대한 정보를 받으면 성공!
        
    - info
        
        로그인 전략 로직 수행 중 발생한 조건에 해당 되는 정보를 받을 경우 info를 받음
        위 로직에서는 전략 수행 과정 중 비밀번호가 다를 경우에 대한 info.message를 받음
        

Passport는 req 객체에 login과 logout 메서드를 추가하여 req.login은 passport.serializeUser를 호출함. req.login에 제공하는 user 객체가 serializeUser로 넘어감.

---

### 5. Kakao login 구현

### passport/kakaoStrategy.js

```jsx
const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const { User } = require("../models");
require("dotenv").config();

module.exports = () => {
  console.log("hihihii");
  passport.use(
    "kakao",
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: process.env.KAKAO_CALLBACK,
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("accessToken:", accessToken);
        console.log("refreshToken:", refreshToken);
        console.log("profile", profile);
        const email = profile["_json"].kakao_account.email;
        const nickname = profile.displayName;
        const provider = "kakao";
        const avatarUrl = "public/images/noAvatar";
        const date = new Date();
        const userInfo = await User.findOne({
          where: { snsId: profile.id, provider: "kakao" },
        });
        if (!userInfo) {
          const newUser = await User.create({
            email: email,
            nickname: nickname,
            snsId: profile.id,
            avatarUrl,
            provider,
            date,
          });
          console.log("회원 가입 햇음 passport/index로 넘어감 ㅂㅇ");
          return done(null, newUser);
        }
        console.log("회원 있따고 함 그래서 passport/index 넘어감 ㅅㄱ");
        return done(null, userInfo);
      }
    )
  );
};
```

passport-kakao 모듈로부터 Strategy 생성자를 불러와 전략을 구현

### routes/users.js

```jsx
router.get(
// 프론트 서버에서 인가코드를 전달 받음
  "/kakao/callback", 
  passport.authenticate("kakao"),
  async (req, res) => {
    try {
      console.log("넘어와찌롱");
      const user = req.user;
      const token = Jwt.sign({ userId: user.userId }, process.env.TOKEN_KEY);
      res.status(200).send({
        message: "로그인에 성공하였습니다.",
        token: token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  });
```

**clientID는 카카오에서 발급해주는 아이디. — REST API 키 사용**

**callbackURL은 카카오로부터 인증 결과를 받을 주소**

### 프론트서버와 협업 시 과정

<aside>
💡 전제 조건

**카카오 홈페이지에서 설정하는 web 주소는 프론트서버의 주소가 되어야됨**.
 - 사유 : 프론트서버에서 인가코드를 받는 작업으로 로그인 로직이 실행 됨.

**REDIRECT_URI 주소도 프론트서버의 주소가 되어야됨.**
 - 사유 : 인가코드 검증을 하고 로그인 처리가 정상 완료 될 수 있도록 시작 했던 프론트서버로 다시 보내줘야됨. 그렇게 하지 않을 경우 프론트는 인가코드를 발급 후 계속 응답을 기다리는 상태가 될 꺼임.

**REDIRECT_URI는 프론트에 맞추는게 편함. — 서버에서 다 처리하면 프론트는 응답도 못받고 api로 통해 전달된 json 화면만 보게 될꺼임.**

실행 과정

 1. 프론트서버에서 카카오 서버로 인가코드를 요청

```jsx
https://kauth.kakao.com/oauth/authorize?response_type=code&client_id={REST_API_KEY}&redirect_uri={REDIRECT_URI}
```

1. 인가코드를 백앤드 서버 api로 보내줌.

 3.  받은 인가코드로 passport-kakao 로그인 전략을 수행함.

- 전략 수행 후 jwt 발급 후 응답값 프론트 서버로 전송

엄청 간단하지만, REDIRECT_URL이 엄청 많아지게 되거나, 꼬이게 된다면, 엄청 해결하기 어려운 문제가 될 것이라고 생각이 듬.

</aside>

---

### 6. Passport-jwt 구현

### passport/jwt.js

```jsx
const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const { ExtractJwt, Strategy: JWTStrategy } = require("passport-jwt");

const { User } = require("../models");

const JWTConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.TOKEN_KEY,
};

const JWTVerify = async (jwtPayload, done) => {
  try {
    // payload의 id값으로 유저의 데이터 조회
    const user = await User.findOne({
      where: { userId: jwtPayload.userId }});
    // 유저 데이터가 있다면 유저 데이터 객체 전송
    if (user) {
      done(null, user);
      return;
    }
    // 유저 데이터가 없을 경우 에러 표시
    done(null, false, { message: "올바르지 않은 인증정보 입니다." });
    return;
  } catch (error) {
    done(error);
  }
};
module.exports = () => {
  passport.use("jwt", new JWTStrategy(JWTConfig, JWTVerify));
};
```

passport-jwt 모듈로부터 Strategy 생성자를 불러와 전략을 구현

JWTConfig를 통해 응답받는 형태와 시크릿키를 선언

- fromAuthHeaderAsBearerToken() ⇒ Bearer token

### middleware/passport-auth.js

```jsx
const passport = require("passport");

exports.logInOnly = (req, res, next) => {
  try {
    // 아까 local로 등록한 인증과정 실행
    passport.authenticate("jwt", (passportError, user, info) => {
      // 인증이 실패했거나 유저 데이터가 없다면 에러 발생
      if (passportError) {
        console.error("passportError:", passportError);
        return res.send({ message: passportError });
      }
      if (!user) {
        return res.status(401).send({ message: info.message });
      }
      res.locals.user = user;
      next();
    })(req, res, next);
  } catch (error) {
    console.error(error);
    return res.send({ message: error });
  }
};
```

로그인 인증을 하는 부분이라 middleware로 사용함.

- 미들웨어 라우터 안 미들웨어
    
    **미들웨어에 사용자 정의 기능을 추가 하고 싶을 경우 이렇게 사용가능**
    
    - 내부 미들웨어에 (req, res, next)를 인수로 제공해서 호출하면 됨.