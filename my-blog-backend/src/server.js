/*
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */

import express from "express";

let articlesInfo = [{
    name: 'learn-french',
    _id: '100003',
    upvotes: 0,
    comments: [],
},{
    name: 'learn-german',
    _id: '100007',
    upvotes: 0,
    comments: [
        {
			"postedBy": "Guido Macaroni",
			"text": "Dass ist ja grauenhaft."
		}
    ],
},{
    name: 'learn-swedish',
    _id: '100013',
    upvotes: 0,
    comments: [],
}]

const app = express();
app.use(express.json());


app.get('/test', async (req, res) => {

   res.send("Up");
});


app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params;
    
    const article = articlesInfo.find(a => a.name === name);
    if (article) {
        res.json(article);
    } else {
        res.statusCode = 404;
        res.send({"error": "Not found!"});
    }

});

app.put('/api/articles/:name/upvote', (req, res) => {
    const { name } = req.params;
    const article = articlesInfo.find(a => a.name === name);
    if (article) {
        article.upvotes+=1;
        res.json(article);
    } else {
        res.statusCode = 404;
        res.send(`The article ${name} does not exist.`)
    }
    
});

app.post('/api/articles/:name/comments', (req, res) => {
    const { name  } = req.params;
    const { postedBy, text} = req.body;
    const article = articlesInfo.find(a => a.name === name);

    if (article) {
        article.comments.push({postedBy, text});
        res.json(article);
    } else {
        res.send(`The article ${name} does not exist.`)
    }
});

    app.listen(8000, () => {
        console.log('Listening on port 8000');
})