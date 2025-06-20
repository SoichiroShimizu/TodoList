const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const Todo = require('./models/todoItem');
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

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/todos', async (req, res) => {
    const todos = await Todo.find({});
    res.render('index', { todos ,formatDateToJapanese});
})

app.get('/todos/new', (req, res) => {
    res.render('new');
});

app.post('/todos', async (req, res) => {
    console.log(req.body);
    const newTodo = new Todo({body: req.body.body, done: false,deadLine:req.body.deadline});
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
app.put('/todos/:id/edit', async(req,res) => {
    const {id} = req.params;
    await Todo.findByIdAndUpdate(id,{body:req.body.body});
    res.redirect('/todos');
})
app.delete('/todos/:id', async (req,res) => {
    const {id} = req.params;
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

app.listen(3000, () => {
    console.log('ポート3000でリクエスト待受中...');
})