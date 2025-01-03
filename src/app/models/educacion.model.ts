

export interface Educacion {
    nombre:          string;
    institucion:     string;
    alias:           string|null;
    fechaInicio:     Date;
    fechaFin:        Date | null;
    promedio:        number|null;
    descripcion:     string|null;
    tipo:            string;
    idTituloDetalle: number;
}
