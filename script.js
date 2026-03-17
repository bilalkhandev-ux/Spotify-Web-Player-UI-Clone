<<<<<<< HEAD
let currentsong = new Audio();
let songs;
let currfolder;

function secendsTominutes(secend) {

    if (isNaN(secend) || secend < 0) {
        return "00:00";
    }

    const minutes = Math.floor(secend / 60);
    const rsecends = Math.floor(secend % 60);

    const formattedMinute = String(minutes).padStart(2, `0`);
    const formattedSecend = String(rsecends).padStart(2, `0`);

    return `${formattedMinute}:${formattedSecend}`;
}

async function getsongs(folder) {

    currfolder = folder;

    let a = await fetch(`http://127.0.0.1:4000/${folder}/`)
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

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]

    songUL.innerHTML = ""

    for (const song of songs) {

        songUL.innerHTML = songUL.innerHTML + `<li> 
                            <img class="invert" src="img/music.svg" alt="" height="28px">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Bilal</div>
                            </div>
                            <div class="playnow">
                                <span>Play now</span>
                                <img src="img/pl.png" alt="" height="40px">
                            </div>
                             </li>`
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {

        e.addEventListener("click", () => {

            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })

    })

    return songs
}

const playMusic = (track, pause = false) => {

    currentsong.src = `http://127.0.0.1:4000/${currfolder}/` + track

    if (!pause) {

        currentsong.play()

        playb.src = "img/pause.svg"

    } else {

        playb.src = "img/play.svg"

    }

    document.querySelector(".songInfo").innerHTML = decodeURI(track)

    document.querySelector(".songTime").innerHTML = "00:00 / 00:00"

}

async function displayAlbums() {

    let a = await fetch(`http://127.0.0.1:4000/songs/`)
    let response = await a.text()

    let div = document.createElement("div")

    div.innerHTML = response

    let anchors = div.getElementsByTagName("a")

    let cardContainer = document.querySelector(".cardContainer")

    let array = Array.from(anchors)

    for (let index = 0; index < array.length; index++) {

        const e = array[index];

        if (e.href.includes("/songs")) {

            let folder = e.href.split("/").filter(x => x).pop()

            let a = await fetch(`http://127.0.0.1:4000/songs/${folder}/info.json`)

            let response = await a.json()

            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">

                                 <div class="play">
                                     <img src="img/pl.png" width="74px">
                                </div>

                                 <img src="http://127.0.0.1:4000/songs/${folder}/cover.png">

                                 <h2>${response.title}</h2>

                                 <p>${response.description}</p>

                             </div>`
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {

        e.addEventListener("click", async item => {

            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)

            playMusic(songs[0])

        })

    })

}

async function main() {

    await getsongs("songs/mood")

    playMusic(songs[0], true)

    playb.src = "img/play.svg"

    displayAlbums();

    playb.addEventListener("click", () => {

        if (currentsong.paused) {

            currentsong.play()

            playb.src = "img/pause.svg"

        }

        else {

            currentsong.pause()

            playb.src = "img/play.svg"

        }

    })

    previous.addEventListener("click", () => {

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])

        if ((index - 1) >= 0) {

            playMusic(songs[index - 1])

        }

    })

    next.addEventListener("click", () => {

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])

        if ((index + 1) < songs.length) {

            playMusic(songs[index + 1])

        }

    })

    currentsong.addEventListener("timeupdate", () => {

        // Don't update if user is dragging seekbar
        if (isDragging) {
            return
        }

        if (currentsong.duration && !isDragging) {

            document.querySelector(".songTime").innerHTML =
                `${secendsTominutes(currentsong.currentTime)} / ${secendsTominutes(currentsong.duration)}`

            document.querySelector(".circle").style.left =
                (currentsong.currentTime / currentsong.duration) * 100 + "%"

        }

    })

    // SEEKBAR - Click to seek

    const seekbar = document.querySelector(".seekbar")
    const circle = document.querySelector(".circle")
    const songTime = document.querySelector(".songTime")
    let isDragging = false
    let wasPlaying = false
    
    // Simple click on seekbar to seek
    seekbar.addEventListener("click", (e) => {
        if (!currentsong.duration || isNaN(currentsong.duration)) {
            return
        }
        
        // Get seekbar position and calculate percent
        const rect = seekbar.getBoundingClientRect()
        const clickX = e.clientX - rect.left
        const percent = Math.max(0, Math.min(1, clickX / rect.width))
        
        // Calculate new time
        const newTime = percent * currentsong.duration
        
        // Check if song was playing
        wasPlaying = !currentsong.paused
        isDragging = true
        
        // Create a promise-based seek
        const seekPromise = new Promise((resolve) => {
            // Set the currentTime
            currentsong.currentTime = newTime
            
            // Listen for seeked event
            const onSeeked = () => {
                currentsong.removeEventListener("seeked", onSeeked)
                resolve()
            }
            currentsong.addEventListener("seeked", onSeeked)
            
            // Backup timeout in case seeked doesn't fire
            setTimeout(() => {
                resolve()
            }, 500)
        })
        
        // Wait for seek to complete, then update UI
        seekPromise.then(() => {
            // Update UI
            circle.style.left = (percent * 100) + "%"
            songTime.innerHTML = `${secendsTominutes(currentsong.currentTime)} / ${secendsTominutes(currentsong.duration)}`
            
            // Resume if was playing
            if (wasPlaying) {
                currentsong.play()
            }
            
            isDragging = false
        })
    })
    
    // Circle drag functionality
    circle.addEventListener("mousedown", (e) => {
        isDragging = true
        wasPlaying = !currentsong.paused
        currentsong.pause()
        e.preventDefault()
        e.stopPropagation()
    })
    
    document.addEventListener("mousemove", (e) => {
        if (isDragging && currentsong.duration) {
            const rect = seekbar.getBoundingClientRect()
            const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
            circle.style.left = (percent * 100) + "%"
            currentsong.currentTime = percent * currentsong.duration
        }
    })
    
    document.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false
            if (wasPlaying) currentsong.play()
        }
    })

    document.querySelector(".hamburger").addEventListener("click", () => {

        document.querySelector(".left").style.left = "0"

    })

    document.querySelector(".close").addEventListener("click", () => {

        document.querySelector(".left").style.left = "-120%"

    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {

        currentsong.volume = parseInt(e.target.value) / 100

    })

    document.querySelector(".volume>img").addEventListener("click", e => {

        if (e.target.src.includes("img/volume.png")) {

            e.target.src = e.target.src.replace("img/volume.png", "img/mute.png")

            currentsong.volume = 0

            document.querySelector(".range").getElementsByTagName("input")[0].value = 0

        }

        else {

            e.target.src = e.target.src.replace("img/mute.png", "img/volume.png")

            currentsong.volume = 0.5

            document.querySelector(".range").getElementsByTagName("input")[0].value = 50

        }

    })

}

=======
let currentsong = new Audio();
let songs;
let currfolder;

function secendsTominutes(secend) {

    if (isNaN(secend) || secend < 0) {
        return "00:00";
    }

    const minutes = Math.floor(secend / 60);
    const rsecends = Math.floor(secend % 60);

    const formattedMinute = String(minutes).padStart(2, `0`);
    const formattedSecend = String(rsecends).padStart(2, `0`);

    return `${formattedMinute}:${formattedSecend}`;
}

async function getsongs(folder) {

    currfolder = folder;

    let a = await fetch(`http://127.0.0.1:4000/${folder}/`)
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

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]

    songUL.innerHTML = ""

    for (const song of songs) {

        songUL.innerHTML = songUL.innerHTML + `<li> 
                            <img class="invert" src="img/music.svg" alt="" height="28px">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Bilal</div>
                            </div>
                            <div class="playnow">
                                <span>Play now</span>
                                <img src="img/pl.png" alt="" height="40px">
                            </div>
                             </li>`
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {

        e.addEventListener("click", () => {

            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })

    })

    return songs
}

const playMusic = (track, pause = false) => {

    currentsong.src = `http://127.0.0.1:4000/${currfolder}/` + track

    if (!pause) {

        currentsong.play()

        playb.src = "img/pause.svg"

    } else {

        playb.src = "img/play.svg"

    }

    document.querySelector(".songInfo").innerHTML = decodeURI(track)

    document.querySelector(".songTime").innerHTML = "00:00 / 00:00"

}

async function displayAlbums() {

    let a = await fetch(`http://127.0.0.1:4000/songs/`)
    let response = await a.text()

    let div = document.createElement("div")

    div.innerHTML = response

    let anchors = div.getElementsByTagName("a")

    let cardContainer = document.querySelector(".cardContainer")

    let array = Array.from(anchors)

    for (let index = 0; index < array.length; index++) {

        const e = array[index];

        if (e.href.includes("/songs")) {

            let folder = e.href.split("/").filter(x => x).pop()

            let a = await fetch(`http://127.0.0.1:4000/songs/${folder}/info.json`)

            let response = await a.json()

            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">

                                 <div class="play">
                                     <img src="img/pl.png" width="74px">
                                </div>

                                 <img src="http://127.0.0.1:4000/songs/${folder}/cover.png">

                                 <h2>${response.title}</h2>

                                 <p>${response.description}</p>

                             </div>`
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {

        e.addEventListener("click", async item => {

            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)

            playMusic(songs[0])

        })

    })

}

async function main() {

    await getsongs("songs/mood")

    playMusic(songs[0], true)

    playb.src = "img/play.svg"

    displayAlbums();

    playb.addEventListener("click", () => {

        if (currentsong.paused) {

            currentsong.play()

            playb.src = "img/pause.svg"

        }

        else {

            currentsong.pause()

            playb.src = "img/play.svg"

        }

    })

    previous.addEventListener("click", () => {

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])

        if ((index - 1) >= 0) {

            playMusic(songs[index - 1])

        }

    })

    next.addEventListener("click", () => {

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])

        if ((index + 1) < songs.length) {

            playMusic(songs[index + 1])

        }

    })

    currentsong.addEventListener("timeupdate", () => {

        // Don't update if user is dragging seekbar
        if (isDragging) {
            return
        }

        if (currentsong.duration && !isDragging) {

            document.querySelector(".songTime").innerHTML =
                `${secendsTominutes(currentsong.currentTime)} / ${secendsTominutes(currentsong.duration)}`

            document.querySelector(".circle").style.left =
                (currentsong.currentTime / currentsong.duration) * 100 + "%"

        }

    })

    // SEEKBAR - Click to seek

    const seekbar = document.querySelector(".seekbar")
    const circle = document.querySelector(".circle")
    const songTime = document.querySelector(".songTime")
    let isDragging = false
    let wasPlaying = false
    
    // Simple click on seekbar to seek
    seekbar.addEventListener("click", (e) => {
        if (!currentsong.duration || isNaN(currentsong.duration)) {
            return
        }
        
        // Get seekbar position and calculate percent
        const rect = seekbar.getBoundingClientRect()
        const clickX = e.clientX - rect.left
        const percent = Math.max(0, Math.min(1, clickX / rect.width))
        
        // Calculate new time
        const newTime = percent * currentsong.duration
        
        // Check if song was playing
        wasPlaying = !currentsong.paused
        isDragging = true
        
        // Create a promise-based seek
        const seekPromise = new Promise((resolve) => {
            // Set the currentTime
            currentsong.currentTime = newTime
            
            // Listen for seeked event
            const onSeeked = () => {
                currentsong.removeEventListener("seeked", onSeeked)
                resolve()
            }
            currentsong.addEventListener("seeked", onSeeked)
            
            // Backup timeout in case seeked doesn't fire
            setTimeout(() => {
                resolve()
            }, 500)
        })
        
        // Wait for seek to complete, then update UI
        seekPromise.then(() => {
            // Update UI
            circle.style.left = (percent * 100) + "%"
            songTime.innerHTML = `${secendsTominutes(currentsong.currentTime)} / ${secendsTominutes(currentsong.duration)}`
            
            // Resume if was playing
            if (wasPlaying) {
                currentsong.play()
            }
            
            isDragging = false
        })
    })
    
    // Circle drag functionality
    circle.addEventListener("mousedown", (e) => {
        isDragging = true
        wasPlaying = !currentsong.paused
        currentsong.pause()
        e.preventDefault()
        e.stopPropagation()
    })
    
    document.addEventListener("mousemove", (e) => {
        if (isDragging && currentsong.duration) {
            const rect = seekbar.getBoundingClientRect()
            const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
            circle.style.left = (percent * 100) + "%"
            currentsong.currentTime = percent * currentsong.duration
        }
    })
    
    document.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false
            if (wasPlaying) currentsong.play()
        }
    })

    document.querySelector(".hamburger").addEventListener("click", () => {

        document.querySelector(".left").style.left = "0"

    })

    document.querySelector(".close").addEventListener("click", () => {

        document.querySelector(".left").style.left = "-120%"

    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {

        currentsong.volume = parseInt(e.target.value) / 100

    })

    document.querySelector(".volume>img").addEventListener("click", e => {

        if (e.target.src.includes("img/volume.png")) {

            e.target.src = e.target.src.replace("img/volume.png", "img/mute.png")

            currentsong.volume = 0

            document.querySelector(".range").getElementsByTagName("input")[0].value = 0

        }

        else {

            e.target.src = e.target.src.replace("img/mute.png", "img/volume.png")

            currentsong.volume = 0.5

            document.querySelector(".range").getElementsByTagName("input")[0].value = 50

        }

    })

}

>>>>>>> 55b4c8412e4d178d299883c902a85a1cbcb3b8a4
main();