function formatDateToJapanese(date){
    if(!date) return '';
    const d = new Date(date);
    return d.toLocaleString('ja-JP',{
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

module.exports = formatDateToJapanese;