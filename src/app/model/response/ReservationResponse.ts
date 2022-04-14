import { ReservationDto } from '../dto/ReservationDto';
export class ReservationResponse{
    result: number;
    errorDescription: string;
    objectResponse:ReservationDto[];
}