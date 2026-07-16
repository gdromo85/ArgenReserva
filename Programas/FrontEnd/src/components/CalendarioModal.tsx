import React, { useEffect, useMemo, useState } from "react";
import { useComplejos } from "../context/ComplejosContext";
import { useReservas } from "../context/ReservasContext";
import { getUnidadesAlojamiento } from "../api/unidadAlojamiento";
import { UnidadAlojamiento } from "../types/UnidadAlojamiento";
import Modal from "./Modal";
import { PrefillDetalle } from "./ReservaForm";

interface CalendarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReservar: (prefill: PrefillDetalle) => void;
}

interface UnidadConComplejo {
  unidad: UnidadAlojamiento;
  complejoId: number;
  complejoNombre: string;
}

const ESTADO_QUE_OCUPA = "confirmado";
const DIAS_SEMANA = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const PALETA_COLORES = [
  { bg: "bg-blue-500", suave: "bg-blue-100 text-blue-800" },
  { bg: "bg-purple-500", suave: "bg-purple-100 text-purple-800" },
  { bg: "bg-pink-500", suave: "bg-pink-100 text-pink-800" },
  { bg: "bg-teal-500", suave: "bg-teal-100 text-teal-800" },
  { bg: "bg-orange-500", suave: "bg-orange-100 text-orange-800" },
  { bg: "bg-cyan-500", suave: "bg-cyan-100 text-cyan-800" },
  { bg: "bg-lime-600", suave: "bg-lime-100 text-lime-800" },
  { bg: "bg-fuchsia-500", suave: "bg-fuchsia-100 text-fuchsia-800" },
  { bg: "bg-amber-500", suave: "bg-amber-100 text-amber-800" },
  { bg: "bg-indigo-500", suave: "bg-indigo-100 text-indigo-800" }
];

const hoy = new Date();
const mesActualISO = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}`;

const formatMoneda = (valor: number): string =>
  (valor || 0).toLocaleString("es-AR", { style: "currency", currency: "ARS" });

const primerDiaDelMes = (mesISO: string): string => `${mesISO}-01`;

const primerDiaSiguienteMes = (mesISO: string): string => {
  const [year, month] = mesISO.split("-").map(Number);
  const d = new Date(year, month, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
};

const sumarMeses = (mesISO: string, cantidad: number): string => {
  const [year, month] = mesISO.split("-").map(Number);
  const d = new Date(year, month - 1 + cantidad, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const nombreMes = (mesISO: string): string => {
  const [year, month] = mesISO.split("-").map(Number);
  const d = new Date(year, month - 1, 1);
  return d.toLocaleDateString("es-AR", { month: "long", year: "numeric" });
};

const sumarDiasISO = (fechaISO: string, dias: number): string => {
  const d = new Date(`${fechaISO}T00:00:00`);
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
};

const formatFechaDMY = (fechaISO: string): string => {
  const d = new Date(`${fechaISO}T00:00:00`);
  return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("es-AR");
};

const matrizDelMes = (mesISO: string): (string | null)[][] => {
  const [year, month] = mesISO.split("-").map(Number);
  const primerDia = new Date(year, month - 1, 1);
  const diasEnMes = new Date(year, month, 0).getDate();
  const inicioSemana = (primerDia.getDay() + 6) % 7; // 0 = lunes

  const celdas: (string | null)[] = [];
  for (let i = 0; i < inicioSemana; i++) celdas.push(null);
  for (let dia = 1; dia <= diasEnMes; dia++) {
    celdas.push(`${year}-${String(month).padStart(2, "0")}-${String(dia).padStart(2, "0")}`);
  }
  while (celdas.length % 7 !== 0) celdas.push(null);

  const semanas: (string | null)[][] = [];
  for (let i = 0; i < celdas.length; i += 7) semanas.push(celdas.slice(i, i + 7));
  return semanas;
};

const CalendarioModal: React.FC<CalendarioModalProps> = ({ isOpen, onClose, onReservar }) => {
  const { complejos } = useComplejos();
  const { reservas } = useReservas();

  const [mesISO, setMesISO] = useState(mesActualISO);
  const [filtroComplejoId, setFiltroComplejoId] = useState<number | "">("");
  const [filtroUnidadId, setFiltroUnidadId] = useState<number | "">("");
  const [unidades, setUnidades] = useState<UnidadConComplejo[]>([]);
  const [loadingUnidades, setLoadingUnidades] = useState(false);
  const [seleccionInicio, setSeleccionInicio] = useState<string | null>(null);
  const [seleccionFin, setSeleccionFin] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setMesISO(mesActualISO);
    setFiltroComplejoId("");
    setFiltroUnidadId("");
    setSeleccionInicio(null);
    setSeleccionFin(null);
  }, [isOpen]);

  useEffect(() => {
    setSeleccionInicio(null);
    setSeleccionFin(null);
  }, [filtroUnidadId, mesISO]);

  useEffect(() => {
    if (!isOpen) return;
    const complejosAConsultar = filtroComplejoId
      ? complejos.filter(c => c.ComplejoID === filtroComplejoId)
      : complejos;

    setLoadingUnidades(true);
    Promise.all(
      complejosAConsultar.map(c =>
        getUnidadesAlojamiento(c.ComplejoID!).then(unidadesDelComplejo =>
          unidadesDelComplejo.map(unidad => ({ unidad, complejoId: c.ComplejoID!, complejoNombre: c.Nombre }))
        )
      )
    )
      .then(resultados => {
        const todas = resultados.flat().sort((a, b) => (a.unidad.unidadAlojamientoId ?? 0) - (b.unidad.unidadAlojamientoId ?? 0));
        setUnidades(todas);
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingUnidades(false));
  }, [isOpen, filtroComplejoId, complejos]);

  const unidadesVisibles = useMemo(() => {
    if (!filtroUnidadId) return unidades;
    return unidades.filter(u => u.unidad.unidadAlojamientoId === filtroUnidadId);
  }, [unidades, filtroUnidadId]);

  const colorDeUnidad = (unidadId?: number): { bg: string; suave: string } => {
    const index = unidades.findIndex(u => u.unidad.unidadAlojamientoId === unidadId);
    return PALETA_COLORES[Math.max(0, index) % PALETA_COLORES.length];
  };

  const ocupacionPorDia = useMemo(() => {
    const mapa = new Map<string, { unidadId: number; nombre: string }[]>();
    const reservasConfirmadas = reservas.filter(
      r => r.estadoReserva?.nombre?.trim().toLowerCase() === ESTADO_QUE_OCUPA
    );

    for (const r of reservasConfirmadas) {
      for (const d of r.detalleReserva || []) {
        const unidadId = d.unidadAlojamiento?.unidadAlojamientoId;
        if (!unidadId) continue;
        if (filtroUnidadId && unidadId !== filtroUnidadId) continue;
        if (!filtroUnidadId && filtroComplejoId && d.unidadAlojamiento?.complejoId !== filtroComplejoId) continue;

        const desde = d.fechaDesde?.slice(0, 10);
        const hasta = d.fechaHasta?.slice(0, 10);
        if (!desde || !hasta) continue;

        const cursor = new Date(`${desde}T00:00:00`);
        const fin = new Date(`${hasta}T00:00:00`);
        while (cursor < fin) {
          const diaISO = cursor.toISOString().slice(0, 10);
          const lista = mapa.get(diaISO) ?? [];
          lista.push({ unidadId, nombre: d.unidadAlojamiento?.nombre ?? "" });
          mapa.set(diaISO, lista);
          cursor.setDate(cursor.getDate() + 1);
        }
      }
    }
    return mapa;
  }, [reservas, filtroUnidadId, filtroComplejoId]);

  const resumenMes = useMemo(() => {
    const desdeMes = primerDiaDelMes(mesISO);
    const hastaMes = primerDiaSiguienteMes(mesISO);
    const reservasConfirmadas = reservas.filter(
      r => r.estadoReserva?.nombre?.trim().toLowerCase() === ESTADO_QUE_OCUPA
    );

    let totalFacturado = 0;
    const reservaIds = new Set<number>();

    for (const r of reservasConfirmadas) {
      for (const d of r.detalleReserva || []) {
        const unidadId = d.unidadAlojamiento?.unidadAlojamientoId;
        if (filtroUnidadId && unidadId !== filtroUnidadId) continue;
        if (!filtroUnidadId && filtroComplejoId && d.unidadAlojamiento?.complejoId !== filtroComplejoId) continue;

        const desde = d.fechaDesde?.slice(0, 10);
        const hasta = d.fechaHasta?.slice(0, 10);
        if (!desde || !hasta) continue;

        if (desde < hastaMes && desdeMes < hasta) {
          totalFacturado += d.precioACobrar;
          if (r.reservaId) reservaIds.add(r.reservaId);
        }
      }
    }

    return { totalFacturado, cantidadReservas: reservaIds.size };
  }, [reservas, mesISO, filtroUnidadId, filtroComplejoId]);

  const semanas = useMemo(() => matrizDelMes(mesISO), [mesISO]);

  const rangoLibre = (desde: string, hastaExclusiva: string): boolean => {
    const cursor = new Date(`${desde}T00:00:00`);
    const fin = new Date(`${hastaExclusiva}T00:00:00`);
    while (cursor < fin) {
      const diaISO = cursor.toISOString().slice(0, 10);
      if ((ocupacionPorDia.get(diaISO) ?? []).length > 0) return false;
      cursor.setDate(cursor.getDate() + 1);
    }
    return true;
  };

  const handleDiaClick = (dia: string) => {
    if (!filtroUnidadId) return;

    if (!seleccionInicio) {
      if (rangoLibre(dia, sumarDiasISO(dia, 1))) {
        setSeleccionInicio(dia);
        setSeleccionFin(sumarDiasISO(dia, 1));
      }
      return;
    }

    if (dia === seleccionInicio) {
      setSeleccionInicio(null);
      setSeleccionFin(null);
      return;
    }

    if (dia > seleccionInicio) {
      if (rangoLibre(seleccionInicio, dia)) {
        setSeleccionFin(dia);
        return;
      }
    }

    if (rangoLibre(dia, sumarDiasISO(dia, 1))) {
      setSeleccionInicio(dia);
      setSeleccionFin(sumarDiasISO(dia, 1));
    } else {
      setSeleccionInicio(null);
      setSeleccionFin(null);
    }
  };

  const confirmarReserva = () => {
    if (!filtroUnidadId || !seleccionInicio || !seleccionFin) return;
    const unidadInfo = unidades.find(u => u.unidad.unidadAlojamientoId === filtroUnidadId);
    if (!unidadInfo) return;
    onReservar({
      complejoId: unidadInfo.complejoId,
      unidad: unidadInfo.unidad,
      fechaDesde: seleccionInicio,
      fechaHasta: seleccionFin
    });
    setSeleccionInicio(null);
    setSeleccionFin(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Calendario de Reservas" maxWidthClassName="sm:max-w-6xl">
      <div className="flex flex-wrap items-end gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mes</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMesISO(prev => sumarMeses(prev, -1))}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
              aria-label="Mes anterior"
            >
              ‹
            </button>
            <input
              type="month"
              value={mesISO}
              onChange={e => e.target.value && setMesISO(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setMesISO(prev => sumarMeses(prev, 1))}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
              aria-label="Mes siguiente"
            >
              ›
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Complejo</label>
          <select
            value={filtroComplejoId}
            onChange={e => {
              setFiltroComplejoId(e.target.value ? Number(e.target.value) : "");
              setFiltroUnidadId("");
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Todos</option>
            {complejos.map(c => (
              <option key={c.ComplejoID} value={c.ComplejoID}>{c.Nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unidad de Alojamiento</label>
          <select
            value={filtroUnidadId}
            onChange={e => setFiltroUnidadId(e.target.value ? Number(e.target.value) : "")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Todas</option>
            {unidades.map(u => (
              <option key={u.unidad.unidadAlojamientoId} value={u.unidad.unidadAlojamientoId}>
                {u.unidad.nombre} · {u.complejoNombre}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-auto sm:ml-auto flex flex-wrap gap-3 text-sm">
          <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-md">
            <span className="text-green-800 font-medium">{resumenMes.cantidadReservas}</span>
            <span className="text-green-700"> reservas confirmadas</span>
          </div>
          <div className="px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-md">
            <span className="text-indigo-800 font-medium">{formatMoneda(resumenMes.totalFacturado)}</span>
            <span className="text-indigo-700"> facturado en el mes</span>
          </div>
        </div>
      </div>

      <p className="text-lg font-semibold text-gray-900 capitalize mb-3">{nombreMes(mesISO)}</p>

      {filtroUnidadId && seleccionInicio && seleccionFin && (
        <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-md flex items-center justify-between flex-wrap gap-2">
          <span className="text-sm text-indigo-800">
            Seleccionado: {formatFechaDMY(seleccionInicio)} al {formatFechaDMY(seleccionFin)}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setSeleccionInicio(null); setSeleccionFin(null); }}
              className="text-sm text-indigo-700 hover:text-indigo-900"
            >
              Cancelar selección
            </button>
            <button
              type="button"
              onClick={confirmarReserva}
              className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Reservar
            </button>
          </div>
        </div>
      )}

      {!filtroUnidadId && (
        <p className="text-sm text-gray-500 mb-3">
          Elegí una Unidad de Alojamiento para poder reservar directamente desde el calendario.
        </p>
      )}

      {loadingUnidades ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1">
            {DIAS_SEMANA.map(dia => (
              <div key={dia} className="text-center text-[10px] sm:text-xs font-medium text-gray-500 py-1">{dia}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
            {semanas.flatMap((semana, i) =>
              semana.map((diaISO, j) => {
                if (!diaISO) {
                  return <div key={`${i}-${j}`} className="min-h-[3.5rem] sm:min-h-[5rem] rounded-md bg-gray-50" />;
                }

                const ocupantes = ocupacionPorDia.get(diaISO) ?? [];
                const unidadUnicaSeleccionada = filtroUnidadId ? unidades.find(u => u.unidad.unidadAlojamientoId === filtroUnidadId) : null;

                if (unidadUnicaSeleccionada) {
                  const ocupado = ocupantes.length > 0;
                  const color = colorDeUnidad(unidadUnicaSeleccionada.unidad.unidadAlojamientoId);
                  const seleccionado = !!(seleccionInicio && seleccionFin && diaISO >= seleccionInicio && diaISO < seleccionFin);
                  return (
                    <div
                      key={diaISO}
                      onClick={() => handleDiaClick(diaISO)}
                      className={`min-h-[3.5rem] sm:min-h-[5rem] rounded-md border p-1 sm:p-1.5 cursor-pointer ${ocupado ? `${color.bg} border-transparent` : "bg-green-50 border-green-200"} ${seleccionado ? "ring-2 ring-offset-1 ring-indigo-600" : ""}`}
                    >
                      <p className={`text-[10px] sm:text-xs font-semibold ${ocupado ? "text-white" : "text-green-800"}`}>
                        {Number(diaISO.slice(8, 10))}
                      </p>
                      <p className={`text-[8px] sm:text-[11px] mt-1 break-words ${ocupado ? "text-white" : "text-green-700"}`}>
                        {ocupado ? "Reservado" : "Libre"}
                      </p>
                    </div>
                  );
                }

                const chips = ocupantes.slice(0, 3);
                const restantes = ocupantes.length - chips.length;

                return (
                  <div
                    key={diaISO}
                    className={`min-h-[3.5rem] sm:min-h-[5rem] rounded-md border p-1 sm:p-1.5 ${ocupantes.length === 0 ? "bg-green-50 border-green-200" : "bg-white border-gray-200"}`}
                  >
                    <p className="text-[10px] sm:text-xs font-semibold text-gray-700">{Number(diaISO.slice(8, 10))}</p>
                    <div className="mt-1 space-y-0.5">
                      {chips.map((o, idx) => (
                        <div
                          key={idx}
                          title={o.nombre}
                          className={`text-[8px] sm:text-[10px] leading-tight px-1 py-0.5 rounded truncate ${colorDeUnidad(o.unidadId).suave}`}
                        >
                          {o.nombre}
                        </div>
                      ))}
                      {restantes > 0 && (
                        <div className="text-[8px] sm:text-[10px] text-gray-500">+{restantes} más</div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {!filtroUnidadId && unidadesVisibles.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {unidadesVisibles.map(u => (
                <div key={u.unidad.unidadAlojamientoId} className="flex items-center gap-1.5 text-xs text-gray-600">
                  <span className={`h-3 w-3 rounded-full ${colorDeUnidad(u.unidad.unidadAlojamientoId).bg}`} />
                  {u.unidad.nombre} · {u.complejoNombre}
                </div>
              ))}
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <span className="h-3 w-3 rounded-full bg-green-50 border border-green-300" />
                Libre
              </div>
            </div>
          )}
        </>
      )}
    </Modal>
  );
};

export default CalendarioModal;
