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
    habilidades:       Habilidades[];
}

export interface Contacto {
    telefono:     null|string;
    telefonoFijo: string|null;
    linkedin:     null|string;
    paginaWeb:    string|null;
}

export interface Habilidades {
    nombre: string;
    tipo:   string;
}

export interface PerfilProfesional {
    cargo:                 string|null;
    cartaPresentacion:     string|null;
    disponibilidad:        string|null;
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
