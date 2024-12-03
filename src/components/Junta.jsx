import React, { useState } from 'react';
import './Junta.css'; // Importamos la hoja de estilos

const Junta = () => {
  const [formData, setFormData] = useState({
    escenario: '',
    nombre: '',
    cedula: '',
    telefono: '',
    correo: '',
    fecha: '',
    hora: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
    alert('Formulario enviado con éxito');
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
          <option value=""> Seleccione la cancha</option>
          <option value="Fútbol">Unidad Deportiva Principal</option>
          <option value="Baloncesto">Villanueva</option>
          <option value="Voleibol">Cristo Rey</option>
          <option value="Tenis">Pedrera</option>
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
        <label className="form-label">Hora:</label>
        <input
          className="form-input"
          type="time"
          name="hora"
          value={formData.hora}
          onChange={handleChange}
          required
        />
      </div>

      {/* Botón de Envío */}
      <button className="form-button" type="submit">
        Enviar
      </button>
    </form>
  );
};

export {Junta};
