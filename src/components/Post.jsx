import {
  Heart,
  MessageCircle,
  Repeat2,
  Send,
} from "lucide-react";

import CommentSection from "./CommentSection";


function Post({
  post,
  isCommentsOpen,
  onToggleComments,
  onToggleLike,
  commentText,
  setCommentText,
  onAddComment,
}) {

  return (

    <article className="post">

      {/* AVATAR */}

      <div className="avatar">
        {post.user.charAt(0)}
      </div>


      <div className="post-content">

        {/* HEADER */}

        <div className="post-header">

          <strong>
            {post.user}
          </strong>

          <span>
            {post.username}
          </span>

          <span>
            ·
          </span>

          <span>
            {post.time}
          </span>

        </div>


        {/* TEXTO */}

        {post.content && (

          <p>
            {post.content}
          </p>

        )}


        {/* IMAGEN */}

        {post.image && (

          <div className="post-image">

            <img
              src={post.image}
              alt="Publicación"
            />

          </div>

        )}


        {/* ACCIONES */}

        <div className="post-buttons">

          {/* COMENTARIOS */}

          <button
            className={
              isCommentsOpen
                ? "post-action active"
                : "post-action"
            }
            onClick={onToggleComments}
            aria-label="Comentarios"
          >

            <MessageCircle
              size={18}
              strokeWidth={
                isCommentsOpen ? 2.2 : 1.8
              }
            />

            <span>
              {post.comments}
            </span>

          </button>


          {/* REPUBLICAR */}

          <button
            className="post-action"
            aria-label="Republicar"
          >

            <Repeat2
              size={18}
              strokeWidth={1.8}
            />

          </button>


          {/* LIKE */}

          <button
            className={
              post.liked
                ? "post-action like-button liked"
                : "post-action like-button"
            }
            onClick={onToggleLike}
            aria-label={
              post.liked
                ? "Quitar me gusta"
                : "Me gusta"
            }
          >

            <Heart
              size={18}
              strokeWidth={
                post.liked ? 2.2 : 1.8
              }
              fill={
                post.liked
                  ? "currentColor"
                  : "none"
              }
            />

            <span>
              {post.likes}
            </span>

          </button>


          {/* COMPARTIR */}

          <button
            className="post-action"
            aria-label="Compartir"
          >

            <Send
              size={18}
              strokeWidth={1.8}
            />

          </button>

        </div>


        {/* COMENTARIOS */}

        {isCommentsOpen && (

          <CommentSection
            post={post}
            commentText={commentText}
            setCommentText={
              setCommentText
            }
            onAddComment={
              onAddComment
            }
          />

        )}

      </div>

    </article>
  );
}


export default Post;