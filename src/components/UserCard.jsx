function UserCard({
  user,
  isFollowing,
  onToggleFollow,
}) {

  return (

    <div className="user-card">

      <div className="avatar">
        {user.name.charAt(0)}
      </div>


      <div className="user-card-info">

        <strong>
          {user.name}
        </strong>

        <span>
          {user.username}
        </span>

        <p>
          {user.bio}
        </p>

      </div>


      <button
        className={
          isFollowing
            ? "following-button"
            : "follow-button"
        }
        onClick={() =>
          onToggleFollow(user.id)
        }
      >

        {isFollowing
          ? "Siguiendo ✓"
          : "Seguir"}

      </button>

    </div>
  );
}


export default UserCard;