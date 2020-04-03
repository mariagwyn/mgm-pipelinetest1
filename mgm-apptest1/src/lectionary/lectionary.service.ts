import { Injectable, HttpService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Reading } from './lectionary.entity';

@Injectable()
export class LectionaryService {
  constructor(
    @InjectRepository(Reading)
    private readonly repo : Repository<Reading>,
    private http : HttpService
  ) {}

  findAll() : Promise<Reading[]> {
    return this.repo.find();
  }

  create(reading : Reading) : Promise<Reading> {
    return this.repo.save(reading);
  }

  async getReadings(slug : string, lectionaryName : string, when : number, whentype : string, date : Date = undefined) : Promise<Reading[]> {
    let query : any = {
      lectionary: In(lectionaryName.split(',')),
      day: slug
    }
    if(when && whentype) {
      query.when = when;
      query.whentype = whentype;
    }

    if(lectionaryName == 'rclsunday') {
      return this.rcl(date);
    } else if(lectionaryName == 'episcopal,rcl') {
      query.lectionary = 'episcopal';
      const episcopal = await this.repo.find(query),
            rcl = await this.rcl(date);
      return episcopal.concat(rcl);
    } else {
      return this.repo.find(query);
    }
  }

  find(query : any) : Promise<Reading[]> {
    return this.repo.find(query);
  }

  async rcl(date : Date) : Promise<Reading[]> {
    let found = await this.repo.find({ lectionary: 'rclsunday', when: date.getTime() });

    if(found && found.length && found.length > 0) {
      return found;
    } else {
      console.log('(lectionaryService) (rcl) calling API');
      const resp = await this.http.get(`https://lectserve.com/date/${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
        {
          params: {
            'lect': 'rcl'
          }
        }).toPromise();

      const API_READING_ORDER = ['first_reading', 'morning_psalms', 'second_reading', 'gospel'];
      let reading_order = API_READING_ORDER;

      if(resp.status === 200) {
        try {
          let readings : Reading[] = new Array(),
              citations : string[];
          const services = resp.data.red_letter && resp.data.red_letter.services[0].readings.length > 0 ? resp.data.red_letter.services : resp.data.sunday.services;


          if(services.length == 1 && services) {
            // ordinary Sunday
            citations = services[0].readings;
          } else {
            // special days with more than one set of reading
            const firstServiceName = services[0].name;
            console.log('Multiple services, starting with', firstServiceName);

            if(firstServiceName.includes('Palm')) {
              // Palm Sunday
              console.log('Palm Sunday');
              citations = services[1].readings.concat(services[0].readings).flat();
              reading_order = API_READING_ORDER.concat(['palms_gospel', 'palms_psalm']);
            } else if(firstServiceName.includes('Great Vigil')) {
              // Easter
              console.log('Easter Sunday', services[2]);
              citations = services[2].readings; // offer only "Principal Service" readings
            } else if(firstServiceName.includes('Easter Vigil')) {
              // Easter
              console.log('Easter Sunday', services);
              citations = services[1].readings; // offer only "Principal Service" readings
            } else {
              // other days, fall back to first service listed
              citations = services[0].readings;
            }
          }

          citations.forEach((cites, ii) => {
            const rs = cites.split(' or ').map(cite => {
              let r = new Reading();
              r.lectionary = 'rclsunday';
              r.citation = cite;
              r.type = reading_order[ii];
              r.when = date.getTime();
              r.whentype = 'time';
              return r;
            });
            readings = readings.concat(rs);
            rs.forEach(r => this.repo.save(r));
          });
          return readings;
        } catch(e) {
          console.error(e);
          return [];
        }
      }
    }
  }
}
