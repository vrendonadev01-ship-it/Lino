import {
  House,
  Compass,
  Users,
  Music2,
  MessageCircle,
  Bell,
  UserRound,
  Plus,
} from "lucide-react";

function Sidebar({
  activePage,
  onChangePage,
}) {
  const menuItems = [
    {
      icon: House,
      name: "Inicio",
    },
    {
      icon: Compass,
      name: "Explorar",
    },
    {
      icon: Users,
      name: "Personas",
    },
    {
      icon: Music2,
      name: "Música",
    },
    {
      icon: MessageCircle,
      name: "Mensajes",
    },
    {
      icon: Bell,
      name: "Notificaciones",
    },
    {
      icon: UserRound,
      name: "Perfil",
    },
  ];

  return (
    <aside className="sidebar">

      {/* LOGO */}

      <div className="logo">
        <div className="logo-icon">
          L
        </div>

        <span>
          lino
        </span>
      </div>


      {/* MENÚ */}

      <nav className="menu">

        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            activePage === item.name;

          return (
            <button
              key={item.name}
              className={
                isActive
                  ? "menu-item active"
                  : "menu-item"
              }
              onClick={() =>
                onChangePage(item.name)
              }
            >

              <span className="menu-icon">
                <Icon
                  size={20}
                  strokeWidth={
                    isActive ? 2.2 : 1.7
                  }
                />
              </span>

              <span>
                {item.name}
              </span>

            </button>
          );
        })}

      </nav>


      {/* PUBLICAR */}

      <button
        className="create-post"
        onClick={() =>
          onChangePage("Inicio")
        }
      >
        <Plus
          size={19}
          strokeWidth={2}
        />

        <span>
          Publicar
        </span>
      </button>


      {/* USUARIO */}

      <div className="sidebar-user">

        <div className="avatar">
          V
        </div>

        <div>
          <strong>
            Victor
          </strong>

          <span>
            @victor
          </span>
        </div>

      </div>

    </aside>
  );
}

export default Sidebar;