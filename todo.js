const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash');

const Todo = require('./models/todoItem');
const User = require('./models/user');
const formatDateToJapanese = require('./js/dateFormat');

mongoose.connect('mongodb://localhost:27017/todolist', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
}).then(() => {
    console.log('MongoDBコネクションOK');
}).catch(err => {
    console.log('MongoDBコネクションエラー');
    console.log(err);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/css', express.static(__dirname + '/css'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({secret: 'mysecret'}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/fakeUser', async (req,res) => {
    const user = new User({email: 'hogegege@example.com', username:'hogegege'});
    const newUser = await User.register(user,'mogegege');
    res.send(newUser);
})

app.get('/todos', async (req, res) => {
    const todos = await Todo.find({});
    res.render('index', { todos, formatDateToJapanese });
})

app.get('/todos/new', (req, res) => {
    res.render('new');
});

app.post('/todos', async (req, res) => {
    console.log(req.body);
    const newTodo = new Todo({ body: req.body.body, done: false, deadLine: req.body.deadline });
    await newTodo.save();
    res.redirect('/todos');
});

app.get('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    res.render('show', { todo });
});

app.get('/todos/:id/edit', async (req, res) => {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    res.render('edit', { todo });
})
app.put('/todos/:id/edit', async (req, res) => {
    const { id } = req.params;
    await Todo.findByIdAndUpdate(id, { body: req.body.body });
    res.redirect('/todos');
})
app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const deleteTodo = await Todo.findByIdAndDelete(id);
    res.redirect('/todos');
})
app.put('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    if (todo) {
        todo.done = !todo.done; // 状態を反転
        await todo.save();
    }
    res.redirect('/todos');
});

app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const user = new User({
        username
    });
    const registeredUser = await User.register(user, password);
    res.redirect('/')
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login',passport.authenticate('local',{failureFlash:true, failureRedirect: '/login'}), (req,res) => {
    res.redirect('/');
})

app.get('/secret', (req, res) => {
    if(!req.session.user_id){
        return res.redirect('/login');
    }
    res.send('ここはログイン済みの場合だけ見れる秘密のページ');
})
app.listen(3000, () => {
    console.log('ポート3000でリクエスト待受中...');
})