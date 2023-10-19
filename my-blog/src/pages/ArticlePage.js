/*
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import articles from "./article-content";
import NotFoundPage from "./NotFoundPage";
import CommentsList from "../components/CommentsList";
import AddCommentForm from "../components/AddComentForm";

const  ArticlePage = () => {
    const [articleInfo, setArticleInfo] = useState({ upvotes: 0, comments: []});

    const {articleId} = useParams();

    useEffect( () => {
        const loadArticleInfo = async () => {
            const response = await axios.get(`/api/articles/${articleId}`);
            const newArticleInfo = response.data;
            setArticleInfo(newArticleInfo);
            //console.log(newArticleInfo);
        }

        loadArticleInfo();
        
    }, []);

    const article = articles.find(article => article.name === articleId)

    const addUpvote = async() => {
        const response = await axios.put(`/api/articles/${articleId}/upvote`);
        const upVotedArticle = response.data;
        setArticleInfo(upVotedArticle);
    }

    if (!article) {
        return <NotFoundPage/>
    }

    return (
        <>
        <h1>{article.title}</h1>
        <div className="upvotes-section">
            <button onClick={addUpvote}>Upvote</button>
            <p>This article has {articleInfo.upvotes} upvote(s)</p>
        </div>
        {article.content.map((paragraph,i )=> (
            <p key={i}>{paragraph}</p>
        ))}
        <AddCommentForm articleName={articleId} onArticleUpdated={upDatedArticle => setArticleInfo(upDatedArticle)}/>
        <CommentsList comments={articleInfo.comments}/>
        </>

    );
}

export default ArticlePage;