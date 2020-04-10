import moment from 'moment';

function generateOneColGrids($beginHour, $endHour, gapMinute) {
  let len = Math.ceil(60 / gapMinute), gird = [];
  for (let i = $beginHour; i <= $endHour; i++) {
    for (let j = 0; j < len; j++) {
      if (!!gird[i]) {
        gird[i][j] = [
          {has: false}
        ];
      } else {
        gird[i] = [
          {has: false}
        ];
      }
    }
  }
}

export function calculateEventPosition(events, $beginHour, $endHour, gapMinute) {
  //初始化数组
  let grids = [];
}
