export interface ColorOption {
    id: string;
    nombre: string;
    bgClass: string;      // Clase para el fondo del ícono/card
    textClass: string;    // Clase para el texto del ícono
}

export const ICON_OPTIONS = [
    { id: 'folder', label: 'Carpeta' },
    { id: 'rocket', label: 'Cohete' },
    { id: 'code', label: 'Código' },
    { id: 'chart', label: 'Métricas' },
    { id: 'briefcase', label: 'Maletín' }
];