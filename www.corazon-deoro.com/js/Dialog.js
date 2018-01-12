var Dialog = function (css, isModal) {
    this.isInit = false;
    this.is_open = false;
    this.css = typeof (css) != 'undefined' ? css : '';
    this.isModal = typeof (isModal) != 'undefined' ? isModal : false;

    this.name = "WDialog" + Math.round(Math.random() * 100000);
};

Dialog.prototype.init = function () {
    if (this.isInit) {
        return true;
    }

    var dialog = '<div id="' + this.name + '" class="modal fade modal-wide ' + this.css + '" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"></div></div></div>';
    $('body').append(dialog);

    // Remove div after close
    var D = this;
    $('#' + this.name).on('hidden.bs.modal', function (e) {
        //$('#' + this.name + ' .modal-content').remove();
        D.is_open = false;
    });

    this.isInit = true;
};

Dialog.prototype.setOpenCallback = function (fct) {
    if (typeof (fct) !== 'function') {
        return false;
    }

    $('#' + this.name).on('shown.bs.modal', function (e) {
        fct();
    });
};

Dialog.prototype.setCloseCallback = function (fct) {
    if (typeof (fct) !== 'function') {
        return false;
    }

    $('#' + this.name).on('hidden.bs.modal', function (e) {
        fct();
    });
};

Dialog.prototype.close = function () {
    $('#' + this.name).modal('hide');
};

Dialog.prototype.isOpen = function () {
    return this.is_open;
};

Dialog.prototype.open = function (to, callBack) {
    this.init();
    this.is_open = true;

    var Dialog = this;

    $.ajax({
        dataType: 'html',
        url: to
    }).done(function (data) {
        if (data != "") {
            Dialog.changeContent(data, callBack);
        }
    });

    return true;
};

Dialog.prototype.changeContent = function (data, callBack) {
    this.init();
    this.is_open = true;

    if (this.isModal) {
        $('#' + this.name).modal({
            backdrop: 'static'
        });
    }

    $('#' + this.name).modal('show');
    $('#' + this.name + ' .modal-content').html(data);

    if (typeof (callBack) === 'function') {
        callBack(data);
    }
};