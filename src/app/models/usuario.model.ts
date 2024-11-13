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
