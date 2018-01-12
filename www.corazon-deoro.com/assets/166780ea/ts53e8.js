// local scopes 
(function() {
    Tchat = function(json, debug, currentCity, showExitAlert) {
        this.currentCity = currentCity;
        this.debug = debug;
        this.data = json;
        this.seerName = 'Corazon de Oro';
        this.id = '#reader';
        this.timeForLetter = ( debug ) ? 0 : 60;
        this.minTimeoutWrite = ( debug ) ? 0 : 3000;
        this.maxTimeoutWrite = ( debug ) ? 0 : 6000;
        this.timeAfterTxt = ( debug ) ? 0 : 1000;

        this.nbData = 0;
        this.ended = false;
        
        this.firstName = null;
        this.dob = null;
        this.gender = null;
        this.email = null;
        
        this.md5 = null;
        this.successUrl = '';

        this.subscribeAttempt = 0;

        this.init( showExitAlert );
    };
    
    Tchat.prototype.createNewLine = function( text ) {
        var $line = $('<div>', {
            'class' : 'line'
        });
        
        var $profile = $('<div>', {
            'class' : 'imgProfile'
        });
        var $img = $('<img>', {
            'src' : '/images/profile.jpg',
            'class' : 'img-responsive'
        });
        $profile.html( $img );
        
        
        var $txt = $('<div>', {
            'class' : 'text'
        });
        $txt.append( text );
        
        $line.append( $profile ).append( $txt );
        $(this.id).append( $line );
        
        $(this.id).scrollTop($(this.id)[0].scrollHeight);
    };

    Tchat.prototype.createNewLineUser = function( text ) {
        var $line = $('<div>', {
            'class' : 'line'
        });
        
        var $txt = $('<div>', {
            'class' : 'text-user'
        });
        $txt.append( text );
        
        $line.append( $txt );
        $(this.id).append( $line );
        
        $(this.id).scrollTop($(this.id)[0].scrollHeight);
    };
    
    Tchat.prototype.showIsTyping = function() {
        if( $('#isTyping').length > 0 ) {
            $('#isTyping').remove();
        }
        
        var $line = $('<div>', {
            'class' : 'line-typing',
            'id' : 'isTyping'
        });
        
        var $profile = $('<div>', {
            'class' : 'imgProfile'
        });
        var $img = $('<img>', {
            'src' : '/images/profile.jpg',
            'class' : 'img-responsive'
        });
        $profile.html( $img );
        
        var $txtI = $('<div>', {
            'class' : 'textTyping'
        });
        $txtI.append( this.seerName+' está escribiendo' );
        
        var $txt = $('<div>', {
            'class' : 'textTypingGif'
        });
        $txt.append( '<img src="/images/points.gif" />' );
        
        $line.append( $profile ).append( $txtI ).append( $txt );
        $(this.id).append( $line );
        
        $(this.id).scrollTop($(this.id)[0].scrollHeight);
    };
    
    Tchat.prototype.hideIsTyping = function() {
        $('#isTyping').remove();
    };

    Tchat.prototype.init = function( showExitAlert ) {
        if (this.data.length <= 0) {
            return alert('no data found');
        }

        if( typeof(showExitAlert) == 'undefined' ) {
//            showExitAlert = true;
            showExitAlert = false;
        }
        
        var T = this;

        T.showIsTyping();
        
        if (this.data.length > this.nbData) {
            this.createNewLine( this.data[ this.nbData ] );
            this.nbData++;
        }
        
        $('body').on("contextmenu",function(){
            return false;
        }); 
            
        this.next();

        if( showExitAlert ) {
            $(window).bind('beforeunload', function () {
                if (!T.ended) {
                    return "Atención de esta página, perderá el acceso a su horóscopo gratis!";
                }
            });
        }
    };

    Tchat.prototype.next = function() {
        if (this.data.length > this.nbData) {
            var T = this;

            if (this.data[ this.nbData ] == '') {
                T.next();
            }
            else {
                this.add(this.data[ this.nbData ]).done(function() {
                    T.nbData++;
                    window.setTimeout(function() {
                        T.next();
                    }, T.timeAfterTxt);
                });
            }
        }
        else {
            this.ended = true;
            window.location.href = this.successUrl;
        }
    };

    Tchat.prototype.add = function(txt) {
        var D = new jQuery.Deferred();
        var T = this;

        if (txt.toLowerCase() == '{askfirstname}') {
            $('#divFirstname').css('display', 'block');
            $('#sendFirstname').on('click', function(e) {
                if ($('#firstname').val() == '') {
                    alert('Por favor, introduzca su nombre de pila');
                    return e.preventDefault();
                }
                $('#divFirstname').css('display', 'none');
                var f = String($('#firstname').val());
                T.firstName = f.charAt(0).toUpperCase() + f.substr(1);
                
                T.createNewLineUser( T.firstName );
                
                D.resolve();
            });
        }
        else if (txt.toLowerCase() == '{askemail}') {
            $('#divEmail').css('display', 'block');
            $('#sendEmail').on('click', function(e) {
                if ($('#email').val() == '') {
                    alert('Por favor, introduzca su dirección de e-mail');
                    return e.preventDefault();
                }

                T.verifyEmail( $('#email').val() ).done( function( newEmail ) {
                    T.email = newEmail;
                    T.subscribe().done( function() {
                        $('#divEmail').css('display', 'none');

                        T.createNewLineUser( T.email );

                        D.resolve();
                    } );
                });
            });
        }
        else if (txt.toLowerCase() == '{askdob}') {
            $('#divDob').css('display', 'block');
            $('#sendDob').on('click', function(e) {
                if ($('#day').val() == '' || $('#month').val() == '' || $('#year').val() == '') {
                    alert('Ingrese su fecha de nacimiento, por favor');
                    return e.preventDefault();
                }
                
                T.dob = $('#day').val()+'/'+$('#month').val()+'/'+$('#year').val();
                $('#divDob').css('display', 'none');
                
                T.createNewLineUser( T.dob );
                
                D.resolve();
            });
        }
        else if (txt.toLowerCase() == '{askgender}') {
            $('#divGender').css('display', 'block');
            $('#sendGender').on('click', function(e) {
                var textGender = $('#gender').find(":selected").text();
                var valGender = $('#gender').find(":selected").val();

                if (valGender == '') {
                    alert('Por favor seleccione su género');
                    return e.preventDefault();
                }
                
                T.gender = valGender;
                $('#divGender').css('display', 'none');

                T.createNewLineUser( textGender );
                D.resolve();
            });
        }
        else if (txt.toLowerCase() == '{cta}') {
            $('.chat-cta').css( 'display', 'block' );
            D.resolve();
        }
        else if (txt.toLowerCase() == '{pause}') {
            if( T.debug ) {
                D.resolve();
            }
            else {
                window.setTimeout( function() {
                    D.resolve();
                }, 1000 );
            }
        }
        else {
            T.showIsTyping();
            
            txt = txt.replace('{firstname}', T.firstName);
            txt = txt.replace('{city}', T.currentCity);

            var timer = txt.length * this.timeForLetter;
            if (timer < this.minTimeoutWrite) {
                timer = this.minTimeoutWrite;
            }
            else if( timer > this.maxTimeoutWrite ) {
                timer = this.maxTimeoutWrite;
            }

            window.setTimeout(function() {
                T.hideIsTyping();
                
                T.createNewLine( txt );
                
                D.resolve();
            }, timer);
        }

        return D.promise();
    };
    
    Tchat.prototype.subscribe = function() {
        var D = new jQuery.Deferred();
        var T = this;
        var idC = $('#idC').val();
        var subId = $('#subId').val();

        $('#sendEmail').attr('disabled', true);

        $.ajax({
            dataType: 'json',
            url: '/tchat-simule/subscribe'+window.location.search,
            type: 'POST',
            data: 'email='+T.email+'&firstName='+T.firstName+'&dob='+T.dob+'&gender='+T.gender+'&idC='+idC+'&subId='+subId+'&attempt='+T.subscribeAttempt,
            success: function(res) {
                if( res.error ) {

                    $('#sendEmail').attr('disabled', false);

                    T.subscribeAttempt++;

                    alert( res.data );
                    D.reject(res.data);
                }
                else {
                    T.md5 = res.data.md5;
                    T.successUrl = res.data.url;

                    $('#trackingPixel').html( res.data.pixel );

                    D.resolve(res.data);
                }
            }
        });

        return D.promise();
    };
    
    Tchat.prototype.verifyEmail = function( email ) {
        var D = new jQuery.Deferred();
        var T = this;
        
        $.ajax({
            dataType: 'json',
            url: '/tchat-simule/check-email',
            type: 'POST',
            data: 'email='+email,
            success: function(res) {
                if ($.type(res) === 'object') {
                    if (res.error) {
                        var Dial = new Dialog('verifyEmail', true);
                        Dial.changeContent( '<div class="modal-header"><h4 class="modal-title" id="myModalLabel">Gracias por verificar tu dirección de correo electrónico</h4></div><div class="modal-body" style="text-align :center;">'+res.data+'</div><div class="modal-footer"><button type="button" class="btn btn-success btnVerifyEmail">Validar</button></div>', function() {
                            $('.btnVerifyEmail').on( 'click', function(e) {
                                if( $('.inputVerifyEmail').length > 0 ) {
                                    var newEmail = $( "input[name=newEmail]:checked" ).val();
                                    if( newEmail != '' ) {
                                        D.resolve( newEmail );
                                        Dial.close();
                                    }
                                }
                                else {
                                    Dial.close();
                                }
                            });
                        });
                    }
                    else {
                        D.resolve( res.data );
                    }
                }
            }
        });
        
        return D.promise();
    };
    
    
})();

