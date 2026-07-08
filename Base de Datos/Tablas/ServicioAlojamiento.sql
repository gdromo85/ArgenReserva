CREATE TABLE ServicioAlojamiento (
    ServicioAlojamientoId INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(250) NOT NULL,
    Descripcion NVARCHAR(MAX)
); 