import Post from "../components/Post";


function Explore({
  posts,
  searchQuery,
  setSearchQuery,
  getSearchResults,
  onToggleLike,
}) {

  const results =
    getSearchResults();


  return (

    <section className="explore-page">

      <div className="explore-header">

        <h2>
          Explorar
        </h2>

        <p>
          Descubre publicaciones de tu colegio
        </p>

      </div>


      <div className="search-results">

        {searchQuery.trim() && (

          <h3>
            Resultados para "{searchQuery}"
          </h3>

        )}


        {!searchQuery.trim() ? (

          <div className="explore-empty">

            <div className="explore-icon">
              🔎
            </div>

            <h2>
              Busca algo
            </h2>

            <p>
              Encuentra publicaciones y
              personas de tu colegio.
            </p>

          </div>

        ) : results.length === 0 ? (

          <div className="no-results">

            <div>
              🔍
            </div>

            <h3>
              No encontramos nada
            </h3>

            <p>
              Prueba buscando otra cosa.
            </p>

          </div>

        ) : (

          results.map((post) => (

            <Post
              key={post.id}
              post={post}

              isCommentsOpen={false}

              onToggleComments={() => {}}

              onToggleLike={() =>
                onToggleLike(post.id)
              }

              commentText=""

              setCommentText={() => {}}

              onAddComment={() => {}}
            />

          ))

        )}

      </div>

    </section>
  );
}


export default Explore;