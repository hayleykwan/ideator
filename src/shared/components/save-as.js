module.exports = saveAs

// from http://stackoverflow.com/questions/283956/
function saveAs(html) {

  var imgsrc = 'data:image/svg+xml;base64,'+ btoa(html);

  var canvas = document.querySelector("canvas"),
  context = canvas.getContext("2d");

  var image = new Image;
  image.src = imgsrc;
  image.onload = function() {
    context.drawImage(image, 0, 0);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.download = "sample.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
    document.body.removeChild(a);
  };

}
