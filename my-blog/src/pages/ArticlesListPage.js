/*
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */

import articles from "./article-content";
import ArticlesList from "../components/ArticlesList";

const ArticlesListPage = () => {

    return (
        <>
        <h1>Articles</h1>
       <ArticlesList articles={articles} />
        </>
    );
}

export default ArticlesListPage;