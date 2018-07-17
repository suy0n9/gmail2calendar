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