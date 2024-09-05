import { Component } from '@angular/core';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RegistersService } from '../../services/registers/registers.service';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NzFormModule, 
    NzInputModule, 
    NzButtonModule, 
    ReactiveFormsModule, 
    NzCheckboxModule, 
    RouterLink, 
    NzIconModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private registersService: RegistersService) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  onClickLogin(): void {
    if(this.form.invalid) return;
    this.registersService.login(this.form.value)
      .then((response) => {
        console.log(response);
      })
      .catch(error => console.log(error));
  }

  onClickLoginGoogle(): void {
    this.registersService.loginWithGoogle()
      .then((response) => {
        console.log(response);
      })
      .catch(error => console.log(error));
  }

}
