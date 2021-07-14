const http = require('http');
const path = require('path');
const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config({
 path: path.join(__dirname , 'config/app.env'),

});
dotenv.config({
    path: path.join(__dirname , 'config/db.env'),
   
   });
const mainRouter = require('./routes/main');
const userRouter = require('./routes/user');
const guestbookRouter = require('./routes/guestbook');
const port = 8080;



// Environment Variables (환경변수)

// Application Setup
const application = express()
    // 1. static serve 
    .use(express.static(path.join(__dirname,process.env.STATIC_RESOURCES_DIRECTORY)))
    // session enviroonment
    .use(session({
        secret: 'mysite-session', // 쿠키 변조를 방지하기 위한 값
        resave: 'false', // 요청 처리에서 세션의 변경사항이 없어도 항상 저장
        saveUninitialized: false //  새로 세션을 생성할 때 "uninitialized" 상태로 뜬다. 따라서 로그인 세션에서는 false 하는 것이 좋다.
        
    }))

    // 2. request body parser
    .use(express.urlencoded({extended: true})) // application/x-www-form-urlencoded
    .use(express.json())                       // application/json
    // 3. view engine setup
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    // 4. request router
    .all('*', function(req, res, next) {
        res.locals.req = req;
        res.locals.res = res;
        next();
    })
    .use('/', mainRouter)
    .use('/user', userRouter)
    .use('/guestbook', guestbookRouter)
    .use((req,res) => res.render("error/404"));

// Server Setup    
http.createServer(application)
    .on('listening', function(){
        console.info(`Http Server running on port ${process.env.PORT}`);
    })
    .on('error', function(error){
        if(error.syscall !== 'listen'){
            throw error;
        }
        switch(error.code){
            case 'EACCESS':
                console.error(`Port: ${process.env.PORT} requires privileges`);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(`Port: ${process.env.PORT} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;        
        }
    })
    .listen(process.env.PORT);