
export interface Filtro {
    type:string,
    name:string,
    nameText?:string,
    values?: {value:any, selected?:boolean}[],
    icon?:string
}

export function getDataOfFiltro(filtros: Filtro[]){
    let datosToReturn: { [key: string]: any } = {}; 
  
    filtros.forEach(el => {
      let key: string | undefined;
      let value: any;
      
      // Verifica si el filtro es de tipo "option"
      if (el.type === 'option') {
        const selectedValue = el.values?.find(v => v.selected);
        key = el.name; 
        value = selectedValue?.value; 
      }if (el.type == 'text') {
        key = el.name
        value = (el.values && el.values.length>0) ? el.values[0].value : undefined 
      }
  
      if (key && value !== undefined) {
        datosToReturn[key] = value;
      }
    });

    return datosToReturn;
}