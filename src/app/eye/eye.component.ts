import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-eye',
  standalone: true,
  templateUrl: './eye.component.html',
  styleUrls: ['./eye.component.css'],
  imports: [FormsModule, CommonModule]
})
export class EyeComponent implements OnInit {
  eyePosition = { top: '0px', left: '0px' };
  eyeSize = 80;
  maxDistance = 45;

  ngOnInit() {
    // Initial setup if needed
    this.setInitialPosition();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const svgContainer = (event.currentTarget as HTMLElement).querySelector('.svg-container') as HTMLElement;
    const { left, top, width, height } = svgContainer.getBoundingClientRect();

    const mouseX = event.clientX - left;
    const mouseY = event.clientY - top;
    const centerX = width / 2;
    const centerY = height / 2;
    const distanceX = mouseX - centerX;
    const distanceY = mouseY - centerY;

    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    let positionX = distanceX;
    let positionY = distanceY;

    if (distance > this.maxDistance) {
      const scale = this.maxDistance / distance;
      positionX = distanceX * scale;
      positionY = distanceY * scale;
    }

    const eyeHalfSize = this.eyeSize / 2;
    const maxX = (width / 2) - eyeHalfSize;
    const maxY = (height / 2) - eyeHalfSize;

    positionX = Math.max(Math.min(positionX, maxX), -maxX);
    positionY = Math.max(Math.min(positionY, maxY), -maxY);

    this.eyePosition = {
      top: `${centerY + positionY - 100}px`,
      left: `${centerX + positionX - 100}px`
    };
  }

  private setInitialPosition() {
    this.eyePosition = {
      top: `${(200 / 2) - (this.eyeSize / 2) - 60}px`,
      left: `${(200 / 2) - (this.eyeSize / 2) - 60}px`
    };
  }
}
