import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

import { ConfigService } from '../config/config.service';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {
  constructor(private configService: ConfigService){ }

  transform(timestamp: number | Date, short?: boolean, date?: boolean): string
  transform(timestamp: number | Date, rules: string): string
  transform(timestamp: number | Date, rules: Rules): string
  transform(timestamp: number | Date): string {
    /** Converts a timestamp into a readable format via the moment library
     * USAGE
     * time | time:"rules:RULE_STRING"    => any              --> micro syntax provides flexible parsing options
     *    RULE_STRING: "option1?=value1,option2?=value2" a list of comma separated options, some of which may include a value
     *      OPTIONS:              DEFAULT         MEANING
     *      * local               false (utc)     time will be parsed in local time
     *      * date                false (time)    timestamp will be parsed as a date; otherwise, a time
     *      * short               false (long)    a short version of the format will be used
     *      * format="MM/DD/YYY"  null            the format string will be used to parse the timestamp; this takes precedence over the date option
     * timePipe.transform(time, RulesObject)
     *
     *
     * time | time:"MM/DD/YYYY"   => "09/16/2000"     --> string is a format
     * time | time:true           => "5:30"           --> boolean indicates whether or not to shorten the time
     * time | time:false          => "5:30 PM"
     * date | time:boolean:true   => "Mon, May 5th"   --> second boolean indicates that the date formats should be used
     * */

    // check the timestamp
    if(!timestamp)
      return "";

    if(typeof timestamp === 'string')
      throw Error(`Cannot transform string timestamps: ${timestamp}`);

    if(timestamp < 24)
      throw Error("Time cannot be in the now-deprecated hours format: " + timestamp);

    // modify these variables according to the params
    var rules: Rules = {
      date: false,
      short: false,
      local: false,
      format: "", // format is the trump card here
    }

    if(typeof arguments[1] === 'string'){
      if(arguments[1].substring(0, 6) === 'rules:'){
        const ruleString = arguments[1].substr(6).split(",");
        for(let rule of ruleString){
          const [key, value] = rule.split("=");
          if(value !== undefined)
            rules[key] = value;
          else
            rules[key] = true;
        }
      }
    }else if(typeof arguments[1] === 'object'){
      const rulesInput = arguments[1];
      for(let key in rulesInput)
        rules[key] = rulesInput[key];
    }else{
      rules.short = arguments[1] || false;
      rules.date  = arguments[2] || false;
    }

    // execute the variables
    if(!rules.format){
      if(rules.date){
        if(rules.short)
          rules.format = this.configService.getConfig<string>('client.shortDateDisplayFormat', "ddd, MMM DD");
        else
          rules.format = this.configService.getConfig<string>('client.fullDateDisplayFormat', "dddd, MMMM DD, YYYY");
      }else{
        if(rules.short)
          rules.format = this.configService.getConfig<string>('client.shortTimeDisplayFormat', "h:mm");
        else
          rules.format = this.configService.getConfig<string>('client.timeDisplayFormat', "h:mm a");
      }
    }

    // parse & format
    let timeMoment = rules.local ? moment(timestamp) : moment.utc(timestamp);
    let value = timeMoment.format(rules.format);

    // return
    return value;
  }
}

export interface Rules {
  local?: boolean;
  date?: boolean;
  short?: boolean;
  format?: string;
}