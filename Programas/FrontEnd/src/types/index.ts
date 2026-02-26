export interface ExcelData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface ColumnMapping {
  excelColumn: string;
  mappedField: string;
  columnIndex: number;
  valor_json: string;
}

export interface ChipData {
  id: string;
  label: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'indigo';
  valor_json: string;
}

export interface SelectorOption {
  value: string;
  label: string;
}

export interface listDniDuplicados {
  Documento: string;
  Repeticion: number;
}


export interface listDniDuplicadosExportar {										
  nro_afiliado: string;
  ape_nom: string;
  cuil: string;
  tipodni: string;
  documento: string;
  parentesco: string;
  titular: string;
  sexo: string;
  fecha_nacimiento: string;
  localidad: string;
  provincia: string;
  situacion_revista: string;
  incapacitado: string;
  tipo_beneficiario: string;
  fecha_alta: string;
  

  
}

export interface Usuario {
  usuarioID: number;
  nombre: string;
  email: string;
  activo: boolean;
  passwordHash: string;
}

export interface ControlPaso1 {
  respuesta: string;
  afiliadosBaja: number;
  correcto: boolean;
}

export interface ControlPaso2 {
  respuesta: string;
  correcto: boolean;
}