CREATE TABLE DetalleReserva (
    DetalleReservaID       INT IDENTITY(1,1) PRIMARY KEY,
    ReservaID               INT NOT NULL,
    UnidadAlojamientoID     INT NOT NULL,
    PrecioACobrar            DECIMAL(18,2) NOT NULL,
    CantidadPersonas         INT NOT NULL,
    FechaDesde               DATETIME NOT NULL,
    FechaHasta               DATETIME NOT NULL
);
   

