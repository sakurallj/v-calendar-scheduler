<template>
  <section class="v-cal-content">
    <div class="v-cal-weekdays">
      <div class="v-cal-weekday-item">{{ activeDate.format('ddd DD/MM') }}</div>
    </div>
    <div class="v-cal-days">
      <div class="v-cal-times">
        <div class="v-cal-hour" :class="{ 'is-now': time.isSame(now, 'hour') }" v-for="time in times">
          {{ time | formatTime(use12) }}
        </div>
      </div>
      <div class="v-cal-days__wrapper">
        <div class="v-cal-day v-cal-day--day" :class="{ 'is-today': day.isToday }" v-if="day !== null">
          <div class="v-cal-day__hour-block"
               @click="timeClicked({ date: day.d.toDate(), time: time.hour() })"
               :class="[ time.isSame(now, 'hour') ? 'is-now' : '', hourClass ]"
               v-for="time in day.availableTimes"></div>
          <event-item
            v-for="event, index in day.events"
            :key="index"
            :event="event"
            :use12="use12">
          </event-item>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import moment from 'moment';
  import {EventBus} from '../EventBus';
  import EventItem from '../EventItem';
  import IsView from '../mixins/IsView';
  import ShowsTimes from '../mixins/ShowsTimes';
  import {calculateEventPosition} from '../CalculateEventPosition';

  export default {
    name: "day",
    mixins: [IsView, ShowsTimes],
    components: {EventItem},
    data() {
      return {
        day: null
      }
    },
    mounted() {
      this.buildCalendar();
    },
    methods: {
      timeClicked(data) {
        EventBus.$emit('time-clicked', data)
      },
      buildCalendar() {
        let now = moment();
        const today = moment(this.activeDate);
        this.day = {
          d: today,
          isPast: today.isBefore(now, 'day'),
          isToday: today.isSame(now, 'day'),
          availableTimes: this.times,
          events: calculateEventPosition(this.events, 0, 23, 10)
        };
        console.log("buildCalendar", this.day);
      }
    }
  }
</script>

<style scoped>

</style>
