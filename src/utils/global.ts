// Validation functions
function zeroReturnNull(value: any) {
    if (value == 0) {
        return null;
    }
    return value;
}

function convertToInteger(value: any) {
    const intValue = parseInt(value, 10);
    return isNaN(intValue) ? value : intValue;
}

function removeComma(value: any) {
    if (value.toString().includes(',')) {
        value = value.replaceAll(',', '');
    }
    return value;
}

function commaZeroCheck(value: any) {
    value = removeComma(value);
    value = zeroReturnNull(value);
    if (value !== null) {
        value = convertToInteger(value);
    }
    return value;
}

function isValidUrl(value: string): boolean {
    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (err) {
        return false;
    }
}

function isBeforeDate (dateString:any) {
    const cutoffDate = new Date(dateString);
    const currentDate = new Date();

    if(dateString) {
        return currentDate < cutoffDate;
    } else {
        return currentDate
    }
}

function formateDateTime(date:any) {
    new Date(date).toISOString().slice(0, 19).replace('T', ' ')
}

export default {
    zeroReturnNull,
    removeComma,
    commaZeroCheck,
    isValidUrl,
    isBeforeDate
};
