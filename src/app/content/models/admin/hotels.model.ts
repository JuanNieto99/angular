export interface Hotel {
    id?: number;
    nobre?: string;
    direccion?: string;
    imagen?: string;
    ciudad_id?: number;
    contacto?: string;
    contacto_telefono?: string;
    contacto_cargo?: string;
    telefono?: string;
    nit?: string;
    razon_social?: string;
    cantidad_habitaciones?: number;
    email?: string;
    tipo_contribuyente?: number | null;
    usuario_id?: number;
    estado?: string;
    ciudad?: any;
    
}

export interface country{
    id?:number;
    nombre?: string;
    estado: number,
    abreviatura: number,
    codigo_telefono: number,
    codigo_dian: number,
}

export interface state{
    id?:number;
    nombre?: string;
    pais_id?: number;
}

export interface city{
    codigo_dane?:string;
    nombre?: string;
    departamento_id?: number;
    id?:number;
    estado?:number;

}