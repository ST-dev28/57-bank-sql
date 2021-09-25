const helpers = {};

helpers.Capitalize = async (str) => {
    return str[0].toUpperCase() + str.slice(1);
};

/*helpers.formatDate = async (date) => {
    const d = new Date(date);
    const dformat = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-');
    return dformat;
}
helpers.formatTime = async (time) => {
    const t = new Date(time);
    const tformat = [d.getHours(), d.getMinutes() + 1, d.getSeconds()].join(':');
    return tformat;
}*/

helpers.fullDate = async (date) => {
    const dt = new Date(date);
    const fullDate = ([dt.getFullYear(), dt.getMonth() + 1, dt.getDate()].join('-')) + ' ' + ([dt.getHours(), dt.getMinutes() + 1, dt.getSeconds()].join(':'));
    return fullDate;
}

module.exports = helpers;