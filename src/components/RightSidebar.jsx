function RightSidebar() {

  return (

    <aside className="right-sidebar">

      <section className="card">

        <h3>
          🔥 Tendencias
        </h3>


        <div className="trend">

          <span>
            En tu colegio
          </span>

          <strong>
            #ExamenMañana
          </strong>

          <small>
            124 publicaciones
          </small>

        </div>


        <div className="trend">

          <span>
            Popular
          </span>

          <strong>
            #NoHayTarea
          </strong>

          <small>
            89 publicaciones
          </small>

        </div>


        <div className="trend">

          <span>
            Ahora
          </span>

          <strong>
            #Recreo
          </strong>

          <small>
            57 publicaciones
          </small>

        </div>

      </section>


      <section className="card">

        <h3>
          👥 Personas sugeridas
        </h3>


        <div className="suggestion">

          <div className="avatar">
            A
          </div>

          <div className="suggestion-info">

            <strong>
              Ana López
            </strong>

            <span>
              @analopez
            </span>

          </div>

          <button>
            Seguir
          </button>

        </div>


        <div className="suggestion">

          <div className="avatar">
            D
          </div>

          <div className="suggestion-info">

            <strong>
              Diego Ramos
            </strong>

            <span>
              @diegor
            </span>

          </div>

          <button>
            Seguir
          </button>

        </div>

      </section>

    </aside>
  );
}


export default RightSidebar;