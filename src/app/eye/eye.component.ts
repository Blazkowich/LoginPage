import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CursorService } from './services/cursor.service';
import { UsernameService } from './services/username.service';
import { PasswordService } from './services/password.service';

@Component({
  selector: 'app-eye',
  standalone: true,
  templateUrl: './eye.component.html',
  styleUrls: ['./eye.component.css'],
  imports: [FormsModule, CommonModule]
})
export class EyeComponent implements OnInit, AfterViewInit {
  eyePosition = { top: '0px', left: '0px' };
  usernameInputElement!: HTMLInputElement;
  passwordInputElement!: HTMLInputElement;
  isInputFocused = false;
  passwordVisible = false;
  isAnimating = false;
  private animationFrameId: number | null = null;

  constructor(
    private cursorService: CursorService,
    private usernameService: UsernameService,
    private passwordService: PasswordService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.setInitialPosition();
  }

  ngAfterViewInit() {
    this.usernameInputElement = this.el.nativeElement.querySelector('#username') as HTMLInputElement;
    this.passwordInputElement = this.el.nativeElement.querySelector('#password') as HTMLInputElement;

    this.renderer.listen(this.usernameInputElement, 'focus', () => this.onUsernameFocus());
    this.renderer.listen(this.usernameInputElement, 'blur', () => this.onInputBlur());
    this.usernameInputElement.addEventListener('input', this.updateUsernameEyePosition.bind(this));

    this.renderer.listen(this.passwordInputElement, 'focus', () => this.onPasswordFocus());
    this.renderer.listen(this.passwordInputElement, 'blur', () => this.onInputBlur());
    this.passwordInputElement.addEventListener('input', this.updatePasswordEyePosition.bind(this));
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
    this.stopAnimation();

    if (this.passwordVisible) {
      this.updatePasswordEyePosition();
    } else {
      this.eyePosition = this.convertToString(this.passwordService.getStartPosition());
      this.startSmoothEyeMovement();
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.passwordVisible && this.isInputFocused) {
      return;
    }

    if (!this.isInputFocused) {
      const svgContainer = (event.currentTarget as HTMLElement).querySelector('.svg-container') as HTMLElement;
      this.eyePosition = this.cursorService.calculateEyePosition(event, svgContainer);
      this.stopAnimation();
    }
  }

  private onUsernameFocus() {
    this.isInputFocused = true;
    this.stopAnimation();
    this.updateUsernameEyePosition();
  }

  private onPasswordFocus() {
    this.isInputFocused = true;
    this.stopAnimation();
    if (this.passwordVisible) {
      this.updatePasswordEyePosition();
    } else {
      this.startSmoothEyeMovement();
    }
  }

  private onInputBlur() {
    this.isInputFocused = false;
    this.stopAnimation();
    if (!this.passwordVisible) {
      this.startSmoothEyeMovement();
    }
  }

  private updateUsernameEyePosition() {
    if (!this.passwordVisible) {
      const svgContainer = document.querySelector('.svg-container') as HTMLElement;
      if (this.usernameInputElement) {
        this.eyePosition = this.usernameService.calculateEyePosition(this.usernameInputElement, svgContainer);
      }
    }
  }

  private updatePasswordEyePosition() {
    if (this.passwordVisible) {
      const svgContainer = document.querySelector('.svg-container') as HTMLElement;
      if (this.passwordInputElement) {
        this.eyePosition = this.usernameService.calculateEyePosition(this.passwordInputElement, svgContainer);
      }
    }
  }

  private startSmoothEyeMovement() {
    if (this.isAnimating || this.passwordVisible) return;

    this.isAnimating = true;

    const start = this.convertToString(this.passwordService.getStartPosition());
    const left = this.convertToString(this.passwordService.getLeftPosition());
    const right = this.convertToString(this.passwordService.getRightPosition());

    const positions = [start, left, start, right];
    let currentIndex = 0;

    const moveSmoothlyToNextPosition = () => {
      if (this.isAnimating) {
        const currentPos = positions[currentIndex];
        const nextIndex = (currentIndex + 1) % positions.length;
        const nextPos = positions[nextIndex];

        const topDiff = parseFloat(nextPos.top) - parseFloat(currentPos.top);
        const leftDiff = parseFloat(nextPos.left) - parseFloat(currentPos.left);

        let step = 0;
        const steps = 60;

        const animate = () => {
          if (step >= steps) {
            currentIndex = nextIndex;
            moveSmoothlyToNextPosition();
          } else {
            const newTop = parseFloat(currentPos.top) + (topDiff / steps) * step;
            const newLeft = parseFloat(currentPos.left) + (leftDiff / steps) * step;
            this.eyePosition = {
              top: `${newTop}px`,
              left: `${newLeft}px`
            };
            step++;
            this.animationFrameId = requestAnimationFrame(animate)
          }
        };

        animate();
      }
    };

    moveSmoothlyToNextPosition();
  }

  private stopAnimation() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
      this.isAnimating = false;
    }
  }

  private setInitialPosition() {
    this.eyePosition = this.convertToString(this.passwordService.getStartPosition());
  }

  private convertToString(position: { top: number; left: number }): { top: string; left: string } {
    return {
      top: `${position.top}px`,
      left: `${position.left}px`
    };
  }
}
