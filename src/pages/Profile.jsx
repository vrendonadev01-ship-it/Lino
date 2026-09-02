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
  Camera,
  Image as ImageIcon,
  LoaderCircle,
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

  const metadata = user?.user_metadata || {};

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

  const [avatarUrl, setAvatarUrl] = useState(
    metadata.avatar_url || null
  );

  const [bannerUrl, setBannerUrl] = useState(
    metadata.banner_url || null
  );

  /* =================================
     IMÁGENES NUEVAS
  ================================= */

  const [newAvatar, setNewAvatar] = useState(null);
  const [newBanner, setNewBanner] = useState(null);

  const [avatarPreview, setAvatarPreview] =
    useState(null);

  const [bannerPreview, setBannerPreview] =
    useState(null);

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

  const currentUsername = `@${username}`;

  const userPosts = posts.filter(
    (post) =>
      post.username === currentUsername
  );

  /* =================================
     ESTADÍSTICAS
  ================================= */

  const totalLikes = userPosts.reduce(
    (total, post) =>
      total + (post.likes || 0),
    0
  );

  const totalPosts = userPosts.length;

  const totalFollowing = following.length;

  const totalFollowers = followers.length;

  /* =================================
     ABRIR EDITOR
  ================================= */

  function openEditor() {
    setName(metadata.name || "Victor");

    setUsername(
      metadata.username || "victor"
    );

    setBio(
      metadata.bio ||
        "Estudiante · Programación · Tecnología 💻"
    );

    setAvatarUrl(
      metadata.avatar_url || null
    );

    setBannerUrl(
      metadata.banner_url || null
    );

    setNewAvatar(null);
    setNewBanner(null);

    setAvatarPreview(null);
    setBannerPreview(null);

    setError("");

    setIsEditing(true);
  }

  /* =================================
     SELECCIONAR AVATAR
  ================================= */

  function handleAvatarChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(
        "La foto de perfil debe ser una imagen."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "La foto de perfil no puede superar 5 MB."
      );
      return;
    }

    setError("");

    setNewAvatar(file);

    const previewUrl =
      URL.createObjectURL(file);

    setAvatarPreview(previewUrl);
  }

  /* =================================
     SELECCIONAR BANNER
  ================================= */

  function handleBannerChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(
        "El banner debe ser una imagen."
      );
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError(
        "El banner no puede superar 8 MB."
      );
      return;
    }

    setError("");

    setNewBanner(file);

    const previewUrl =
      URL.createObjectURL(file);

    setBannerPreview(previewUrl);
  }

  /* =================================
     SUBIR IMAGEN
  ================================= */

  async function uploadProfileImage(
    file,
    type
  ) {
    if (!user?.id || !file) return null;

    const extension =
      file.name
        ?.split(".")
        .pop()
        ?.toLowerCase() || "jpg";

    const fileName =
      `${user.id}/${type}-${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } =
      await supabase.storage
        .from("profile-images")
        .upload(fileName, file, {
          contentType:
            file.type || "image/jpeg",
          upsert: false,
        });

    if (uploadError) {
      throw uploadError;
    }

    const { data } =
      supabase.storage
        .from("profile-images")
        .getPublicUrl(fileName);

    return {
      url: data.publicUrl,
      path: fileName,
    };
  }

  /* =================================
     OBTENER PATH DE IMAGEN
  ================================= */

  function getStoragePath(url) {
    if (!url) return null;

    try {
      const parsedUrl = new URL(url);

      const marker =
        "/profile-images/";

      const index =
        parsedUrl.pathname.indexOf(marker);

      if (index === -1) {
        return null;
      }

      return decodeURIComponent(
        parsedUrl.pathname.slice(
          index + marker.length
        )
      );
    } catch {
      return null;
    }
  }

  /* =================================
     ELIMINAR IMAGEN ANTIGUA
  ================================= */

  async function deleteOldImage(url) {
    const path = getStoragePath(url);

    if (!path) return;

    const { error } =
      await supabase.storage
        .from("profile-images")
        .remove([path]);

    if (error) {
      console.error(
        "No se pudo eliminar la imagen anterior:",
        error
      );
    }
  }

  /* =================================
     GUARDAR PERFIL
  ================================= */

  async function saveProfile() {
    setError("");

    const cleanName = name.trim();

    const cleanUsername = username
      .trim()
      .replace(/^@/, "")
      .toLowerCase();

    const cleanBio = bio.trim();

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

    if (cleanUsername.includes(" ")) {
      setError(
        "El username no puede contener espacios."
      );
      return;
    }

    setSaving(true);

    try {
      let finalAvatarUrl = avatarUrl;
      let finalBannerUrl = bannerUrl;

      /* =============================
         SUBIR NUEVO AVATAR
      ============================= */

      if (newAvatar) {
        const uploadedAvatar =
          await uploadProfileImage(
            newAvatar,
            "avatar"
          );

        finalAvatarUrl =
          uploadedAvatar.url;
      }

      /* =============================
         SUBIR NUEVO BANNER
      ============================= */

      if (newBanner) {
        const uploadedBanner =
          await uploadProfileImage(
            newBanner,
            "banner"
          );

        finalBannerUrl =
          uploadedBanner.url;
      }

      /* =============================
         ACTUALIZAR AUTH
      ============================= */

      const { error: authError } =
        await supabase.auth.updateUser({
          data: {
            name: cleanName,
            username: cleanUsername,
            bio: cleanBio,
            avatar_url: finalAvatarUrl,
            banner_url: finalBannerUrl,
          },
        });

      if (authError) {
        throw authError;
      }

      /* =============================
         ACTUALIZAR PROFILES
      ============================= */

      const { error: profileError } =
        await supabase
          .from("profiles")
          .update({
            name: cleanName,
            username: cleanUsername,
            bio: cleanBio,
            avatar_url: finalAvatarUrl,
            banner_url: finalBannerUrl,
          })
          .eq("id", user.id);

      if (profileError) {
        throw profileError;
      }

      /* =============================
         ELIMINAR IMÁGENES ANTIGUAS
      ============================= */

      if (
        newAvatar &&
        avatarUrl &&
        finalAvatarUrl !== avatarUrl
      ) {
        await deleteOldImage(avatarUrl);
      }

      if (
        newBanner &&
        bannerUrl &&
        finalBannerUrl !== bannerUrl
      ) {
        await deleteOldImage(bannerUrl);
      }

      /* =============================
         ACTUALIZAR ESTADO
      ============================= */

      setName(cleanName);

      setUsername(cleanUsername);

      setBio(cleanBio);

      setAvatarUrl(finalAvatarUrl);

      setBannerUrl(finalBannerUrl);

      setNewAvatar(null);

      setNewBanner(null);

      setAvatarPreview(null);

      setBannerPreview(null);

      setSaving(false);

      setIsEditing(false);
    } catch (saveError) {
      console.error(
        "Error guardando perfil:",
        saveError
      );

      setError(
        saveError?.message ||
          "No se pudieron guardar los cambios."
      );

      setSaving(false);
    }
  }

  /* =================================
     AVATAR ACTUAL
  ================================= */

  const displayedAvatar =
    avatarPreview || avatarUrl;

  /* =================================
     BANNER ACTUAL
  ================================= */

  const displayedBanner =
    bannerPreview || bannerUrl;

  return (
    <section className="profile-page">

      {/* =================================
          PORTADA
      ================================= */}

      <div
        className="profile-cover"
        style={
          displayedBanner
            ? {
                backgroundImage: `url("${displayedBanner}")`,
              }
            : undefined
        }
      >
        {!displayedBanner && (
          <div className="cover-decoration"></div>
        )}

        {isEditing && (
          <label className="profile-banner-edit">
            <ImageIcon
              size={17}
              strokeWidth={1.8}
            />

            <span>
              Cambiar banner
            </span>

            <input
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              hidden
            />
          </label>
        )}
      </div>

      {/* =================================
          INFORMACIÓN DEL PERFIL
      ================================= */}

      <div className="profile-info">

        <div className="profile-top">

          {/* AVATAR */}

          <div className="profile-avatar">

            {displayedAvatar ? (
              <img
                src={displayedAvatar}
                alt={`Foto de ${name}`}
              />
            ) : (
              name
                .charAt(0)
                .toUpperCase()
            )}

            {isEditing && (
              <label className="profile-avatar-edit">
                <Camera
                  size={17}
                  strokeWidth={2}
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  hidden
                />
              </label>
            )}

          </div>

          {/* EDITAR */}

          {!isEditing && (
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
          )}

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

                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={`Foto de ${name}`}
                  />
                ) : (
                  name
                    .charAt(0)
                    .toUpperCase()
                )}

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

                  <button
                    className="post-action"
                    aria-label="Republicar"
                  >
                    <Repeat2
                      size={18}
                      strokeWidth={1.8}
                    />
                  </button>

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

            {/* HEADER */}

            <div className="profile-modal-header">

              <div>
                <h3>
                  Editar perfil
                </h3>

                <p>
                  Personaliza tu perfil
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

            {/* PREVIEW DEL BANNER */}

            <div
              className="profile-edit-banner"
              style={
                displayedBanner
                  ? {
                      backgroundImage: `url("${displayedBanner}")`,
                    }
                  : undefined
              }
            >

              {!displayedBanner && (
                <div>
                  <ImageIcon
                    size={24}
                    strokeWidth={1.5}
                  />

                  <span>
                    Sin banner
                  </span>
                </div>
              )}

              <label className="profile-edit-banner-button">

                <Camera
                  size={16}
                  strokeWidth={1.9}
                />

                Cambiar banner

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  hidden
                />

              </label>

            </div>

            {/* AVATAR */}

            <div className="profile-edit-avatar-wrapper">

              <div className="profile-edit-avatar">

                {displayedAvatar ? (
                  <img
                    src={displayedAvatar}
                    alt={`Foto de ${name}`}
                  />
                ) : (
                  name
                    .charAt(0)
                    .toUpperCase()
                )}

                <label className="profile-edit-avatar-button">

                  <Camera
                    size={16}
                    strokeWidth={2}
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    hidden
                  />

                </label>

              </div>

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

                  <>
                    <LoaderCircle
                      size={17}
                      className="spin"
                    />

                    Guardando...
                  </>

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