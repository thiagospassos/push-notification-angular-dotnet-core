import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { NotificationService, PushSubscription } from './generated';

@Injectable({
  providedIn: 'root'
})
export class NotificationMiddlewareService {

  public pushNotificationStatus = {
    isSubscribed: false,
    isSupported: false,
    isInProgress: false
  };
  private swRegistration = null;
  public notifications = [];

  constructor(private notificationService: NotificationService) { }


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

    navigator.serviceWorker.addEventListener('message', (event) => {
      this.notifications.push(event.data);
    });

  }

  checkSubscription() {
    this.swRegistration.pushManager.getSubscription()
      .then(subscription => {
        console.log(subscription);
        console.log(JSON.stringify(subscription));
        this.pushNotificationStatus.isSubscribed = !(subscription === null);
      });
  }

  toggleSubscription() {
    if (this.pushNotificationStatus.isSubscribed) {
      this.unsubscribeUser();
    } else {
      this.subscribeUser();
    }
  }

  subscribeUser() {
    this.pushNotificationStatus.isInProgress = true;
    const applicationServerKey = this.urlB64ToUint8Array(environment.applicationServerPublicKey);
    this.swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
      .then(subscription => {
        console.log(subscription);
        console.log(JSON.stringify(subscription));
        var newSub = JSON.parse(JSON.stringify(subscription));
        console.log(newSub);
        this.notificationService.subscribe(<PushSubscription>{
          auth: newSub.keys.auth,
          p256Dh: newSub.keys.p256dh,
          endPoint: newSub.endpoint
        }).subscribe(s => {
          this.pushNotificationStatus.isSubscribed = true;
        })
      })
      .catch(err => {
        console.log('Failed to subscribe the user: ', err);
      })
      .then(() => {
        this.pushNotificationStatus.isInProgress = false;
      });
  }

  unsubscribeUser() {
    this.pushNotificationStatus.isInProgress = true;
    var sub;
    this.swRegistration.pushManager.getSubscription()
      .then(function (subscription) {
        if (subscription) {
          sub = JSON.parse(JSON.stringify(subscription));
          return subscription.unsubscribe();
        }
      })
      .catch(function (error) {
        console.log('Error unsubscribing', error);
      })
      .then(() => {
        this.notificationService.unsubscribe(<PushSubscription>{
          auth: sub.keys.auth,
          p256Dh: sub.keys.p256dh,
          endPoint: sub.endpoint
        }).subscribe(() => {
          this.pushNotificationStatus.isSubscribed = false;
          this.pushNotificationStatus.isInProgress = false;
        });
      });
  }

  urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}
