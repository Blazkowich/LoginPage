import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CursorService } from './services/cursor.service';
import { UsernameService } from './services/username.service';

@Component({
  selector: 'app-eye',
  standalone: true,
  templateUrl: './eye.component.html',
  styleUrls: ['./eye.component.css'],
  imports: [FormsModule, CommonModule]
})
export class EyeComponent implements OnInit, AfterViewInit {
  eyePosition = { top: '0px', left: '0px' };
  inputElement!: HTMLInputElement;
  isInputFocused = false;

  constructor(
    private cursorService: CursorService,
    private usernameService: UsernameService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.setInitialPosition();
  }

  ngAfterViewInit() {
    this.inputElement = this.el.nativeElement.querySelector('#username') as HTMLInputElement;
    this.renderer.listen(this.inputElement, 'focus', () => this.onInputFocus());
    this.renderer.listen(this.inputElement, 'blur', () => this.onInputBlur());
    this.inputElement.addEventListener('input', this.updateEyePosition.bind(this));
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isInputFocused) {
      const svgContainer = (event.currentTarget as HTMLElement).querySelector('.svg-container') as HTMLElement;
      this.eyePosition = this.cursorService.calculateEyePosition(event, svgContainer);
    }
  }

  private onInputFocus() {
    this.isInputFocused = true;
    this.updateEyePosition();
  }

  private onInputBlur() {
    this.isInputFocused = false;
  }

  private updateEyePosition() {
    const svgContainer = document.querySelector('.svg-container') as HTMLElement;
    if (this.inputElement) {
      this.eyePosition = this.usernameService.calculateEyePosition(this.inputElement, svgContainer);
    }
  }

  private setInitialPosition() {
    this.eyePosition = {
      top: `${(200 / 2) - (this.cursorService.eyeSize / 2) - 60}px`,
      left: `${(200 / 2) - (this.cursorService.eyeSize / 2) - 60}px`
    };
  }
}
