import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth/auth.service';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

enum LoginStatus {
  PENDING,
  AUTHENTICATING,
  SUCCESS,
  ERROR,
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatIconModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInput,
    MatButtonModule,
    AsyncPipe,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  hidePassword = true;
  loginStatus = LoginStatus.PENDING;

  loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  async authenticate() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email!;
      const password = this.loginForm.value.password!;

      this.loginStatus = LoginStatus.AUTHENTICATING;
      const isAuthenticated = await this.authService.login({ email, password });

      if (isAuthenticated) {
        this.loginStatus = LoginStatus.SUCCESS;
        this.snackBar.open('Login Successful', 'Okay', {
          duration: 2500,
        });
        await this.router.navigate(['home']);
      } else {
        this.loginStatus = LoginStatus.ERROR;
      }
    }
  }

  protected readonly LoginStatus = LoginStatus;
}
