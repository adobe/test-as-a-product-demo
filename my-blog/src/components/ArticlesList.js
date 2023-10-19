/*
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */

import { Link } from "react-router-dom";


const ArticlesList = ( { articles } ) => {
    return (
        <>
        {articles.map( article =>
            <Link  to={`/articles/${article.name}`} key={`${article.name}`} data-testid={`${article.name}`} className="article-list-item">
            <h3>{article.title}</h3>
            <p>{article.content[0].substring(0,150)}...</p>
            </Link>
        )}
        </>
    );
}

export default ArticlesList;