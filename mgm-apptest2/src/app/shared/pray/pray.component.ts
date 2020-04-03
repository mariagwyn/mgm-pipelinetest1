import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CompiledLiturgy, LiturgicalDay, CompiledSection } from '../../models/liturgy.model';

@Component({
  selector: 'venite-pray',
  templateUrl: './pray.component.html',
  styleUrls: ['./pray.component.scss']
})
export class PrayComponent implements OnInit {
  @Input() obj : CompiledLiturgy;
  @Input() bulletinEditor : boolean = false;
  @Output() objChange : EventEmitter<CompiledLiturgy> = new EventEmitter();
  bordercolor : string = '#ccc';
  icon : string;
  iconUrl : string;
  hasIcon : boolean;
  liturgyDate : Date;
  isSunday : boolean = false;

  getColor() : string {
    let color : string = '#ccc';
    if(this.obj.day.color && this.obj.day.color.hex) {
      color = this.obj.day.color.hex;
    } else if(this.obj.day.week.color && this.obj.day.week.color.hex) {
      color = this.obj.day.week.color.hex;
    }
    return color;
  }

  dateFromDay(dt : string) : Date {
    let [date, time] = dt.split("T"),
        [year, month, day] = date.split("-"),
        d = new Date();
    d.setFullYear(parseInt(year));
    d.setMonth(parseInt(month)-1, parseInt(day));
    return d;
  }

  dateIsSunday() : boolean {
    let d = this.dateFromDay(this.obj.day.date.toString());
    return d.getDay() == 0;
  }

  holyDayObserved(day : LiturgicalDay) : boolean {
    return !!day.holy_days.find(hd => hd ? hd.slug == day.slug : false);
  }

  holyDayName(day : LiturgicalDay) : string {
    return day.holy_days.find(hd => hd ? hd.slug == day.slug : false).name;
  }

  sectionChanged(ii : number, event : CompiledSection) {
    this.obj.liturgy[ii] = event;
    this.objChange.emit(this.obj);
  }

  constructor() { }

  ngOnInit() {
    this.bordercolor = this.getColor();
    this.hasIcon = !!this.obj.day.color && !!this.obj.day.color.image;
    this.icon = this.obj.day.color && this.obj.day.color.image ? this.obj.day.color.image : undefined;
    this.iconUrl = this.obj.day.color && this.obj.day.color.image ? this.obj.day.color.imageUrl || this.obj.day.color.image : undefined;
    this.liturgyDate = this.dateFromDay(this.obj.day.date.toString());
    this.isSunday = this.dateIsSunday();
    console.log('[DATE]', this.obj.day.date.toString(), this.dateFromDay(this.obj.day.date.toString()), this.liturgyDate);
  }

}
