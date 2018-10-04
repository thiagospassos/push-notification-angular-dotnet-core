import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationMiddlewareService {

  public pushNotificationStatus = {
    isSubscribed: false,
    isSupported: false
  };
  private swRegistration = null;

  constructor() { }


init() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {

    navigator.serviceWorker.register('/assets/sw.js')
      .then(swReg => {
        console.log('Service Worker is registered', swReg);

        this.swRegistration = swReg;
        this.checkSubscription();
      })
      .catch(error => {
        console.error('Service Worker Error', error);
      });
    this.pushNotificationStatus.isSupported = true;
  } else {
    this.pushNotificationStatus.isSupported = false;
  }
}

checkSubscription() {
  this.swRegistration.pushManager.getSubscription()
    .then(subscription => {
      console.log(subscription);
      console.log(JSON.stringify(subscription));
      this.pushNotificationStatus.isSubscribed = !(subscription === null);
    });
}
}
