function getDmmData(splitedBody) {
/*
レッスンの予約が完了しました

XX様、yyyy/mm/dd hh:mmのxxxxとのレッスン予約が完了しました。レッスン開始の数分前にレッスンに参加してください。
*/
  var obj = new Object()
  obj.title = 'DMM英会話'

  Logger.log(splitedBody)

  for (var k = 0; k < splitedBody.length; k++) {
    var str = splitedBody[k]

    // yyyy/mm/dd
    if (str.match(/(\d+)\/(\d+)\/(\d+)/)) {
      var date = str.match(/(\d+)\/(\d+)\/(\d+)/)[0]
      Logger.log('date: ' + date)
    }

    // hh:mm
    if (str.match(/(\d+):(\d+)/)) {
      var start_time = str.match(/(\d+):(\d+)/)[0]
      obj.start = new Date(date + ' ' + start_time)
      obj.end = new Date(+obj.start + 25*60*1000)
      Logger.log('start time: ' + obj.start)
      Logger.log('end time: ' + obj.end)
    }
  }
  return obj
}
