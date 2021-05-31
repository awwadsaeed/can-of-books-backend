'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
app.use(cors());
const PORT = process.env.PORT;

mongoose.connect('mongodb://localhost:27017/books', { useNewUrlParser: true, useUnifiedTopology: true });

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
// userModelSeeding();

app.get('/', homeHandler);
app.get('/books', booksHandler);
function booksHandler(req, res) {
    let userEmail = req.query.email;

    userModel.find({ email: userEmail }, function (err, userData) {
        if (err) {
            console.log('psyc, that did not work')
        } else {
            // console.log(userData);
            // console.log(userData[0]);
            console.log(userData[0].books);
            res.send(userData[0].books);
        }
    })
}
function homeHandler(req, res) {

    res.send('working');

}
app.listen(PORT, () => {
    console.log(PORT);
})