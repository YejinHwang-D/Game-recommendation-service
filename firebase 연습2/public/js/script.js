const ranking = document.getElementsByClassName('rankingArea')
const gameinfo = document.getElementsByClassName('game')
const game_rank = document.getElementsByClassName('rank')
const game_icon = document.getElementsByClassName('app-image')
const game_name = document.getElementsByClassName('gamename')

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

const createcard = (data) => {
    const card = document.createElement('div');
    card.classList.add('game');
    card.id = '${data.id}';
    card.innerHTML = `
    <p class="rank">?위</p>
    <img class="app-image" src="${data.background_image}">
    <p class="gamename">${data.name}</p>
    <ul class="hashtags">
    <li class="hashtag">#호러</li>
    <li class="hashtag">#잔인함</li>
    <li class="hashtag">#협동</li>
    <li class="hashtag">#놀램주의</li>
    </ul>`;

    return card;
}

const showRanking = async (game_list) =>{
    const pregames= document.querySelector('.games')
    const games = document.createElement('div');
    games.classList.add('games');
    game_list.forEach((data) => {
        const card = createcard(data);
        games.append(card);
    });
    
    if(pregames){
        pregames.replaceWith(games);
    }
    else{
        ranking.append(games);
    }
}

const init = async () => {
    let games = await getgameList();
    showRanking(games);
}

init();