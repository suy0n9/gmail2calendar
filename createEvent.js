function main() {
  console.info('=== Start ===')
  createEvent('movie')
  console.info('=== End ===')
}

function createEvent(labelName) {
  var label = labelName
  var threads = GmailApp.getUserLabelByName(label).getThreads()
  
  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages()
    
    for (var j = 0; j < messages.length; j++) {
      var body = messages[j].getBody()
      var subject = messages[j].getSubject()

      if (subject.indexOf('TOHO CINEMAS') >0){
        var result = getTohoData(body)
      } else if (subject.indexOf('ユナイテッド・シネマ グループ') >0){
        var result = getUnitedData(body)
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
  }
}

function getTohoData(body) {
  /*
  ■購入番号 Confirmation Number  XXXX　(TEL:XXX-XXX-XXX)
  ■映画館 Theater  XXXXX
  ■上映日 Date  yyyy/mm/dd　■時間 Time  hh:mm～
  ■映画名称 Movie  （字）XXXXXXX
  */
  var obj = new Object()

  obj.buy_num = body.match(/Confirmation Number\s*(\d{4})/)[1]
  obj.theater = fetchData(body, '■映画館 Theater', '<br>').trim().split(/\s+/)[0]
  obj.title = fetchData(body,'■映画名称 Movie', '<br>').trim().replace(/\/ [A-Za-z]+/, '')
  
  var date = fetchData(body, '■上映日 Date', '<br>')
  var date_arg = date.match(/\d+\/\d+\/\d+/)
  var start_time = date.split('■時間 Time')[1].match(/\d{2}:+\d{2}/)
  obj.start = new Date(date_arg + ' ' + start_time)
  obj.end = new Date(+obj.start + 120*60*1000)

  return obj
}

function getUnitedData(body) {
  /*
  ●作品・劇場・時間
  劇場：XXXXX
  作品名：XXXXXXX
  鑑賞日：yyyy/mm/dd（金）
  上映時間：hh:mm～hh:mm
  */
  var obj = new Object()
  
  var theater_place = fetchData(body, '劇場：', '<br>')
  obj.theater = 'ユナイテッド・シネマ' + theater_place
  obj.buy_num = body.match(/【(\d{4})】/)[1]

  obj.title = fetchData(body,'作品名：', '<br>')
  var date = fetchData(body, '鑑賞日：', '<br>')
  var date_arg = date.match(/\d+\/\d+\/\d+/)
  var time = fetchData(body, '上映時間：', '<br>')
  var start_time = time.split('～')[0]
  var end_time = time.split('～')[1]

  obj.start = new Date(date_arg + ' ' + start_time)
  obj.end = new Date(date_arg + ' ' + end_time)
  
  return obj
}

function fetchData(str, pre, suf) {
  var reg = new RegExp(pre + '.*?' + suf)
  var data = str.match(reg)[0]
                .replace(pre, '')
                .replace(suf, '')
                .replace('</span>','')
  return data
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
