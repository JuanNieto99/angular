// users.model.ts
export interface Products {
    id?: number;
    nombre?: string;
    descripcion?: string;
    imagen?: string;
    sin_limite_cantidad?: number;
    medida_id?: number; 
    precio?: string; 
    cantidad?: number; 
    estado?: number; 
    inventario_id?: number; 
    stop_minimo?: number; 
    visible_venta?: number; 
    precio_base?: string; 
    tipo_producto?: number; 
    created_at?: string; 
    updated_at?: string;  
}