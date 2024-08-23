import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsernameService {
  eyeSize = 80;
  maxDistance = 29;
  maxCharacters = 40;

  calculateEyePosition(inputElement: HTMLInputElement, svgContainer: HTMLElement): { top: string; left: string } {
    const containerRect = svgContainer.getBoundingClientRect();
    const { width } = containerRect;
    const svgCenterX = width / 2;

    const charPosition = inputElement.value.length;

    const horizontalMove = Math.max(Math.min((charPosition / this.maxCharacters) * this.maxDistance * 2 - this.maxDistance, this.maxDistance), -this.maxDistance);

    const maxTopMovement = 10;
    const verticalMove = 34 + maxTopMovement * (1 - Math.pow(horizontalMove / this.maxDistance, 2));

    const eyePosition = {
      top: `${verticalMove}px`,
      left: `${svgCenterX + horizontalMove - this.eyeSize / 2 - 60}px`
    };

    console.log('Eye Position:', eyePosition);

    return eyePosition;
  }
}
