import { inject, Injectable } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { AUTH } from '../../app.config';
import { authState } from 'rxfire/auth';
import { Credentials } from '../../interfaces/credentials.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export type AuthUser = User | null | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(AUTH);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  public readonly authState$: Observable<AuthUser> = authState(this.auth);

  private currentUser: AuthUser = undefined;
  userSubject = new BehaviorSubject(this.currentUser);

  constructor() {
    this.authStateListener();
  }

  authStateListener() {
    this.auth.onAuthStateChanged((user) => {
      this.userSubject.next(user);
    });
  }

  async register(credentials: Credentials): Promise<boolean> {
    return await createUserWithEmailAndPassword(
      this.auth,
      credentials.email,
      credentials.password,
    )
      .then(() => {
        return true;
      })
      .catch((error) => {
        console.error('An error occurred while registering user: ', error);
        return false;
      });
  }

  async login(credentials: Credentials): Promise<boolean> {
    return await signInWithEmailAndPassword(
      this.auth,
      credentials.email,
      credentials.password,
    )
      .then(() => {
        return true;
      })
      .catch((error) => {
        console.error('An error occurred while authenticating user: ', error);
        return false;
      });
  }

  async logout(): Promise<void> {
    signOut(this.auth)
      .then(() => {
        this.snackBar.open('Logged out successfully', 'Okay', {
          duration: 2500,
        });
        this.router.navigateByUrl('/auth/login');
      })
      .catch((error) => {
        console.error('An error occurred while logging out user: ', error);
        this.snackBar.open('Unable to log out, please try again.', 'Okay', {
          duration: 2500,
        });
      });
  }
}
