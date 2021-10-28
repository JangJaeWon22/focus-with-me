const fs = require("fs/promises");
const removeImage = async (path) => {
  try {
    await fs.unlink(path);
    return "삭제 성공";
  } catch (error) {
    console.log(error);
    return "삭제 실패";
  }
};

module.exports = { removeImage };
