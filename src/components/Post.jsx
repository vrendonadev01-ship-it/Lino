import {
  Heart,
  MessageCircle,
  Repeat2,
  Send,
  MoreHorizontal,
  Bookmark,
  Link,
  Share2,
  Trash2,
  Flag,
} from "lucide-react";

import { useState } from "react";

import CommentSection from "./CommentSection";


function Post({
  post,
  isCommentsOpen,
  onToggleComments,
  onToggleLike,
  commentText,
  setCommentText,
  onAddComment,
  onDeletePost,
  currentUserId,
}) {

  const [showMenu, setShowMenu] =
    useState(false);

  const [copyMessage, setCopyMessage] =
    useState(false);


  const isOwner =
    post.userId ===
    currentUserId;


  /* =================================
     COPIAR ENLACE
  ================================= */

  async function handleCopyLink() {

    const postUrl =
      `${window.location.origin}/post/${post.id}`;


    try {

      await navigator.clipboard.writeText(
        postUrl
      );


      setCopyMessage(true);


      setTimeout(() => {

        setCopyMessage(false);

      }, 1800);


      setShowMenu(false);

    } catch (error) {

      console.error(
        "No se pudo copiar el enlace:",
        error
      );

    }

  }


  /* =================================
     COMPARTIR
  ================================= */

  async function handleShare() {

    const postUrl =
      `${window.location.origin}/post/${post.id}`;


    const shareData = {

      title:
        `${post.user} en Campus`,

      text:
        post.content
          ? post.content
          : "Mira esta publicación en Campus.",

      url:
        postUrl,

    };


    try {

      // Si el navegador/dispositivo
      // soporta el menú nativo.

      if (
        navigator.share
      ) {

        await navigator.share(
          shareData
        );

      } else {

        // Si no existe navigator.share,
        // copiamos el enlace.

        await navigator.clipboard.writeText(
          postUrl
        );


        setCopyMessage(true);


        setTimeout(() => {

          setCopyMessage(false);

        }, 1800);

      }


      setShowMenu(false);

    } catch (error) {

      // Cancelar el menú nativo
      // no debe generar un error
      // visible para el usuario.

      if (
        error?.name !==
        "AbortError"
      ) {

        console.error(
          "Error compartiendo:",
          error
        );

      }

    }

  }


  /* =================================
     GUARDAR
  ================================= */

  function handleSave() {

    // Preparado para conectar
    // posteriormente con Supabase.

    setShowMenu(false);

    console.log(
      "Guardar publicación:",
      post.id
    );

  }


  /* =================================
     ENVIAR
  ================================= */

  function handleSend() {

    // Posteriormente esto abrirá
    // el selector de conversaciones.

    setShowMenu(false);

    console.log(
      "Enviar publicación:",
      post.id
    );

  }


  /* =================================
     REPORTAR
  ================================= */

  function handleReport() {

    setShowMenu(false);

    console.log(
      "Reportar publicación:",
      post.id
    );

  }


  return (

    <article className="post">


      {/* =================================
          AVATAR
      ================================= */}

      <div className="avatar">

        {post.user
          ?.charAt(0)
          ?.toUpperCase() ||
          "U"}

      </div>


      <div className="post-content">


        {/* =================================
            HEADER DEL POST
        ================================= */}

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


          {/* =================================
              MENÚ DE OPCIONES
          ================================= */}

          <div className="post-menu-container">

            <button
              className="post-menu-button"
              onClick={() =>
                setShowMenu(
                  (current) =>
                    !current
                )
              }
              aria-label="Opciones de publicación"
              title="Opciones"
            >

              <MoreHorizontal
                size={19}
                strokeWidth={1.8}
              />

            </button>


            {showMenu && (

              <>

                <div
                  className="post-menu-overlay"
                  onClick={() =>
                    setShowMenu(false)
                  }
                />


                <div className="post-menu">


                  {/* GUARDAR */}

                  <button
                    className="post-menu-item"
                    onClick={
                      handleSave
                    }
                  >

                    <Bookmark
                      size={17}
                      strokeWidth={1.8}
                    />

                    <span>
                      Guardar publicación
                    </span>

                  </button>


                  {/* ENVIAR */}

                  <button
                    className="post-menu-item"
                    onClick={
                      handleSend
                    }
                  >

                    <Send
                      size={17}
                      strokeWidth={1.8}
                    />

                    <span>
                      Enviar
                    </span>

                  </button>


                  {/* COPIAR ENLACE */}

                  <button
                    className="post-menu-item"
                    onClick={
                      handleCopyLink
                    }
                  >

                    <Link
                      size={17}
                      strokeWidth={1.8}
                    />

                    <span>
                      Copiar enlace
                    </span>

                  </button>


                  {/* COMPARTIR */}

                  <button
                    className="post-menu-item"
                    onClick={
                      handleShare
                    }
                  >

                    <Share2
                      size={17}
                      strokeWidth={1.8}
                    />

                    <span>
                      Compartir
                    </span>

                  </button>


                  {/* SEPARADOR */}

                  <div className="post-menu-divider" />


                  {/* ELIMINAR */}

                  {isOwner ? (

                    <button
                      className="post-menu-item danger"
                      onClick={() => {

                        setShowMenu(
                          false
                        );

                        onDeletePost(
                          post
                        );

                      }}
                    >

                      <Trash2
                        size={17}
                        strokeWidth={1.8}
                      />

                      <span>
                        Eliminar publicación
                      </span>

                    </button>

                  ) : (

                    <button
                      className="post-menu-item danger"
                      onClick={
                        handleReport
                      }
                    >

                      <Flag
                        size={17}
                        strokeWidth={1.8}
                      />

                      <span>
                        Reportar publicación
                      </span>

                    </button>

                  )}

                </div>

              </>

            )}

          </div>

        </div>


        {/* =================================
            MENSAJE DE COPIADO
        ================================= */}

        {copyMessage && (

          <div className="post-copy-message">

            Enlace copiado ✓

          </div>

        )}


        {/* =================================
            CONTENIDO
        ================================= */}

        {post.content && (

          <p>
            {post.content}
          </p>

        )}


        {/* =================================
            IMAGEN
        ================================= */}

        {post.image && (

          <div className="post-image">

            <img
              src={
                post.image
              }
              alt="Publicación"
              loading="lazy"
            />

          </div>

        )}


        {/* =================================
            ACCIONES
        ================================= */}

        <div className="post-buttons">


          {/* COMENTARIOS */}

          <button
            className={
              isCommentsOpen
                ? "post-action active"
                : "post-action"
            }
            onClick={
              onToggleComments
            }
            aria-label="Comentarios"
          >

            <MessageCircle
              size={18}
              strokeWidth={
                isCommentsOpen
                  ? 2.2
                  : 1.8
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
            onClick={
              onToggleLike
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
            onClick={
              handleShare
            }
            aria-label="Compartir"
          >

            <Send
              size={18}
              strokeWidth={1.8}
            />

          </button>


        </div>


        {/* =================================
            COMENTARIOS
        ================================= */}

        {isCommentsOpen && (

          <CommentSection
            post={
              post
            }

            commentText={
              commentText
            }

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