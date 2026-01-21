CREATE TABLE UsuarioComplejos (
    UsuarioComplejoID INT IDENTITY(1,1) PRIMARY KEY,
    UsuarioID INT FOREIGN KEY REFERENCES Usuarios(UsuarioID),
    ComplejoID INT FOREIGN KEY REFERENCES Complejos(ComplejoID),
    -- Aquí definimos qué hace este usuario en ESTE complejo específico
    RolEnComplejo NVARCHAR(50) NOT NULL, 
    -- Valores posibles: 'Dueño', 'Gerente', 'Recepcionista', 'Personal de Limpieza'
    -- Clave única para evitar que asignen al mismo usuario dos veces al mismo complejo con roles distintos
    CONSTRAINT UK_UsuarioComplejo UNIQUE (UsuarioID, ComplejoID)
);


                

