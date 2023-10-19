/*
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
package com.bridgeservice.demo.backend;

import io.restassured.path.json.JsonPath;
import org.hamcrest.Matchers;
import org.testng.annotations.Test;

import static org.hamcrest.MatcherAssert.assertThat;

public class GeneralBackEnd {
    private static final String STD_URL = "http://localhost:8000/";

    @Test
    public void testAllIsUp() {

        assertThat("We should be up", MyBlogBackEnd.isSystemUp(STD_URL));
    }

    @Test
    public void testUpVote() {
        JsonPath l_article = MyBlogBackEnd.fetchArticle(STD_URL, "learn-german");
        int currentUpvote = Integer.parseInt(l_article.get("upvotes").toString());
        System.out.println(currentUpvote);
        currentUpvote++;

        JsonPath newValue = MyBlogBackEnd.upVoteArticle(STD_URL, "learn-german");
        assertThat("We should find the upvote", newValue.getInt("upvotes"), Matchers.equalTo(currentUpvote));

    }

    @Test
    public void testUpVoteNegative() {
        JsonPath l_article = MyBlogBackEnd.upVoteArticle(STD_URL, "learn-nothing");

        assertThat("We should find the upvote", l_article, Matchers.nullValue());
    }

    @Test
    public void testFetchArticle() {
        JsonPath l_result = MyBlogBackEnd.fetchArticle(STD_URL, "learn-swedish");
        assertThat("We should find the upvote", l_result.get("_id"), Matchers.equalTo("100013"));

    }

    @Test
    public void testFetchArticleNegative() {
        JsonPath l_result = MyBlogBackEnd.fetchArticle(STD_URL, "learn-nothing");
        assertThat("We should find the upvote", l_result.get("error"), Matchers.equalTo("Not found!"));

        MyBlogBackEnd.isSystemUp(STD_URL);
    }

    @Test
    public void testPostComment() {
        String l_articleID = "learn-swedish";
        JsonPath before = MyBlogBackEnd.fetchArticle(STD_URL, l_articleID);

        int commentsBefore = before.getInt("comments.size()");

        int commentsAfter = commentsBefore + 1;
        String l_commentator = "Hank" + commentsAfter;
        String l_comment = "This is a comment nr " + commentsAfter + "!";

        assertThat("We should successfully add our comment",
                MyBlogBackEnd.addCommentToArticle(STD_URL, l_commentator, l_comment, l_articleID));

        JsonPath after = MyBlogBackEnd.fetchArticle(STD_URL, l_articleID);

        assertThat("We should be able to get the body", after.get("comments[" + commentsBefore + "].postedBy"),
                Matchers.equalTo(l_commentator));
    }

}
