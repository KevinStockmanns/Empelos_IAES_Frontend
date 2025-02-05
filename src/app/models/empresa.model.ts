import { UsuarioListado } from "./usuario.model";

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
    usuario:               any|null;
    ubicacion:             any|null;
    horarios:              any[];
    pasantias:             any[];
    experienciasLaborales: any[];
}
