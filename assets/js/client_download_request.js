var convertBtn = document.querySelector('.convert-button');
var URLinput = document.querySelector('.URL-input');
var cutDuration = document.querySelector('.cut-duration');

convertBtn.addEventListener('click', () => {
    if (URLinput.value == ''){
        alert("Please paste a YouTube URL");
        return;
    }
    console.log(`URL : ${URLinput.value}`);
    sendURL(URLinput.value, cutDuration.value);
});

function sendURL(URL, cutDur) {
    console.log(`Sending URL to server: ${URL}`);
    window.location.href = `http://${window.location.hostname}:${window.location.port}/download?URL=${URL}&Duration=${cutDur}`;
}