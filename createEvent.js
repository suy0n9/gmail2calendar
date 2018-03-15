function main() {
  console.info('=== Start ===')
  createEvent('unexecuted')
  console.info('=== End ===')
}

function createEvent(labelName) {
  var label = GmailApp.getUserLabelByName(labelName)
  var threads = label.getThreads()
  if (threads.length == 0) {
    Logger.log('No threads')
    return
  }

  for (var i = 0; i < threads.length; i++) {
    var thread = threads[i]
    var messages = thread.getMessages()
    
    for (var j = 0; j < messages.length; j++) {
      var body = messages[j].getPlainBody()
      var splitedBody = body.split('\n')
      var subject = messages[j].getSubject()
      
      if (subject.indexOf('TOHO CINEMAS') >0){
        var result = getTohoData(splitedBody)
      } else if (subject.indexOf('ユナイテッド・シネマ グループ') >0){
        var result = getUnitedData(splitedBody)
      }

      var calendar = CalendarApp.getDefaultCalendar()
      var registed_events = calendar.getEvents(result.start, result.end, {search: result.title})
      
      if (registed_events.length == 0) {
        Logger.log('--------------------------')
        Logger.log('theater: ' + result.theater)
        Logger.log('Confirmation Number: ' + result.buy_num)
        Logger.log('title: ' + result.title)
        Logger.log('start_time: ' + result.start)
        Logger.log('end_time: ' + result.end)
        
        insertEventToCalendar(result.title, result.theater, result.start, result.end, result.buy_num)
      } else {
        Logger.log('alredy exist event: ' + result.title)
      }
      
    }
    thread.removeLabel(label)
    console.log('Remove label, title: ' + result.title)
  }
}

function getTohoData(splitedBody) {
  /*
  ■購入番号 Confirmation Number  XXXX　(TEL:XXX-XXX-XXX)
  ■映画館 Theater  XXXXX
  ■上映日 Date  yyyy/mm/dd　■時間 Time  hh:mm～
  ■映画名称 Movie  （字）XXXXXXX
  */
  var obj = new Object()
  
  for (var k = 0; k < splitedBody.length; k++) {  
    var str = splitedBody[k]
    
    if (str.match(/Confirmation Number/)){
      obj.buy_num = str.match(/Confirmation Number\s*(\d{4})/)[1]
      Logger.log('+++++ Confirmation Number ' + obj.buy_num)
    }
    
    if (str.match(/Theater/)){
      obj.theater = str.match(/Theater\s*([^ ]+)/)[1]
      Logger.log('+++++ theater name ' + obj.theater)
    }

    if (str.match(/Movie/)){
      obj.title = str.match(/Movie\s(.*) \//)[1]
      Logger.log('+++++ title ' + obj.title)
    }
    
    if (str.match(/Date/)){
      var date = str.match(/Date\s*(\d+\/\d+\/\d+)/)[1]
      var start_time = str.match(/Time\s*(\d{2}:\d{2})/)[1]
      obj.start = new Date(date + ' ' + start_time)
      obj.end = new Date(+obj.start + 120*60*1000)
      Logger.log('+++++ date ' + date)
      Logger.log('+++++ time ' + obj.start + '~' + obj.end)
    }
  }
  return obj
}

function getUnitedData(splitedBody) {
  /*
  ●作品・劇場・時間
  劇場：XXXXX
  作品名：XXXXXXX
  鑑賞日：yyyy/mm/dd（金）
  上映時間：hh:mm～hh:mm
  */

  var obj = new Object()
  
  for (var k = 0; k < splitedBody.length; k++) {
    var str = splitedBody[k]
    
    if (str.match(/劇場：/)){
      var theater_place = str.match(/劇場：(.+)/)
      obj.theater = 'ユナイテッド・シネマ' + theater_place[1]
      Logger.log('+++++ theater name ' + obj.theater)
    }
    
    if (str.match(/【(\d{4})】/)){
      obj.buy_num = str.match(/【(\d{4})】/)[1]
      Logger.log('+++++ buy num ' + obj.buy_num)
    }
    
    if (str.match(/作品名：/)){
      obj.title = str.match(/作品名：(.+)/)[1]
      Logger.log('+++++ title ' + obj.title)
    }
    
    if (str.match(/鑑賞日：/)){
      var date = str.match(/鑑賞日：(\d+\/\d+\/\d+)/)[1]
      Logger.log('+++++ date ' + date)
    }
    
    if (str.match(/上映時間：/)){
      var time = str.match(/上映時間：(\d{2}:\d{2})～(\d{2}:\d{2})/)
      Logger.log('+++++ time ' + time)
    }
    
    if (date !=null && time !=null) {
      obj.start = new Date(date + ' ' + time[1])
      obj.end = new Date(date + ' ' + time[2])
    }
  }
  return obj
}

function insertEventToCalendar(title, theater, start, end, buy_number) {
  console.info('=== Start insertEventToCalendar ===')
  
  //var calendarId.  Use the variable defined in config.gs
  var event_data = {
    summary: title,
    location: theater,
    description: 'Confirmation Number ' + buy_number,
    start: {
      dateTime: start.toISOString()
    },
    end: {
      dateTime: end.toISOString()
    },
    //PURPlE background. Use Calendar.Colors.get() for the full list.
    colorId: 3
  }
  var event = Calendar.Events.insert(event_data, calendarId)

  console.log({message: 'Event registration: ' + title, initialData: event_data})
  Logger.log('Event ID: ' + event.getId())
  console.info('=== End insertEventToCalendar ===')
}
