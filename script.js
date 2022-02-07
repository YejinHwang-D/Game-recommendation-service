

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
const apigamelist = `https://api.rawg.io/api/games?key=${api_Key}&page=3&`

const Top3 = [];

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

const Top3ranklist = async (game_list) =>{
    game_list.forEach((data) => checkingTop3(Top3, data));
    console.log(Top3);


    const pregames= document.querySelector('.rankingArea')
    const games = document.createElement('div');
    games.classList.add('rankingArea');
    const createrankcard = (data) => {
        const card = document.createElement('div');
        card.classList.add('game');
        card.id = '${data.id}';
        card.innerHTML = `
        <p class="rank">${Top3.indexOf(data) + 1}위</p>
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
    Top3.forEach((data) => {
        const card = createrankcard(data);
        games.append(card);
    });
    
    if(pregames){
        pregames.replaceWith(games);
    }
    else{
        ranking.append(games);
    }
}

const checkingTop3 = (Top3, data) => {

    if(Top3.length == 0){
        Top3.push(data);
    }
    else{
        Top3.forEach((toplist) =>{
            if(Top3.indexOf(data) >= 0){
                console.log(Top3.indexOf(data));
                console.log("pass");
            }
            else if(toplist.metacritic < data.metacritic){
                let num = Top3.indexOf(toplist);
                Top3.splice(num, 1, data);
                toplist = data;
            }
            else if(Top3.length < 3){
                Top3.push(data);
            }
        })
    }
}

const createcard = (data) => {
    const card = document.createElement('div');
    card.classList.add('game');
    card.id = '${data.id}';
    card.innerHTML = `
    <img class="app-image" src="${data.background_image}">
    <p class="gamename">${data.name}</p>
    <p class="metacritic">${data.metacritic}</p>
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
    Top3ranklist(games);
}

init();