const searchButton = document.getElementById('search-btn')
const searchText = document.getElementById('search-txt');
const searchResult = document.getElementById('search-result');
const songName = document.getElementById('song');
const artistName = document.getElementById('artist');
const songLyrics = document.getElementById('song-lyrics');
const outputView = document.getElementById('output');

// Search button addEventListener
searchButton.addEventListener("click", () => {

    if (!searchText.value) {
        const output = document.getElementById("myOutput");
        output.style.display = "block";
        window.onclick = function (event) {

            if (event.target == output) {
                output.style.display = "none";
            }
        }
        outputView.innerHTML = `<h2>Please input your lyrics...</h2>`;
    } else {
        fetchValue(searchText.value);
    }
});

// Search text addEventListener
searchText.addEventListener("keypress", (event) => {

    if (event.keyCode == 13) {
        fetchValue(searchText.value);
    }
});

function fetchValue(search) {
    fetch(`https://api.lyrics.ovh/suggest/${search}`)
        .then(response => response.json())
        .then(data => showData(data))
}

function showData(data) {

    searchResult.innerHTML = `
            ${data.data.map(song => `
                        <div class="song-result row align-items-center my-3 p-3">
                        
                            <div class="col-md-9">
                                <h3 class="lyrics-name song-detail">Title : ${song.title}</h3>
                                <p class="author lead song-detail">Artist Name :<span> ${song.artist.name}</span></p>
                                <p class="author lead song-detail">Album :<span> ${song.album.title}</span></p>
                            </div>
                            <div class="col-md-3 text-md-right text-center">
                                <button data-artist="${song.artist.name}" data-songtitle="${song.title}" class="btn btn-success">Get Lyrics</button>
                            </div>
                        </div>
                    `)
            .join('')}
        `;
}

// Search result addEventListener
searchResult.addEventListener('click', btn => {

    if (btn.target.innerHTML === 'Get Lyrics') {
        const artist = btn.target.getAttribute("data-artist");
        const songTitle = btn.target.getAttribute("data-songtitle");
        getLyrics(artist, songTitle);
    }
})

// Get lyrics for song
async function getLyrics(artist, songTitle) {
    const res = await fetch(`https://api.lyrics.ovh/v1/${artist}/${songTitle}`);
    const data = await res.json();

    const lyrics = data.lyrics;
    const output = document.getElementById("myOutput");
    output.style.display = "block";
    window.onclick = function (event) {
        if (event.target == output) {
            output.style.display = "none";
        }
    }
    outputView.innerHTML = `<h2><strong>${artist}</strong> - ${songTitle}</h2> <br/> <pre class="lyrics-text">${lyrics}</pre>`;
}