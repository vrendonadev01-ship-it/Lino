function CommentSection({
  post,
  commentText,
  setCommentText,
  onAddComment,
}) {

  return (

    <div className="comments-section">

      <div className="comments-title">
        Comentarios
      </div>


      <div className="comments-list">

        {(post.commentList || []).map(
          (comment) => (

            <div
              className="comment"
              key={comment.id}
            >

              <div className="avatar comment-avatar">
                {comment.user.charAt(0)}
              </div>


              <div className="comment-content">

                <div className="comment-user">

                  <strong>
                    {comment.user}
                  </strong>

                  <span>
                    {comment.username}
                  </span>

                </div>


                <p>
                  {comment.text}
                </p>

              </div>

            </div>

          )
        )}

      </div>


      <div className="comment-input">

        <div className="avatar comment-avatar">
          V
        </div>


        <input
          type="text"
          placeholder="Escribe un comentario..."
          value={commentText}
          onChange={(e) =>
            setCommentText(
              e.target.value
            )
          }
          onKeyDown={(e) => {

            if (e.key === "Enter") {
              onAddComment();
            }

          }}
        />


        <button
          onClick={onAddComment}
        >
          ➤
        </button>

      </div>

    </div>
  );
}


export default CommentSection;