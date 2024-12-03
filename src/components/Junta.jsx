import React, { useState } from "react";
import "./Junta.css"; // Importamos la hoja de estilos

const Junta = () => {
  const [formData, setFormData] = useState({
    escenario: "",
    nombre: "",
    cedula: "",
    telefono: "",
    correo: "",
    fecha: "",
    hora: "", // Aquí almacenaremos el intervalo seleccionado
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);
    alert("Formulario enviado con éxito");
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
          <option value="Cancha Ídem">Cancha Ídem</option>
          <option value="Villanueva">Villanueva</option>
          <option value="Asunción">Asunción</option>
          <option value="Presbítero">Presbítero</option>
          <option value="Fátima">Fátima</option>
          <option value="Misericordia">Misericordia</option>
          <option value="Machado">Machado</option>
          <option value="Ciudadela">Ciudadela</option>
          <option value="Pedrera">Pedrera</option>
          <option value="Tenis">Cancha de tenis</option>
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
          <option value="7:00-8:00">7:00 - 8:00</option>
          <option value="8:00-9:00">8:00 - 9:00</option>
          <option value="9:00-10:00">9:00 - 10:00</option>
          <option value="10:00-11:00">10:00 - 11:00</option>
          <option value="11:00-12:00">11:00 - 12:00</option>
          <option value="12:00-13:00">12:00 - 13:00</option>
          <option value="13:00-14:00">13:00 - 14:00</option>
          <option value="14:00-15:00">14:00 - 15:00</option>
          <option value="15:00-16:00">15:00 - 16:00</option>
          <option value="16:00-17:00">16:00 - 17:00</option>
          <option value="17:00-18:00">17:00 - 18:00</option>
          <option value="18:00-19:00">18:00 - 19:00</option>
          <option value="19:00-20:00">19:00 - 20:00</option>
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
