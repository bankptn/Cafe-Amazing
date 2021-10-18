Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

    $(document).ready( function () {
        
        $('#signin-btn').click(function () {

            var user_id = $('#txt_Username').val().trim();
            if (user_id == '') {
                alert('กรุณาระบุ User ID');
                $('#txt_Username').focus();
                return false;
            } 
            console.log('sssssssssssssssssssssssssss')
            var password = $('#txt_Password').val().trim();
            if (password == '') {
                alert('กรุณาระบุ Password');
                $('#txt_Password').focus();
                return false;
            }
            
            var token = $('[name=csrfmiddlewaretoken]').val();
 
            $.ajax({
                url:  '/signin/',
                type:  'post',
                data: $('#form_login').serialize(),
                headers: { "X-CSRFToken": token },
                dataType:  'json',
            
                success: function  (data) {
                    console.log(data.logs)
                    if (data.logs.status != 1) {
                        // console.log(token);
                        alert(data.logs.msg);
                        
                    } else {
                        alert("Login successfully!")
                        localStorage.setItem("user_id", user_id);
                        localStorage.removeItem(user_id);
                        window.location.href= "/invoice";
                        console.log(token);
                    } 
                }
            });
        });
    });

