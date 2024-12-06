import React, { useState } from "react";
import "./Junta.css"; // Importamos la hoja de estilos



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

  const horariosPorFecha = {
    "2024-12-05": ["7:00-8:00", "8:00-9:00", "9:00-10:00"],
    "2024-12-06": ["10:00-11:00", "11:00-12:00", "12:00-13:00"],
  };

  const handleDateChange = (e) => {
    const fechaSeleccionada = e.target.value;
    setFormData({ ...formData, fecha: fechaSeleccionada });

    // Actualizar horarios según la fecha seleccionada
    setHorariosDisponibles(horariosPorFecha[fechaSeleccionada] || []);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        alert("Formulario enviado con éxito: " + result.message);
        setFormData({
          nombre: "",
          cedula: "",
          telefono: "",
          correo: "",
          fecha: "",
          hora: "",
          escenario: "",
        }); // Limpiamos el formulario
      } else {
        alert("Error al enviar el formulario");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2 className="form-title">Reserva de Escenario Deportivo</h2>

      {/* Escenario Deportivo */}
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
          onChange={handleDateChange}
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
          onChange={handleDateChange}
          required
        >
          <option value="">Selecciona la hora de la reserva</option>
          {horariosDisponibles.map((hora, index) => (
            <option key={index} value={hora}>
              {hora}
            </option>
          ))}
        </select>
      </div>

      {/* Botón de Envío */}
      <button className="form-button" type="submit">
        Enviar
      </button>
    </form>
  );
};

export { Junta };
