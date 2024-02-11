let currentSong = new Audio();
let songs;
let currFolder;


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder=folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    //Show all the songs in the playlist

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + ` <li><img class="invert" src="img/music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
            <div>Sumit</div>
        </div></li>`;

    }

    //Add an event listner to each song

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)

        })
         
    })    

      return songs

}

const playMusic=(track, pause=false)=>{
    currentSong.src = `/${currFolder}/` + track
        
    if(!pause){
        currentSong.play()
        play.src = "img/pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)    
    document.querySelector(".T-1").innerHTML = "0:00"
    document.querySelector(".T-2").innerHTML = "0:00"

    

}

async function displayAlbums(){
    let a  = await fetch(`http://127.0.0.1:5500/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
        if(e.href.includes("/songs/")){
            let folder=e.href.split("/").slice(-1)[0]
            // Get the metadata of the folder
            let a  = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
            let response = await a.json();
            
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
            <div class="play">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                        stroke-linejoin="round" />
                </svg>
            </div>

            <img src="songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
        }
        
        
    }
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            console.log(`songs/${item.currentTarget.dataset.folder}`);
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })
    
}

async function main() {

    //Get the List of All songs
    await getSongs("songs/AnotherLove")
    playMusic(songs[0], true)

    displayAlbums()    

    //Attach an event listener to play, next and previous

    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src="img/pause.svg"

        } else{
            currentSong.pause()
            play.src="img/play.svg"
        }

    })

    previous.addEventListener("click", () => {
        currentSong.pause()
        
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    next.addEventListener("click", () => {
        currentSong.pause()
        

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    //Listen for timeupdate event

    currentSong.addEventListener("timeupdate",()=>{
        
        document.querySelector(".T-1").innerHTML = `${
            secondsToMinutesSeconds(currentSong.currentTime)
        }`
        document.querySelector(".T-2").innerHTML = `${
            secondsToMinutesSeconds(currentSong.duration)
        }`
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100 +"%"

    })

    //Add an event listener to seekbar

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    //Add an event listener for harmburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left="0"
    })

    //Add an event listener for close
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left="-120%"
    })

    //Add an event listener for volume button
    document.querySelector(".soundbar").addEventListener("click", e=>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle2").style.left = percent + "%";
        currentSong.volume=percent / 100
    })

    //Add an event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src=e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume=0;
            document.querySelector(".circle2").style.left = "-0.5%";
            
        }else{
            e.target.src=e.target.src.replace("mute.svg","volume.svg");
            currentSong.volume = .10;
            document.querySelector(".circle2").style.left = "10%";
           
        }  
    })

    
     

}

main()


