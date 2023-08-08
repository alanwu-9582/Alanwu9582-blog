setInterval(getTime, 1000);
var counter = 0;

function getTime() {
    var d = new Date();
    var arr = d.toString().split(" ");

    $('#time').text(arr[4]);
    $('title').text("Time " + arr[4] + " " + arr[1] + " " + arr[2] + ", " + arr[3]);
    $('#date').text(arr[1] + " " + arr[2] + ", " + arr[3]);

    if (d.getSeconds() % 10 === 0) {
        var red = Math.floor(Math.random() * 255);
        var green = Math.floor(Math.random() * 255);
        var blue = Math.floor(Math.random() * 255);

        var rgb = "rgb" + "(" + red + ", " + green + ", " + blue + ")";
        $('body').css('background-color', rgb);


    }


}