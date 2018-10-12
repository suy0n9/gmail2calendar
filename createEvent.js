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
      } else if (subject.indexOf('DMM英会話') >0){
        var result = getDmmData(splitedBody)
      } else {
        return
      }

      var calendar = CalendarApp.getDefaultCalendar()
      var registed_events = calendar.getEvents(result.start, result.end, {search: result.title})
      
      if (registed_events.length == 0) {
        Logger.log('--------------------------')
        Logger.log(result)
        
        if (subject.indexOf('TOHO CINEMAS') >0 || subject.indexOf('ユナイテッド・シネマ グループ') >0){
          Logger.log('movie')
          insertMovieEvent(result)
        } else if (subject.indexOf('DMM英会話') >0){
          insertEnglishEvent(result)
          Logger.log('english')
        }
      } else {
        Logger.log('alredy exist event: ' + result.title)
      }
      
    }
  }
  thread.removeLabel(label)
}

function insertEnglishEvent(result) {
  console.info('=== Start insertEnglishEvent ===')
  
  //var calendarId.  Use the variable defined in config.gs
  var event_data = {
    summary: result.title,
    description: '講師名 ' + result.teacher_name + '\n' + 'Skype名 ' + result.skype_name + '\n' + 'https://eikaiwa.dmm.com/book/book_list/',
    start: {
      dateTime: result.start.toISOString()
    },
    end: {
      dateTime: result.end.toISOString()
    },
    //Flamingo background. Use Calendar.Colors.get() for the full list.
    colorId: 4
  }
  var event = Calendar.Events.insert(event_data, calendarId)

  console.log({message: 'Event registration: ' + result.title, initialData: event_data})
  Logger.log('Event ID: ' + event.getId())
  console.info('=== End insertEnglishEvent ===')
}

function insertMovieEvent(result) {
  console.info('=== Start insertMovieEvent ===')
  
  //var calendarId.  Use the variable defined in config.gs
  var event_data = {
    summary: result.title,
    location: result.theater,
    description: 'Confirmation Number ' + result.buy_num,
    start: {
      dateTime: result.start.toISOString()
    },
    end: {
      dateTime: result.end.toISOString()
    },
    //PURPlE background. Use Calendar.Colors.get() for the full list.
    colorId: 3
  }
  var event = Calendar.Events.insert(event_data, calendarId)

  console.log({message: 'Event registration: ' + result.title, initialData: event_data})
  Logger.log('Event ID: ' + event.getId())
  console.info('=== End insertMovieEvent ===')
}
