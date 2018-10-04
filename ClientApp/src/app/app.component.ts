import { Component, OnInit } from '@angular/core';
import { NotificationMiddlewareService } from './core/notification-middleware.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private notificationMiddleware: NotificationMiddlewareService) {
  }

  ngOnInit(){
    this.notificationMiddleware.init();
  }
}
