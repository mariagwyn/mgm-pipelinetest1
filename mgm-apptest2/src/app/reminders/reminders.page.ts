import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

import { LocalStorageService } from '../services/localstorage.service';
import { Reminder, ReminderService } from '../services/reminder.service';


const PRESETS = {
  'angelus': [
    {
      title: 'Morning Prayer',
      on: {
        hour: 6,
        minute: 0
      }
    },
    {
      title: 'Noonday Prayer',
      on: {
        hour: 12,
        minute: 0
      }
    },
    {
      title: 'Evening Prayer',
      on: {
        hour: 18,
        minute: 0
      }
    }
  ],
  'office': [
    {
      title: 'Morning Prayer',
      on: {
        hour: 8,
        minute: 0
      }
    },
    {
      title: 'Noonday Prayer',
      on: {
        hour: 12,
        minute: 0
      }
    },
    {
      title: 'Evening Prayer',
      on: {
        hour: 17,
        minute: 0
      }
    },
    {
      title: 'Compline',
      on: {
        hour: 21,
        minute: 0
      }
    }
  ],
  'mp-ep': [
    {
      title: 'Morning Prayer',
      on: {
        hour: 8,
        minute: 0
      }
    },
    {
      title: 'Evening Prayer',
      on: {
        hour: 17,
        minute: 0
      }
    }
  ]
}

@Component({
  selector: 'venite-reminders',
  templateUrl: './reminders.page.html',
  styleUrls: ['./reminders.page.scss'],
})
export class RemindersPage implements OnInit {
  notificationsEnabled : boolean = false;
  reminders : Reminder[] = new Array();

  constructor(
    private storage : LocalStorageService,
    private platform : Platform,
    private service : ReminderService
  ) { }

  async ngOnInit() {
    let storedReminders : Reminder[] = await this.storage.get('reminders');
    if(storedReminders) {
      this.reminders = storedReminders;
    }
  }

  schedule() {
    console.log('(RemindersPage) (schedule) reminders = ', JSON.stringify(this.reminders));
    this.saveReminders();
    this.service.schedule(this.reminders);
  }

  loadPreset(name : string) {
    this.reminders = PRESETS[name];
    this.reminders.forEach(reminder => {
      if(!reminder.time && reminder.on) {
        reminder.time = `${reminder.on.hour.toString().padStart(2, '0')}:${reminder.on.minute.toString().padStart(2, '0')}`;
      }
      reminder.active = true;
    });
    this.schedule();
  }

  saveReminders() {
    this.storage.set('reminders', this.reminders);
  }

  addReminder() {
    const r = new Reminder();
    r.on = {
      hour: 12,
      minute: 0
    }
    r.time = '12:00';
    this.reminders.push(r);
    this.schedule();
  }

  remove(index : number) {
    this.reminders.splice(index, 1);
    this.schedule();
  }
}
