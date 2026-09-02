import Post from "../components/Post";
import PostComposer from "../components/PostComposer";


function Home({
  posts,
  newPost,
  setNewPost,
  selectedImage,
  setSelectedImage,
  onPublish,
  openComments,
  setOpenComments,
  onToggleLike,
  commentText,
  setCommentText,
  onAddComment,
  onDeletePost,
  currentUserId,
}) {

  return (

    <>

      <PostComposer
        newPost={
          newPost
        }

        setNewPost={
          setNewPost
        }

        selectedImage={
          selectedImage
        }

        setSelectedImage={
          setSelectedImage
        }

        onPublish={
          onPublish
        }
      />


      <section className="feed">

        {posts.length === 0 ? (

          <div className="feed-empty">

            <h3>
              Aún no hay publicaciones
            </h3>

            <p>
              Sé el primero en publicar algo.
            </p>

          </div>

        ) : (

          posts.map(
            (post) => (

              <Post
                key={
                  post.id
                }

                post={
                  post
                }

                isCommentsOpen={
                  openComments ===
                  post.id
                }

                onToggleComments={() =>
                  setOpenComments(
                    openComments ===
                      post.id
                      ? null
                      : post.id
                  )
                }

                onToggleLike={() =>
                  onToggleLike(
                    post.id
                  )
                }

                commentText={
                  commentText
                }

                setCommentText={
                  setCommentText
                }

                onAddComment={() =>
                  onAddComment(
                    post.id
                  )
                }

                onDeletePost={
                  onDeletePost
                }

                currentUserId={
                  currentUserId
                }

              />

            )
          )

        )}

      </section>

    </>

  );

}


export default Home;