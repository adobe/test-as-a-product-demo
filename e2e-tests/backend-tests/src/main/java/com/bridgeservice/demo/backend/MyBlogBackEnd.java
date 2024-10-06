/*
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */
package com.bridgeservice.demo.backend;

import io.restassured.http.ContentType;
import io.restassured.path.json.JsonPath;
import io.restassured.response.ExtractableResponse;
import io.restassured.response.Response;
import io.restassured.response.ResponseBody;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static io.restassured.RestAssured.given;

public class MyBlogBackEnd {

    public static final String API_ROOT = "api/articles/";

    public static ResponseBody fetchPostResponse(String url, String endPoint, Map<String, String> bodyData) {
        return given().body(bodyData).contentType(ContentType.JSON).post(url + endPoint).getBody();
    }

    private static ResponseBody fetchGetResponse(String url, String endPoint) {
        return given().when().get(url + endPoint).getBody();
    }

    private static ResponseBody fetchPutResponse(String url, String endPoint) {
        return given().put(url + endPoint).getBody();
    }

    /**
     * Checks if the system is up
     * 
     * @return true if the system is up and running
     */
    public static boolean isSystemUp(String url) {
        ResponseBody result = MyBlogBackEnd.fetchGetResponse(url, "test");
        return (result != null) ? result.asString().equals("Up") : false;
    }

    /**
     * Fetches a JSON representation of the article
     *
     * @param url       The url of the endpoint
     * @param articleId The ID of the article
     * @return A Json representation of the article
     */
    public static Map fetchArticle(String url, String articleId) {
        ResponseBody lr_returnJSON = MyBlogBackEnd.fetchGetResponse(url, API_ROOT + articleId);
        return lr_returnJSON.jsonPath().get();
    }

    /**
     * Upvotes the given article
     * 
     * @param url       The url of the endpoint
     * @param articleId The ID of the article
     * @return A Json representation of the article
     */
    public static Integer upVoteArticle(String url, String articleId) {

        ExtractableResponse<Response> returnValue = given().put(url + API_ROOT + articleId + "/upvote").then()
                .extract();
        if (returnValue.statusCode() == 404) {
            return null;
        }
        return returnValue.jsonPath().getInt("upvotes");
    }

    /**
     * Adds a comment to the article
     * 
     * @param url       The url of the endpoint
     * @param postedBy  The commentor
     * @param text      The comment
     * @param articleId The ID of the article
     * @return true is succeeded, false if failed
     */
    public static boolean addCommentToArticle(String url, String postedBy, String text, String articleId) {
        Map<String, String> bodyData = new HashMap<>();
        bodyData.put("postedBy", postedBy);
        bodyData.put("text", text);
        ExtractableResponse<Response> returnValue = given().body(bodyData).contentType(ContentType.JSON)
                .post(url + API_ROOT + articleId + "/comments").then().extract();

        return returnValue.statusCode() == 200;
    }

    /**
     * Fetched the last existing comment of the article
     * 
     * @param stdUrl    the end point
     * @param articleID the article ID
     * @return The last comment of the article
     */
    public static Map fetchLastComment(String stdUrl, String articleID) {
        Map article = fetchArticle(stdUrl, articleID);
        List<Map> comments = (List<Map>) article.getOrDefault("comments", new ArrayList<>());
        int lastIndex = comments.size() - 1;

        return comments.get(lastIndex);
    }
}
