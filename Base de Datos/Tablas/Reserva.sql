CREATE TABLE Reserva (
    ReservaID       INT IDENTITY(1,1) PRIMARY KEY,
    InquilinoID     INT NOT NULL,
    TipoReservaID   INT NOT NULL,
    Sena            DECIMAL(18,2) NOT NULL DEFAULT 0,
    TotalAPagar     DECIMAL(18,2) NOT NULL DEFAULT 0,
    TotalPagado     DECIMAL(18,2) NOT NULL DEFAULT 0
);
   

