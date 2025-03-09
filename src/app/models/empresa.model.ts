import { Ubicacion, Usuario, UsuarioListado } from "./usuario.model";

export interface Empresas {
    empresas: Empresa[];
}

export interface Empresa {
    id:        number;
    nombre:    string;
    referente: null|string;
    cuil_cuit: null|string;
    usuario:   null|UsuarioListado;
}

export interface EmpresaDetalle {
    id:                    number;
    nombre:                string;
    referente:             string;
    cuil:                  string;
    usuario:               Usuario|null;
    ubicacion:             Ubicacion|null;
    horarios:              Horario[];
    pasantias?:             EmpresaPasantia[];
    experienciasLaborales?: EmpresaExperiencias[];
    imagen:                string|null;
}




export interface Horario {
    desde: string;
    hasta: string;
    dias:  string[];
}






export interface EmpresaExperiencias {
    id:               number;
    puesto:           string;
    empresa:          string;
    fechaInicio:      Date;
    fechaTerminacion: Date|null;
    descripcion:      string|null;
    idEmpresa:        number;
}


export interface EmpresaPasantia {
    id:          number;
    fechaInicio: string;
    fechaFinal:  string|null;
    titulo:  string;
    usuario:     UsuarioEmpresaPasantia[];
}

export interface UsuarioEmpresaPasantia {
    id:          number;
    nombre: string;
    apellido:  string;
    nota:        number|null;
}
