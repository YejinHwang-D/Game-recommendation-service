const express = require('express');
var request = require('request');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
var url = require('url');
var qs = require('querystring');
var ejs = require('ejs');
const cors = require('cors');
const path = require('path');
const User = require('./config');
const TestData = require('./config');
const ref = require('firebase');
const app = express()
app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))

//session
app.use(expressSession({
  secret: 'abcdef',
  resave: true, //세션을 언제나 저장할지?
  saveUninitialized: true,
  httpOnly: true, //JS로 세션 쿠키 사용 못하게 막음
}))

//db
const firebase = require('firebase');
const firebaseConfig = {
    apiKey: "AIzaSyC167s4_cS5Q8P0qLiym8-CyoCRztFJ82o",
    authDomain: "practice-firebase-441a2.firebaseapp.com",
    databaseURL: "https://practice-firebase-441a2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "practice-firebase-441a2",
    storageBucket: "practice-firebase-441a2.appspot.com",
    messagingSenderId: "103032202119",
    appId: "1:103032202119:web:091c703ba80969592ba922",
    measurementId: "G-ZGDVXL9MQ1"
};

const db = firebase.firestore();


//views
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
app.use(express.static(__dirname + '/public'));


//environment variables
var list_Count = 30;
const userAgent = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36' };
var api_key = 'df6d88f2a5bd4280898352a6420dcf56';
  var api_url = 'https://api.rawg.io/api/games?key=' + api_key + 'dates=2019-01-01,2019-12-31&ordering=-added';
  var options = {
    method: 'GET',
    header: userAgent,
    url: api_url,
    qs: {
      key: api_key,
      ordering: '-relevance',
      discover: true,
      page_size: list_Count
    }
  };

  const apiCall = async options => {
    const rawgRequest = () => {
      return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
          try {
            resolve(JSON.parse(body));
            console.body
          } catch (e) {
            reject(e);
          }
        });
      });
    };
    try {
      parsedResult = await rawgRequest();
    } catch (e) {
      console.error(e);
    }
    //parsedResult가 우리가 원하는 body
    return parsedResult; //따라서 결과는 이걸 리턴하는 함수인 것
  };


app.get("/testtest", (req, res) => {
    const usersRef = ref.child('users');
usersRef.set({
  alanisawesome: {
    date_of_birth: 'June 23, 1912',
    full_name: 'Alan Turing'
  },
  gracehop: {
    date_of_birth: 'December 9, 1906',
    full_name: 'Grace Hopper'
  }
});
})



//routes
app.get("/", (req, res) => {
    if (req.session.user) {
      console.log(req.session.user['id'])

      
      res.render("index", { user_id: req.session.user['id'], text: "로그인o" });
    }
    else {
      res.render("index", {user_id: "", text: "로그인x"});
    }
})

app.get("/signin", (req, res) => {
  if (req.session.user) {
    res.render("index", {user_id: req.session.user['id']});
  }
  else {
    res.render("signin", {user_id: "", text: "로그인x"});
  }
})

app.post("/signin-process", function(req, res) {
  firebase.auth().signInWithEmailAndPassword(req.body.id, req.body.pw)
  .then(function(firebaseUser) {
    req.session.user = {
      id: req.body.id,
      name: req.body.id,
    }
    res.send("<script>alert('로그인 성공');location.href='/';</script>");
  })
  .catch(function(error) {
    console.log(error.code)
    res.send("<script>alert('로그인 실패');location.href='/signin';</script>");
  })
})

app.get("/signout", function(req, res) {
  if (req.session.user) {
    req.session.destroy(function(err){
      if (err) throw err;
      res.send("<script>alert('로그아웃됨');location.href='/';</script>");
    })
  }
  else {
    console.log("로그인 상태 아님");
    res.redirect("/signin");
  }
})


app.get("/signup", (req, res) => {
  if (req.session.user) {
    res.render("index", {user_id: req.session.user['id']});
  }
  else {
    res.render("signup", {user_id: ""});
  }
})

app.post("/signup-process", function(req, res) {
  const name = req.body.name;
  const id = req.body.id;
  const pwd = req.body.pwd;
  const repwd = req.body.repwd;
  
  if (pwd != repwd) {
    res.send("<script>alert('비밀번호가 일치하지 않습니다.<br>회원가입 페이지로 이동합니다.');location.href='/signup';</script>");
  }
  else {
    firebase.auth().createUserWithEmailAndPassword(id, pwd)
    .then(function(firebaseUser) {
      console.log(firebaseUser.user.email);
      db.collection(firebaseUser.user.email).doc("LikeList").set({
        "state": false,
      });
      
      res.send("<script>alert('회원가입 완료<br>로그인 페이지로 이동합니다.');location.href='/signin';</script>");
      
    })
    .catch(function(error){
      console.log(error.code);
      if (error.code == 'auth/email-already-in-use') {
        res.send("<script>alert('이미 존재하는 계정입니다.');location.href='/signup';</script>");
      }
      else {
        res.send("<script>alert('회원가입 실패<br>회원가입 페이지로 이동합니다.');location.href='/signup';</script>");
      }
      
    })
  }
})




app.get("/ranking", (req, res) => {
  if (req.session.user) {
    res.render("ranking", {user_id: req.session.user['id']});
  }
  else {
    res.render("ranking", {user_id: ""});
  }
})

//api 요청 주소
app.get('/api/gamelist', async (req, res) => {
    res_list = [];
    genres_temp = [];
    res.set('Cache-Control', 'no-cache');
    resListBody = await apiCall(options);
    
    if (req.session.user) {
      //user가 있을 때.
      for (var i=0; i<list_Count; i++) {
        genres_temp = [];
        arr = resListBody.results[i].genres;
        arr.forEach(function(item, index) {
          genres_temp.push(item.name);
        })
  
        res_list.push({
          "name": resListBody.results[i].name,
          "released": resListBody.results[i].released,
          "rating": resListBody.results[i].rating,
          "genres": genres_temp,
          "background_image": resListBody.results[i].background_image,
        })
        var docRef = db.collection(req.session.user['id']).doc("LikeList");
        docRef.get().then(function(res) {
        if (res.exists) {
          //console.log(res.data().state) //false. 그냥 res.data()하면 { state: false } 형태로 나옴.
          if (res.data().state == false) {
            db.collection(req.session.user['id']).doc(resListBody.results[i].name).set(
                {
                  "name": resListBody.results[i].name,
                  "released": resListBody.results[i].released,
                  "rating" : resListBody.results[i].rating,
                  "genres": genres_temp,
                  "background_image": resListBody.results[i].background_image,
                  "like": 0, //기본값은 0. 좋아요는 1. 싫어요는 -1
                  "save_check": 0, //최초 저장 안됨 0, 최초 저장 됨 1
                }
              );
              db.collection(req.session.user['id']).doc("LikeList").set({
                "state": true,
              });
            }
        }
        })
      }
      res.render('showList', {list: res_list, user_id: req.session.user['id']}, (error, html) => {
        if (error) {
          console.log(error);
        }
        else {
          res.end(html);
        }
      })
    }
    else {
      //유저가 없을 때.
      for (var i=0; i<list_Count; i++) {
        genres_temp = [];
        arr = resListBody.results[i].genres;
        arr.forEach(function(item, index) {
          genres_temp.push(item.name);
        })
  
        res_list.push({
          "name": resListBody.results[i].name,
          "released": resListBody.results[i].released,
          "rating": resListBody.results[i].rating,
          "genres": genres_temp,
          "background_image": resListBody.results[i].background_image,
        })
      }
      res.render('showList', {list: res_list, user_id: ""}, (error, html) => {
        if (error) {
          console.log(error);
        }
        else {
          res.end(html);
        }
      })
    }
  });

app.post("/api/gamelist/:number", async (req, res) => {
  if (req.session.user) {
    var number = req.params.number;
    var likeType = 0;
    console.log(number);
    console.log(req.body.gameName);
    if (req.body.like === "like") {
      likeType = 1;
   }
    else {
      likeType = -1;
    }
    console.log("likeType = " + likeType);
    const likeRef = db.collection(req.session.user['id']).doc(req.body.gameName);
    const resThen = await likeRef.update({like: likeType});
    res.send("<script>alert('"+req.body.gameName+"에 대한 회원님의 선호도가 입력되었습니다.');location.href='/api/gamelist';</script>");
  }
  else {
    res.send("<script>alert('회원만 선택하실 수 있습니다.');location.href='/api/gamelist';</script>");
  }
})










app.get("/check", async (req, res) => {
    const snapshot = await User.get();
    const list = snapshot.docs.map((doc) => ({id:doc.id, ...doc.data()}));
    //const list = snapshot.docs.map((doc) => doc.data());
    res.send(list);
})

app.post("/create", async(req, res)=>{
    const data =req.body;
    await User.add(data);
    res.send({msg: "User Added"});
})

app.post("/update", async(req, res)=>{
    const id =req.body.id;
    console.log("Before deleting ID", req.body)
    delete req.body.id;
    console.log("After deleting ID", req.body)
    const data = req.body;
    await User.doc(id).update(req.body);
    res.send({msg: "Updated"});
})

app.listen(3000, ()=> console.log("Running!"))