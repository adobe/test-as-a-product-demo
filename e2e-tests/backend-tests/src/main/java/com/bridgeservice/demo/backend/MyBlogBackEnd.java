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

import java.util.HashMap;
import java.util.Map;

import static io.restassured.RestAssured.given;

public class MyBlogBackEnd {

    public static final String API_ROOT = "api/articles/";

    public static ResponseBody fetchPostResponse(String in_url, String in_endPoint, Map<String, String> in_bodyData) {
        return given().body(in_bodyData).contentType(ContentType.JSON).post(in_url + in_endPoint).getBody();
    }

    private static ResponseBody fetchGetResponse(String in_url, String in_endPoint) {
        return given().when().get(in_url + in_endPoint).getBody();
    }

    private static ResponseBody fetchPutResponse(String in_url, String in_endPoint) {
        return given().put(in_url + in_endPoint).getBody();
    }
    /**
     * Checks if the system is up
     * @return true if the system is up and running
     */
    public static boolean isSystemUp(String in_url) {
        ResponseBody l_result = MyBlogBackEnd.fetchGetResponse(in_url,"test");
        return (l_result != null) ? l_result.asString().equals("Up") : false;
    }

    /**
     * Fetches a JSON representation of the article
     *
     * @param in_url       The url of the endpoint
     * @param in_articleId The ID of the article
     * @return A Json representation of the article
     */
    public static JsonPath fetchArticle(String in_url, String in_articleId) {
        ResponseBody lr_returnJSON = MyBlogBackEnd.fetchGetResponse(in_url, API_ROOT +in_articleId);
        return lr_returnJSON.jsonPath();
    }

    /**
     * Upvotes the given article
     * @param in_url The url of the endpoint
     * @param in_articleId The ID of the article
     * @return A Json representation of the article
     */
    public static JsonPath upVoteArticle(String in_url, String in_articleId) {
        //given().put(in_url + API_ROOT+in_articleId+"/upvote").getBody();
        //ResponseBody lr_returnJSON = MyBlogBackEnd.fetchPutResponse(in_url,API_ROOT+in_articleId+"/upvote");

        ExtractableResponse<Response> l_returnValue = given().put(in_url+API_ROOT+in_articleId+"/upvote").then().extract();
        if (l_returnValue.statusCode()==404) {
            return null;
        }
        return l_returnValue.jsonPath();
    }

    /**
     * Adds a comment to the article
     * @param in_url The url of the endpoint
     * @param in_postedBy The commentor
     * @param in_text The comment
     * @param in_articleId  The ID of the article
     * @return true is succeeded, false if failed
     */
    public static boolean addCommentToArticle(String in_url, String in_postedBy, String in_text, String in_articleId) {
        Map<String , String> l_bodyData = new HashMap<>();
        l_bodyData.put("postedBy", in_postedBy);
        l_bodyData.put("text", in_text);
        ExtractableResponse<Response> l_returnValue = given().body(l_bodyData).contentType(ContentType.JSON).post(in_url + API_ROOT+in_articleId+"/comments").then().extract();

        return  l_returnValue.statusCode()==200;
    }
}
