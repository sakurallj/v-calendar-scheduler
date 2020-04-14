import VueScheduler from '../../index';
import '../../lib/main.css';

export default ({
    Vue, // the version of Vue being used in the VuePress app
    options, // the options for the root Vue instance
    router, // the router instance for the app
    siteData // site metadata
}) => {
    Vue.use(VueScheduler, {
        locale: 'es',
        timeRange: [9,23],
        availableViews: ['month','week','day'],
        initialView: 'week',
        use12: true,
        showTimeMarker: true,
        showTodayButton: false
    });
}
