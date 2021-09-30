
function convertTime12to24(time12h) {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes, seconds] = time.split(':');

    if (hours === '12') {
        hours = '00';
    }
    
    if (modifier.split('.')[0] == 'p') {
        hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}:${seconds}`;
}
    
function getHour(UNIX_timestamp) {  
    const time12h = new Date(parseInt(UNIX_timestamp)).toLocaleTimeString('es-CO', { timeZone: 'America/Bogota'});
    return convertTime12to24(time12h);
}

console.log(getHour("1632966903434"));