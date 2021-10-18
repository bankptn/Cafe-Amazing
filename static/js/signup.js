Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

    $(document).ready( function () {   
        
        $("#txt_Bday").datepicker({ 
            dateFormat: 'dd/mm/yy' 
        });

        $('#btn_BirthDay').click(function() {
            $('#txt_Bday').datepicker('show');
        });

        $('#signup-btn').click(function () {

            var name = $('#txt_Name').val().trim();
            if (name == '') {
                alert('กรุณาระบุ Name');
                $('#txt_Name').focus();
                return false;
            }
            var minit = $('#txt_Minit').val().trim();
            if (minit == '') {
                alert('กรุณาระบุ Minit');
                $('#txt_Minit').focus();
                return false;
            }
            var lastname = $('#txt_LastName').val().trim();
            if (lastname == '') {
                alert('กรุณาระบุ Lastname');
                $('#txt_LastName').focus();
                return false;
            }
            var birth = $('#txt_Bday').val().trim();
            if (!dateRegex.test(birth)) {
                alert('กรุณาระบุวันเกิด ให้ถูกต้อง');
                $('#txt_Bday').focus();
                return false;
            }
            var address = $('#txt_Address').val().trim();
            if (address == '') {
                alert('กรุณาระบุ Address');
                $('#txt_Address').focus();
                return false;
            }
            var tel = $('#txt_Tel').val().trim();
            if (tel == '') {
                alert('กรุณาระบุ Tel');
                $('#txt_Tel').focus();
                return false;
            }
            var tel = $('#txt_Tel').val().trim();
            if (!telRegex.test(tel)) {
                alert('เบอร์โทรศัพท์ของคุณไม่ถูกต้อง');
                $('#txt_Tel').focus();
                return false;
            }
            var mail = $('#txt_Mail').val().trim();
            if (mail == '') {
                alert('กรุณาระบุ E-Mail');
                $('#txt_Mail').focus();
                return false;
            }
            var mail = $('#txt_Mail').val().trim();
            if (!emailRegex.test(mail)) {
                alert('E-mail ของคุณไม่ถูกต้อง!');
                $('#txt_Mail').focus();
                return false;
            }
            var sex = $('#txt_Sex').val().trim();
            if (sex == '') {
                alert('กรุณาระบุ Sex');
                $('#txt_Sex').focus();
                return false;
            }
            
            // if (password == repass) {
            //     var token = $('[name=csrfmiddlewaretoken]').val();
            //     $.ajax({
            //         url:  '/sign-up/create',
            //         type:  'post',
            //         data: $('#form_signup').serialize(),
            //         headers: { "X-CSRFToken": token },
            //         dataType:  'json',
            //         success: function  (data) {
            //             if (data.error) {
            //                 alert(data.error);
            //             } else {
            //                 $('#txt_Username').val(data.signup.username)
            //                 alert('Sign Up สำเร็จ')      
            //             }                    
            //         },
            //     }); 

            
            var token = $('[name=csrfmiddlewaretoken]').val();
            $.ajax({
                url:  '/sign-up/create',
                type:  'post',
                data: $('#form_signup').serialize(),
                headers: { "X-CSRFToken": token },
                dataType:  'json',
                success: function  (data) {
                //     if (data.username == username) {
                //         alert('Username already exists')
                //     } else {
                        if (data.error) {
                            alert(data.error);
                        } else {
                            $('#txt_Username').val(data.signup.username)
                            alert('Sign Up สำเร็จ')
                            window.location.href= "/invoice";      
                        }
                    // }                    
                },
            }); 
            
            
             
        });
        $('#bc').click(function () {
            window.location.href= "/";
        });
        // });
    });


var dateRegex = /^(?=\d)(?:(?:31(?!.(?:0?[2469]|11))|(?:30|29)(?!.0?2)|29(?=.0?2.(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))(?:\x20|$))|(?:2[0-8]|1\d|0?[1-9]))([-.\/])(?:1[012]|0?[1-9])\1(?:1[6-9]|[2-9]\d)?\d\d(?:(?=\x20\d)\x20|$))?(((0?[1-9]|1[012])(:[0-5]\d){0,2}(\x20[AP]M))|([01]\d|2[0-3])(:[0-5]\d){1,2})?$/;
//var numberRegex = /^-?\d+\.?\d*$/;
var numberRegex = /^-?\d*\.?\d*$/

var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

var telRegex = /^[0-9]{10}$/;

var idRegex = /^[0-9]{13}$/;