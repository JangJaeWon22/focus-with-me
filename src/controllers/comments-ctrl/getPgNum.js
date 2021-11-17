exports.getPgNum = async function (pagination, respondComments) {
    console.log(pagination);
    const perPage = 3; // per page당 몇개씩 댓글 처리할 것인가
    const totalPage = pagination * perPage;
    const pageNum = parseInt(pagination, 10); //parseInt(string, 진수)
    console.log(pageNum);
    let startNum = 0; // num을 변경할 것이기 때문에, 초기화값으로 설정
    let lastNum = 0; // num을 변경할 것이기 때문에, 초기화값으로 설정ㅎ

    // 유효성 처리
    if(pageNum >= 1){
        startNum = (pageNum - 1) * perPage,
        lastNum = pageNum * perPage;
        
    } else { // < 1
       return null;
    }
    console.log(respondComments.length);
    console.log(respondComments);
    if(respondComments.length < totalPage) {
        lastNum = respondComments.length;
    }

    // 배열처리
    const cmtsList = [];
    for (let i = startNum; i < lastNum; i++) {
        cmtsList.push(respondComments[i]);
    }

    return cmtsList;
}