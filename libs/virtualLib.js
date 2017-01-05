function virtualDate() {
    var date = new Date(this.created_at);
    return {
        year : date.getFullYear(),
        month : date.getMonth()+1,
        day : date.getDate()
    };
}

var virtual = {
    virtualDate: virtualDate
};

module.exports = virtual;