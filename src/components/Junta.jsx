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
    const mes = 3; // Febrero es el mes 1 en el índice (0 = Enero, 1 = Febrero, 2 mar, 3 abril, 4 mayo, 5 junio, 6 julio, 7 agosto, 8 septiembre, 9 octubre, 10 noviembre, 11 diciembre)
  
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
    
    //  "2025-05-05": ["6:00-7:30",  "11:00-12:30", "12:30-14:00"],
      //"2025-05-06": ["11:00-12:30", "12:30-14:00"],
      //"2025-05-07": ["6:00-7:30", "11:00-12:30", "12:30-14:00" ],
      //"2025-05-08": ["11:00-12:30", "12:30-14:00" ],
      //"2025-05-09": ["6:00-7:30",  "11:00-12:30", "12:30-14:00", "16:00-17:30", "19:00-20:30", "20:30-22:00" ],
      
    },
    Villanueva: {
      
      
      "2025-08-25":["6:00-07:00","7:00-8:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "21:00-22:00" ],
      "2025-08-26": ["06:00-07:00", "07:00-08:00", "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",  
                      "12:00-13:00", "13:00-14:00"],
      "2025-08-27": ["6:00-07:00","7:00-8:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", ],
      "2025-08-28": ["06:00-07:00", "07:00-08:00", "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00","13:00-14:00",  ],
    "2025-08-29": ["6:00-07:00","7:00-8:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", ],
    },
    Asunción: {
      
      "2025-08-25": ["6:00-7:00", "7:00-8:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00", 
                     "15:00-16:00", "20:00-21:00", "21:00-22:00" ],
      "2025-08-26": ["06:00-07:00", "07:00-08:00", "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",  
                   "12:00-13:00", "15:00-16:00" ],
      "2025-08-27": ["06:00-07:00", "07:00-08:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00", 
                    "15:00-16:00", "20:00-21:00"], 
      "2025-08-28": ["06:00-07:00", "07:00-08:00", "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",  
                      "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00", ],
      "2025-08-29": ["06:00-07:00", "07:00-08:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00"],
    },
    Presbítero: {
     
      "2025-08-25": [""],
      "2025-08-26": ["20:30-21:30", "21:30-22:30"],
      "2025-08-27": ["" ],
      "2025-08-28": [],
      "2025-08-29": ["20:30-21:30","21:30-22:30" ],
    },
    Fátima: {
     
     "2025-08-01": ["6:00-7:00", "7:00-8:00", "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", 
                      "13:00-14:00", "19:30-20:30", "21:30-22:30"],
      "2025-09-02": ["6:00-7:00", "7:00-8:00", "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00","19:30-20:30",
                      "21:30-22:30" ],
      "2025-08-03": ["6:00-7:00", "7:00-8:00", "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", 
                      "19:30-20:30" ],
      "2025-08-04": ["6:00-7:00", "7:00-8:00", "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00",
                     "13:00-14:00",  "21:00-22:00"],
      "2025-08-05": ["6:00-7:00", "7:00-8:00", "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", 
                      "14:00-15:00", "21:30-22:30" ],

    }, 
    Misericordia: {
      
      "2025-08-25": ["6:00-7:00", "7:00-8:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00",
                       "21:00-22:00"],
      "2025-08-26": ["6:00-7:00", "7:00-8:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00","21:00-22:00" ],
      "2025-08-27": ["6:00-7:00", "7:00-8:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00",  ],
      "2025-08-28": ["6:00-7:00", "7:00-8:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00" ],
      "2025-08-29": ["06:00-07:00", "07:00-08:00", "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",  
                     "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00",  
                      "18:00-19:00", "19:00-20:00", "20:00-21:00", "21:00-22:00"],
    },
    Machado: {
      
      "2025-08-25": ["06:00-07:00", "07:00-08:00", "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",  
                     "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00"],
      "2025-08-26": ["06:00-07:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",  
                      "12:00-13:00", "13:00-14:00", "14:00-15:00",  ],
     "2025-08-27": ["06:00-07:00", "07:00-08:00", "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",  
                     "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00",  "20:00-21:00", "21:00-22:00" ],
      "2025-08-28": ["06:00-07:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",  
                     "12:00-13:00", "13:00-14:00", "14:00-15:00", ],  
      "2025-08-29": ["06:00-07:00", "07:00-08:00", "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",  
                     "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00" ],
    },
    Ciudadela: {
    
    //"2025-06-30": [],
    //"2025-07-01": ["21:30-22:30"],
    //"2025-07-02": ["21:00-22:30" ],
    //"2025-07-03": ["21:00-22:30" ],
    //"2025-07-04": ["21:30-22:30" ],
    },
    Pedrera: {
      
      //"2025-08-25": ["6:00-7:30", "7:30-9:00", "9:00-10:30", "10:30-12:00","21:30-22:30"  ],
      "2025-08-26": ["6:00-7:30", "7:30-9:00", "9:00-10:30", "10:30-12:00", "12:00-13:30" ,"21:30-22:30" ],
      "2025-08-27": ["6:00-7:30", "7:30-9:00", "9:00-10:30", "10:30-12:00", "12:00-13:30","21:30-22:30" ],
      "2025-08-28": ["6:00-7:30", "7:30-9:00", "9:00-10:30", "10:30-12:00", "12:00-13:30" ,"21:30-22:30"],
      "2025-08-29": ["6:00-7:30", "7:30-9:00", "9:00-10:30", "10:30-12:00", "12:00-13:30", "18:00-19:00", ],
    },
    CristoRey: {
      
      "2025-08-25": ["06:00-7:30", "7:30-9:00", "9:00-10:30", "10:30-12:00", "12:00-13:30","13:30-15:00" ],  
      "2025-08-26": ["06:00-07:30", "10:00-11:30", "11:30-13:00", "13:00-14:30"],
      "2025-08-27": ["06:00-07:30", "7:30-9:00", "9:30-11:00", "11:00-12:30", "12:30-14:00" ],
      "2025-08-28": ["06:00-7:30",  "11:30-13:00", "13:00-14:30"  ],
      "2025-08-29": ["06:00-07:30", "10:00-11:30", "11:30-13:00",   ],
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
      <img className="logo" src="inder.jpeg" alt="" />

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
          <option value="CristoRey">Cristo Rey</option>
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
         <b>1: Condiciones de entrega del escenario:</b> El escenario debe ser entregado en óptimas condiciones de calidad, orden y aseo 
         dentro del horario establecido para el préstamo. El solicitante asume el compromiso de reparar cualquier daño causado por el uso 
         indebido del mismo. Se prohíbe el ingreso a instituciones educativas y se deberá abandonar el escenario puntualmente al finalizar 
         el horario del préstamo. Cualquier incumplimiento de este compromiso podrá resultar en la no autorización de futuros préstamos.
        </label>
        <select className="form-select" required>
          <option value="">seleccione una opción</option>
          <option value="si">Acepta</option>
          <option value="no">No Acepta</option>
        </select>
      </div>
      <br />
      <div className="form-group">
        <label className="form-label">
        <b>2: Responsabilidad en caso de incidentes:</b> El INDER Copacabana no asume ninguna responsabilidad por lesiones o accidentes
         que ocurran durante el uso del escenario, ya que no se asigna instructor o coordinador para acompañar las actividades. 
         El solicitante es responsable de garantizar la seguridad de los participantes y del cumplimiento de las normas de seguridad.
        </label>
        <select className="form-select" required>
          <option value="">seleccione una opción</option>
          <option value="si">Acepta</option>
          <option value="no">No Acepta</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">
          <b>3: Restricciones sobre publicidad política:</b>  Se prohíbe el uso de los escenarios deportivos para actividades que impliquen publicidad 
            política, incluyendo logotipos, eslóganes o cualquier tipo de promoción de campañas o partidos políticos. 
            En cumplimiento con la Ley 1356 de 2009, Artículo 218 I y J, el solicitante acepta las obligaciones y restricciones 
            inherentes al uso del escenario, y se compromete a respetar todas las disposiciones legales.
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
          <b>IMPORTANTE:</b> El INDER COPACABANA como responsable del tratamiento de
          los datos, solicita su autorización para recolectar, almacenar,
          circular y usar sus datos personales, en cumplimiento de lo
          establecido por las normas vigentes: Ley 1581 de 2012 y demás normas
          que la reglamentan o complementan. La información suministrada por
          usted, será utilizada única y exclusivamente para el siguiente fin,
          realizar la reserva de espacios deportivos.
        </label>
        <label htmlFor="">
          {" "}
          <b>IMPORTANTE:</b> El préstamo de los escenarios deportivos ES COMPLETAMENTE GRATUITO.      
          Este permiso es personal e intransferible, se debe presentar documento de identidad del titular. 
          Cualquier anomalía sobre la particular denuncia al teléfono: 3207262935.
        </label>
        <label htmlFor="">
          {" "}
          <b>AVISO FINAL:</b> El incumplimiento de los plazos, el mal uso de los escenarios o el incumplimiento de cualquiera 
          de las condiciones establecidas en este formato o en las normas legales y reglamentarias dará lugar a la cancelación 
          de futuros préstamos de los escenarios deportivos, sin excepción.
        </label>
      </div>
      <button className="form-button" type="submit">
        Enviar
      </button>
      
    <h1>CM</h1>


    </form>
  );
};

export { Junta };
