export interface dashboardRooms {
    nombre?: string;
    descripcion?: string;
    diseno_json?: string;
    estado?: number;
    piso?: number;
    id?: number;
    detalle: dashboardRoomsDetalle;
}

export interface dashboardRoomsDetalle {
    checkout?: string;
    checkin?: string;
    hotel_id?: number;
    facturacion_id?: number;
    cliente_id?: number;
    usuario_id?: number;
    id?: number;
    habitacion_id: number;
    fecha_inicio: string;
    fecha_salida: string;
}