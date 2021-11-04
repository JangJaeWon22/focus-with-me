exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("-----------------------------");
    console.log(req.user);
    console.log("-----------------------------");
    next();
  } else {
    console.log("123123");
    user = null;
    next();
  }
};

// exports.isNotLoggedIn = (req, res, next) => {
//   if (!req.isAuthenticated()) {
//     next();
//   } else {
//     const message = encodeURIComponent("로그인한 상태입니다.");
//     res.redirect(`/?error=${message}`);
//   }
// };
