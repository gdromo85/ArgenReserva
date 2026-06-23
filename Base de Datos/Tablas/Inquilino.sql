CREATE TABLE Inquilino (
    InquilinoId INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(150) NOT NULL,
	Apellido NVARCHAR(150),
    Direccion NVARCHAR(255),
    Telefono NVARCHAR(50),
    Descripcion NVARCHAR(MAX)
);
   

