import { Injectable } from '@nestjs/common';
import { HolyDay, HolyDayDB } from './holyday.model';
import { COLORS } from '../season/season.service';

@Injectable()
export class HolydayService {

  specialDay(slug : string) : HolyDay {
    return SPECIAL_DAYS[slug];
  }

  feastDate(date : Date) : HolyDay {
    let mmDD : string = `${date.getMonth()+1}/${date.getDate()}`;
    return FEAST_DATES[mmDD];
  }

}

const SPECIAL_DAYS : HolyDayDB = {
  "wednesday-last-epiphany": {
    slug: "wednesday-last-epiphany",
    name: "Ash Wednesday",
    season: "Lent",
    type: {
      name: "Fast",
      rank: 3
    },
    color: COLORS.Purple,
//	collect: "Almighty and everlasting God, you hate nothing you have made and forgive the sins of all who are penitent: Create and make in us new and contrite hearts, that we, worthily lamenting our sins and acknowledging our wretchedness, may obtain of you, the God of all mercy, perfect remission and forgiveness; through Jesus Christ our Lord, who lives and reigns with you and the Holy Spirit, one God, for ever and ever."
  },
  "thursday-last-epiphany": {
    slug: "thursday-last-epiphany",
    name: "Thursday after Ash Wednesday",
    season: "Lent",
    type: {
      name: "Weekday",
      rank: 2
    },
    color: COLORS.Purple,
//	collect: "Almighty and everlasting God, you hate nothing you have made and forgive the sins of all who are penitent: Create and make in us new and contrite hearts, that we, worthily lamenting our sins and acknowledging our wretchedness, may obtain of you, the God of all mercy, perfect remission and forgiveness; through Jesus Christ our Lord, who lives and reigns with you and the Holy Spirit, one God, for ever and ever."
  },
  "friday-last-epiphany": {
    slug: "friday-last-epiphany",
    name: "Friday after Ash Wednesday",
    season: "Lent",
    type: {
      name: "Weekday",
      rank: 2
    },
    color: COLORS.Purple,
//	collect: "Almighty and everlasting God, you hate nothing you have made and forgive the sins of all who are penitent: Create and make in us new and contrite hearts, that we, worthily lamenting our sins and acknowledging our wretchedness, may obtain of you, the God of all mercy, perfect remission and forgiveness; through Jesus Christ our Lord, who lives and reigns with you and the Holy Spirit, one God, for ever and ever."
  },
  "saturday-last-epiphany": {
    slug: "saturday-last-epiphany",
    name: "Saturday after Ash Wednesday",
    season: "Lent",
    type: {
      name: "Weekday",
      rank: 2
    },
    color: COLORS.Purple,
//	collect: "Almighty and everlasting God, you hate nothing you have made and forgive the sins of all who are penitent: Create and make in us new and contrite hearts, that we, worthily lamenting our sins and acknowledging our wretchedness, may obtain of you, the God of all mercy, perfect remission and forgiveness; through Jesus Christ our Lord, who lives and reigns with you and the Holy Spirit, one God, for ever and ever."
  },
  "sunday-holy-week": {
    slug: "sunday-holy-week",
    name: "Palm Sunday",
    season: "HolyWeek",
    type: {
      name: "Sunday",
      rank: 5
    },
    color: COLORS.Red,
    image: "/assets/iconography/palm_sunday.png",
    imageUrl: "https://w3id.org/vhmml/readingRoom/view/501250"
  },
  "monday-holy-week": {
    slug: "monday-holy-week",
    name: "Monday in Holy Week",
    season: "HolyWeek",
    type: {
      name: "Holy Week",
      rank: 4
    },
//	collect: "Almighty God, whose dear Son went not up to joy but first he suffered pain, and entered not into glory before he was crucified: Mercifully grant that we, walking in the way of the cross, may find it none other that the way of life and peace; through Jesus Christ your Son our Lord, who lives and reigns with you and the Holy Spirit, one God, for ever and ever."
  },
  "tuesday-holy-week": {
    slug: "tuesday-holy-week",
    name: "Tuesday in Holy Week",
    season: "HolyWeek",
    type: {
      name: "Holy Week",
      rank: 4
    },
//	collect: "O God, by the passion of your blessed Son you made an instrument of shameful death to be for us the means of life: Grant us so to glory in the cross of Christ, that we may gladly suffer shame and loss for the sake of your Son our Savior Jesus Christ; who lives and reigns with you and the Holy Spirit, one God, for ever and ever."
  },
  "wednesday-holy-week": {
    slug: "wednesday-holy-week",
    name: "Wednesday in Holy Week",
    season: "HolyWeek",
    type: {
      name: "Holy Week",
      rank: 4
    },
//	collect: "Lord God, whose blessed Son our Savior gave his body to be whipped and his face to be spit upon: Give us grace to accept joyfully the sufferings of the present time, confident of the glory that shall be revealed; through Jesus Christ your Son our Lord, who lives and reigns with you and the Holy Spirit, one God, for ever and ever."
  },
  "thursday-holy-week": {
    slug: "thursday-holy-week",
    name: "Maundy Thursday",
    season: "HolyWeek",
    type: {
      name: "Triduum",
      rank: 4
    },
    color: COLORS.Red,
    image: "/assets/iconography/maundy_thursday.png",
    imageUrl: "https://w3id.org/vhmml/readingRoom/view/501250"
//	collect: "Almighty Father, whose dear Son, on the night before he suffered, instituted the Sacrament of his Body and Blood: Mercifully grant that we may receive it thankfully in remembrance of Jesus Christ our Lord, who in these holy mysteries gives us a pledge of eternal life; and who now lives and reigns with you and the Holy Spirit, one God, for ever and ever."
  },
  "friday-holy-week": {
    slug: "friday-holy-week",
    name: "Good Friday",
    season: "HolyWeek",
    type: {
      name: "Triduum",
      rank: 4
    },
    color: COLORS.Red,
    image: "/assets/iconography/good_friday.png",
    imageUrl: "https://w3id.org/vhmml/readingRoom/view/501250"
//	collect: "Almighty God, we pray you graciously to behold this your family, for whom our Lord Jesus Christ was willing to be betrayed, and given into the hands of sinners, and to suffer death upon the cross; who now lives and reigns with you and the Holy Spirit, one God, for ever and ever."
  },
  "saturday-holy-week": {
    slug: "saturday-holy-week",
    name: "Holy Saturday",
    season: "HolyWeek",
    type: {
      name: "Triduum",
      rank: 4
    },
    color: COLORS.Red,
    image: "/assets/iconography/holy_saturday.png",
    imageUrl: "https://w3id.org/vhmml/readingRoom/view/501250"
//	collect: "O God, Creator of heaven and earth:  Grant that, as the crucified body of your dear Son was laid in the tomb and rested on this holy Sabbath, so we may await with him the  coming of the third day, and rise with him to newness of life; who now lives and reigns with you and the Holy Spirit, one God, for ever and ever."
  },
  "monday-easter": {
    slug: "monday-easter",
    name: "Monday in Easter Week",
    season: "Easter",
    type: {
      name: "Weekday",
      rank: 2
    },
//	collect: "Grant, we pray, Almighty God, that we who celebrate with awe the Paschal feast may be found worthy to attain to everlasting joys; through Jesus Christ our Lord, who lives and reigns with you and the Holy Spirit, one God, now and for ever."
  },
  "tuesday-easter": {
    slug: "tuesday-easter",
    name: "Tuesday in Easter Week",
    season: "Easter",
    type: {
      name: "Weekday",
      rank: 2
    },
//	collect: "O God, who by the glorious resurrection of your Son Jesus Christ destroyed death and brought life and immortality to light: Grant that we, who have been raised with him, may abide in his presence and rejoice in the hope of eternal glory; through Jesus Christ our Lord, to whom, with you and the Holy Spirit, be dominion and praise for ever and ever."
  },
  "wednesday-easter": {
    slug: "wednesday-easter",
    name: "Wednesday in Easter Week",
    season: "Easter",
    type: {
      name: "Weekday",
      rank: 2
    },
//	collect: "O God, whose blessed Son made himself known to his disciples in the breaking of bread: Open the eyes of our faith, that we may behold him in all his redeeming work; who lives and reigns with you, in the unity of the Holy Spirit, one God, now and for ever."
  },
  "thursday-easter": {
    slug: "thursday-easter",
    name: "Thursday in Easter Week",
    season: "Easter",
    type: {
      name: "Weekday",
      rank: 2
    },
//	collect: "Almighty and everlasting God, who in the Paschal mystery established the new covenant of reconciliation: Grant that all who have been reborn into the fellowship of Christ's Body may show forth in their lives what they profess by their faith; through Jesus Christ our Lord, who lives and reigns with you and the Holy Spirit, one God, for ever and ever."
  },
  "friday-easter": {
    slug: "friday-easter",
    name: "Friday in Easter Week",
    season: "Easter",
    type: {
      name: "Weekday",
      rank: 2
    },
//	collect: "Almighty Father, who gave your only Son to die for our sins and to rise for our justification: Give us grace so to put away the leaven of malice and wickedness, that we may always serve you in pureness of living and truth; through Jesus Christ your Son our Lord, who lives and reigns with you and the Holy Spirit, one God, now and for ever."
  },
  "saturday-easter": {
    slug: "saturday-easter",
    name: "Saturday in Easter Week",
    season: "Easter",
    type: {
      name: "Weekday",
      rank: 2
    },
//	collect: "We thank you, heavenly Father, that you have delivered us from the dominion of sin and death and brought us into the kingdom of your Son; and we pray that, as by his death he has recalled us to life, so by his love he may raise us to eternal joys; who lives and reigns with you, in the unity of the Holy Spirit, one God, now and forever."
  },
  "wednesday-6th-easter": {
    slug: "wednesday-6th-easter",
    eve: true,
    name: "Eve of the Ascension",
//	collect: "Almighty God, whose blessed Son our Savior Jesus Christ ascended far above all heavens that he might fill all things: Mercifully give us faith to perceive that, according to his promise, he abides with his Church on earth, even to the end of the ages; through Jesus Christ our Lord, who lives and reigns with you and the Holy Spirit, one God, in glory everlasting.",
    readings: "eve-wednesday-6th-easter"
  },
  "thursday-6th-easter": {
    slug: "thursday-6th-easter",
    name: "Ascension Day",
//	collect: "Almighty God, whose blessed Son our Savior Jesus Christ ascended far above all heavens that he might fill all things: Mercifully give us faith to perceive that, according to his promise, he abides with his Church on earth, even to the end of the ages; through Jesus Christ our Lord, who lives and reigns with you and the Holy Spirit, one God, in glory everlasting."
  },
  "friday-6th-easter": {
    slug: "friday-6th-easter",
//	collect: "Almighty God, whose blessed Son our Savior Jesus Christ ascended far above all heavens that he might fill all things: Mercifully give us faith to perceive that, according to his promise, he abides with his Church on earth, even to the end of the ages; through Jesus Christ our Lord, who lives and reigns with you and the Holy Spirit, one God, in glory everlasting."
  },
  "saturday-6th-easter": {
    slug: "saturday-6th-easter",
//	collect: "Almighty God, whose blessed Son our Savior Jesus Christ ascended far above all heavens that he might fill all things: Mercifully give us faith to perceive that, according to his promise, he abides with his Church on earth, even to the end of the ages; through Jesus Christ our Lord, who lives and reigns with you and the Holy Spirit, one God, in glory everlasting."
  },
  "saturday-7th-easter": {
    slug: "saturday-7th-easter",
    eve: true,
    name: "Eve of Pentecost",
    readings: "eve-of-pentecost",
    color: COLORS.Red,
    collectOptions: ["Almighty God, on this day you opened the way of eternal life to every race and nation by the promised gift of your Holy Spirit: Shed abroad this gift throughout the world by the preaching of the Gospel, that it may reach to the ends of the earth; through Jesus Christ our Lord, who lives and reigns with you, in the unity of the Holy Spirit, one God, for ever and ever.", "O God, who on this day taught the hearts of your faithful people by sending to them the light of your Holy Spirit: Grant us by the same Spirit to have a right judgment in all things, and evermore to rejoice in his holy comfort; through Jesus Christ your Son our Lord, who lives and reigns with you, in the unity of the Holy Spirit, one God, for ever and ever."]
  },
  "sunday-pentecost": {
    slug: "sunday-pentecost",
    color: COLORS.Red
  }
}

const FEAST_DATES : HolyDayDB = {
  "10/31": {
    mmdd: "10/31",
    slug: "eve-of-all-saints",
    eve: true,
    name: "Eve of All Saints’ Day",
    season: "Saints",
    color: COLORS.Gold,
//	collect: "Almighty God, you have knit together your elect in one communion and fellowship in the mystical body of your Son Christ our Lord: Give us grace so to follow your blessed saints in all virtuous and godly living, that we may come to those ineffable joys that you have prepared for those who truly love you; through Jesus Christ our Lord, who with you and the Holy Spirit lives and reigns, one God, in glory everlasting."
  },
  "11/1": {
    mmdd: "11/1",
    slug: "all-saints-day",
    name: "All Saints’ Day",
    season: "Saints",
    color: COLORS.Gold,
//	collect: "Almighty God, you have knit together your elect in one communion and fellowship in the mystical body of your Son Christ our Lord: Give us grace so to follow your blessed saints in all virtuous and godly living, that we may come to those ineffable joys that you have prepared for those who truly love you; through Jesus Christ our Lord, who with you and the Holy Spirit lives and reigns, one God, in glory everlasting."
  },
  "11/2": {
    mmdd: "11/2",
    slug: "all-souls-day",
    name: "Commemoration of All Faithful Departed (All Souls’ Day)",
    season: "Saints",
    color: COLORS.Purple,
//	collect: "God, the Maker and Redeemer of all believers: Grant to the faithful departed the unsearchable benefits of the passion of your Son; that on the day of his appearing they may be manifested as your children; through Jesus Christ our Lord, who lives and reigns with you and the Holy Spirit, one God, now and for ever."
  },
  "12/24": {
    mmdd: "12/24",
    slug: "christmas-eve",
    eve: true,
    name: "Christmas Eve",
    season: "Christmas",
    color: COLORS.White,
//	collect: "O God, you have caused this holy night to shine with the brightness of the true Light: Grant that we, who have known the mystery of that Light on earth, may also enjoy him perfectly in heaven; where with you and the Holy Spirit he lives and reigns, one God, in glory everlasting."
  },
  "12/25": {
    mmdd: "12/25",
    slug: "christmas-day",
    name: "Christmas Day",
    season: "Christmas",
    type: {
      name: "Principal Feast",
      rank: 5
    },
    color: COLORS.White,
//	collect: "O God, you make us glad by the yearly festival of the birth of your only Son Jesus Christ: Grant that we, who joyfully receive him as our Redeemer, may with sure confidence behold him when he comes to be our Judge; who lives and reigns with you and the Holy Spirit, one God, now and for ever."
  },
  "12/26": {
    mmdd: "12/26",
    slug: "st-stephen",
    name: "Feast of St. Stephen",
    season: "Saints",
    color: COLORS.Red,
    image: "https://i.pinimg.com/originals/5b/4a/d3/5b4ad33a0d48d7e5a59467d0afa73562.jpg",
//	collect: "We give you thanks, O Lord of glory, for the example of the first martyr Stephen, who looked up to heaven and prayed for his persecutors to your Son Jesus Christ, who stands at your right hand; where he lives and reigns with you and the Holy Spirit, one God, in glory everlasting."
  },
  "12/27": {
    mmdd: "12/27",
    slug: "st-john",
    name: "Feast of St. John",
    season: "Saints",
    color: COLORS.White,
    image: "http://c590298.r98.cf2.rackcdn.com/XAM6_134.JPG",
//	collect: "Shed upon your Church, O Lord, the brightness of your light, that we, being illumined by the teaching of your apostle and evangelist John, may so walk in the light of your truth, that at length we may attain to the fullness of eternal life; through Jesus Christ our Lord, who lives and reigns with you and the Holy Spirit, one God, for ever and ever."
  },
  "12/28": {
    mmdd: "12/28",
    slug: "holy-innocents",
    name: "Holy Innocents",
    season: "Saints",
    color: COLORS.Red,
    image: "http://www.calledtocommunion.com/wp-content/uploads/2009/12/icon-of-holy-innocents.jpg",
//	collect: "We remember today, O God, the slaughter of the holy innocents of Bethlehem by King Herod. Receive, we pray, into the arms of your mercy all innocent victims; and by your great might frustrate the designs of evil tyrants and establish your rule of justice, love, and peace; through Jesus Christ our Lord, who lives and reigns with you, in the unity of the Holy Spirit, one God, for ever and ever."
  },
  "12/29": {
    mmdd: "12/29",
    slug: "december-29",
    season: "Christmas",
    color: COLORS.White
  },
  "12/30": {
    mmdd: "12/30",
    slug: "december-30",
    season: "Christmas",
    color: COLORS.White
  },
  "12/31": {
    mmdd: "12/31",
    slug: "december-31",
    season: "Christmas",
    color: COLORS.White
  },
  "1/1": {
    mmdd: "1/1",
    slug: "holy-name",
    name: "The Holy Name of Our Lord Jesus Christ",
    season: "Christmas",
    type: {
      name: "Principal Feast",
      rank: 5
    },
    color: COLORS.White,
//	collect: "Eternal Father, you gave to your incarnate Son the holy name of Jesus to be the sign of our salvation: Plant in every heart, we pray, the love of him who is the Savior of the world, our Lord Jesus Christ; who lives and reigns with you and the Holy Spirit, one God, in glory everlasting."
  },
  "1/2": {
    mmdd: "1/2",
    slug: "january-2",
    season: "Christmas",
    color: COLORS.White
  },
  "1/3": {
    mmdd: "1/3",
    slug: "january-3",
    season: "Christmas",
    color: COLORS.White
  },
  "1/4": {
    mmdd: "1/4",
    slug: "january-4",
    season: "Christmas",
    color: COLORS.White
  },
  "1/5": {
    mmdd: "1/5",
    slug: "january-5",
    morning: {
      slug: "january-5",
      season: "Christmas",
      color: COLORS.White
    },
    evening: {
      slug: "eve-epiphany",
      season: "Epiphany",
      color: COLORS.Green,
      name: "Eve of the Epiphany",
      type: {
        name: "Principal Feast",
        rank: 5
      }
    }
  },
  "1/6": {
    mmdd: "1/6",
    slug: "epiphany",
    name: "The Epiphany",
    season: "Epiphany",
    type: {
      name: "Principal Feast",
      rank: 5
    }
  },
  "1/7": {
    mmdd: "1/7",
    slug: "january-7",
		stops_at_sunday: "1st-epiphany"
  },
  "1/8": {
    mmdd: "1/8",
    slug: "january-8",
		stops_at_sunday: "1st-epiphany"
  },
  "1/9": {
    mmdd: "1/9",
    slug: "january-9",
		stops_at_sunday: "1st-epiphany"
  },
  "1/10": {
    mmdd: "1/10",
    slug: "january-10",
		stops_at_sunday: "1st-epiphany"
  },
  "1/11": {
    mmdd: "1/11",
    slug: "january-11",
		stops_at_sunday: "1st-epiphany"
  },
  "1/12": {
    mmdd: "1/12",
    slug: "january-12",
		stops_at_sunday: "1st-epiphany"
  },
  "1/18": {
    mmdd: "1/18",
    slug: "confession-of-st-peter",
    name: "The Confession of St. Peter the Apostle",
    season: "Saints",
//	collect: "Almighty Father, who inspired Saint Peter, first among the apostles, to confess Jesus as Messiah and Son of the living God: Keep your Church steadfast upon the rock of this faith, so that in unity and peace we may proclaim the one truth and follow the one Lord, our Savior Jesus Christ; who lives and reigns with you and the Holy Spirit, one God, now and for ever.",
    type: {
      name: "Holy Days",
      rank: 3
    },
    color: COLORS.White,
    image: "http://www.spreadjesus.org/img/APOSTLES-PETER.jpg"
  },
  "1/25": {
    mmdd: "1/25",
    slug: "conversion-of-st-paul",
    name: "The Conversion of St. Paul the Apostle",
    season: "Saints",
//	collect: "O God, by the preaching of your apostle Paul you have caused the light of the Gospel to shine throughout the world: Grant, we pray, that we, having his wonderful conversion in remembrance, may show ourselves thankful to you by following his holy teaching; through Jesus Christ our Lord, who lives and reigns with you, in the unity of the Holy Spirit, one God, now and for ever.",
    type: {
      name: "Holy Days",
      rank: 3
    },
    color: COLORS.White,
    image: "http://www.stewardshipadvocates.org/wp-content/uploads/conversion-of-st-paul-300x295.jpg"
  },
  "2/1": {
    mmdd: "2/1",
    slug: "eve-of-the-presentation",
    eve: true,
    name: "Eve of the Presentation of Our Lord Jesus Christ in the Temple",
//	collect: "Almighty and everliving God, we humbly pray that, as your only-begotten Son was this day presented in the temple, so we may be presented to you with pure and clean hearts by Jesus Christ our Lord; who lives and reigns with you and the Holy Spirit, one God, now and for ever.",
    type: {
      name: "Holy Days",
      rank: 3
    },
    color: COLORS.White
  },
  "2/2": {
    mmdd: "2/2",
    slug: "the-presentation",
    name: "The Presentation of Our Lord Jesus Christ in the Temple (Candlemas)",
//	collect: "Almighty and everliving God, we humbly pray that, as your only-begotten Son was this day presented in the temple, so we may be presented to you with pure and clean hearts by Jesus Christ our Lord; who lives and reigns with you and the Holy Spirit, one God, now and for ever.",
    type: {
      name: "Holy Days",
      rank: 3
    },
    color: COLORS.White
  },
  "2/24": {
    mmdd: "2/24",
    slug: "st-matthias",
    name: "St. Matthias the Apostle",
    season: "Saints",
//	collect: "Almighty God, who in the place of Judas chose your faithful servant Matthias to be numbered among the Twelve: Grant that your Church, being delivered from false apostles, may always be guided and governed by faithful and true pastors; through Jesus Christ our Lord, who lives and reigns with you, in the unity of the Holy Spirit, one God, now and for ever.",
    type: {
      name: "Holy Days",
      rank: 3
    },
    color: COLORS.Red
  },
  "3/19": {
    mmdd: "3/19",
    slug: "st-joseph",
    name: "St. Joseph",
    season: "Saints",
//	collect: "O God, who from the family of your servant David raised up Joseph to be the guardian of your incarnate Son and the spouse of his virgin mother: Give us grace to imitate his uprightness of life and his obedience to your commands; through Jesus Christ our Lord, who lives and reigns with you and the Holy Spirit, one God, for ever and ever.",
    type: {
      name: "Holy Days",
      rank: 3
    },
    color: COLORS.White
  },
  "3/24": {
    mmdd: "3/24",
    slug: "eve-of-the-annunciation",
    eve: true,
    name: "Eve of the Annunciation of Our Lord Jesus Christ to the Blessed Virgin Mary",
    season: "Saints",
//	collect: "Pour your grace into our hearts, O Lord, that we who have known the incarnation of your Son Jesus Christ, announced by an angel to the Virgin Mary, may by his cross and passion be brought to the glory of his resurrection; who lives and reigns with you, in the unity of the Holy Spirit, one God, now and for ever.",
    type: {
      name: "Holy Days",
      rank: 3
    },
    color: COLORS.Blue,
    image: "http://www.bridgebuilding.com/images/nmgab-l.jpg"
  },
  "3/25": {
    mmdd: "3/25",
    slug: "annunciation",
    name: "The Annunciation of Our Lord Jesus Christ to the Blessed Virgin Mary",
    season: "Saints",
//	collect: "Pour your grace into our hearts, O Lord, that we who have known the incarnation of your Son Jesus Christ, announced by an angel to the Virgin Mary, may by his cross and passion be brought to the glory of his resurrection; who lives and reigns with you, in the unity of the Holy Spirit, one God, now and for ever.",
    type: {
      name: "Holy Days",
      rank: 3
    },
    color: COLORS.Blue,
    image: "http://www.bridgebuilding.com/images/nmgab-l.jpg"
  },
  "4/25": {
    mmdd: "4/25",
    slug: "st-mark",
    name: "St. Mark the Evangelist",
    season: "Saints",
//	collect: "Almighty God, by the hand of Mark the evangelist you have given to your Church the Gospel of Jesus Christ the Son of God: We thank you for this witness, and pray that we may be firmly grounded in its truth; through Jesus Christ our Lord, who lives and reigns with you and the Holy Spirit, one God, for ever and ever.",
    type: {
      name: "Holy Days",
      rank: 3
    },
    color: COLORS.Red
  },
  "5/1": {
    mmdd: "5/1",
    slug: "ss-philip-and-james",
    name: "St. Philip and St. James, Apostles",
    season: "Saints",
//	collect: "Almighty God, who gave to your apostles Philip and James grace and strength to bear witness to the truth: Grant that we, being mindful of their victory of faith, may glorify in life and death the Name of our Lord Jesus Christ; who lives and reigns with you and the Holy Spirit, one God, now and for ever.",
    type: {
      name: "Holy Days",
      rank: 3
    },
    color: COLORS.Red
  },
  "5/30": {
    mmdd: "5/30",
    slug: "eve-of-the-visitation",
    eve: true,
    name: "Eve of the Visitation of the Blessed Virgin Mary",
//	collect: "Father in heaven, by your grace the virgin mother of your incarnate Son was blessed in bearing him, but still more blessed in keeping your word: Grant us who honor the exaltation of her lowliness to follow the example of her devotion to your will; through Jesus Christ our Lord, who lives and reigns with you and the Holy Spirit, one God, for ever and ever.",
    type: {
      name: "Holy Days",
      rank: 3
    },
    color: COLORS.Blue,
    image: "http://www.madonnahouse.org/features/kowalchyk/Kowalchyk-The_Visitation.jpg"
  },
  "5/31": {
    mmdd: "5/31",
    slug: "the-visitation",
    name: "The Visitation of the Blessed Virgin Mary",
//	collect: "Father in heaven, by your grace the virgin mother of your incarnate Son was blessed in bearing him, but still more blessed in keeping your word: Grant us who honor the exaltation of her lowliness to follow the example of her devotion to your will; through Jesus Christ our Lord, who lives and reigns with you and the Holy Spirit, one God, for ever and ever.",
    type: {
      name: "Holy Days",
      rank: 3
    },
    color: COLORS.Blue,
    image: "http://www.madonnahouse.org/features/kowalchyk/Kowalchyk-The_Visitation.jpg"
  },
  "6/11": {
    mmdd: "6/11",
    slug: "st-barnabas",
    name: "St. Barnabas the Apostle",
    season: "Saints",
//	collect: "Grant, O God, that we may follow the example of your faithful servant Barnabas, who, seeking not his own renown but the well-being of your Church, gave generously of his life and substance for the relief of the poor and the spread of the Gospel; through Jesus Christ our Lord, who lives and reigns with you and the Holy Spirit, one God, for ever and ever.",
    type: {
      name: "Holy Days",
      rank: 3
    },
    color: COLORS.Red
  },
  "6/23": {
    mmdd: "6/23",
    slug: "eve-of-st-john-the-baptist",
    eve: true,
    name: "Eve of the Nativity of St. John the Baptist",
    season: "Saints",
//	collect: "Almighty God, by whose providence your servant John the Baptist was wonderfully born, and sent to prepare the way of your Son our Savior by preaching repentance: Make us so to follow his teaching and holy life, that we may truly repent according to his preaching; and, following his example, constantly speak the truth, boldly rebuke vice, and patiently suffer for the truth's sake; through Jesus Christ your Son our Lord, who lives and reigns with you and the Holy Spirit, one God, for ever and ever.",
    type: {
      name: "Holy Days",
      rank: 3
    },
    color: COLORS.White,
    image: "http://trinitylewisham.files.wordpress.com/2012/06/johntheb.jpg"
  },
  "6/24": {
    mmdd: "6/24",
    slug: "nativity-of-st-john-the-baptist",
    name: "The Nativity of St. John the Baptist",
    season: "Saints",
//	collect: "Almighty God, by whose providence your servant John the Baptist was wonderfully born, and sent to prepare the way of your Son our Savior by preaching repentance: Make us so to follow his teaching and holy life, that we may truly repent according to his preaching; and, following his example, constantly speak the truth, boldly rebuke vice, and patiently suffer for the truth's sake; through Jesus Christ your Son our Lord, who lives and reigns with you and the Holy Spirit, one God, for ever and ever.",
    type: {
      name: "Holy Days",
      rank: 3
    },
    color: COLORS.White,
    image: "http://trinitylewisham.files.wordpress.com/2012/06/johntheb.jpg"
  },
  "6/29": {
    mmdd: "6/29",
    slug: "ss-peter-and-paul",
    name: "St. Peter and St. Paul, Apostles",
    season: "Saints",
//	collect: "Almighty God, whose blessed apostles Peter and Paul glorified you by their martyrdom: Grant that your Church, instructed by their teaching and example, and knit together in unity by your Spirit, may ever stand firm upon the one foundation, which is Jesus Christ our Lord; who lives and reigns with you, in the unity of the Holy Spirit, one God, now and for ever.",
    type: {
      name: "Holy Days",
      rank: 3
    },
    color: COLORS.Red
  },
  "7/4": {
    mmdd: "7/4",
    slug: "independence-day",
    name: "Independence Day",
//	collect: "Lord God Almighty, in whose Name the founders of this country won liberty for themselves and for us, and lit the torch of freedom for nations then unborn: Grant that we and all the people of this land may have grace to maintain our liberties in righteousness and peace; through Jesus Christ our Lord, who lives and reigns with you and the Holy Spirit, one God, for ever and ever.",
    type: {
      name: "Holy Days",
      rank: 3
    }
  },
  "7/22": {
    mmdd: "7/22",
    slug: "st-mary-magdalene",
    name: "St. Mary Magdalene",
    season: "Saints",
//	collect: "Almighty God, whose blessed Son restored Mary Magdalene to health of body and of mind, and called her to be a witness of his resurrection: Mercifully grant that by your grace we may be healed from all our infirmities and know you in the power of his unending life; who with you and the Holy Spirit lives and reigns, one God, now and for ever.",
    type: {
      name: "Holy Days",
      rank: 3
    },
    color: COLORS.White,
    image: "http://www.monasteryicons.com/graphics/products/large/728.jpg"
  },
  "7/25": {
    mmdd: "7/25",
    slug: "st-james",
    name: "St. James the Apostle",
    season: "Saints",
//	collect: "O gracious God, we remember before you today your servant and apostle James, first among the Twelve to suffer martyrdom for the Name of Jesus Christ; and we pray that you will pour out upon the leaders of your Church that spirit of self-denying service by which alone they may have true authority among your people; through Jesus Christ our Lord, who lives and reigns with you and the Holy Spirit, one God, now and for ever.",
    type: {
      name: "Holy Days",
      rank: 3
    },
    color: COLORS.Red
  },
  "8/5": {
    mmdd: "8/5",
    slug: "eve-of-the-transfiguration",
    eve: true,
    name: "Eve of the Transfiguration of Our Lord Jesus Christ",
//	collect: "O God, who on the holy mount revealed to chosen witnesses your well-beloved Son, wonderfully transfigured, in raiment white and glistening: Mercifully grant that we, being delivered from the disquietude of this world, may by faith behold the King in his beauty; who with you, O Father, and you, O Holy Spirit, lives and reigns, one God, for ever and ever.",
    type: {
      name: "Holy Days",
      rank: 3
    }
  },
  "8/6": {
    mmdd: "8/6",
    slug: "the-transfiguration",
    name: "The Transfiguration of Our Lord Jesus Christ",
//	collect: "O God, who on the holy mount revealed to chosen witnesses your well-beloved Son, wonderfully transfigured, in raiment white and glistening: Mercifully grant that we, being delivered from the disquietude of this world, may by faith behold the King in his beauty; who with you, O Father, and you, O Holy Spirit, lives and reigns, one God, for ever and ever.",
    type: {
      name: "Holy Days",
      rank: 3
    },
    color: COLORS.White,
    image: "http://www.stjamesdenver.org/wp-content/uploads/2013/02/transfiguration.jpg"
  },
  "8/15": {
    mmdd: "8/15",
    slug: "st-mary-the-virgin",
    name: "St. Mary the Virgin, Mother of Our Lord Jesus Christ",
    season: "Saints",
//	collect: "O God, you have taken to yourself the blessed Virgin Mary, mother of your incarnate Son: Grant that we, who have been redeemed by his blood, may share with her the glory of your eternal kingdom; through Jesus Christ our Lord, who lives and reigns with you, in the unity of the Holy Spirit, one God, now and for ever.",
    type: {
      name: "Holy Days",
      rank: 3
    },
    color: COLORS.Blue,
    image: "http://www.bridgebuilding.com/images/mi574x.jpg"
  },
  "8/24": {
    mmdd: "8/24",
    slug: "st-bartholomew",
    name: "St. Bartholomew the Apostle",
    season: "Saints",
//	collect: "Almighty and everlasting God, who gave to your apostle Bartholomew grace truly to believe and to preach your Word: Grant that your Church may love what he believed and preach what he taught; through Jesus Christ our Lord, who lives and reigns with you and the Holy Spirit, one God, for ever and ever.",
    type: {
      name: "Holy Days",
      rank: 3
    },
    color: COLORS.Red
  },
  "9/13": {
    mmdd: "9/13",
    slug: "eve-of-holy-cross",
    eve: true,
    name: "Eve of Holy Cross Day",
    season: "HolyWeek",
//	collect: "Almighty God, whose Son our Savior Jesus Christ was lifted high upon the cross that he might draw the whole world to himself: Mercifully grant that we, who glory in the mystery of our redemption, may have grace to take up our cross and follow him; who lives and reigns with you and the Holy Spirit, one God, in glory everlasting.",
    type: {
      name: "Holy Days",
      rank: 3
    },
    color: COLORS.Red
  },
  "9/14": {
    mmdd: "9/14",
    slug: "holy-cross",
    name: "Holy Cross Day",
    season: "HolyWeek",
//	collect: "Almighty God, whose Son our Savior Jesus Christ was lifted high upon the cross that he might draw the whole world to himself: Mercifully grant that we, who glory in the mystery of our redemption, may have grace to take up our cross and follow him; who lives and reigns with you and the Holy Spirit, one God, in glory everlasting.",
    type: {
      name: "Holy Days",
      rank: 3
    },
    color: COLORS.Red
  },
  "9/21": {
    mmdd: "9/21",
    slug: "st-matthew",
    name: "St. Matthew, Apostle and Evangelist",
    season: "Saints",
//	collect: "We thank you, heavenly Father, for the witness of your apostle and evangelist Matthew to the Gospel of your Son our Savior; and we pray that, after his example, we may with ready wills and hearts obey the calling of our Lord to follow him; through Jesus Christ our Lord, who lives and reigns with you and the Holy Spirit, one God, now and for ever.",
    type: {
      name: "Holy Days",
      rank: 3
    },
    color: COLORS.Red
  },
  "9/29": {
    mmdd: "9/29",
    slug: "st-michael",
    name: "St. Michael and All Angels",
    season: "Saints",
//	collect: "Everlasting God, you have ordained and constituted in a wonderful order the ministries of angels and mortals: Mercifully grant that, as your holy angels always serve and worship you in heaven, so by your appointment they may help and defend us here on earth; through Jesus Christ our Lord, who lives and reigns with you and the Holy Spirit, one God, for ever and ever.",
    type: {
      name: "Holy Days",
      rank: 3
    },
    color: COLORS.White,
    image: "http://www.bridgebuilding.com/images/mi583x.jpg"
  },
  "10/18": {
    mmdd: "10/18",
    slug: "st-luke",
    name: "St. Luke the Evangelist",
    season: "Saints",
//	collect: "Almighty God, who inspired your servant Luke the physician to set forth in the Gospel the love and healing power of your Son: Graciously continue in your Church this love and power to heal, to the praise and glory of your Name; through Jesus Christ our Lord, who lives and reigns with you, in the unity of the Holy Spirit, one God, now and for ever.",
    type: {
      name: "Holy Days",
      rank: 3
    },
    color: COLORS.Red
  },
  "10/23": {
    mmdd: "10/23",
    slug: "st-james-of-jerusalem",
    name: "St. James of Jerusalem, Brother of Our Lord Jesus Christ, and Martyr",
    season: "Saints",
//	collect: "Grant, O God, that, following the example of your servant James the Just, brother of our Lord, your Church may give itself continually to prayer and to the reconciliation of all who are at variance and enmity; through Jesus Christ our Lord, who lives and reigns with you and the Holy Spirit, one God, now and for ever.",
    type: {
      name: "Holy Days",
      rank: 3
    },
    color: COLORS.Red
  },
  "10/28": {
    mmdd: "10/28",
    slug: "ss-simon-and-jude",
    name: "St. Simon and St. Jude, Apostles",
    season: "Saints",
//	collect: "O God, we thank you for the glorious company of the apostles, and especially on this day for Simon and Jude; and we pray that, as they were faithful and zealous in their mission, so we may with ardent devotion make known the love and mercy of our Lord and Savior Jesus Christ; who lives and reigns with you and the Holy Spirit, one God, for ever and ever.",
    type: {
      name: "Holy Days",
      rank: 3
    },
    color: COLORS.Red
  },
  "11/30": {
    mmdd: "11/30",
    slug: "st-andrew",
    name: "St. Andrew the Apostle",
    season: "Saints",
//	collect: "Almighty God, who gave such grace to your apostle Andrew that he readily obeyed the call of your Son Jesus Christ, and brought his brother with him: Give us, who are called by your holy Word, grace to follow him without delay, and to bring those near to us into his gracious presence; who lives and reigns with you and the Holy Spirit, one God, now and for ever.",
    type: {
      name: "Holy Days",
      rank: 3
    },
    color: COLORS.Red
  },
  "12/21": {
    mmdd: "12/21",
    slug: "st-thomas",
    name: "St. Thomas the Apostle",
    season: "Saints",
//	collect: "Everliving God, who strengthened your apostle Thomas with firm and certain faith in your Son's resurrection: Grant us so perfectly and without doubt to believe in Jesus Christ, our Lord and our God, that our faith may never be found wanting in your sight; through him who lives and reigns with you and the Holy Spirit, one God, now and for ever.",
    type: {
      name: "Holy Days",
      rank: 3
    },
    color: COLORS.Red
  },
}
