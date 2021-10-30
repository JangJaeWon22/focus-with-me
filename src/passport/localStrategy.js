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
