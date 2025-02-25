import React, { useState } from "react";
import "./Junta.css"; // Importamos la hoja de estilos
import Swal from "sweetalert2";

const Junta = () => {
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [reservas, setReservas] = useState([]); // Reservas definidas
  const [formData, setFormData] = useState({
    nombre: "",
    cedula: "",
    escenario: "",
    telefono: "",
    correo: "",
    fecha: "",
    hora: "",
  });
  // Estado para mensajes de error
  const [errores, setErrores] = useState({
    nombre: "",
    cedula: "",
    telefono: "",
    correo: "",
  });

  // horarios del mes de febrero 
  function generarHorariosFebrero() {
    const horarios = {};
    const year = 2025; // Año de referencia
    const mes = 1; // Febrero es el mes 1 en el índice (0 = Enero, 1 = Febrero, etc.)
  
    // Generar las horas de 6:00 a.m. a 10:00 p.m.
    const horasDelDia = [];
    for (let i = 6; i < 22; i++) {
      const horaInicio = `${i}:00`;
      const horaFin = `${i + 1}:00`;
      horasDelDia.push(`${horaInicio}-${horaFin}`);
    }
  
    // Generar las fechas para febrero
    const diasEnFebrero = new Date(year, mes + 1, 0).getDate(); // Último día del mes de febrero
    for (let dia = 1; dia <= diasEnFebrero; dia++) {
      const fecha = new Date(year, mes, dia);
      const fechaFormato = fecha.toISOString().split("T")[0]; // Formato YYYY-MM-DD
      horarios[fechaFormato] = [...horasDelDia]; // Agregar las horas del día
    }
  
    return horarios;
  }
  
  const horariosFebrero = generarHorariosFebrero();

  // Horarios disponibles por escenario y fecha
  const horariosPorEscenario = {
    idem: {
      "2024-12-16": ["7:00-8:00", "8:00-9:00", "9:00-10:00"],
      "2024-12-15": ["10:00-11:00", "11:00-12:00"],
      "2025-01-07": [
        "10:00-11:00",
        "11:00-12:00",
        "12:00-1:00",
        "1:00-2:00",
        "4:00-5:00",
      ],
      "2025-01-12": [
        "10:00-11:00",
        "11:00-12:00",
        "12:00-1:00",
        "1:00-2:00",
        "4:00-5:00",
      ],
      ...horariosFebrero,
    },
    Villanueva: {
       ...horariosFebrero,
    },
    Asunción: {
      "2024-12-15": ["9:00-10:00", "10:00-11:00"],
      ...horariosFebrero,
    },
    Presbítero: {
      "2024-12-15": ["9:00-10:00", "10:00-11:00"],
      ...horariosFebrero,
    },
    Fátima: {
      "2024-12-15": ["9:00-10:00", "10:00-11:00"],
      ...horariosFebrero,
    },
    Misericordia: {
      "2024-12-15": ["9:00-10:00", "10:00-11:00"],
      ...horariosFebrero,
    },
    Machado: {
      "2024-12-15": ["9:00-10:00", "10:00-11:00"],
      ...horariosFebrero,
    },
    Ciudadela: {
      "2024-12-15": ["9:00-10:00", "10:00-11:00"],
      ...horariosFebrero,
    },
    Pedrera: {
      "2024-12-15": ["9:00-10:00", "10:00-11:00"],
      ...horariosFebrero,
    },
    tenis: {
      "2024-12-15": ["9:00-10:00", "10:00-11:00"],
      "2024-12-16": ["9:00-10:00", "10:00-11:00"],
      ...horariosFebrero,
    },
  };

  // Validar el campo de nombre
  const validarNombre = (valor) => {
    const regex = /^[a-zA-Z\s]+$/;

    if (!regex.test(valor) && valor !== "") {
      return "El nombre solo puede contener letras y espacios.";
    } else if (valor.length > 30) {
      return "El nombre no puede tener más de 30 caracteres.";
    } else {
      return "";
    }
  };

  // Validar el campo de cédula (5 a 10 dígitos)
  const validarCedula = (valor) => {
    const regex = /^\d{5,10}$/;

    if (!regex.test(valor) && valor !== "") {
      return "La cédula debe tener entre 5 y 10 dígitos.";
    } else if (valor.trim() === "") {
      return "La cédula es obligatoria.";
    } else {
      return "";
    }
  };

  // Validar el campo de teléfono para Colombia
  const validarTelefono = (valor) => {
    const regex = /^(3\d{9}|[1-9]\d{6}|\d{10})$/;

    if (!regex.test(valor) && valor !== "") {
      return "Ingrese un teléfono válido (celular o fijo).";
    } else if (valor.trim() === "") {
      return "El teléfono es obligatorio.";
    } else {
      return "";
    }
  };
  // Validar Correo Electrónico
  const validarCorreo = (valor) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(valor) && valor !== "") {
      return "Ingrese un correo electrónico válido.";
    } else if (valor.trim() === "") {
      return "El correo es obligatorio.";
    } else {
      return "";
    }
  };

  // Manejar cambios en cualquier campo del formulario
  const handleChange = async (e) => {
    const { name, value } = e.target;

    // Validar el nombre al escribir
    if (name === "nombre") {
      const error = validarNombre(value);
      setErrores((prevErrores) => ({
        ...prevErrores,
        nombre: error,
      }));
    }

    // Validar la cédula
    if (name === "cedula") {
      const error = validarCedula(value);
      setErrores((prevErrores) => ({
        ...prevErrores,
        cedula: error,
      }));
    }
    if (name === "telefono") {
      const error = validarTelefono(value);
      setErrores((prevErrores) => ({
        ...prevErrores,
        telefono: error,
      }));
    }
    if (name === "correo") {
      const error = validarCorreo(value);
      setErrores((prevErrores) => ({
        ...prevErrores,
        correo: error,
      }));
    }
    // Actualizar el estado del formulario
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "escenario" || name === "fecha") {
      const escenarioSeleccionado =
        name === "escenario" ? value : formData.escenario;
      const fechaSeleccionada = name === "fecha" ? value : formData.fecha;

      // Obtener los horarios disponibles para el escenario y la fecha
      const horarios =
        horariosPorEscenario[escenarioSeleccionado]?.[fechaSeleccionada] || [];

      // Consultar las reservas desde el backend
      const reservas = await obtenerReservasDesdeAPI(
        escenarioSeleccionado,
        fechaSeleccionada
      );

      // Filtrar los horarios disponibles eliminando los reservados
      const horariosFiltrados = horarios.filter(
        (horario) => !reservas.includes(horario)
      );

      setHorariosDisponibles(horariosFiltrados);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorNombre = validarNombre(formData.nombre);
    const errorCedula = validarCedula(formData.cedula);
    const errorTelefono = validarTelefono(formData.telefono);
    const errorCorreo = validarCorreo(formData.correo);
    if (errorNombre || errorCedula) {
      setErrores((prevErrores) => ({
        ...prevErrores,
        nombre: errorNombre,
        cedula: errorCedula,
        telefono: errorTelefono,
        correo: errorCorreo,
      }));
    }
    //Condicon para validacion
    if (errorNombre || errorCedula || errorTelefono || errorCorreo) {
      return false; // Hay errores, bloquear envío
    }

    // Mostrar resumen con SweetAlert2
    const { value: confirmacion } = await Swal.fire({
      title: "Confirma los datos",
      html: `
        <p><b>Nombre:</b> ${formData.nombre}</p>
        <p><b>Cédula:</b> ${formData.cedula}</p>
        <p><b>Teléfono:</b> ${formData.telefono}</p>
        <p><b>Correo:</b> ${formData.correo}</p>
        <p><b>Fecha:</b> ${formData.fecha}</p>
        <p><b>Hora:</b> ${formData.hora}</p>
        <p><b>Escenario:</b> ${formData.escenario}</p>
      
       `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Enviar",
      cancelButtonText: "Cancelar",
    });

    if (!confirmacion) {
      Swal.fire({
        title: "Envío cancelado",
        text: "Por favor, revise los datos.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const response = await fetch(
        "https://reservas-canchas.vercel.app/escenario",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
  
      const result = await response.json();
  
      if (!response.ok) {
        // Manejo de errores con mensajes específicos del backend
        let errorMessage = result.mensaje || "Hubo un problema al realizar la reserva.";
  
        if (response.status === 400) {
          Swal.fire({
            icon: "error",
            title: "Reserva No Permitida",
            text: errorMessage,
            confirmButtonText: "OK",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ocurrió un problema con la reserva.",
            confirmButtonText: "Entendido",
          });
        }
        return;
      }
  
      // Reserva exitosa
      Swal.fire({
        title: "Reserva Confirmada",
        text: result.message || "Tu reserva ha sido creada con éxito.",
        icon: "success",
        confirmButtonText: "OK",
      });
  
      // Limpiar formulario después de reserva exitosa
      setFormData({
        nombre: "",
        cedula: "",
        telefono: "",
        correo: "",
        fecha: "",
        hora: "",
        escenario: "",
        barrio: "",
      });
  
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
  
      Swal.fire({
        title: "Error de conexión",
        text: `No se pudo conectar con el servidor: ${error.message}`,
        icon: "error",
        confirmButtonText: "Entendido",
      });
    }
  };
  

  const obtenerReservasDesdeAPI = async (escenario, fecha) => {
    try {
      const response = await fetch(
        `https://reservas-canchas.vercel.app/reservas?escenario=${escenario}&fecha=${fecha}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener las reservas");
      }

      const data = await response.json();
      console.log("Reservas obtenidas:", data); // Verificar los datos
      return data; // Lista de horarios reservados
    } catch (error) {
      // console.error("Error al consultar la API:", error);
      // Swal.fire("Error", "No se pudieron obtener las reservas", "error");
      return []; // En caso de error, devolver una lista vacía
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <img className="logo" src="logo.jpg" alt="" />

      <h2 className="form-title">Reserva de Escenario Deportivo</h2>

      <div className="form-group">
        <label className="form-label">Seleccione el escenario deportivo:</label>
        <select
          className="form-select"
          name="escenario"
          value={formData.escenario}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione la cancha</option>
          <option value="idem">Cancha Ídem</option>
          <option value="Villanueva">Villanueva</option>
          <option value="Asunción">Asunción</option>
          <option value="Presbítero">Presbítero</option>
          <option value="Fátima">Fátima</option>
          <option value="Misericordia">Misericordia</option>
          <option value="Machado">Machado</option>
          <option value="Ciudadela">Ciudadela</option>
          <option value="Pedrera">Pedrera</option>
          <option value="tenis">Cancha de tenis</option>
        </select>
      </div>

      {/* Nombre Completo */}
      <div className="form-group">
        <label className="form-label">Nombre Completo:</label>
        <input
          className="form-input"
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Ingrese su nombre completo"
          required
          style={{
            border: errores.nombre ? "2px solid red" : "1px solid #ccc",
            backgroundColor: errores.nombre ? "#ffe6e6" : "white",
          }}
        />
        {errores.nombre && (
          <span style={{ color: "red", fontSize: "12px" }}>
            {errores.nombre}
          </span>
        )}
      </div>

      {/* Cédula */}
      <div className="form-group">
        <label className="form-label">Número de Cédula:</label>
        <input
          className="form-input"
          type="text"
          name="cedula"
          value={formData.cedula}
          onChange={handleChange}
          placeholder="Ingrese su cédula"
          required
          style={{
            border: errores.cedula ? "2px solid red" : "1px solid #ccc",
            backgroundColor: errores.cedula ? "#ffe6e6" : "white",
          }}
        />
        {errores.cedula && (
          <span style={{ color: "red", fontSize: "12px" }}>
            {errores.cedula}
          </span>
        )}
      </div>

      {/* Teléfono */}
      <div className="form-group">
        <label className="form-label">Teléfono:</label>
        <input
          className="form-input"
          type="tel"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          placeholder="Ingrese su número de teléfono"
          required
          style={{
            border: errores.telefono ? "2px solid red" : "1px solid #ccc",
            backgroundColor: errores.telefono ? "#ffe6e6" : "white",
          }}
        />
        {errores.telefono && (
          <span style={{ color: "red" }}>{errores.telefono}</span>
        )}
      </div>

      {/* Correo Electrónico */}
      <div className="form-group">
        <label className="form-label">Correo Electrónico:</label>
        <input
          className="form-input"
          type="email"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          placeholder="Ingrese su correo electrónico"
          required
          style={{
            border: errores.correo ? "2px solid red" : "1px solid #ccc",
            backgroundColor: errores.correo ? "#ffe6e6" : "white",
          }}
        />
        {errores.correo && (
          <span style={{ color: "red" }}>{errores.correo}</span>
        )}
      </div>

      {/* Fecha */}
      <div className="form-group">
        <label className="form-label">Fecha:</label>
        <input
          className="form-input"
          type="date"
          name="fecha"
          value={formData.fecha}
          onChange={handleChange}
          required
        />
      </div>

      {/* Hora */}
      <div className="form-group">
        <label className="form-label">Seleccione la hora:</label>
        <select
          className="form-select"
          name="hora"
          value={formData.hora}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione una hora</option>
          {horariosDisponibles.map((hora, index) => (
            <option key={index} value={hora}>
              {hora}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">
          No está permitida la utilización de los escenarios deportivos para
          realizar actividad que contengan publicidad política, esto incluye los
          logos y eslogan de candidatos, campañas o partidos políticos.
        </label>
        <select className="form-select" required>
          <option value="">seleccione una opción</option>
          <option value="si">Sí</option>
          <option value="no">No</option>
        </select>
      </div>
      <br />
      <div className="form-group">
        <label className="form-label">
          Jundeportes Copacabana no tiene instructor asignado para acompañarlo
          y/o coordinar rutinas de trabajo por tal motivo no se hace responsable
          de lesiones y/o accidentes ocasionados por estos.
        </label>
        <select className="form-select" required>
          <option value="">seleccione una opción</option>
          <option value="si">Acepta</option>
          <option value="no">No Acepta</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">
          El escenario deberá ser entregado, por parte de la persona autorizada,
          en óptimas condiciones de calidad, orden y aseo, dentro del horario de
          servicio establecido, sin que ello represente inconveniente alguno;
          asumiendo igualmente el compromiso de reparar los daños que se puedan
          generar por el uso indebido del escenario deportivo, no se debe
          ingresar a las instituciones educativas y Usted deberá salir del
          escenario deportivo una vez finalice el horario del préstamo sin
          excepción.
        </label>
        <select className="form-select" required>
          <option value="">seleccione una opción</option>
          <option value="si">Acepta</option>
          <option value="no">No Acepta</option>
        </select>
      </div>
      <div className="form-group">
        <input type="checkbox" required />
        <label htmlFor="">
          {" "}
          La JUNTA DE DEPORTES DE COPACABANA como responsable del tratamiento de
          los datos, solicita su autorización para recolectar, almacenar,
          circular y usar sus datos personales, en cumplimiento de lo
          establecido por las normas vigentes: Ley 1581 de 2012 y demás normas
          que la reglamentan o complementan. La información suministrada por
          usted, será utilizada única y exclusivamente para el siguiente fin,
          realizar la reserva de espacios deportivos.
        </label>
      </div>
      <button className="form-button" type="submit">
        Enviar
      </button>
    </form>
  );
};

export { Junta };
