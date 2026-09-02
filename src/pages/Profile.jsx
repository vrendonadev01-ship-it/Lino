import { useState } from "react";

import {
  CalendarDays,
  MapPin,
  Pencil,
  X,
  Check,
  Heart,
  MessageCircle,
  Repeat2,
  Send,
  FileText,
} from "lucide-react";

import { supabase } from "../lib/supabase";


function Profile({
  session,
  posts,
  following,
  followers,
  onToggleLike,
}) {

  /* =================================
     USUARIO ACTUAL
  ================================= */

  const user = session?.user;

  const metadata =
    user?.user_metadata || {};


  /* =================================
     DATOS DEL PERFIL
  ================================= */

  const [name, setName] = useState(
    metadata.name || "Victor"
  );

  const [username, setUsername] = useState(
    metadata.username || "victor"
  );

  const [bio, setBio] = useState(
    metadata.bio ||
      "Estudiante · Programación · Tecnología 💻"
  );


  /* =================================
     MODAL
  ================================= */

  const [isEditing, setIsEditing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");


  /* =================================
     PUBLICACIONES DEL USUARIO
  ================================= */

  const currentUsername =
    `@${username}`;

  const userPosts = posts.filter(
    (post) =>
      post.username === currentUsername
  );


  /* =================================
     ESTADÍSTICAS
  ================================= */

  const totalLikes =
    userPosts.reduce(
      (total, post) =>
        total + post.likes,
      0
    );

  const totalPosts =
    userPosts.length;

  const totalFollowing =
    following.length;

  const totalFollowers =
    followers.length;


  /* =================================
     ABRIR EDITOR
  ================================= */

  function openEditor() {

    setName(
      metadata.name || "Victor"
    );

    setUsername(
      metadata.username || "victor"
    );

    setBio(
      metadata.bio ||
        "Estudiante · Programación · Tecnología 💻"
    );

    setError("");

    setIsEditing(true);
  }


  /* =================================
     GUARDAR PERFIL
  ================================= */

  async function saveProfile() {

    setError("");

    const cleanName =
      name.trim();

    const cleanUsername =
      username
        .trim()
        .replace(/^@/, "")
        .toLowerCase();

    const cleanBio =
      bio.trim();


    /* VALIDAR NOMBRE */

    if (!cleanName) {

      setError(
        "El nombre no puede estar vacío."
      );

      return;
    }


    /* VALIDAR USERNAME */

    if (!cleanUsername) {

      setError(
        "El username no puede estar vacío."
      );

      return;
    }


    if (
      cleanUsername.includes(" ")
    ) {

      setError(
        "El username no puede contener espacios."
      );

      return;
    }


    setSaving(true);


    /* ACTUALIZAR SUPABASE */

    const { error: updateError } =
      await supabase.auth.updateUser({
        data: {
          name: cleanName,
          username: cleanUsername,
          bio: cleanBio,
        },
      });


    /* ERROR */

    if (updateError) {

      setError(
        updateError.message ||
          "No se pudieron guardar los cambios."
      );

      setSaving(false);

      return;
    }


    /* ACTUALIZAR INTERFAZ */

    setName(cleanName);

    setUsername(cleanUsername);

    setBio(cleanBio);

    setSaving(false);

    setIsEditing(false);
  }


  return (

    <section className="profile-page">


      {/* =================================
          PORTADA
      ================================= */}

      <div className="profile-cover">

        <div className="cover-decoration"></div>

      </div>


      {/* =================================
          INFORMACIÓN DEL PERFIL
      ================================= */}

      <div className="profile-info">

        <div className="profile-top">


          {/* AVATAR */}

          <div className="profile-avatar">

            {name
              .charAt(0)
              .toUpperCase()}

          </div>


          {/* EDITAR */}

          <button
            className="edit-profile-button"
            onClick={openEditor}
          >

            <Pencil
              size={16}
              strokeWidth={1.9}
            />

            <span>
              Editar perfil
            </span>

          </button>

        </div>


        {/* NOMBRE */}

        <div className="profile-name">

          <h2>
            {name}
          </h2>

          <span>
            @{username}
          </span>

        </div>


        {/* BIO */}

        <p className="profile-bio">
          {bio}
        </p>


        {/* META */}

        <div className="profile-meta">


          <span>

            <MapPin
              size={15}
              strokeWidth={1.8}
            />

            Tacna, Perú

          </span>


          <span>

            <CalendarDays
              size={15}
              strokeWidth={1.8}
            />

            Se unió recientemente

          </span>


        </div>


        {/* =================================
            ESTADÍSTICAS
        ================================= */}

        <div className="profile-stats">


          <div>

            <strong>
              {totalPosts}
            </strong>

            <span>
              Publicaciones
            </span>

          </div>


          <div>

            <strong>
              {totalFollowing}
            </strong>

            <span>
              Siguiendo
            </span>

          </div>


          <div>

            <strong>
              {totalFollowers}
            </strong>

            <span>
              Seguidores
            </span>

          </div>


          <div>

            <strong>
              {totalLikes}
            </strong>

            <span>
              Me gusta
            </span>

          </div>


        </div>

      </div>


      {/* =================================
          TABS
      ================================= */}

      <div className="profile-tabs">

        <button className="profile-tab active">
          Publicaciones
        </button>

        <button className="profile-tab">
          Respuestas
        </button>

        <button className="profile-tab">
          Multimedia
        </button>

        <button className="profile-tab">
          Me gusta
        </button>

      </div>


      {/* =================================
          PUBLICACIONES
      ================================= */}

      <div className="profile-posts">


        {userPosts.length === 0 ? (

          <div className="profile-empty">

            <div className="profile-empty-icon">

              <FileText
                size={28}
                strokeWidth={1.5}
              />

            </div>


            <h3>
              Todavía no has publicado nada
            </h3>


            <p>
              Cuando publiques algo,
              aparecerá aquí.
            </p>

          </div>

        ) : (

          userPosts.map((post) => (

            <article
              className="post"
              key={post.id}
            >


              {/* AVATAR */}

              <div className="avatar">

                {name
                  .charAt(0)
                  .toUpperCase()}

              </div>


              <div className="post-content">


                {/* HEADER */}

                <div className="post-header">

                  <strong>
                    {name}
                  </strong>

                  <span>
                    @{username}
                  </span>

                  <span>
                    ·
                  </span>

                  <span>
                    {post.time}
                  </span>

                </div>


                {/* CONTENIDO */}

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
                    className="post-action"
                    aria-label="Comentarios"
                  >

                    <MessageCircle
                      size={18}
                      strokeWidth={1.8}
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
                    onClick={() =>
                      onToggleLike(post.id)
                    }
                    aria-label={
                      post.liked
                        ? "Quitar me gusta"
                        : "Me gusta"
                    }
                  >

                    <Heart
                      size={18}
                      strokeWidth={
                        post.liked
                          ? 2.2
                          : 1.8
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

              </div>

            </article>

          ))

        )}

      </div>


      {/* =================================
          MODAL EDITAR PERFIL
      ================================= */}

      {isEditing && (

        <div
          className="profile-modal-overlay"
          onClick={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {
              setIsEditing(false);
            }

          }}
        >


          <div className="profile-modal">


            {/* HEADER DEL MODAL */}

            <div className="profile-modal-header">

              <div>

                <h3>
                  Editar perfil
                </h3>

                <p>
                  Actualiza tu información
                </p>

              </div>


              <button
                className="profile-modal-close"
                onClick={() =>
                  setIsEditing(false)
                }
                aria-label="Cerrar"
              >

                <X
                  size={19}
                  strokeWidth={1.8}
                />

              </button>

            </div>


            {/* AVATAR */}

            <div className="profile-edit-avatar">

              {name
                .charAt(0)
                .toUpperCase()}

            </div>


            {/* NOMBRE */}

            <label>

              Nombre

              <input
                type="text"
                value={name}
                maxLength={40}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                placeholder="Tu nombre"
              />

            </label>


            {/* USERNAME */}

            <label>

              Username

              <div className="username-input">

                <span>
                  @
                </span>

                <input
                  type="text"
                  value={username}
                  maxLength={25}
                  onChange={(event) =>
                    setUsername(
                      event.target.value
                    )
                  }
                  placeholder="username"
                />

              </div>

            </label>


            {/* BIO */}

            <label>

              Biografía

              <textarea
                value={bio}
                maxLength={160}
                onChange={(event) =>
                  setBio(
                    event.target.value
                  )
                }
                placeholder="Cuéntanos algo sobre ti..."
              />

              <small>
                {bio.length}/160
              </small>

            </label>


            {/* ERROR */}

            {error && (

              <div className="profile-edit-error">

                {error}

              </div>

            )}


            {/* BOTONES */}

            <div className="profile-modal-actions">


              <button
                className="profile-cancel-button"
                onClick={() =>
                  setIsEditing(false)
                }
                disabled={saving}
              >

                Cancelar

              </button>


              <button
                className="profile-save-button"
                onClick={saveProfile}
                disabled={saving}
              >

                {saving ? (

                  "Guardando..."

                ) : (

                  <>

                    <Check
                      size={17}
                      strokeWidth={2}
                    />

                    Guardar cambios

                  </>

                )}

              </button>


            </div>


          </div>

        </div>

      )}

    </section>
  );
}


export default Profile;