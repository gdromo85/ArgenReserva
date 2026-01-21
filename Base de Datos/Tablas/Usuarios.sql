create table Usuarios (
	UsuarioID INT IDENTITY(1,1) PRIMARY KEY,
    Email NVARCHAR(150) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    Nombre NVARCHAR(100),
    Activo BIT DEFAULT 1

)
go

                

