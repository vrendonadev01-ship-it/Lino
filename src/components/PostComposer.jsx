function PostComposer({
  newPost,
  setNewPost,
  selectedImage,
  setSelectedImage,
  onPublish,
}) {

  function handleImageChange(e) {

    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const imageUrl =
      URL.createObjectURL(file);

    setSelectedImage(imageUrl);
  }


  return (

    <section className="create-post-card">

      <div className="avatar">
        V
      </div>


      <div className="post-input-container">

        <input
          type="text"
          placeholder="¿Qué está pasando?"
          value={newPost}
          onChange={(e) =>
            setNewPost(e.target.value)
          }
          onKeyDown={(e) => {

            if (e.key === "Enter") {
              onPublish();
            }

          }}
        />


        {selectedImage && (

          <div className="image-preview">

            <img
              src={selectedImage}
              alt="Vista previa"
            />

            <button
              className="remove-image"
              onClick={() =>
                setSelectedImage(null)
              }
            >
              ✕
            </button>

          </div>

        )}


        <div className="post-actions">

          <div className="post-tools">

            <label className="image-upload-button">

              🖼️

              <input
                type="file"
                accept="image/*"
                onChange={
                  handleImageChange
                }
              />

            </label>


            <button>
              😊
            </button>


            <button>
              🎵
            </button>

          </div>


          <button
            className="publish-button"
            onClick={onPublish}
          >
            Publicar
          </button>

        </div>

      </div>

    </section>
  );
}


export default PostComposer;