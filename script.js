

const ranking = document.getElementsByClassName('rankingArea')
const gameinfo = document.getElementsByClassName('game')
const game_rank = document.getElementsByClassName('rank')
const game_icon = document.getElementsByClassName('app-image')
const game_name = document.getElementsByClassName('gamename')

//api 예시
//GET https://api.rawg.io/api/platforms?key=YOUR_API_KEY
//GET https://api.rawg.io/api/games?key=YOUR_API_KEY&dates=2019-09-01,2019-09-30&platforms=18,1,7

const api_Key = "3c4db8d9f2fb4602938c65f41f06df0b";

let apiUrlset = "https://api.rawg.io/api/"
const apigamelist = `https://api.rawg.io/api/games?key=${api_Key}&`

const getgameList = async () => {
    const resp = await fetch(apigamelist + "size=50", {
        mod: 'crs',
        method: 'GET',
        crossDomain: true,
        headers:{
            'User-Agent': 'game-recommand-service'
        }
    });
    const data = await resp.json();
    
    return data.results;
}

const showRanking = async (game_list) =>{
    const gamesinfoarea = document.getElementsByClassName('games')
    const card = (data) => `<div class="game" >
        <p class="rank">?위</p>
        <img class="app-image" src="${data.background_image}">
        <p class="gamename">${data.name}</p>
        <ul class="hashtags">
        <li class="hashtag">#호러</li>
        <li class="hashtag">#잔인함</li>
        <li class="hashtag">#협동</li>
        <li class="hashtag">#놀램주의</li>
        </ul>
    </div>
    `;
    let cards ='';
    game_list.forEach((data) => {
        cards += card(data);
    });

    console.log(cards);
    gamesinfoarea.innerHTML = cards;
}

const init = async () => {
    let games = await getgameList();
    showRanking(games);
}

init();