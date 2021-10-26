module.exports = {
  getPosts: (req, res) => {
    console.log("GET posts");
    return res.send({});
  },
  postPosts: (req, res) => {
    console.log("POST posts");
    return res.send({});
  },
  putPosts: (req, res) => {
    console.log("PUT posts");
    return res.send({});
  },
  deletePosts: (req, res) => {
    console.log("DELETE posts");
    return res.send({});
  },
};
