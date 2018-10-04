import { Component, OnInit } from '@angular/core';
import { NotificationMiddlewareService } from '../core/notification-middleware.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  constructor(public notificationMiddleware: NotificationMiddlewareService, private router: Router) { }

  ngOnInit() {
  }

  toggleSubscription() {
    this.notificationMiddleware.toggleSubscription();
  }

  cleanUrl(url) {
    if (url.indexOf(self.location.origin) >= 0) {
      return url.replace(self.location.origin, '');
    }
    return url;
  }

  removeNotif(notif) {
    var index = this.notificationMiddleware.notifications.indexOf(notif);
    if (index >= 0) {
      this.notificationMiddleware.notifications.splice(index, 1);
    }
  }
}
