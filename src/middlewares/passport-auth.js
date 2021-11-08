const passport = require("passport");

//토큰이 없이 들어오면 빠꾸 --- 사유 : 회원 탈퇴-아에 접근하면 안됨, 게시글 작성-아에 접근하면 안됨, 좋아요 등등
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send("로그인이 필요한 기능 입니다.");
  }
};

// 토큰이 없어도 들어와짐 // 하지만 토큰으로 정보를 가져오는 부분은 안보여줌.(대문 == following user의 게시글 목록)
exports.existLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    passport.authenticate("jwt", { session: false });
    console.log(req.user);
    next();
  } else {
    passport.authenticate("jwt", { session: false });
  }
};
