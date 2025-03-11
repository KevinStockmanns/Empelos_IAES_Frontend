import { Educacion } from "./educacion.model";
import { Empresa, EmpresaDetalle } from "./empresa.model";

export interface Usuario {
    id:              number;
    correo:          string;
    nombre:          string;
    apellido:        string;
    dni:             string;
    fechaNacimiento: Date;
    estado:          string;
    rol:             string;
    token:           string|null;
    adminInfo?:       {solicitudUsuarios?:number}
}

export interface UsuarioListado {
    id:              number;
    correo:          string;
    nombre:          string;
    apellido:        string;
    dni:             string;
    fechaNacimiento: Date;
    estado:          string;
    rol:          string;
    estadoPerfil:    number;
    disponibilidad:  null | string;
}


export interface UsuarioDetalle {
    id:                number;
    nombre:            string;
    apellido:          string;
    correo:            string;
    dni:               string;
    estadoCivil:       string;
    genero:            string;
    fechaNacimiento:   Date;
    estado:            string;
    rol:               string;
    fotoPerfil:        string|null;
    perfilProfesional: PerfilProfesional|null;
    contacto:          Contacto|null;
    ubicacion:         Ubicacion|null;
    habilidades:       Habilidad[];
    educacion:         Educacion[];
    experienciaLaboral: ExperienciaLaboral[];
    licenciaConducir: LicenciaConducir|null;
    empresasAsociadas:   EmpresaDetalle[];
    pasantias:         PasantiaUsuario[];
}

export interface Contacto {
    telefono:     null|string;
    telefonoFijo: string|null;
    linkedin:     null|string;
    paginaWeb:    string|null;
}

export interface Habilidad {
    nombre: string;
    tipo:   string;
}

export interface PerfilProfesional {
    cargo:                 string;
    cartaPresentacion:     string|null;
    disponibilidad:        string;
    disponibilidadMudanza: number|null;
}

export interface Ubicacion {
    idDireccion: number;
    pais:        string;
    provincia:   string;
    localidad:   string;
    barrio:       string;
    calle:       string;
    numero:      null;
    piso:        null;
}


export interface UsuarioPerfilCompletado {
    completo: number;
    datos:    Array<Array<boolean | string>>;
}



export interface ExperienciaLaboral {
    id:               number;
    puesto:           string;
    empresa:          string;
    fechaInicio:      Date;
    fechaTerminacion: Date|null;
    descripcion:      string|null;
    idEmpresa:        number|null;
}



export interface LicenciaConducir {
    id:             number;
    categoria:      string;
    vehiculoPropio: number|null;
}



export interface PasantiaUsuario {
    id:          number;
    titulo:      string;
    descripcion: string|null;
    fechaInicio: Date|null;
    fechaFinal:  null;
    empresa:     EmpresaPasantia;
    nota:        number;
}

export interface EmpresaPasantia {
    nombre: string;
    id:     number;
}
