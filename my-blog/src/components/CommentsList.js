/*
 * Copyright 2023 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 */

const CommentsList = ( { comments } ) => (
    <>
    <div data-testid="previous-comments">
    <h3>Comments:</h3>
    {comments.map( comment => (
        <div className="comment" key={comment.postedBy + ': '+ comment.text}>
            <h4 data-testid="poster">{comment.postedBy}</h4>
            <p data-testid="post-text">{comment.text}</p>
        </div>
    ))}
    </div>
    </>
);

export default CommentsList;