export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface AppAlert {
    id: number;
    type: AlertType;
    title: string;
    message?: string;
}