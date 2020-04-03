import { Injectable } from '@nestjs/common';
import { Document, Paragraph, TextRun, Packer, HeadingLevel, Styles, AlignmentType } from 'docx';
import { CompiledLiturgy, CompiledSection, CompiledOption, LiturgyObject } from '../pray/pray.model';
import { Liturgy, Section, Condition, ClientPreferences, PreferenceOption } from '../liturgy/liturgy.entity';
import { LiturgicalDay } from '../calendar/calendar.model';

const STYLES = {
  characterStyles: [
    {
      id: 'Response',
      name: 'Response',
      run: {
        bold: true
      }
    },
    {
      id: 'ResponsivePrayerLabel',
      name: 'Responsive Prayer Label',
      run: {
        italics: true
      }
    },
  ],
  paragraphStyles: [
    {
      id: 'Normal',
      name: 'Normal',
      run: {
        font: 'Garamond',
        size: 24
      },
      paragraph: {
          spacing: {
              after: 120
          }
      }
    },
    {
      id: 'Antiphon',
      name: 'Antiphon',
      run: {
        font: 'Garamond',
        size: 24,
        italics: true
      },
      paragraph: {
          spacing: {
              after: 120
          }
      }
    },
    {
      id: 'Title',
      name: 'Title',
      run: {
        font: 'Garamond',
        size: 56,
        color: '000000',
      },
      paragraph: {
          spacing: {
              after: 240
          },
          alignment: AlignmentType.CENTER
      }
    },
    {
      id: 'Heading_1',
      name: 'Heading 1',
      run: {
        font: 'Garamond',
        size: 32,
        color: '000000',
        bold: true
      },
      paragraph: {
          spacing: {
              after: 240,
              before: 240
          }
      }
    },
    {
      id: 'Heading_2',
      name: 'Heading 2',
      run: {
        font: 'Garamond',
        size: 24,
        color: '000000',
        bold: true
      },
      paragraph: {
          spacing: {
              after: 240,
              before: 240
          }
      }
    },
    {
      id: 'Heading_3',
      name: 'Heading 3',
      run: {
        font: 'Garamond',
        size: 24,
        color: '000000',
        italics: true
      },
      paragraph: {
          spacing: {
              after: 240
          }
      }
    },
    {
      id: 'Response',
      name: 'Response',
      basedOn: 'Normal',
      next: 'Normal',
      run: {
        bold: true
      }
    },
    {
      id: 'Rubric',
      name: 'Rubric',
      basedOn: 'Normal',
      next: 'Normal',
      run: {
        italics: true,
        color: 'CC0000'
      },
      paragraph: {
          spacing: {
              after: 120
          }
      }
    },
    {
      id: 'Psalm',
      name: 'Psalm',
      basedOn: 'Normal',
      next: 'Normal',
      paragraph: {
          indent: {
              left: 240,
              hanging: 240
          },
          spacing: {
              after: 0
          }
      }
    },
    {
      id: 'Gloria',
      name: 'Gloria Patri',
      basedOn: 'Normal',
      next: 'Normal',
      paragraph: {
          indent: {
              left: 240,
              hanging: 240
          },
          spacing: {
              after: 0
          }
      }
    }
  ]
}

@Injectable()
export class PlanService {

  gloria;

  buildObject(obj : LiturgyObject, prayers : string[]) : Paragraph[] {
    let children : Paragraph[] = new Array();
    if((obj.value && obj.value.length > 0) || (obj.verses && obj.verses.length > 0)) {
      switch(obj.type) {
        case 'text':
        case 'reading':
          if(obj.verses && obj.verses.length > 0) {
            children = children.concat(obj.verses.map(p => {
              return new Paragraph({
                children: p.map(verse => new TextRun(verse.text)),
                style: 'Normal'
              })
            }));
            break;
          }
        case 'antiphon':
          children = children.concat(obj.value.map(p => {
            let runs : TextRun[] = new Array();

            p.split('\n').forEach((run, index) => {
              if(index == 0) {
                runs.push(new TextRun(run));
              } else {
                runs.push(new TextRun(run).break())
              }
            });

            return new Paragraph({
              children: runs,
              style: obj.type == 'antiphon' ? 'Antiphon' : 'Normal'
            });
          }));
          break;
        case 'gloria':
          this.gloria = obj;
          children = children.concat(new Paragraph({
            style: 'Gloria',
            children: [
              new TextRun(obj.value[0].replace(/\&nbsp\;/g, ' ')),
              new TextRun(obj.value[1].replace(/\&nbsp\;/g, ' ')).break()
            ]
          }))
          break;
        case 'rubric':
          children = children.concat(obj.value.map(p => new Paragraph({
            text: p,
            style: 'Rubric'
          })));
          break;
        case 'scripture':
        case 'collect':
          children = children.concat(new Paragraph({
            style: 'Text',
            children: obj.value.map(p => new TextRun(p)).concat(new TextRun({
              text: obj.response ? ` ${obj.response}` : ' Amen.',
              style: 'Response'
            }))
          }));

          if(obj.collect && !obj.omit_gloria) {
            children = children.concat(new Paragraph({
              style: 'Gloria',
              children: [
                new TextRun(obj.value[0].replace(/\&nbsp\;/g, ' ')),
                new TextRun(obj.value[1].replace(/\&nbsp\;/g, ' ')).break()
              ]
            }));
          }

          break;
        case 'prayers':
          if(obj.slug == 'meditate') {
            children.push(new Paragraph({text: 'A meditation, silent or spoken, may follow.', style: 'Rubric'}));
          } else if(obj.slug == 'free-intercessions') {
            children.push(new Paragraph({text: 'Free intercessions may be offered.', style: 'Rubric'}));
          } else if(obj.value) {
            obj.value.forEach(category => category.value.forEach(section => section.value.forEach(prayer => {
              if(prayer.show || prayers.includes(prayer.number)) {
                children = children.concat(new Paragraph({
                  text: prayer.label,
                  heading: HeadingLevel.HEADING_3
                }));
                children = children.concat(new Paragraph({
                  style: 'Text',
                  children: [
                    new TextRun(prayer.text),
                    new TextRun({
                      text: obj.response ? ` ${obj.response.replace(/=/g, '')}` : ' Amen.',
                      style: 'Response'
                    })
                  ]
                }));
              }
            })))
          }

          break;
        case 'preces':
        case 'litany':
        case 'responsive':
          if(obj.value[0].hasOwnProperty('label')) {
            let texts : TextRun[] = new Array();

            obj.value.forEach((line, index) => {
              if(index == 0) {
                texts.push(new TextRun({
                  text: `${line.label}\t`,
                  style: 'ResponsivePrayerLabel'
                }));
              } else {
                texts.push(new TextRun({
                  text: `${line.label}\t`,
                  style: 'ResponsivePrayerLabel'
                }).break());
              }
              texts.push(new TextRun({
                text: `${line.text}`,
                style: index % 2 == 1 ? 'Response' : 'Normal'
              }))
            })

            children.push(new Paragraph({ style: 'ResponsivePrayer', children: texts }));
          }
          if(!!obj.response || Array.isArray(obj.value[0])) {
            obj.value.forEach((line, index) => {
              children.push(new Paragraph({
                style: 'Litany',
                children: [
                  new TextRun(line[0]),
                  new TextRun({text: obj.response ? obj.response : line[1], style: 'Response'}).break()
                ]
              }));
            });
          }
          break;
        case 'psalm':
        case 'canticle':
          obj.value.forEach(set => {
            let verseChildren : Paragraph[] = new Array();
            if(set.hasOwnProperty('label')) {
              verseChildren.push(new Paragraph({
                text: set.label,
                heading: HeadingLevel.HEADING_3
              }));
            }

            (set.verses || set).forEach(verse => {
              if(verse.length == 3) {
                verseChildren.push(new Paragraph({
                  style: 'Psalm',
                  children: [
                    new TextRun(`${verse[1]}`.replace(/\&nbsp\;/g, ' ')),
                    new TextRun(verse[2].replace(/\&nbsp\;/g, ' ')).break()
                  ]
                }));
              } else if(verse.length == 2) {
                verseChildren.push(new Paragraph({
                  style: 'Psalm',
                  children: [
                    new TextRun(`${verse[0]}`.replace(/\&nbsp\;/g, ' ')),
                    new TextRun(verse[1].replace(/\&nbsp\;/g, ' ')).break()
                  ]
                }));
              } else {
                verseChildren.push(new Paragraph ({
                  style: 'Psalm',
                  text: verse[0].replace(/\&nbsp\;/g, ' ')
                }));
              }
            });

            children = children.concat(verseChildren).concat(new Paragraph(' '))
          });

          if(obj.canticle && !obj.omit_gloria && this.gloria) {
            children = children.concat(new Paragraph({
              style: 'Gloria',
              children: [
                new TextRun(this.gloria.value[0].replace(/\&nbsp\;/g, ' ')),
                new TextRun(this.gloria.value[1].replace(/\&nbsp\;/g, ' ')).break()
              ]
            }))
          }

          break;
        default:
          children.push(new Paragraph({text: JSON.stringify(obj)}))
      }
    }
    return children;
  }

  buildSection(section : CompiledSection, options : number[] = [], prayers : string[] = []) : Paragraph[] {
    let children : Paragraph[] = new Array();

    children.push(new Paragraph({
      text: section.label,
      heading: HeadingLevel.HEADING_1
    }))
    section.value.forEach((option, optionIndex) => {
      if(!option.hidden) {
        let selected = option.value[option.selected] || option.value[options[optionIndex] || 0];

        if(selected) {
          if(selected.localname || selected.label) {
            children.push(new Paragraph({
              text: selected.localname || selected.label,
              heading: HeadingLevel.HEADING_2
            }));
          }

          children = children.concat(this.buildObject(selected, prayers));
        }
      }
    });
    return children;
  }

  compiledLiturgyToDocx(liturgy : CompiledLiturgy) : Promise<Buffer> {
    console.log(liturgy);
    const doc = new Document({ styles: STYLES });
    let children = new Array();

    children.push(new Paragraph({
      text: liturgy.name,
      heading: HeadingLevel.TITLE
    }));

    liturgy.liturgy.forEach((section, sectionIndex) => {
      children = children.concat(this.buildSection(section));
    });

    doc.addSection({ children });

    return Packer.toBuffer(doc);
  }
}
