import React, { useRef } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';

interface ExcelImporterProps {
  onFileSelect: (file: File) => void;
  loading?: boolean;
  disabled?: boolean;
}

export const ExcelImporter: React.FC<ExcelImporterProps> = ({
  onFileSelect,
  loading = false,
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  
  return (
    <div className={`w-full ${disabled ? 'pointer-events-none' : 'pointer-events-auto'} `}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full px-6 py-4 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <div className="flex flex-col items-center space-y-3">
          {loading ? (
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <div className="p-3 bg-primary-100 rounded-full group-hover:bg-primary-200 transition-colors duration-200">
              <Upload className="w-6 h-6 text-primary-600" />
            </div>
          )}
          
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700">
              {loading ? 'Procesando archivo...' : 'Importar archivo Excel'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {loading ? 'Por favor espera...' : 'Haz clic para seleccionar un archivo .xlsx, .xls o .csv'}
            </p>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Formatos soportados: Excel y CSV</span>
          </div>
        </div>
      </button>
    </div>
  );
};