export interface Clientes {
    id?: number,
    nombres?: string,
    apellidos?: string,
    tipo?: number,
    estado?: number,
    ciudad_id?: number,
    tipo_documento_id?: number,
    numero_documento?: string,
    genero_id?: number,
    estado_civil_id?: number,
    barrio_residencia?: string,
    fecha_nacimiento?: string,
    telefono?: string,
    celular?: string,
    nivel_studio_id?: number,
    correo?: string,
    observacion?: string,
    usuario_create_id?: number,
    usuario_update_id?: number,
    hotel_id?: number,
    created_at?: null,
    updated_at?: null
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
