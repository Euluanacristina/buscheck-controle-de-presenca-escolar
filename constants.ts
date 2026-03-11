
import { Student } from './types';

export const INITIAL_STUDENTS: Student[] = [
  { id: '1', name: 'Ana Silva', school: 'Escola Municipal Central', period: 'Manhã', status: 'pending' },
  { id: '2', name: 'Bruno Santos', school: 'Colégio Adventista', period: 'Tarde', status: 'pending' },
  { id: '3', name: 'Carla Oliveira', school: 'Escola Estadual Delta', period: 'Manhã', status: 'pending' },
  { id: '4', name: 'Diego Ferreira', school: 'Instituto Federal', period: 'Noite', status: 'pending' },
  { id: '5', name: 'Elena Souza', school: 'Escola Municipal Central', period: 'Manhã', status: 'pending' },
  { id: '6', name: 'Fabio Mendes', school: 'Colégio Adventista', period: 'Tarde', status: 'pending' },
  { id: '7', name: 'Giovanna Lima', school: 'Escola Estadual Delta', period: 'Manhã', status: 'pending' },
  { id: '8', name: 'Hugo Rocha', school: 'Instituto Federal', period: 'Noite', status: 'pending' },
  { id: '9', name: 'Isabela Costa', school: 'Escola Municipal Central', period: 'Manhã', status: 'pending' },
  { id: '10', name: 'João Victor', school: 'Colégio Adventista', period: 'Tarde', status: 'pending' },
  { id: '11', name: 'Larissa Alencar', school: 'Escola Municipal Central', period: 'Manhã', status: 'pending' },
  { id: '12', name: 'Marcos Paulo', school: 'Colégio Politécnico', period: 'Tarde', status: 'pending' },
  { id: '13', name: 'Nathalia Gomes', school: 'Escola Estadual Delta', period: 'Manhã', status: 'pending' },
  { id: '14', name: 'Otávio Augusto', school: 'Instituto Federal', period: 'Noite', status: 'pending' },
  { id: '15', name: 'Patrícia Amaral', school: 'Escola Municipal Central', period: 'Manhã', status: 'pending' }
];

export const SCHOOLS = Array.from(new Set(INITIAL_STUDENTS.map(s => s.school)));
export const PERIODS = ['Manhã', 'Tarde', 'Noite'];
