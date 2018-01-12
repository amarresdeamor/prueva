/* http://keith-wood.name/countdown.html
   French initialisation for the jQuery countdown extension
   Written by Keith Wood (kbwood{at}iinet.com.au) Jan 2008. */
(function($) {
	$.countdown.regionalOptions['es'] = {
		labels: ['Años', 'Meses', 'Semanas', 'Dias', 'Horas', 'Minutos', 'Segundos'],
		labels1: ['Año', 'Mes', 'Semana', 'día', 'Hora', 'Minuto', 'Segundo'],
		compactLabels: ['a', 'm', 's', 'd'],
		whichLabels: function(amount) {
            return (amount > 1 ? 0 : 1);
        },
		digits: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
		timeSeparator: ':', isRTL: false};
	$.countdown.setDefaults($.countdown.regionalOptions['es']);
})(jQuery);
