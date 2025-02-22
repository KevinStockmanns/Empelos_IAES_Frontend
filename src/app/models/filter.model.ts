
export interface Filtro {
    type:string,
    name:string,
    nameText?:string,
    values?: {value:any, selected?:boolean}[],
    value?: string
    icon?:string,
    multiple?:boolean
}

export function getDataOfFiltro(filtros: Filtro[]) {
  let datosToReturn: { [key: string]: any } = {}; 

  filtros.forEach(el => {
    let key: string | undefined;
    let value: any;
    
    if (el.type === 'option') {
      key = el.name;
      const selectedValues = el.values?.filter(v => v.selected).map(v => v.value);
      
      if (el.multiple) {
        value = selectedValues?.length ? selectedValues.join(',') : undefined;
      } else {
        value = selectedValues?.[0]; // Solo el primer seleccionado si no es múltiple
      }
    }
    
    if (el.type === 'text') {
      key = el.name;
      value = (el.values && el.values.length > 0) ? el.values[0].value : undefined;
    }

    if (el.type === 'range') {
      key = el.name;
      if (el.values?.[0].value && el.values?.[1].value) {
        value = el.values?.[0].value + '-' + el.values?.[1].value;
      } else if (el.values?.[0].value) {
        value = el.values?.[0].value; 
      } else if (el.values?.[1].value) {
        value = el.values?.[1].value;
      }
    }

    if (key && value !== undefined) {
      datosToReturn[key] = value;
    }
  });

  return datosToReturn;
}
