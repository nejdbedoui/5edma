import { CommandeDetailsDto } from '../dto/CommandeDetailsDto';
export class CommandeDetailsDtoResponse{
    result: number;
    errorDescription: string;
    objectResponse:CommandeDetailsDto[];
}