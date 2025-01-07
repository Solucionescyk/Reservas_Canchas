import React, { useState } from "react";
import "./Junta.css"; // Importamos la hoja de estilos
import Swal from "sweetalert2";


const Junta = () => {
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    cedula: "",
    escenario: "",
    telefono: "",
    correo: "",
    fecha: "",
    hora: "",
  });

  // Horarios disponibles por escenario y fecha
  const horariosPorEscenario = {
    idem: {
      "2024-12-16": ["7:00-8:00", "8:00-9:00", "9:00-10:00"],
      "2024-12-15": ["10:00-11:00", "11:00-12:00"],
      "2025-01-07": ["10:00-11:00", "11:00-12:00", "12:00-1:00"],
      
    },
    Villanueva: {
      "2024-12-15": ["9:00-10:00", "10:00-11:00"],
      
    },
    Asunción: {
      "2024-12-15": ["9:00-10:00", "10:00-11:00"],
      
    },
    Presbítero: {
      "2024-12-15": ["9:00-10:00", "10:00-11:00"],
      
    },
    Fátima: {
      "2024-12-15": ["9:00-10:00", "10:00-11:00"],
      
    },
    Misericordia: {
      "2024-12-15": ["9:00-10:00", "10:00-11:00"],
      
    },
    Machado: {
      "2024-12-15": ["9:00-10:00", "10:00-11:00"],
      
    },
    Ciudadela: {
      "2024-12-15": ["9:00-10:00", "10:00-11:00"],
      
    },
    Pedrera: {
      "2024-12-15": ["9:00-10:00", "10:00-11:00"],
      
    },
    tenis: {
      "2024-12-15": ["9:00-10:00", "10:00-11:00"],
      "2024-12-16": ["9:00-10:00", "10:00-11:00"],
      
    },
  
  };

  // Manejar cambios en cualquier campo del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Actualizar el estado del formulario
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Actualizar los horarios disponibles si cambia el escenario o la fecha
    if (name === "escenario" || name === "fecha") {
      const escenarioSeleccionado = name === "escenario" ? value : formData.escenario;
      const fechaSeleccionada = name === "fecha" ? value : formData.fecha;

      // Obtener los horarios según el escenario y la fecha seleccionados
      const horarios = horariosPorEscenario[escenarioSeleccionado]?.[fechaSeleccionada] || [];
      setHorariosDisponibles(horarios);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Mostrar resumen con SweetAlert2
    const { value: confirmacion } = await Swal.fire({
      title: "Confirma los datos",
      html:`
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
  
    // Enviar formulario al backend
    try {
      const response = await fetch("http://localhost:3000/escenario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const result = await response.json();
        Swal.fire({
          title: "Formulario enviado",
          text: result.message,
          icon: "success",
          confirmButtonText: "OK",
        });
  
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
      } else {
        const errorMessage = await response.text();
        console.error("Error en la respuesta:", errorMessage);
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al enviar el formulario: " + errorMessage,
          icon: "error",
          confirmButtonText: "Entendido",
        });
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      Swal.fire({
        title: "Error",
        text: `Error al conectar con el servidor: ${error.message}`,
        icon: "error",
        confirmButtonText: "Entendido",
      });
    }
  };
  
  
  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <img className="logo" src="logo blanco.jpg" alt="" />
      
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
        />
      </div>

      {/* Cédula */}
      <div className="form-group">
        <label className="form-label">Cédula:</label>
        <input
          className="form-input"
          type="text"
          name="cedula"
          value={formData.cedula}
          onChange={handleChange}
          placeholder="Ingrese su cédula"
          required
        />
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
          placeholder="Ingrese su teléfono"
          required
        />
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
          placeholder="Ingrese su correo"
          required
        />
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
          <option value="">Selecciona la hora de la reserva</option>
          {horariosDisponibles.map((horario, index) => (
            <option key={index} value={horario}>
              {horario}
            </option>
          ))}
        </select>
      </div>
  
            <div className="">
              <label className="form-label">
              No está permitida la utilización de los escenarios deportivos para realizar actividad que contengan publicidad política, esto incluye los logos y eslogan de candidatos, campañas o partidos políticos.
              </label>
              <select className="form-select" required>
                <option value="">--seleccione una opción</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div><br />
            <div className="form-group">
              <label className="form-label">
              Jundeportes Copacabana no tiene instructor asignado para acompañarlo y/o coordinar rutinas de trabajo por tal motivo no se hace responsable de lesiones y/o accidentes ocasionados por estos.
              </label>
              <select className="form-select" required>
                <option value="">--seleccione una opción</option>
                <option value="si">Acepta</option>
                <option value="no">No Acepta</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">
              El escenario deberá ser entregado, por parte de la persona autorizada, en óptimas condiciones de calidad, orden y aseo, dentro del horario de servicio establecido, sin que ello represente inconveniente alguno; asumiendo igualmente el compromiso de reparar los daños que se puedan generar por el uso indebido del escenario deportivo, no se debe ingresar a las instituciones educativas y Usted deberá salir del escenario deportivo una vez finalice el horario del préstamo sin excepción.
              </label>
              <select className="form-select" required>
                <option value="">--seleccione una opción</option>
                <option value="si">Acepta</option>
                <option value="no">No Acepta</option>
              </select>
            </div>
            <div className="form-group">
              <input type="checkbox" required />
              <label htmlFor="">	La JUNTA DE DEPORTES DE COPACABANA como responsable del tratamiento de los datos, solicita su autorización para recolectar, almacenar, circular y usar sus datos personales, en cumplimiento de lo establecido por las normas vigentes: Ley 1581 de 2012 y demás normas que la reglamentan o complementan.
              La información suministrada por usted, será utilizada única y exclusivamente para el siguiente fin, realizar la reserva de espacios deportivos.</label>

            </div>
    <button className="form-button" type="submit">
    Enviar
  </button>
        
         
    
    </form>

  );
};

export { Junta };
