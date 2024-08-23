import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EyeComponent } from "./eye/eye.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EyeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'LoginPage';
}
