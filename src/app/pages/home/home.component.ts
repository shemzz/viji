import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from 'src/app/components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {





playVideo() {
console.log('play video clicked')
}

}
