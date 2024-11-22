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
}

export interface UsuarioListado {
    id:              number;
    correo:          string;
    nombre:          string;
    apellido:        string;
    dni:             string;
    fechaNacimiento: Date;
    estado:          string;
    estadoPerfil:    number;
    disponibilidad:  null | string;
}


export interface UsuarioDetalle {
    id:                number;
    nombre:            string;
    apellido:          string;
    correo:            string;
    dni:               string;
    fechaNacimiento:   Date;
    estado:            string;
    rol:               string;
    perfilProfesional: PerfilProfesional|null;
    contacto:          Contacto|null;
    ubicacion:         Ubicacion|null;
    habilidades:       Habilidad[];
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
    calle:       string;
    numero:      null;
    piso:        null;
}


export interface UsuarioPerfilCompletado {
    completo: number;
    datos:    Array<Array<boolean | string>>;
}
