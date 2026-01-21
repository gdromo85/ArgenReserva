import React from 'react';
import { ExcelData, ColumnMapping, ChipData } from '../types';

interface DataGridProps {
  data: ExcelData[];
  columnMappings: ColumnMapping[];
  onDropChip: (columnIndex: number, chip: ChipData) => void;
  onRemoveMapping: (columnIndex: number) => void;
  draggedChip: ChipData | null;
}

export const DataGrid: React.FC<DataGridProps> = ({
  data,
  columnMappings,
  onDropChip,
  onRemoveMapping,
  draggedChip
}) => {
  
  if (data.length === 0) {
    return (
      <div className="w-full h-64 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">No hay datos disponibles</p>
          <p className="text-sm mt-1">Importa un archivo Excel para ver los datos aquí</p>
        </div>
      </div>
    );
  }

  const columns = Object.keys(data[0]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, columnIndex: number) => {
    e.preventDefault();
    if (draggedChip) {
      onDropChip(columnIndex, draggedChip);
    }
  };

  const getMappingForColumn = (columnIndex: number) => {
    return columnMappings.find(mapping => mapping.excelColumn === columns[columnIndex]);
  };

  const handleRemoveMapping = (columnIndex: number) => {
    onRemoveMapping(columnIndex);
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column, index) => {
                const mapping = getMappingForColumn(index);
                return (
                  <th key={index} className="px-4 py-3 text-left">
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {column}
                      </div>
                      
                      <div
                        className={`
                          min-h-[32px] p-2 rounded border-2 border-dashed border-gray-300 bg-gray-50
                          flex items-center justify-center text-xs transition-all duration-200
                          ${draggedChip ? 'border-primary-400 bg-primary-50' : ''}
                        `}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                      >
                        {mapping ? (
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-primary-700">
                              {mapping.mappedField}
                            </span>
                            <button
                              onClick={() => handleRemoveMapping(index)}
                              className="text-red-500 hover:text-red-700 text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400">
                            Arrastra aquí un campo
                          </span>
                        )}
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 10).map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-100 hover:bg-gray-50">
                {columns.map((column, columnIndex) => {
                  const isMapped = getMappingForColumn(columnIndex);
                  return (
                    <td 
                      key={columnIndex} 
                      className={`px-4 py-3 text-sm ${isMapped ? 'bg-success-50' : ''}`}
                    >
                      {typeof row[column] === 'object' && row[column] instanceof Date
                        ? row[column].toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })
                        : row[column]}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.length > 10 && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600 text-center">
          Mostrando las primeras 10 filas de {data.length} registros totales
        </div>
      )}
    </div>
  );
};