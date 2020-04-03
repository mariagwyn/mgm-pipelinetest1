import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { Plugins, LocalNotificationPendingList } from '@capacitor/core';
const { LocalNotifications } = Plugins;

import { BibleService } from '../services/bible.service';

const VERSES = {
  'morning': ['Psalm 5:3', 'Psalm 55:17', 'Psalm 119:164', 'Mark 1:35'],
  'noon': ['Psalm 55:17', 'Daniel 6:10', 'Acts 10:9'],
  'evening': ['Psalm 55:17', 'Daniel 6:10', 'Acts 3:1', 'Psalm 119:164'],
  'night': ['Psalm 119:164', 'Psalm 63:5-6', 'Psalm 134:1', 'Acts 16:25']
}

export class Reminder {
  title: string;
  time: string;
  on: {
    hour: number;
    minute: number;
  }
  active: boolean = false;
}

@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  pending : LocalNotificationPendingList;

  constructor(private bible : BibleService, private platform : Platform) {
    if(this.platform.is('capacitor')) {
      this.loadPending();
    }
  }

  async loadPending() {
    console.log(`areEnabled() = ${JSON.stringify(await LocalNotifications.areEnabled())}`)

    this.pending = await LocalNotifications.getPending();
    console.log(`pending = ${JSON.stringify(this.pending)}`);
  }

  async clear() {
    if(this.pending && this.pending.notifications && this.pending.notifications.length > 0) {
      LocalNotifications.cancel(this.pending);
    }
    this.pending = await LocalNotifications.getPending();
    console.log(`pending = ${JSON.stringify(this.pending)}`);
  }

  async schedule(reminders : Reminder[]) {
    this.clear();
    let notifications = await Promise.all(reminders.filter(reminder => !!reminder.active)
      .map(async (reminder, ii) => {
        // reminder.time is an ISO 8601 format like 2020-03-02T11:51:37.265-05:00
        const [hour, minute] = reminder.time.split(':');
        return {
          title: reminder.title,
          body: await this.getMessage(parseInt(hour)),
          id: ii,
          schedule: {
            //repeats: true,
            //every: "day" as "day" | "hour" | "minute" | "month" | "second" | "year" | "two-weeks" | "week",
            on: {
              hour: parseInt(hour),
              minute: parseInt(minute)
            }
          },
        }
      }));

    await LocalNotifications.schedule({ notifications });

    console.log(`pending = ${JSON.stringify(this.pending)}`);
  }

  async getMessage(hour : number) : Promise<string> {
    let timeOfDay : string = 'night';
    if(hour >= 4 && hour <= 10) {
      timeOfDay = 'morning';
    } else if(hour >= 11 && hour <= 14) {
      timeOfDay = 'noon';
    } else if(hour >= 15 && hour <= 19) {
      timeOfDay = 'evening';
    }

    try {
      const verses = VERSES[timeOfDay],
            randomVerse = verses[Math.floor(Math.random() * verses.length)],
            bibleReading = await this.bible.getText(randomVerse, 'ESV').toPromise(),
            bibleText = bibleReading.verses.flat().map(verse => verse.text).join('').replace('(ESV)', '').replace(/\s+/g, ' ').trim();
      console.log(bibleText);
      return `“${bibleText}” – ${randomVerse}`;
    } catch(e) {
      console.warn(e);
      return '“I was glad when they said to me, ‘Let us go to the house of the Lord!’” – Psalm 122:1';
    }
  }
}
