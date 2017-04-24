const TIPS = [
  '请不要留下单独空座', // 右
  '请不要留下单独空座', // 左
  '请不要留下单独空座',
  '请不要留下单独空座',
  '为避免留空，已关联取消了右侧座位',
  '为避免留空，已关联取消了左侧座位'
]

function checkSeatPolicy(target, context, xCoord, yCoord) {
  let seats = context.data.seats;
  let row = seats[xCoord];

  if (!row) return; // not a avail seat

  let current = row[yCoord]
  let currentInd = row.indexOf(current)
  console.log('seat index', currentInd);

  let left_1 = row[currentInd - 1];
  // left_1 = isSeat(left_1) && left_1;
  let left_2 = left_1 && row[currentInd - 2];
  let left_3 = left_2 && row[currentInd - 3];

  let right_1 = row[currentInd + 1];
  // right_1 = isSeat(right_1) && right_1;
  let right_2 = right_1 && row[currentInd + 2];
  let right_3 = right_2 && row[currentInd + 3];

  return isAvailable(current) ?
    onSelect(left_1, left_2, left_3, right_1, right_2, right_3, context) :
    (onUnselect(left_1, left_2, left_3, right_1, right_2, right_3, context) || true);
}

function onSelect(left_1, left_2, left_3, right_1, right_2, right_3, context) {
  // 9.16修改连选座位时，左1或右1可选座并且左2或右2为锁座并且在排的中间时不可选
  if ((isChecked(left_1) && !right_2) || (isChecked(right_1) && !left_2)) {
    return true;
  }
  // 边缘座位
  if (!left_1 || !right_1) {
    // 左+1为边缘
    if (!left_1 && isAvailable(right_1) && isChecked(right_2)) {
      // 右+1为可选，右+2为（自已）已选，右+1连带选上
      console.log('左+1为边缘 ');
      wx.showModal({
           content: TIPS[1],
           showCancel: false,
        })

      return false;
    }

    // 右+1为边缘
    if (!right_1 && isAvailable(left_1) && isChecked(left_2)) {
      // 左+1为可选，左+2为（自已）已选，左+1连带选上
      console.log('右+1为边缘');
      wx.showModal({
           content: TIPS[1],
           showCancel: false,
        })

      return false;
    }
  }

  // 左+1或右+1为不可选

  // 左+1不可选
  if (!isAvailable(left_1)) {
    console.log('左+1不可选');
    if (isChecked(left_1) && (!right_2 || isUnavailable(right_2)) && isAvailable(right_1)) {
      // 左+1为已选座位并且（右+2是）
      // 9.17 修改连选座位时，修改连选3个座位后，在中间只有两个座位时第4个座位不能选
      // 10.12 修改中间座位只剩4个座位时可以从左或从右依次连选1、2、3和4个位；当中间座位只剩3个座位时，可以从左或从右依次连选1、2和3个位
      if (left_2 && left_3 && isAvailable(right_1)) {
        // 10.15 当在中间只剩3个座且左1为已卖，左2为可选，修改了从左往右选座到第2个座时选不了
        if (isUnavailable(left_2)) {
          if (!(isUnavailable(left_2) && isUnavailable(right_2))) {
            wx.showModal({
               content: TIPS[1],
               showCancel: false,
            })
            return 0;
          }

          return true;
        } else if (isAvailable(left_2)) {
          wx.showModal({
           content: TIPS[1],
           showCancel: false,
        })
          return 0;
        }

        return true;
      }
      // 10.15 当在中间只剩4个座且左1为已卖，左2为可选，修改了从左往右选座到第3个座时选不了
      if (isUnavailable(left_3)) {
        if (!(isUnavailable(left_3) && isUnavailable(right_2))) {
          wx.showModal({
           content: TIPS[1],
           showCancel: false,
        })
          return false;
        }

        return true;
      } else if (isAvailable(left_3)) {
        wx.showModal({
           content: TIPS[1],
           showCancel: false,
        })
        return false;
      }
    }
  } else if (isAvailable(right_1) && isChecked(right_2)) {
    
    wx.showModal({
           content: TIPS[1],
           showCancel: false,
        })
    return false;
  }

  // 右+1不可选
  if (!isAvailable(right_1)) {
    if (isChecked(right_1) && (!left_2 || isUnavailable(left_2)) && isAvailable(left_1)) {
      // 9.17 修改连选座位时，修改连选3个座位后，在中间只有两个座位时第4个座位不能选
      // 10.12 修改中间座位只剩4个座位时可以从左或从右依次连选1、2、3和4个位；当中间座位只剩3个座位时，可以从左或从右依次连选1、2和3个位
      if (!right_3 && isAvailable(left_1)) {
        // 10.15 当在中间只剩3个座且右1为已卖，右2为可选，修改了从右往左选座到第2个座时选不了
        if (isUnavailable(right_2)) {
          if (!(isUnavailable(right_2) && isUnavailable(left_2))) {
           
            wx.showModal({
           content: TIPS[1],
           showCancel: false,
        })
            return false;
          }

          return true;
        } else if (isAvailable(right_2)) {
          
          wx.showModal({
           content: TIPS[1],
           showCancel: false,
        })
          return false;
        }

        // 10.15 当在中间只剩4个座且右1为已卖，右2为可选，修改了从右往左选座到第3个座时选不了
        if (isUnavailable(right_3)) {
          if (!(isUnavailable(right_3) && isUnavailable(left_2))) {
            wx.showModal({
           content: TIPS[0],
           showCancel: false,
        })
            return false;
          }

          return true;
        } else if (isAvailable(right_3)) {
          wx.showModal({
           content: TIPS[0],
           showCancel: false,
        })
          return false;
        }
      }
    } else if (isAvailable(left_1) && isChecked(left_2)) {
      wx.showModal({
           content: TIPS[1],
           showCancel: false,
        })
      return false;
    }
  }

  // 左+1和右+1都可选
  if (isAvailable(left_1) && isAvailable(right_1)) {
    if (isAvailable(left_2) && isAvailable(right_2)) {

      return true;

    } else if (isChecked(left_2) && isChecked(right_2)) {

      wx.showModal({
           content: TIPS[1],
           showCancel: false,
        })
      return false;

    } else if (isUnavailable(left_2)) {

      // 左+2为边缘或不是可选状态
      // toast.show({ message: isChecked(right_2) ? TIPS[0] : TIPS[1] });
      wx.showModal({
           content: TIPS[1],
           showCancel: false,
        })
      return false;

    } else if (!right_2 || !isAvailable(right_2)) {
      // 右+2为边缘或不是可选状态
      // toast.show({ message: (isChecked(left_2) ? TIPS[0] : TIPS[1]) });
      wx.showModal({
           content: TIPS[4],
           showCancel: false,
        })
      return false;

    } else {
      wx.showModal({
           content: TIPS[1],
           showCancel: false,
        })
      return false;
    }
  }

  return true;
}

function onUnselect(left_1, left_2, left_3, right_1, right_2, right_3, context) {
  let { toggleSeat} = context
  console.log('unselect');
  if ((!left_1 || !isAvailable(left_1)) && (!right_1 || !isAvailable(right_1))) {
    console.log('两边不为可选');
    // 两边不为可选
    if (isChecked(left_1) && isChecked(right_1)) {
      // 左边已选,右边已选
      console.log('左边已选,右边已选');
      if (isAvailable(right_2)) {
        // 右边+2为可选
        console.log('右边+2为可选');
        if (!right_3 || isAvailable(right_3)) {
          // 右边+3有人或者为边缘
          console.log('右边+3有人或者为边缘');
          if (isChecked(right_1)) {
            // 右+1为被（自己）选中状态，所带的这些属性都为真，连带取消

            console.log('右+1为被（自己）选中状态，所带的这些属性都为真，连带取消');
            wx.showModal({
           content: TIPS[4],
           showCancel: false,
        })

            right_1 && toggleSeat(right_1.row, right_1.n)

            return false;

          }
        } else if (isChecked(left_2)) {
          // 左+2为被（自己）选中状态
          console.log('左+2为被（自己）选中状态');

          if (isChecked(right_1)) {
            // 右+1为被（自己）选中状态，所带的这些属性都为真，连带取消
            console.log('右+1为被（自己）选中状态，所带的这些属性都为真，连带取消');

            wx.showModal({
           content: TIPS[4],
           showCancel: false,
        })
            right_1 && toggleSeat(right_1.row, right_1.n);

            return false;
          }
        } else {
          if (isUnavailable(left_2)) {
            // 左2为不可选
            console.log('左2为不可选');
            if (isChecked(right_1)) {

              // 右+1为被（自己）选中状态，所带的这些属性都为真，连带取消
              console.log('右+1为被（自己）选中状态，所带的这些属性都为真，连带取消');
              wx.showModal({
           content: TIPS[4],
           showCancel: false,
        })
              right_1 && right_1.isSeat && toggleSeat(right_1.row, right_1.n);

              return false;
            }
          } else if (isUnavailable(right_2)) {
            // 右2为不可选
            console.log('右2为不可选');

            if (isChecked(left_1)) {

              // 左+1为被（自己）选中状态，所带的这些属性都为真，连带取消
              console.log('左+1为被（自己）选中状态，所带的这些属性都为真，连带取消');

              wx.showModal({
           content: TIPS[4],
           showCancel: false,
        })
              left_1 && left_1.isSeat && toggleSeat(left_1.row, left_1.n);

              return false;
            }
          } else if (isChecked(left_1)) {
            // 左+1为被（自己）选中状态，所带的这些属性都为真，连带取消
            console.log('左+1为被（自己）选中状态，所带的这些属性都为真，连带取消');
            wx.showModal({
           content: TIPS[4],
           showCancel: false,
        })
            left_1 && left_1.isSeat && toggleSeat(left_1.row, left_1.n)
            return false;
          }
        }
      } else {
        // 右边+2为不可选
        console.log('右边+2为不可选');
        if (isChecked(right_2)) {
          // 右边+2选中时
          console.log('右边+2选中时');
          if (isChecked(left_1)) {
            // 左+1为被（自己）选中状态，所带的这些属性都为真，连带取消
            console.log('左+1为被（自己）选中状态，所带的这些属性都为真，连带取消');
            
            wx.showModal({
           content: TIPS[5],
           showCancel: false,
        })
            left_1 && left_1.isSeat && toggleSeat(left_1.row, left_1.n)
            return false;
          }
        } else if (isChecked(left_2)) {
          // 左边+2选中时
          console.log('左边+2选中时');
          if (isChecked(right_1)) {
            // 右+1为被（自己）选中状态，所带的这些属性都为真，连带取消
            console.log('右+1为被（自己）选中状态，所带的这些属性都为真，连带取消');
            wx.showModal({
               content: TIPS[4],
               showCancel: false,
            })
            right_1 && right_1.isSeat && toggleSeat(right_1.row, right_1.n);
            return false;
          }
        } else {
          // 右边+2选中时
          console.log('右边+2选中时');
          if (isChecked(left_1)) {
            // 左+1为被（自己）选中状态，所带的这些属性都为真，连带取消
            console.log('左+1为被（自己）选中状态，所带的这些属性都为真，连带取消');
            wx.showModal({
               content: TIPS[5],
               showCancel: false,
            })
            left_1 && left_1.isSeat && toggleSeat(left_1.row, left_1.n)
            return false;
          }
        }
      }
    } else if (isChecked(left_1) && (!right_1 || !isAvailable(right_1) || !isChecked(right_1))) {
      console.log('左边已选,右边不可选或者为边缘');
      // 左边已选,右边不可选或者为边缘
      if (isUnavailable(left_2)) {
        return true;
      }
      if (isChecked(left_1)) {
        // 左+1为被（自己）选中状态，所带的这些属性都为真，连带取消
        wx.showModal({
           content: TIPS[5],
           showCancel: false,
        })
        left_1 && left_1.isSeat && toggleSeat(left_1.row, left_1.n)
        return false;
      }
    } else if (isChecked(right_1) && (!left_1 || (!isChecked(left_1) || !isAvailable(left_1_)))) {
      // 右边已选,左边不可选或者为边缘
      console.log('右边已选,左边不可选或者为边缘');
      if (isUnavailable(right_2)) {
        return true;
      }
      if (isChecked(right_1)) {
        // 左+1为被（自己）选中状态，所带的这些属性都为真，连带取消
        wx.showModal({
           content: TIPS[4],
           showCancel: false,
        })
        right_1 && right_1.isSeat && toggleSeat(right_1.row, right_1.n);
        return false;
      }
    } else {
      // console.log(`left_1: ${left_1.className}\n left_1_is_checked: ${isChecked(left_1)}`);
    }
  }

  return true;
}

function isAvailable(seat) {
  return seat && seat.classStatus == 1
}

function isChecked(seat) {
  return seat && seat.classStatus == 3
}

function isUnavailable(seat) {
  return seat && seat.classStatus == 0
}

function isSeat(seat) {
  return seat && seat.classStatus != 2
}

module.exports = {
  check: checkSeatPolicy
}
