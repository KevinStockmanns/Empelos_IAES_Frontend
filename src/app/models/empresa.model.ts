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
    ubicacion:             any|Ubicacion;
    horarios:              Horario[];
    pasantias:             any[];
    experienciasLaborales: any[];
    imagen:                string|null;
}




export interface Horario {
    desde: string;
    hasta: string;
    dias:  string[];
}
