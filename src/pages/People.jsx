import { useEffect, useState } from "react";
import { Search, UserRound } from "lucide-react";
import UserCard from "../components/UserCard";
import { supabase } from "../lib/supabase";

function People({
  session,
  following,
  onToggleFollow,
}) {
  const [people, setPeople] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPeople() {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, name, bio, avatar_url, created_at")
        .order("created_at", {
          ascending: true,
        });

      if (error) {
        console.error("Error cargando personas:", error);
        setPeople([]);
        setLoading(false);
        return;
      }

      console.log("PERFILES ENCONTRADOS:", data);

      const otherPeople = (data || []).filter(
        (profile) => profile.id !== session?.user?.id
      );

      setPeople(otherPeople);
      setLoading(false);
    }

    if (session?.user?.id) {
      loadPeople();
    }
  }, [session]);

  const filteredPeople = people.filter((person) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return true;
    }

    const name = person.name?.toLowerCase() || "";
    const username = person.username?.toLowerCase() || "";

    return (
      name.includes(query) ||
      username.includes(query) ||
      username.replace(/^@/, "").includes(query.replace(/^@/, ""))
    );
  });

  return (
    <section className="people-page">
      <div className="people-header">
        <h2>Personas</h2>

        <p>
          Encuentra personas de tu colegio.
        </p>
      </div>

      <div className="people-search">
        <Search size={18} strokeWidth={1.8} />

        <input
          type="text"
          placeholder="Buscar personas..."
          value={searchQuery}
          onChange={(event) =>
            setSearchQuery(event.target.value)
          }
        />
      </div>

      <div className="people-list">
        {loading ? (
          <div className="people-loading">
            Cargando personas...
          </div>
        ) : filteredPeople.length === 0 ? (
          <div className="people-empty">
            <div className="people-empty-icon">
              <UserRound size={24} strokeWidth={1.7} />
            </div>

            <h3>
              {searchQuery
                ? "No encontramos a esa persona"
                : "Aún no hay personas"}
            </h3>

            <p>
              {searchQuery
                ? "Prueba buscando por su nombre o username."
                : "Cuando haya más usuarios aparecerán aquí."}
            </p>
          </div>
        ) : (
          filteredPeople.map((user) => (
            <UserCard
              key={user.id}
              user={{
                ...user,
                username: user.username
                  ? `@${user.username.replace(/^@/, "")}`
                  : "@usuario",
                userId: user.id,
              }}
              isFollowing={following.includes(user.id)}
              onToggleFollow={onToggleFollow}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default People;