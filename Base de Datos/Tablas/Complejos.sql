CREATE TABLE Complejos (
    ComplejoID INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(150) NOT NULL,
    Direccion NVARCHAR(255),
    Telefono NVARCHAR(50),
    Descripcion NVARCHAR(MAX)
);
   

