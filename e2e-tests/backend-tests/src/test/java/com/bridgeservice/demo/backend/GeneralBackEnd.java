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

import java.util.List;
import java.util.Map;

public class GeneralBackEnd {
    private static final String STD_URL = "http://localhost:8000/";

    @Test
    public void testAllIsUp() {

        assertThat("We should be up and running", MyBlogBackEnd.isSystemUp(STD_URL));
    }

    @Test
    public void testUpVote() {
        Map article = MyBlogBackEnd.fetchArticle(STD_URL, "learn-swedish");
        int currentUpvote = Integer.parseInt(article.get("upvotes").toString());

        int newValue = MyBlogBackEnd.upVoteArticle(STD_URL, "learn-swedish");
        assertThat("The upvote should have been correctly incremented", newValue,
                Matchers.equalTo(currentUpvote+1));

    }

    @Test
    public void testUpVoteNegative() {
        Integer upvotes = MyBlogBackEnd.upVoteArticle(STD_URL, "learn-nothing");

        assertThat("We should not find the this article", upvotes, Matchers.nullValue());
    }

    @Test
    public void testFetchArticle() {
        Map result = MyBlogBackEnd.fetchArticle(STD_URL, "learn-swedish");
        assertThat("We should find this article", result.get("_id"), Matchers.equalTo("100013"));

    }

    @Test
    public void testFetchArticleNegative() {
        Map result = MyBlogBackEnd.fetchArticle(STD_URL, "learn-nothing");
        assertThat("We should show the correct error when the aricle does not exist", result.get("error"),
                Matchers.equalTo("Not found!"));

        MyBlogBackEnd.isSystemUp(STD_URL);
    }

    @Test
    public void testPostComment() {
        String articleID = "learn-swedish";
        Map before = MyBlogBackEnd.fetchArticle(STD_URL, articleID);

        int commentsBefore = ((List) before.get("comments")).size();

        int commentsAfter = commentsBefore + 1;
        String commentator = "Hank" + commentsAfter;
        String comment = "This is a comment nr " + commentsAfter + "!";

        assertThat("We should successfully add our comment",
                MyBlogBackEnd.addCommentToArticle(STD_URL, commentator, comment, articleID));

        Map lastComment = MyBlogBackEnd.fetchLastComment(STD_URL, articleID);

        assertThat("We should be able to see the that comment has been taken into consideration",
                lastComment.get("postedBy"),
                Matchers.equalTo(commentator));
    }

}
