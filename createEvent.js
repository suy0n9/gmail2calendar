function main() {
  createEvent('toho', 'TOHO CINEMAS')
  createEvent('united', 'ユナイテッド・シネマ グループ')
}

function createEvent(labelName, keyword) {
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
      
      Logger.log('========')
      Logger.log(result.theater)
      Logger.log(result.buy_num)
      Logger.log(result.title)
      Logger.log('start_time:' + result.start)
      Logger.log('end_time:' + result.end)

      insertEventToCalendar(result.title, result.theater, result.start, result.end, result.buy_num)
    }
    var thread = threads[i]
    thread.removeLabel(GmailApp.getUserLabelByName(label))
  }
}

function getTohoData(body) {
  /*
  ■購入番号 Confirmation Number  1003　(TEL:XXX-XXX-XXX)
  ■映画館 Theater  XXXXX
  ■上映日 Date  2017/12/24　■時間 Time  20:30～
  ■映画名称 Movie  （字）XXXXXXX
  */
  var obj = new Object()

  obj.theater = fetchData(body, '■映画館 Theater', '<br>').trim().split(/\s+/)[0]
  obj.buy_num = fetchData(body, '■購入番号', '<br>')
  obj.title = fetchData(body,'■映画名称 Movie', '<br>').trim()
  
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
  鑑賞日：2018/01/19（金）
  上映時間：21:30～23:35
  */
  var obj = new Object()
  
  var theater_place = fetchData(body, '劇場：', '<br>')
  obj.theater = 'ユナイテッド・シネマ' + theater_place
  obj.buy_num = fetchData(body, 'お客さまの購入番号は', '<br>')
  obj.title = fetchData(body,'作品名：', '<br>')
  var date = fetchData(body, '鑑賞日：', '<br>')
  var time = fetchData(body, '上映時間：', '<br>')
  var date_arg = date.match(/\d+\/\d+\/\d+/)
  var start_time = time.split('～')[0]
  var end_time = time.split('～')[1]

  obj.start = new Date(date_arg + ' ' + start_time)
  obj.end = new Date(date_arg + ' ' + end_time)
  
  return obj
}

function fetchData(str, pre, suf) {
  var reg = new RegExp(pre + '.*?' + suf)
  var data = str.match(reg)[0]
  
  if (data.match(/購入番号/)) {
    var data = data.replace(suf, '')
    return data
  } else {
    var data = data.replace(pre, '')
                   .replace(suf, '')
    return data
  }
}

function insertEventToCalendar(title, theater, start, end, text) {
  //var calendarId.  Use the variable defined in config.gs
  var event = {
    summary: title,
    location: theater,
    description: text,
    start: {
      dateTime: start.toISOString()
    },
    end: {
      dateTime: end.toISOString()
    },
    //PURPlE background. Use Calendar.Colors.get() for the full list.
    colorId: 3
  }
  event = Calendar.Events.insert(event, calendarId)
  Logger.log('Event ID: ' + event.getId())
}
