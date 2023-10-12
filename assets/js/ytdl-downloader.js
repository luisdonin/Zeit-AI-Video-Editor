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
    fetch(`http://localhost:3000/download?URL=${URL}`, {
        method: 'GET'
    }).then(res => res.json())
    .then(json => console.log(json));
}