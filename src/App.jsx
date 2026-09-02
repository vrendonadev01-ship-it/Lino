import { useEffect, useState } from "react";
import "./App.css";

import {
  House,
  Compass,
  Users,
  Music2,
  MessageCircle,
  Bell,
  UserRound,
  Search,
} from "lucide-react";

import { supabase } from "./lib/supabase";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Sidebar from "./components/Sidebar";
import RightSidebar from "./components/RightSidebar";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import People from "./pages/People";
import Music from "./pages/Music";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

function App() {

  /* =================================
     AUTENTICACIÓN
  ================================= */

  const [session, setSession] = useState(null);

  const [checkingSession, setCheckingSession] =
    useState(true);

  const [showRegister, setShowRegister] =
    useState(false);


  /* =================================
     NAVEGACIÓN
  ================================= */

  const [activePage, setActivePage] =
    useState("Inicio");


  /* =================================
     POSTS
  ================================= */

  const [posts, setPosts] = useState([]);


  /* =================================
     NUEVO POST
  ================================= */

  const [newPost, setNewPost] = useState("");

  const [selectedImage, setSelectedImage] =
    useState(null);


  /* =================================
     COMENTARIOS
  ================================= */

  const [openComments, setOpenComments] =
    useState(null);

  const [commentText, setCommentText] =
    useState("");


  /* =================================
     BÚSQUEDA
  ================================= */

  const [searchQuery, setSearchQuery] =
    useState("");


  /* =================================
     SEGUIDORES
  ================================= */

  const [following, setFollowing] =
    useState([]);

  const [followers, setFollowers] =
    useState([]);


  /* =================================
     NAVEGACIÓN MÓVIL
  ================================= */

  const mobileNavItems = [
    {
      icon: House,
      name: "Inicio",
    },

    {
      icon: Compass,
      name: "Explorar",
    },

    {
      icon: Music2,
      name: "Música",
    },

    {
      icon: Users,
      name: "Personas",
    },

    {
      icon: UserRound,
      name: "Perfil",
    },
  ];


  /* =================================
     COMPROBAR SESIÓN
  ================================= */

  useEffect(() => {

    async function getSession() {

      const { data } =
        await supabase.auth.getSession();

      setSession(data.session);

      setCheckingSession(false);
    }

    getSession();


    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (_event, newSession) => {

          setSession(newSession);

        }
      );


    return () => {
      subscription.unsubscribe();
    };

  }, []);


  /* =================================
     CARGAR POSTS DESDE SUPABASE
  ================================= */

  useEffect(() => {

    async function loadPosts() {

      if (!session?.user?.id) {
        setPosts([]);
        return;
      }

      const { data, error } =
        await supabase
          .from("posts")
          .select(`
            id,
            user_id,
            content,
            image_url,
            created_at,
            profiles (
              name,
              username,
              avatar_url
            )
          `)
          .order("created_at", {
            ascending: false,
          });


      if (error) {

        console.error(
          "Error cargando publicaciones:",
          error
        );

        return;
      }


      const formattedPosts =
        (data || []).map((post) => {

          const username =
            post.profiles?.username
              ? `@${post.profiles.username.replace(
                  /^@/,
                  ""
                )}`
              : "@usuario";


          return {

            id:
              post.id,

            user:
              post.profiles?.name ||
              "Usuario",

            username,

            userId:
              post.user_id,

            time:
              new Date(
                post.created_at
              ).toLocaleString(),

            content:
              post.content || "",

            image:
              post.image_url || null,

            likes:
              0,

            comments:
              0,

            liked:
              false,

            commentList:
              [],

          };

        });


      setPosts(formattedPosts);

    }


    loadPosts();

  }, [session]);


  /* =================================
     CARGAR SEGUIDORES Y SIGUIENDO
  ================================= */

  useEffect(() => {

    async function loadFollowData() {

      if (!session?.user?.id) {
        setFollowing([]);
        setFollowers([]);
        return;
      }

      const { data, error } =
        await supabase
          .from("follows")
          .select(
            "follower_id, following_id"
          )
          .or(
            `follower_id.eq.${session.user.id},following_id.eq.${session.user.id}`
          );


      if (error) {

        console.error(
          "Error cargando follows:",
          error
        );

        return;
      }


      const followingIds = [];
      const followerIds = [];


      (data || []).forEach((follow) => {

        if (
          follow.follower_id ===
          session.user.id
        ) {

          followingIds.push(
            follow.following_id
          );

        }


        if (
          follow.following_id ===
          session.user.id
        ) {

          followerIds.push(
            follow.follower_id
          );

        }

      });


      setFollowing(followingIds);

      setFollowers(followerIds);

    }


    loadFollowData();

  }, [session]);


  /* =================================
     PUBLICAR
  ================================= */

  async function publishPost() {

    if (
      !newPost.trim() &&
      !selectedImage
    ) {
      return;
    }


    if (!session?.user?.id) {
      return;
    }


    let imageUrl = null;


    /* ================================
       SUBIR IMAGEN A STORAGE
    ================================= */

    if (selectedImage) {

      try {

        const response =
          await fetch(selectedImage);

        const blob =
          await response.blob();


        const fileExtension =
          blob.type?.split("/")[1] ||
          "jpg";


        const fileName =
          `${session.user.id}/${crypto.randomUUID()}.${fileExtension}`;


        const { error: uploadError } =
          await supabase.storage
            .from("post-images")
            .upload(
              fileName,
              blob,
              {
                contentType:
                  blob.type ||
                  "image/jpeg",

                upsert: false,
              }
            );


        if (uploadError) {

          console.error(
            "Error subiendo imagen:",
            uploadError
          );

          return;
        }


        const {
          data: publicUrlData,
        } =
          supabase.storage
            .from("post-images")
            .getPublicUrl(
              fileName
            );


        imageUrl =
          publicUrlData.publicUrl;

      } catch (error) {

        console.error(
          "Error procesando imagen:",
          error
        );

        return;
      }

    }


    /* ================================
       GUARDAR POST
    ================================= */

    const { data, error } =
      await supabase
        .from("posts")
        .insert({

          user_id:
            session.user.id,

          content:
            newPost.trim(),

          image_url:
            imageUrl,

        })
        .select(`
          id,
          user_id,
          content,
          image_url,
          created_at,
          profiles (
            name,
            username,
            avatar_url
          )
        `)
        .single();


    if (error) {

      console.error(
        "Error publicando:",
        error
      );

      return;
    }


    const username =
      data.profiles?.username
        ? `@${data.profiles.username.replace(
            /^@/,
            ""
          )}`
        : "@usuario";


    const post = {

      id:
        data.id,

      user:
        data.profiles?.name ||
        session.user.user_metadata?.name ||
        "Usuario",

      username,

      userId:
        data.user_id,

      time:
        "Ahora",

      content:
        data.content || "",

      image:
        data.image_url || null,

      likes:
        0,

      comments:
        0,

      liked:
        false,

      commentList:
        [],

    };


    setPosts(
      (currentPosts) => [
        post,
        ...currentPosts,
      ]
    );


    setNewPost("");

    setSelectedImage(null);

  }


  /* =================================
     ELIMINAR POST
  ================================= */

  async function deletePost(post) {

    if (!session?.user?.id) {
      return;
    }


    // Seguridad adicional
    // en el frontend.

    if (
      post.userId !==
      session.user.id
    ) {

      console.error(
        "No puedes eliminar este post."
      );

      return;
    }


    const confirmed =
      window.confirm(
        "¿Quieres eliminar esta publicación?"
      );


    if (!confirmed) {
      return;
    }


    /* ================================
       ELIMINAR IMAGEN DE STORAGE
    ================================= */

    if (post.image) {

      try {

        const imageUrl =
          new URL(post.image);


        const marker =
          "/post-images/";


        const markerIndex =
          imageUrl.pathname.indexOf(
            marker
          );


        if (markerIndex !== -1) {

          const filePath =
            decodeURIComponent(
              imageUrl.pathname.slice(
                markerIndex +
                marker.length
              )
            );


          const {
            error: storageError,
          } =
            await supabase.storage
              .from("post-images")
              .remove([
                filePath,
              ]);


          if (storageError) {

            console.error(
              "Error eliminando imagen:",
              storageError
            );

          }

        }

      } catch (error) {

        console.error(
          "Error procesando imagen:",
          error
        );

      }

    }


    /* ================================
       ELIMINAR POST
    ================================= */

    const { error } =
      await supabase
        .from("posts")
        .delete()
        .eq(
          "id",
          post.id
        )
        .eq(
          "user_id",
          session.user.id
        );


    if (error) {

      console.error(
        "Error eliminando publicación:",
        error
      );

      return;
    }


    /* ================================
       ACTUALIZAR FEED
    ================================= */

    setPosts(
      (currentPosts) =>
        currentPosts.filter(
          (currentPost) =>
            currentPost.id !==
            post.id
        )
    );


    if (
      openComments ===
      post.id
    ) {

      setOpenComments(null);

    }

  }


  /* =================================
     LIKES
  ================================= */

  function toggleLike(id) {

    setPosts((currentPosts) =>

      currentPosts.map((post) => {

        if (post.id !== id) {
          return post;
        }


        return {

          ...post,

          liked:
            !post.liked,

          likes:
            post.liked
              ? post.likes - 1
              : post.likes + 1,

        };

      })

    );

  }


  /* =================================
     COMENTARIOS
  ================================= */

  function addComment(postId) {

    if (!commentText.trim()) {
      return;
    }


    const newComment = {

      id:
        Date.now(),

      user:
        session?.user?.user_metadata?.name ||
        "Victor",

      username:
        session?.user?.user_metadata?.username
          ? `@${session.user.user_metadata.username}`
          : "@victor",

      text:
        commentText.trim(),

    };


    setPosts((currentPosts) =>

      currentPosts.map((post) => {

        if (post.id !== postId) {
          return post;
        }


        return {

          ...post,

          comments:
            post.comments + 1,

          commentList: [
            ...(post.commentList || []),
            newComment,
          ],

        };

      })

    );


    setCommentText("");

  }


  /* =================================
     BÚSQUEDA
  ================================= */

  function getSearchResults() {

    const query =
      searchQuery
        .toLowerCase()
        .trim();


    if (!query) {
      return posts;
    }


    return posts.filter((post) => {

      const content =
        post.content?.toLowerCase() ||
        "";

      const user =
        post.user?.toLowerCase() ||
        "";

      const username =
        post.username?.toLowerCase() ||
        "";


      return (

        content.includes(query) ||

        user.includes(query) ||

        username.includes(query)

      );

    });

  }


  /* =================================
     SEGUIR / DEJAR DE SEGUIR
  ================================= */

  async function toggleFollow(userId) {

    if (!session?.user?.id) {
      return;
    }


    const currentUserId =
      session.user.id;


    const isFollowing =
      following.includes(userId);


    if (isFollowing) {

      const { error } =
        await supabase
          .from("follows")
          .delete()
          .eq(
            "follower_id",
            currentUserId
          )
          .eq(
            "following_id",
            userId
          );


      if (error) {

        console.error(
          "Error dejando de seguir:",
          error
        );

        return;
      }


      setFollowing(
        (currentFollowing) =>
          currentFollowing.filter(
            (id) =>
              id !== userId
          )
      );


    } else {

      const { error } =
        await supabase
          .from("follows")
          .insert({

            follower_id:
              currentUserId,

            following_id:
              userId,

          });


      if (error) {

        console.error(
          "Error siguiendo usuario:",
          error
        );

        return;
      }


      setFollowing(
        (currentFollowing) => [

          ...currentFollowing,

          userId,

        ]
      );

    }

  }


  /* =================================
     NAVEGACIÓN
  ================================= */

  function changePage(page) {

    setActivePage(page);


    if (page !== "Explorar") {

      setSearchQuery("");

    }

  }


  /* =================================
     RENDER DE PÁGINAS
  ================================= */

  function renderPage() {

    switch (activePage) {

      case "Inicio":

        return (

          <Home

            posts={
              posts
            }

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
              publishPost
            }

            openComments={
              openComments
            }

            setOpenComments={
              setOpenComments
            }

            onToggleLike={
              toggleLike
            }

            commentText={
              commentText
            }

            setCommentText={
              setCommentText
            }

            onAddComment={
              addComment
            }

            onDeletePost={
              deletePost
            }

            currentUserId={
              session.user.id
            }

          />

        );


      case "Explorar":

        return (

          <Explore

            posts={
              posts
            }

            searchQuery={
              searchQuery
            }

            setSearchQuery={
              setSearchQuery
            }

            getSearchResults={
              getSearchResults
            }

            onToggleLike={
              toggleLike
            }

          />

        );


      case "Personas":

        return (

          <People

            session={
              session
            }

            following={
              following
            }

            onToggleFollow={
              toggleFollow
            }

          />

        );


      case "Música":

        return <Music />;


      case "Mensajes":

        return <Messages />;


      case "Notificaciones":

        return <Notifications />;


      case "Perfil":

        return (

          <Profile

            session={
              session
            }

            posts={
              posts
            }

            following={
              following
            }

            followers={
              followers
            }

            onToggleLike={
              toggleLike
            }

          />

        );


      default:

        return null;

    }

  }


  /* =================================
     CARGANDO SESIÓN
  ================================= */

  if (checkingSession) {

    return (

      <div className="auth-loading">

        <div className="auth-loading-logo">
          C
        </div>

        <p>
          Cargando Campus...
        </p>

      </div>

    );

  }


  /* =================================
     LOGIN / REGISTER
  ================================= */

  if (!session) {

    if (showRegister) {

      return (

        <Register

          onLogin={() =>
            setShowRegister(false)
          }

        />

      );

    }


    return (

      <Login

        onRegister={() =>
          setShowRegister(true)
        }

      />

    );

  }


  /* =================================
     CERRAR SESIÓN
  ================================= */

  async function logout() {

    await supabase.auth.signOut();

  }


  /* =================================
     CAMPUS
  ================================= */

  return (

    <div className="app">


      {/* SIDEBAR DESKTOP */}

      <Sidebar

        activePage={
          activePage
        }

        onChangePage={
          changePage
        }

      />


      {/* CONTENIDO PRINCIPAL */}

      <main className="main-content">


        <header className="top-header">

          <h1>
            {activePage}
          </h1>


          {/* =================================
              ACCIÓN DEL HEADER
          ================================= */}

          {activePage ===
          "Explorar" ? (

            <div className="search-container">

              <Search
                size={17}
                strokeWidth={1.8}
              />

              <input
                type="text"
                placeholder="Buscar..."
                value={
                  searchQuery
                }
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
              />

            </div>

          ) : activePage ===
            "Inicio" ? (

            <button
              className="search-button notification-button"
              onClick={() =>
                changePage(
                  "Notificaciones"
                )
              }
              aria-label="Notificaciones"
              title="Notificaciones"
            >

              <Bell
                size={20}
                strokeWidth={1.8}
              />

            </button>

          ) : (

            <button
              className="search-button"
              onClick={() =>
                changePage(
                  "Explorar"
                )
              }
              aria-label="Buscar"
              title="Buscar"
            >

              <Search
                size={19}
                strokeWidth={1.8}
              />

            </button>

          )}

        </header>


        {renderPage()}


      </main>


      {/* SIDEBAR DERECHO */}

      <RightSidebar />


      {/* NAVEGACIÓN MÓVIL */}

      <nav
        className="mobile-nav"
        aria-label="Navegación principal"
      >

        {mobileNavItems.map(
          (item) => {

            const Icon =
              item.icon;


            const isActive =
              activePage ===
              item.name;


            return (

              <button
                key={
                  item.name
                }
                className={
                  isActive
                    ? "mobile-nav-item active"
                    : "mobile-nav-item"
                }
                onClick={() =>
                  changePage(
                    item.name
                  )
                }
                aria-label={
                  item.name
                }
              >

                <Icon
                  size={21}
                  strokeWidth={
                    isActive
                      ? 2.2
                      : 1.7
                  }
                />


                <span>
                  {item.name}
                </span>


              </button>

            );

          }
        )}

      </nav>


    </div>

  );

}


export default App;