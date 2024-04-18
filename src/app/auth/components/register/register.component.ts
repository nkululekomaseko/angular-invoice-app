import { Component } from '@angular/core';
import { FlexModule } from '@angular/flex-layout';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import {
  MatError,
  MatFormField,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { passwordMatcherValidator } from './utils/password-matcher';

enum RegisterStatus {
  PENDING,
  AUTHENTICATING,
  SUCCESS,
  ERROR,
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FlexModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatError,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatProgressSpinner,
    RouterLink,
    MatAnchor,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router,
  ) {}

  hidePassword = true;
  hideConfirmPassword = true;
  registerStatus = RegisterStatus.PENDING;

  registerForm = this.formBuilder.nonNullable.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      updateOn: 'change',
      validators: [passwordMatcherValidator],
    },
  );

  async register() {
    if (this.registerForm.valid) {
      const email = this.registerForm.value.email!;
      const password = this.registerForm.value.password!;

      this.registerStatus = RegisterStatus.AUTHENTICATING;
      const isAuthenticated = await this.authService.register({
        email,
        password,
      });

      if (isAuthenticated) {
        this.registerStatus = RegisterStatus.SUCCESS;
        this.snackBar.open('Registered Successfully', 'Okay', {
          duration: 2500,
        });
        await this.router.navigate(['home']);
      } else {
        this.registerStatus = RegisterStatus.ERROR;
      }
    }
  }

  protected readonly RegisterStatus = RegisterStatus;
}
