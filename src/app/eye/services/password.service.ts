import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  maxDistance = 29;

  // Start position
  getStartPosition(): { top: number; left: number } {
    return { top: -44, left: 0 };
  }

  // Left position
  getLeftPosition(): { top: number; left: number } {
    return { top: -34, left: -this.maxDistance };
  }

  // Right position
  getRightPosition(): { top: number; left: number } {
    return { top: -34, left: this.maxDistance };
  }
}
