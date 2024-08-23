import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CursorService {
  eyeSize = 80;
  maxDistance = 45;

  calculateEyePosition(event: MouseEvent, svgContainer: HTMLElement): { top: string; left: string } {
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

    return {
      top: `${centerY + positionY - 100}px`,
      left: `${centerX + positionX - 100}px`
    };
  }
}
