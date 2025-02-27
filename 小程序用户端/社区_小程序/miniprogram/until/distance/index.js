/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*                                                                                                */
/*  Simple node js module to get distance between two coordinates.                                */
/*                                                                                                */
/*  Code transformed from Chris Veness example code - please refer to his website for licensing   */
/*  questions.                                                                                    */
/*                                                                                                */
/*                                                                                                */
/*  Latitude/longitude spherical geodesy formulae & scripts (c) Chris Veness 2002-2011            */
/*   - www.movable-type.co.uk/scripts/latlong.html                                                */
/*                                                                                                */
/*                                                                                                */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */



/** Converts numeric degrees to radians */
if(typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function () {
        return this * Math.PI / 180;
    }
}

// start and end are objects with latitude and longitude
//decimals (default 2) is number of decimals in the output
//return is distance in kilometers.
exports.getDistance = function(start, end, decimals) {
    decimals = decimals || 2;
    var earthRadius = 6371; // km
    let lat1 = parseFloat(start.latitude);
    let lat2 = parseFloat(end.latitude);
    let lon1 = parseFloat(start.longitude);
    let lon2 = parseFloat(end.longitude);

    var dLat = (lat2 - lat1).toRad();
    var dLon = (lon2 - lon1).toRad();
    lat1 = lat1.toRad();
    lat2 = lat2.toRad();

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = earthRadius * c;
    return Math.round(d * Math.pow(10, decimals)) / Math.pow(10, decimals);
};