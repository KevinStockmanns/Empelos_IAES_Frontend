
export interface PasantiaListado {
    id:       number;
    titulo:   string;
    estado:   string;
    empresa:  PasantiaEmpresa|null;
    usuarios: PasantiaUsuario[];
}

export interface PasantiaEmpresa {
    id:     number;
    nombre: string;
}

export interface PasantiaUsuario {
    id:       number;
    apellido: string;
    nombre:   string;
    nota:     null | string;
}



export interface PasantiaDetalle {
    id:          number;
    titulo:      string;
    estado:      string;
    fechaInicio: string|null;
    fechaFinal:  string|null;
    descripcion: string|null;
    empresa:  PasantiaEmpresa|null;
    usuarios: PasantiaUsuario[];
}