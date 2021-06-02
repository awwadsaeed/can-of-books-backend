'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const { response } = require('express');

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT;

mongoose.connect(`${process.env.MONGODB_URI}`, { useNewUrlParser: true, useUnifiedTopology: true });

const bookSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String
})
const userSchema = new mongoose.Schema({
    email: String,
    books: [bookSchema],
})
const bookModel = mongoose.model('book', bookSchema);
const userModel = mongoose.model('user', userSchema);

function booksModelSeeding() {
    const naruto = new bookModel({
        name: 'naruto',
        description: 'japanese ninja anime',
        image: 'https://cdn.staticneo.com/w/naruto/Nprofile2.jpg'
    })
    const demonSlayer = new bookModel({
        name: 'kimitsu no yaiba',
        description: 'japanese fantasy anime',
        image: 'https://pics.filmaffinity.com/Demon_Slayer_Kimetsu_no_Yaiba_TV_Series-565420400-large.jpg'
    })
    const attackOnTitan = new bookModel({
        name: 'shingeki no kyojin',
        description: 'japanese fantasy anime with some weird giants',
        image: 'https://m.media-amazon.com/images/M/MV5BMTY5ODk1NzUyMl5BMl5BanBnXkFtZTgwMjUyNzEyMTE@._V1_.jpg'
    })

    naruto.save();
    demonSlayer.save();
    attackOnTitan.save();
}


function userModelSeeding() {
    const saeed = new userModel({
        email: 'saeedawwad450@gmail.com',
        books: [{
            name: 'shingeki no kyojin',
            description: 'japanese fantasy anime with some weird giants',
            image: 'https://m.media-amazon.com/images/M/MV5BMTY5ODk1NzUyMl5BMl5BanBnXkFtZTgwMjUyNzEyMTE@._V1_.jpg'
        },
        {
            name: 'naruto',
            description: 'japanese ninja anime',
            image: 'https://cdn.staticneo.com/w/naruto/Nprofile2.jpg'
        }]
    })
    saeed.save();
    // console.log(saeed);
}
// booksModelSeeding();
userModelSeeding();
app.post('/addBooks', addBooksHandler);
app.get('/', homeHandler);
app.get('/books', booksHandler);
app.delete('/deleteBook/:index', deleteBookHandler);
app.put('/updateBook/:index', updateBookHandler);
function booksHandler(req, res) {
    let userEmail = req.query.email;

    userModel.find({ email: userEmail }, function (err, userData) {
        if (err) {
            console.log('get, that did not work')
        } else {

            res.send(userData[0].books);
        }
    })
}
function addBooksHandler(req, res) {
    const { bookName, description, imageUrl, email } = req.body;
  
    userModel.find({ email: email }, (error, userData) => {
        if (error) {
            console.log('add, that just happened');
        } else {
            // console.log(userData[0].books);
            userData[0].books.push({
                name: bookName,
                description: description,
                image: imageUrl,
            })
            userData[0].save();
            res.send(userData[0].books);
        }
    })
}


function deleteBookHandler(req, res) {
    const { email } = req.query;
    const index = Number(req.params.index);
    userModel.find({ email: email }, (error, userData) => {
        if (error) { res.send('delete ,this just happened') }
        else {
            const newBookArr = userData[0].books.filter((book, idx) => {
                if (idx != index) {
                    return book;
                }
            })

            userData[0].books = newBookArr;
            userData[0].save();
            res.send(userData[0].books);
        }
    })
}

function updateBookHandler(req, res) {
    console.log(req.body);
    const { bookName, description, imageUrl,email } = req.body;
    const index = Number(req.params.index);
    userModel.findOne({ email: email }, (err, userData) => {
        if (err) {
            console.log('that just happened')
        } else {
            userData.books.splice(index, 1, {
                name: bookName,
                description: description,
                image: imageUrl
            })
            userData.save();
            res.send(userData.books);
        }
    })
    console.log(index);
}



function homeHandler(req, res) {

    res.send('working');
}
app.listen(PORT, () => {
    console.log(PORT);
})