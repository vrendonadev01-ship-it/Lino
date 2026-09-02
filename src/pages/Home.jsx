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
}) {

  return (

    <>

      <PostComposer
        newPost={newPost}
        setNewPost={setNewPost}
        selectedImage={selectedImage}
        setSelectedImage={
          setSelectedImage
        }
        onPublish={onPublish}
      />


      <section className="feed">

        {posts.map((post) => (

          <Post
            key={post.id}
            post={post}

            isCommentsOpen={
              openComments === post.id
            }

            onToggleComments={() =>
              setOpenComments(
                openComments === post.id
                  ? null
                  : post.id
              )
            }

            onToggleLike={() =>
              onToggleLike(post.id)
            }

            commentText={commentText}

            setCommentText={
              setCommentText
            }

            onAddComment={() =>
              onAddComment(post.id)
            }
          />

        ))}

      </section>

    </>
  );
}


export default Home;