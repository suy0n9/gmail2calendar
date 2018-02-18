/*
●作品・劇場・時間
劇場：としまえん
作品名：XXXXXXX
鑑賞日：2018/01/19（金）
上映時間：21:30～23:35
（レイトショー）
スクリーン：Screen9
*/



function main() {
  var label = 'movie'
  var threads = GmailApp.getUserLabelByName(label).getThreads()
  
  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages()
    for (var j = 0; j < messages.length; j++) {
      var body = messages[j].getBody()
      
      var buy_num = fetchData(body, 'お客さまの購入番号は', '<br>')
      var title = fetchData(body,'作品名：', '<br>')
      var date = fetchData(body, '鑑賞日：', '<br>')
      var time = fetchData(body, '上映時間：', '<br>')
      
      var date_arg = date.match(/\d+\/\d+\/\d+/)
      var start_time = time.split('～')[0]
      var end_time = time.split('～')[1]
      //var THEATER. Use the variable defined in config.gs
      
      createEvent(title, date_arg, start_time, end_time, buy_num, THEATER)
    }
    var thread = threads[i]
    //thread.removeLabel(GmailApp.getUserLabelByName(label))
  }
}

function fetchData(str, pre, suf) {
  var reg = new RegExp(pre + '.*?' + suf)
  var data = str.match(reg)[0]
  
  if (data.match(/お客さまの購入番号は/)) {
    var data = data.replace(suf, '')
    return data
  } else {
    var data = data.replace(pre, '')
                   .replace(suf, '')
    return data
  }
}

function createEvent(title, date_arg, start_time, end_time, text, THEATER) {
  //var calendarId.  Use the variable defined in config.gs
  var start = new Date(date_arg + ' ' + start_time)
  var end = new Date(date_arg + ' ' + end_time)
  var event = {
    summary: title,
    location: THEATER,
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
