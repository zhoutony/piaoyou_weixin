/* String */
String.format = function () {
    var args = arguments;
    if (args.length == 0) return "";
    if (args.length == 1) return arguments[0];

    var regex = /{(\d+)?}/g, arg, result;
    if (args[1] instanceof Array) {
        arg = args[1];
        result = args[0].replace(regex, function ($0, $1) {
            return arg[parseInt($1)];
        });
    }
    else {
        arg = args;
        result = args[0].replace(regex, function ($0, $1) {
            return arg[parseInt($1) + 1];
        });
    }
    return result;
};
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function showModal(title, content, callback) {
  wx.showModal({
    title: title,
    content: content,
    success: function (res) {
      if (res.confirm) {
        callback && callback();
      }
    }
  })
}

module.exports = {
  formatTime: formatTime,
  showModal: showModal,
  String: String
}
