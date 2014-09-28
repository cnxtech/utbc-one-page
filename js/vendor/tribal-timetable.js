// 
// This work by http://twitter.com/Ben_Lowe of http://www.triballabs.net is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 2.0 UK: England & Wales License.
// http://creativecommons.org/licenses/by-nc-sa/2.0/uk/ 
//
$(function () {
    $('.js-timetable').resize(function (e) {
        $(this).resizeTimetable();
    });
    $(document).ready(function (e) {
        $('.js-timetable').each(function (e) {
            $(this).initialiseTT();
            $(this).resizeTimetable();
        });
    });

    $.fn.initialiseTT = function () {
        var daysArr = new Array(new Array(), new Array(), new Array(), new Array(), new Array(), new Array(), new Array());

        // create array to determine and calcuate position of clashing events
        jQuery('.event', this).each(function (i) {
            $(this).attr('rel', 'tooltip');
            $(this).attr('title', $(this).html().replace('<br/>', '\n'));

            $(this).attr('unselectable', 'on')
               .css({
                   '-moz-user-select': 'none',
                   '-webkit-user-select': 'none',
                   'user-select': 'none',
                   '-ms-user-select': 'none'
               })
               .each(function () {
                   this.onselectstart = function () { return false; };
               });

            var placed = false;
            var dayInt = parseInt($(this).data('day'));

            for (i = 0; i < daysArr[dayInt].length; i++) {
                // if nothing in column then add it in
                if (daysArr[dayInt][i].length == 0) {
                    daysArr[dayInt][i].push(new Array($(this).data('id'), $(this).data('start'), $(this).data('duration'), $(this).getHiddenDimensions(false).height));
                    $(this).data('column', i);
                    placed = true;
                }
                else {
                    // check last end time in column and see if it overlaps
                    var lastEv = daysArr[$(this).data('day')][i].last();

                    if (lastEv[1] + lastEv[2] <= $(this).data('start')) {
                        daysArr[dayInt][i].push(new Array($(this).data('id'), $(this).data('start'), $(this).data('duration'), $(this).getHiddenDimensions(false).height));
                        $(this).data('column', i);
                        placed = true;
                    }
                }
            }
            // if not placed then add a new column
            if (!placed) {
                daysArr[dayInt].push(new Array(new Array($(this).data('id'), $(this).data('start'), $(this).data('duration'), $(this).getHiddenDimensions(false).height)));
                $(this).data('column', daysArr[dayInt].length - 1);
            }
        });

        // work out the required heights of each column
        // loop through each day
        for (i = 0; i < daysArr.length; i++) {
            //loop through each column
            for (j = 0; j < daysArr[i].length; j++) {
                var maxHeight = 0;
                // loop through each event
                for (k = 0; k < daysArr[i][j].length; k++) {
                    if (daysArr[i][j][k][3] > maxHeight) {
                        maxHeight = daysArr[i][j][k][3];
                    }
                }
                daysArr[i][j].push(maxHeight);
            }
        }

        //loop again through events to set their heights and top offset
        jQuery('.event', this).each(function (i) {
            $(this).height(daysArr[$(this).data('day')][$(this).data('column')].last());

            var top = 0;
            for (i = 0; i < $(this).data('column'); i++) {
                top += daysArr[$(this).data('day')][i].last() + 10;
            }
            $(this).data('top', top);
        });

        var options = {
          html: true
        };
        jQuery("[rel=tooltip]", this).tooltip(options);
        jQuery('.js-timetable', this).tooltip(options);

        jQuery('.day', this).each(function (i) {
            var height = 0;
            for (j = 0; j < daysArr[i].length; j++) {
                height += daysArr[i][j].last() + 10;
            }
            if (height > 0) {
                $(this).height(height - 5);
            }
        });
    }

    $.fn.resizeTimetable = function () {
        var tt = this;
        // reset day widths to allow for day names changing based on screen width
        jQuery('.day', this).width('auto');
        jQuery('.day', this).css('margin-right', 0);

        var ttDaysExtras = parseInt(jQuery('.days', this).css('border-left-width')) + parseInt(jQuery('.days', this).css('border-right-width')) + parseInt(jQuery('.days', this).css('padding-left')) + parseInt(jQuery('.days', this).css('padding-right'));

        // have to float left to get width correctly in IE8 and below
        jQuery('.days', this).css('float', 'left');
        var daysWidth = jQuery('.days', this).width() + ttDaysExtras;  // + border
        jQuery('.days', this).css('width', daysWidth + 'px');
        jQuery('.days', this).css('float', '');
        var temp = jQuery('.days', this).getHiddenDimensions();
        jQuery('.times', this).css('padding-left', daysWidth);

        var ttTimesExtras = parseInt(jQuery('.times', this).css('border-top-width')) + parseInt(jQuery('.times', this).css('border-bottom-width')) + parseInt(jQuery('.times', this).css('padding-top')) + parseInt(jQuery('.times', this).css('padding-bottom'));
        var ttTimeExtras = parseInt(jQuery('.time', this).last().css('padding-bottom')) + parseInt(jQuery('.time', this).last().css('padding-top'));
        var tempWidth = jQuery('.time', this).last().width();
        jQuery('.time', this).last().width(0);
        var timesHeight = jQuery('.times', this).height() + ttTimesExtras; // + border
        jQuery('.time', this).last().width(tempWidth);

        jQuery('.days', this).css('top', (timesHeight) + 'px');

        $(this).height((timesHeight + jQuery('.days', this).height()) + 'px');

        jQuery('.events', this).css('left', daysWidth);
        jQuery('.events', this).css('top', timesHeight);
        /* check why different between height and width - times/days */
        var ttWidth = $(this).width();
        var width = $(this).width() - jQuery('.days', this).width() - ttDaysExtras;
        var height = $(this).height();
        var hours = $(this).data('hours');
        var hourWidth = Math.floor(width / hours);
        var timeWidth = hourWidth - parseInt(jQuery('.time', this).first().css('padding-left')) - parseInt(jQuery('.time', this).first().css('padding-right')) - parseInt(jQuery('.time', this).first().css('border-left-width')) - parseInt(jQuery('.time', this).first().css('border-right-width'));
        var widthLeft = width;
        var timeHeight = height - ttTimesExtras - ttTimeExtras;
        var timeMarginBottom = -1 * timeHeight;
        var maxDayWidth = 0;
        var dayHeights = new Array();
        var dayYOffset = new Array();

        // set sizes of the times
        jQuery('.time', this).each(function (i) {
            if (i < hours - 1) {
                $(this).width(timeWidth);
                $(this).height(timeHeight);
                $(this).css('margin-bottom', timeMarginBottom);
                widthLeft -= hourWidth;
            }
            else {
                $(this).width(widthLeft - parseInt($(this).css('padding-left')) - parseInt($(this).css('padding-right')) - parseInt($(this).css('border-left-width')) - parseInt($(this).css('border-right-width')));
            }
        });

        // set day sizes
        jQuery('.day', this).each(function (i) {
            var dayWidth = ttWidth - ttDaysExtras - parseInt($(this).css('padding-left')) - parseInt($(this).css('padding-right'));
            $(this).width(dayWidth);
            $(this).css('margin-right', -1 * width);
            dayHeights[i] = $(this).height() + 11;
            if (i == 0) {
                dayYOffset[i] = 0;
            }
            else {
                dayYOffset[i] = dayYOffset[i - 1] + dayHeights[i - 1];
            }
        });

        jQuery('.event', this).each(function (i) {
            var eventStart = $(this).data('start') * hourWidth;
            var eventWidth = Math.max($(this).data('duration') * hourWidth - 9, 1);
            var eventDay = $(this).data('day');

            $(this).css('top', dayYOffset[eventDay] + $(this).data('top'));
            $(this).css('left', eventStart);
            $(this).width(eventWidth);
        });

        return false;
    };
});

