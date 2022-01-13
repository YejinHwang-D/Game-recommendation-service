const ranking = document.getElementsByClassName('rankingArea')
const gamesinfoarea = document.getElementsByClassName('games')
const gameinfo = document.getElementsByClassName('game')
const game_rank = document.getElementsByClassName('rank')
const game_icon = document.getElementsByClassName('app-image')
const game_name = document.getElementsByClassName('gamename')

//api 예시: http://www.grac.or.kr/WebService/GameSearchSvc.asmx/game?gametitle=[게임물명]&entname=&rateno=&display=10&pageno=1
let apiUrl = "http://www.grac.or.kr/WebService/GameSearchSvc.asmx/game?"

//list api
let listapiURL = "https://api.rawg.io/api/games"

function showRanking(){
}