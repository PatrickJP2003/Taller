import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Register, RegistersService } from '../../services/registers/registers.service';


@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
  users: Register[] = [];

  constructor(private registersService: RegistersService) { }

  ngOnInit(): void {
    this.registersService.getRegisters().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        console.error('Error al obtener registros:', error);
      }
    });
  }
}
