function getDmmData(splitedBody) {
/*
【DMM英会話】レッスン予約完了のお知らせ

講師名：xxxxx
講師Skype名：xxxxx
ご予約日：yyyy年mm月dd日
開始時間：hh時mm分
*/
  var obj = new Object()
  obj.title = 'DMM英会話'
  
  for (var k = 0; k < splitedBody.length; k++) {
    var str = splitedBody[k]
    
    if (str.match(/講師名/)){
      obj.teacher_name = str.match(/講師名：([\s\.0-9a-zA-Z]+)/)[1]
      Logger.log('+++++ 講師名 ' + obj.teacher_name)
    }
    
    if (str.match(/Skype名/)){
      obj.skype_name = str.match(/Skype名：([\s\.:0-9a-zA-Z]+)/)[1]
      Logger.log('+++++ skype名 ' + obj.skype_name)
    }
     
    if (str.match(/ご予約日/)) {
      var date = str.match(/(\d+)年+(\d+)月+(\d+)日/)
      var date_arg = date[1] + "/" + date[2] + "/" + date[3] 
      Logger.log('+++++ date ' + date_arg)
    }
    
    if (str.match(/開始時間/)){
      var time = str.match(/(\d+)時+(\d+)分/)
      Logger.log('+++++ time ' + time[1] + ':' + time[2])
    }
    
    if (date_arg !=null && time !=null) {
      obj.start = new Date(date_arg + ' ' + time[1] + ':' + time[2])
      obj.end = new Date(+obj.start + 25*60*1000)
    }
  }
  return obj
}