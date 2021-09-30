
export function getDate(UNIX_timestamp) {        
    const date = new Date(parseInt(UNIX_timestamp)).toLocaleDateString('es-CO', { timeZone: 'America/Bogota'});
    const d = date.split("/")[0];
    const m = date.split("/")[1]; 
    const y = date.split("/")[2];
    return new Date(`${y}-${m}-${d}`).toISOString().slice(0,10);
}

export function convertTime12to24(time12h) {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes, seconds] = time.split(':');

    if (hours === '12') {
        hours = '00';
    }
    if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}:${seconds}`;
}
    
export function getHour(UNIX_timestamp) {  
    const time12h = new Date(parseInt(UNIX_timestamp)).toLocaleTimeString('es-CO', { timeZone: 'America/Bogota'});
    return convertTime12to24(time12h);
}
