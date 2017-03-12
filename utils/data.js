//考虑到iOS的兼容性，对日期格式做特殊处理
var monthAbbr = {
    '1': 'Jan',
    '2': 'Feb',
    '3': 'Mar',
    '4': 'Apr',
    '5': 'May',
    '6': 'Jun',
    '7': 'Jul',
    '8': 'Aug',
    '9': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec'
};

//日期转转换成星期
var weekAbbr = {
    "0": "周日",
    "1": "周一",
    "2": "周二",
    "3": "周三",
    "4": "周四",
    "5": "周五",
    "6": "周六",
}

//处理小时和分钟的格式，转化为类似'23:02'的格式
var hourMinute = function( hour, minute ) {
    hour = parseInt( hour );
    minute = parseInt( minute );
    hour = hour < 10 ? '0' + hour : hour;
    minute = minute < 10 ? '0' + minute : minute;
    return hour + ':' + minute;
};

//根据字符串('20510513')获取年月日
var strpTime = function( date ) {
    var dateString = date ? date.toString() : '';
    var month = parseInt( dateString.substring( 4, 6 ) );
    return {
        year: dateString.substring( 0, 4 ),
        month: month,
        monthAbbr: monthAbbr[ month ],
        day: parseInt( dateString.substring( 6 ) )
    };
};

//处理后端数据，得到年月日(小时分钟)
var getApiTime = function( date ) {
    var dateString = date ? date.toString() : '';
    var apiTime;

    //如果返回的是类似'20150512'的格式
    if( dateString.length === 8 ) {
        apiTime = strpTime( dateString );
    }
    //如果返回的是类似'2015-05-12 23:20'的格式
    if( dateString.length === 16 && dateString.indexOf( '-' ) !== -1 ) {
        var reg = /-/g;
        var apitimeArray = dateString.replace( reg, '' ).split( ' ' ); //['20150513', '23:20']
        apiTime = strpTime( apitimeArray[ 0 ] );
        apiTime.hourMinute = apitimeArray[ 1 ];
    }
    //如果返回的是类似'2015-05-12 23:20:20'的格式
    if( dateString.length === 19 && dateString.indexOf( '-' ) !== -1 ) {
        var reg = /-/g;
        var apitimeArray = dateString.replace( reg, '' ).split( ' ' ); //['20150513', '23:20:30']
        apiTime = strpTime( apitimeArray[ 0 ] );
        apiTime.hourMinute = apitimeArray[ 1 ].split( ':' )[ 0 ] + ':' + apitimeArray[ 1 ].split( ':' )[ 1 ];
    }
    return apiTime;
};

//获取当前时间
var getCurrentTime = function() {
    var now = new Date();
    var hourminute = hourMinute( now.getHours(), now.getMinutes() );

    return {
        year: now.getFullYear(),
        monthAbbr: monthAbbr[ parseInt( now.getMonth() + 1 ) ],
        day: parseInt( now.getDate() ),
        hourMinute: hourminute
    };
};

//将日期格式转化为iOS系统可识别的格式，比如'Apr 23 2015 00:00'或者'Apr 23 2015 23:20'
var timeCompareKey = function( time ) {
    if( !time.hourMinute ) {
        time.hourMinute = '00:00';
    }
    return [ time.monthAbbr, time.day, time.year, time.hourMinute ].join( ' ' );
};

//转化为同一格式之后，开始比较当前时间与后端返回时间的时间差
var timeDifference = function( apiTime, currentTime ) {
    return Date.parse( apiTime ) - Date.parse( currentTime );
};

//根据时间差，得到相对时间，判断是否为今天、明天、后天
var getRelativeDate = function( date ) {

    var relativeDate;

    var apiTime = timeCompareKey( strpTime( date ) ).substring( 0, 11 );
    var currentTime = timeCompareKey( getCurrentTime() ).substring( 0, 11 );

    var timedifference = timeDifference( apiTime, currentTime );

    var oneDay = 24 * 60 * 60 * 1000;
    var twoDays = 2 * oneDay;

    switch( timedifference ) {
        case 0:
            relativeDate = '今天';
            break;
        case oneDay:
            relativeDate = '明天';
            break;
        case twoDays:
            relativeDate = '后天';
            break;
        default:
            relativeDate = '';
    }
    return relativeDate;
};

//将后端数据('20150423')转化为'年月日'的格式，比如'2015年4月23日'
var displayApiDate = function( date ) {
    var strptime = strpTime( date );

    var year = strptime.year + '-'; //2015年

    var endDate = new Date();
    endDate.setDate( endDate.getDate() + 6 );

    var weekDate = new Date( strptime.year + "/" + strptime.month + "/" + strptime.day );
    var week = weekDate <= endDate ? weekAbbr[ weekDate.getDay() ] : "";

    var month = strptime.month + '-' + strptime.day;
    var monthDay = week != "" ? ' ' + month + ' ' : month; //(4月23日)

    return {
        fullDate: year + monthDay,
        year: year,
        monthDay: monthDay,
        week: week
    };
};

//形成最终页面展示日期
var formateDate = function( date ) {
    var displayDate;
    var prefix = getRelativeDate( date ); //得到今天、明天、后天、''的一个

    var displayapidate = displayApiDate( date );
    var fullDate = displayapidate.fullDate;
    var monthDay = displayapidate.monthDay;
    var week = displayapidate.week;

    //如果前缀为'',那么展示年份，否则，展示对应的相对日期（今天、明天、后天）
    if( prefix ) {
        displayDate = prefix + ' ' + monthDay + '';
    } else {
        if( week )
            displayDate = week + " " + monthDay + ' ';
        else
            displayDate = fullDate + ' ';
    }
    return displayDate;
};

var scheduleDates = function( sche ) {
    if( !sche ) return null;

    var result = {};
    var dates = Object.keys( sche );

    for( var index = 0;index < dates.length;index++ ) {
        var date = dates[ index ];
        result[ date ] = formateDate( date );
    }
    return result;
};


//排期页散场时间计算
var finishTime = function( beginTime, longTime ) {

    var beginHours = parseInt( beginTime.split( ":" )[ 0 ] ); //开场小时数
    var beginMinutes = parseInt( beginTime.split( ":" )[ 1 ] ); //开场分钟数
    var longHours = parseInt( longTime / 60 ); //电影时长小时数
    var longMinutes = longTime - longHours * 60; //电影时长分钟数

    //根据开场时间以及电影时长，计算散场时间
    var totalHours = beginHours + longHours;
    var totalMinutes = beginMinutes + longMinutes;

    if( totalMinutes >= 60 ) {
        totalMinutes = totalMinutes - 60;
        totalHours = totalHours + 1;
    }
    if( totalHours >= 24 ) {
        totalHours = totalHours - 24;
    }

    var overTime = hourMinute( totalHours, totalMinutes );
    return overTime;

};

//获取每场排期信息
var getSeatData = function( seat ) {
    //根据开场时间和影片时长计算散场时间
    var beginTime = seat.time;
    var longTime = ( seat.overtime ).match( /\d+/g )[ 0 ];
    seat.finishTime = finishTime( beginTime, longTime );

    //排序字段
    seat.orderTime = parseInt( beginTime.split( ':' )[ 0 ] ) * 100 + parseInt( beginTime.split( ':' )[ 1 ] );

    //跳转链接
    //seat.url = [
    //    seat.mpid,
    //    seat.ticketid,
    //    seat.hallno,
    //    seat.biscinemano
    //].join('/');

    //ticketid参数去掉了
    seat.url = [
        seat.mpid,
        seat.hallno,
        seat.biscinemano
    ].join( '/' );


    return seat;
};

//得到单日所有类型排期数据
var getAllTypeSches = function( oneDaySches ) {
    var allTypeSches = [];
    for( var i = 0;i < oneDaySches.length;i++ ) {
        var eachTypeSeats = oneDaySches[ i ].seat_info;
        if( eachTypeSeats.length !== 0 ) {
            for( var j = 0;j < eachTypeSeats.length;j++ ) {
                var seat = getSeatData( eachTypeSeats[ j ] );
                //完善数据
                seat.type = oneDaySches[ i ].type;
                seat.lagu = oneDaySches[ i ].lagu;
                allTypeSches.push( seat );
            }
        }
    }
    return allTypeSches;
};


var sortByOrderTime = function( a, b ) {
    return a.orderTime - b.orderTime;
};

//按照开场时间，对单日所有类型排期数据进行排序
var sortAllTypeSches = function( allTypeSches ) {
    allTypeSches.sort( sortByOrderTime );
    return allTypeSches;
};

//获取所有日期已经排序过的排期信息
var getAllDaySches = function( sches ) {
    var allDaySches = {};
    var oneDaySortSches = [];
    var apiDate = Object.keys( sches ); //['20150512', '20150513']
    if( apiDate.length !== 0 ) {
        for( var i = 0;i < apiDate.length;i++ ) {
            var displayDate = formateDate( apiDate[ i ] );
            var oneDaySches = sches[ apiDate[ i ] ];
            if( oneDaySches.length !== 0 ) {
                var allTypeSches = getAllTypeSches( oneDaySches );
                oneDaySortSches = sortAllTypeSches( allTypeSches );
            }
            var wholeDate = apiDate[ i ] + ' ' + displayDate;
            allDaySches[ wholeDate ] = oneDaySortSches;

        }
    }
    return allDaySches;
};


//订单页判断订单是否已过期
var orderExpired = function( date ) {
    if( date == '' )
        return 0;

    var expired;

    //处理后端返回的时间
    var dateString = date.toString();
    var apitime = getApiTime( dateString );
    var expiredTime = timeCompareKey( apitime ); //'May 13 2015 23:20'

    //获取当前时间作为是否过期的基准
    var currentTime = getCurrentTime();
    var baseTime = timeCompareKey( currentTime );

    //1表示没有过期，0表示已经过期
    if( Date.parse( expiredTime ) > Date.parse( baseTime ) > 0 ) {
        expired = 1;
    } else {
        expired = 0;
    }

    return expired;
};

// 加密和解密
var smartKeys = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@*$%^_',
    keysLen = smartKeys.length;
var encryptSmartKey = function( str ) {
    var _str = str,
        strLen = _str.length,
        str0 = _str.substr( 0, 2 ),
        str1 = _str.substr( 2, 6 ),
        str2 = _str.substr( 8, 8 ),
        str3 = _str.substr( 16, 6 ),
        str4 = _str.substr( 22, strLen - 22 );
    temporaryStr = getString( 6 ) + str0 + getString( 4 ) + str1 + getString( 6 ) + str2 + getString( 3 ) + str3 + getString( 5 ) + str4 + getString( 9 ) + '_smart_123';
    return temporaryStr;
}

var decryptedSmartKey = function( str ) {
    var _str = str,
        len = _str.length, str0 = str1 = str2 = str3 = str4 = '';
    _str = _str.replace( _str.substr( len - 9, len ), '' );
    _str = _str.replace( _str.substr( 0, 6 ), '' );
    str0 = _str.substr( 0, 2 );
    _str = _str.replace( str0, '' );
    _str = _str.replace( _str.substr( 0, 4 ), '' );
    str1 = _str.substr( 0, 6 );
    _str = _str.replace( str1, '' );
    _str = _str.replace( _str.substr( 0, 6 ), '' );
    str2 = _str.substr( 0, 8 );
    _str = _str.replace( str2, '' );
    _str = _str.replace( _str.substr( 0, 3 ), '' );
    str3 = _str.substr( 0, 6 );
    _str = _str.replace( str3, '' );
    _str = _str.replace( _str.substr( 0, 5 ), '' );
    str4 = _str;
    var temporaryStr = str0 + str1 + str2 + str3 + str4;
    return temporaryStr;
}
var getString = function( num ) {
    var str = '';
    for( var i = 0;i < num;i++ ) {
        var _num = Math.round( keysLen * Math.random() );
        if( _num == keysLen ) {
            _num = keysLen - 1;
        }
        str += smartKeys.charAt( _num );
    }
    return str;
}

module.exports = {
    getAllDaySches: getAllDaySches,
    orderExpired: orderExpired,
    formateDate: formateDate,
    scheduleDates: scheduleDates,
    encryptSmartKey: encryptSmartKey,
    decryptedSmartKey: decryptedSmartKey
}