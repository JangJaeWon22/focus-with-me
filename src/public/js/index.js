requirejs(["static/js/ckeditor"], function (ClassicEditor) {
  let target;
  ClassicEditor.create(document.querySelector("#editor"))
    .then((resolve) => {
      target = resolve;
    })
    .catch((error) => {
      console.error(error);
    });
  const submitBtn = document.getElementById("submitBtn");

  const getData = () => {
    const data = target.getData();
    console.log(data);
  };

  submitBtn.addEventListener("click", getData);
});
