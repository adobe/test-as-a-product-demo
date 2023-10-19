/*
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */

import axios from "axios";
import { useState } from "react";

const AddCommentForm = ({ articleName, onArticleUpdated }) => {
    const [name, setName] = useState('');
    const [commentText, setCommentText] = useState('');

    const addComment = async () => {
        const response = await axios.post(`/api/articles/${articleName}/comments`, {
            postedBy: name,
            text: commentText,
        })

        const updatedArticle = (response).data;
        onArticleUpdated(updatedArticle);
        setName('');
        setCommentText(''); 
    }

    return (
        <div id='add-comment-form'>
            <h3>Add a Comment</h3>
            <label>
                Name:
                <input 
                    value={name} data-testid='name'
                    onChange={e => setName(e.target.value)}
                    type="text"/>
            </label>
            <label>
                Text:
                <textarea 
                    value={commentText} data-testid='commentText'
                    onChange={e => setCommentText(e.target.value)}
                    type="text" rows="4" cols="50"/>
            </label>
            <button onClick={addComment} type="submit">Add comment</button>
        </div>
    );
}

export default AddCommentForm;