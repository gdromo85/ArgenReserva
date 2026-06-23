CREATE TABLE UnidadAlojamiento (
    UnidadAlojamientoId INT IDENTITY(1,1) PRIMARY KEY,
	ComplejoId INT NOT NULL,
    Nombre NVARCHAR(150) NOT NULL,
    Capacidad INT NOT NULL,
    Descripcion NVARCHAR(MAX),
	Precio DECIMAL(18,2)
); 