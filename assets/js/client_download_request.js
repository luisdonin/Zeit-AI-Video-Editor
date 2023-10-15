var convertBtn = document.querySelector('.convert-button');
var URLinput = document.querySelector('.URL-input');

convertBtn.addEventListener('click', () => {
    if (URLinput.value == ''){
        alert("Please paste a YouTube URL");
        return;
    }
    console.log(`URL : ${URLinput.value}`);
    sendURL(URLinput.value);
});

function sendURL(URL) {
    console.log(`Sending URL to server: ${URL}`);
    //console.log(`http://${window.location.hostname}:${window.location.port}/download?URL=${URL}`)
    window.location.href = `http://${window.location.hostname}:${window.location.port}/download?URL=${URL}&Duration=`;
}