import moment from 'moment';

function generateOneColGrids(beginHour, endHour, gapMinute) {
  let len = Math.ceil(60 / gapMinute), gird = [];
  for (let i = beginHour; i <= endHour; i++) {
    for (let j = 0; j < len; j++) {
      if (!!gird[i]) {
        gird[i][j] = {has: false};
      } else {
        gird[i] = [
          {has: false}
        ];
      }
    }
  }
  return gird;
}

function randomString(len) {
  len = len || 32;
  let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678oOLl9gqVvUuI1';
  let maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}


export function calculateEventPosition(events, beginHour, endHour, gapMinute) {
  //初始化数组
  let grids = [generateOneColGrids(beginHour, endHour, gapMinute)], posGrids = [], maxIndex = 60 / gapMinute - 1;

  for (let i in events) {
    let event = events[i];
    event.startIndex = Math.floor(event.startTime.minutes() / gapMinute);
    event.startHour = event.startTime.hours();
    event.gap = (event.endTime - event.startTime) / (60 * 1000 * gapMinute);
    event.gridIndexs = [];
    let startHour = event.startHour, startIndex = event.startIndex;
    //计算grid下标
    for (let gI = 0; gI < event.gap; gI++) {
      if (startIndex > maxIndex) {
        startIndex = 0;
        startHour++;
      }
      event.gridIndexs.push({
        hour: startHour,
        index: startIndex
      });
      startIndex++;
    }
    //判断格子是否可以放下
    let can = [];
    for (let gI in  grids) {
      can[gI] = true;//可以放下
      for (let gEI in event.gridIndexs) {
        let index = event.gridIndexs[gEI];
        if (grids[gI][index.hour][index.index].has) {
          can[gI] = false;//不可以放下
        }
      }
      if (can[gI]) {
        break;
      }
    }
    let canGenerateOneColGrids = true, gIndex;
    for (let cI in can) {
      if (can[cI]) {
        gIndex = cI;
        canGenerateOneColGrids = false;
      }
    }
    if (canGenerateOneColGrids) {
      grids.push(generateOneColGrids(beginHour, endHour, gapMinute))
      gIndex = grids.length - 1
    }
    //放置格子
    let eventId = randomString(16);
    for (let gI in event.gridIndexs) {
      let index = event.gridIndexs[gI];
      grids[gIndex][index.hour][index.index].has = true;
      grids[gIndex][index.hour][index.index]._id = eventId;
      posGrids[eventId] = {
        gIndex: parseInt(gIndex),
        event: event,
      }
    }
  }
  //合并格 ，计算每列的 格子的位置 宽高
  let gridWith = 100 / grids.length,//每格的宽度 百分比
    gridHeight = 100 / (grids[0].length * (maxIndex + 1));//每格的高度 百分比

  let list = [];
  for (let pI in posGrids) {
    let posGrid = posGrids[pI];
    posGrid.left = gridWith * posGrid.gIndex;
    posGrid.top = (posGrid.event.startHour * (maxIndex + 1) + posGrid.event.startIndex) * gridHeight;
    posGrid.height = posGrid.event.gap * gridHeight;
    posGrid.width = gridWith;
    posGrid.style = 'left:' + posGrid.left + '%;top:' + posGrid.top
      + '%;height:' + posGrid.height + '%;width:' + posGrid.width + '%';
    list.push(posGrid);

  }
  // console.log(grids)
  // echoTable(grids)
  return list;
}

function echoTable(grids) {
  let str = "";
  for (let si = 0; si < grids[0].length; si++) {
    for (let ci = 0; ci < 6; ci++) {
      for (let i in grids) {
        str += grids[i][si][ci].has + "  ";
      }
      str += "\n";
    }
  }
  console.log(str);

}
