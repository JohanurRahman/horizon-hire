import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';
import { User } from '@models';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnDestroy {

  @Input() userInfo: User;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private toast: HotToastService,
  ) { }

  ngOnInit(): void {
  }

  logout() {
    this.authService.logout().pipe(
      this.toast.observe({
        success: 'Logged out successfully',
        loading: 'Logging out...',
        error: ({ message }) => `${message}`
      }),
      tap(() => {
        this.router.navigate(['/']);
      }),
      takeUntil(this.destroy$)
    ).subscribe()
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
