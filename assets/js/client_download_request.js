const server_settings = {
    hostname: 'localhost',
    port: 3000
}

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
    window.location.href = `http://${server_settings.hostname}:${server_settings.port}/download?URL=${URL}`;
}