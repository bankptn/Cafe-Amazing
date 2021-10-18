
var ROW_NUMBER = 5;

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}


$(document).ready( function () {

    /* create datepicker */
    $("#txt_ReceiptDate").datepicker({ 
        dateFormat: 'dd/mm/yy' 
    });
    
    $('#btn_ReceiptDate').click(function() {
        $('#txt_ReceiptDate').datepicker('show');
    });

    /* table add delete row */
    var $TABLE = $('#div_table');
    $('.table-add').click(function () {
        var $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide table-line');
        $TABLE.find('tbody').append($clone);
        re_order_no();
    });

    $('.table-remove').click(function () {
        $(this).parents('tr').detach();

        if ($('#table_main tr').length <= 9) {
            $('.table-add').click();
        }
        re_order_no();
        re_calculate_total_received();
    });

    $('#txt_CustomerCode').change (function () {
        var club_id = $(this).val().trim();

        $.ajax({
            url:  '/customer/detail/' + club_id,
            type:  'get',
            dataType:  'json',
            success: function  (data) {
                $('#txt_CustomerCode').val(data.customers.club_id);
                $('#txt_CustomerName').val(data.customers.first_name);
            },
            error: function (xhr, status, error) {
                $('#txt_CustomerName').val('');
            }
        });
    });

    $('#txt_EmployeeCode').change (function () {
        var user_id = $(this).val().trim();

        $.ajax({
            url:  '/employee/detail/' + user_id,
            type:  'get',
            dataType:  'json',
            success: function  (data) {
                $('#txt_EmployeeCode').val(data.employees.user_id);
                $('#txt_EmployeeName').val(data.employees.employee_first_name);
            },
            error: function (xhr, status, error) {
                $('#txt_EmployeeName').val('');
            }
        });
    });

    $('#txt_PaymentMethod').change (function () {
        var payment_method = $(this).val().trim();

        $.ajax({
            url:  '/payment/detail/' + payment_method,
            type:  'get',
            dataType:  'json',
            success: function  (data) {
                $('#txt_PaymentMethod').val(data.payments.code);
                $('#txt_PaymentName').val(data.payments.name);
            },
            error: function (xhr, status, error) {
                $('#txt_PaymentName').val('');
            }
        });
    });

    /* search invoice no  */
    $('.search_invoice_no').click(function () {
        $p_code = $(this).parents('td').children('span').html();
        $(this).parents('tr').find('.order_no').html('*');

        $.ajax({
            url:  '/invoice/list',
            type:  'get',
            dataType:  'json',
            success: function  (data) {
                let rows =  '';
                var i = 1;
                data.invoices.forEach(invoice => {
                    rows += `
                    <tr class="d-flex">
                        <td class='col-1'>${i++}</td>
                        <td class='col-3'><a class='a_click' href='#'>${invoice.invoice_no}</a></td>
                        <td class='col-5'>${invoice.invoice_date}</td>
                        <td class='col-3'>${invoice.club_id_id}</td>
                        <td class='hide'>${invoice.amount_due}</td>
                        <td class='hide'>${invoice.total}</td>
                        <td class='hide'>${invoice.tax}</td>
                    </tr>`;
                });
                $('#table_modal > tbody').html(rows);

                $('#model_header_1').text('Invoice No');
                $('#model_header_2').text('Invoice Date');
                $('#model_header_3').text('Note');
            },
        });
        // open popup
        $('#txt_modal_param').val('invoice_no');
        $('#modal_form').modal();
    });

    $('.search_customer_code').click(function () {
        $.ajax({
            url:  '/customer/list',
            type:  'get',
            dataType:  'json',
            success: function  (data) {
                let rows =  '';
                var i = 1;
                data.customers.forEach(customer => {
                    rows += `
                    <tr class="d-flex">
                        <td class='col-1'>${i++}</td>
                        <td class='col-3'><a class='a_click' href='#'>${customer.club_id}</a></td>
                        <td class='col-5'>${customer.first_name}</td>
                        <td class='col-3'></td>
                        <td class='hide'></td>
                    </tr>`;
                });
                $('#table_modal > tbody').html(rows);

                $('#model_header_1').text('Club ID');
                $('#model_header_2').text('Customer Name');
                $('#model_header_3').text('Note');

            },
        });        
        // open popup
        $('#txt_modal_param').val('club_id');
        $('#modal_form').modal();
    });

    $('.search_employee_code').click(function () {
        $.ajax({
            url:  '/employee/list',
            type:  'get',
            dataType:  'json',
            success: function  (data) {
                let rows =  '';
                var i = 1;
                data.employees.forEach(employee => {
                    rows += `
                    <tr class="d-flex">
                        <td class='col-1'>${i++}</td>
                        <td class='col-3'><a class='a_click' href='#'>${employee.user_id}</a></td>
                        <td class='col-5'>${employee.employee_first_name}</td>
                        <td class='col-3'></td>
                        <td class='hide'></td>
                    </tr>`;
                });
                $('#table_modal > tbody').html(rows);

                $('#model_header_1').text('User ID');
                $('#model_header_2').text('Employee Name');
                $('#model_header_3').text('Note');

            },
        });        
        // open popup
        $('#txt_modal_param').val('user_id');
        $('#modal_form').modal();
    });

    $('.search_payment_reference').click(function () {
        $.ajax({
            url:  '/payment/list',
            type:  'get',
            dataType:  'json',
            success: function  (data) {
                let rows =  '';
                var i = 1;
                data.payments.forEach(payment_method => {
                    rows += `
                    <tr class="d-flex">
                        <td class='col-1'>${i++}</td>
                        <td class='col-3'><a class='a_click' href='#'>${payment_method.code}</a></td>
                        <td class='col-5'>${payment_method.name}</td>
                        <td class='col-3'></td>
                        <td class='hide'></td>
                    </tr>`;
                });
                $('#table_modal > tbody').html(rows);

                $('#model_header_1').text('Payment Code');
                $('#model_header_2').text('Payment Method');
                $('#model_header_3').text('Note');

            },
        });        
        // open popup
        $('#txt_modal_param').val('payment_method');
        $('#modal_form').modal();
    });

    $('table').on('focusin', 'td[contenteditable]', function() {
        $(this).data('val', $(this).html());
    }).on('input', 'td[contenteditable]', function() {
        //re_calculate_total_received();
    }).on('keypress', 'td[contenteditable]', function (e) {
        if (e.keyCode == 13) {
            return false;
        }
    }).on('focusout', 'td[contenteditable]', function() {
        var prev = $(this).data('val');
        var data = $(this).html();
        if (!numberRegex.test(data)) {
            $(this).text(prev);
        } else {
            $(this).data('val', $(this).html());
        }
        re_calculate_total_received();
    });

    // return from modal (popup)
    $('body').on('click', 'a.a_click', function() {
        //console.log($(this).parents('tr').html());
        //console.log($(this).parents('tr').find('td:nth-child(1)').html());
        var code = $(this).parents('tr').find('td:nth-child(2)').children().html();
        var name = $(this).parents('tr').find('td:nth-child(3)').html();
        var note = $(this).parents('tr').find('td:nth-child(4)').html();
        var method = $(this).parents('tr').find('td:nth-child(5)').html();
        var ref = $(this).parents('tr').find('td:nth-child(6)').html();
        var received = $(this).parents('tr').find('td:nth-child(7)').html();
        var remark = $(this).parents('tr').find('td:nth-child(8)').html();
        var op = $(this).parents('tr').find('td:nth-child(9)').html();

        if ($('#txt_modal_param').val() == 'invoice_no') {
            $("#table_main tbody tr").each(function() {
                if ($(this).find('.order_no').html() == '*') {
                    $(this).find('.invoice_no_1 > span').html(code);
                    $(this).find('.invoice_date').html(name);
                    $(this).find('.invoice_full_amount').html(method);
                    $(this).find('.change').html('0.00');
                    $(this).find('.amount_paid').html('0.00');
                    $(this).find('.point').html('0');
                    $(this).find('.payment_reference').html(ref);
                }
            });
            
            re_calculate_total_received();
        } else if ($('#txt_modal_param').val() == 'club_id') {
            $('#txt_CustomerCode').val(code);
            $('#txt_CustomerName').val(name);
        } else if ($('#txt_modal_param').val() == 'user_id') {
            $('#txt_EmployeeCode').val(code);
            $('#txt_EmployeeName').val(name);
        } else if ($('#txt_modal_param').val() == 'payment_method') {
            $('#txt_PaymentMethod').val(code);
            $('#txt_PaymentMethod').val(name);
            $('#txt_PaymentReference').val(note);
        } else if ($('#txt_modal_param').val() == 'receipt_no') {
            $('#txt_ReceiptNo').val(code);
            $('#txt_ReceiptDate').val(name);
            $('#txt_CustomerCode').val(note);
            $('#txt_CustomerCode').change();
            $('#txt_EmployeeCode').val(method);
            $('#txt_EmployeeCode').change();
            $('#txt_PaymentMethod').val(ref);
            //$('#txt_PaymentMethod').change();
            $('#txt_PaymentReference').val(received);
            $('#txt_TotalReceived').val(remark);
            $('#txt_Remarks').val(op);
            
            get_receipt_detail(code);
        }

        $('#modal_form').modal('toggle');
    });

    // detect modal close form
    $('#modal_form').on('hidden.bs.modal', function () {
        re_order_no();
    });

    //disable_ui();
    reset_form();

    re_order_no();
    re_calculate_total_received();

    $('#btnNew').click(function () {
        reset_form();

        re_order_no();
        re_calculate_total_received();
    });
    $('#btnEdit').click(function () {
        $.ajax({
            url:  '/receipt/list',
            type:  'get',
            dataType:  'json',
            success: function  (data) {
                let rows =  '';
                var i = 1;
                data.receipts.forEach(receipt => {
                    var receipt_date = receipt.receipt_date;
                    receipt_date = receipt_date.slice(0,10).split('-').reverse().join('/');
                    rows += `
                    <tr class="d-flex">
                        <td class='col-1'>${i++}</td>
                        <td class='col-3'><a class='a_click' href='#'>${receipt.receipt_no}</a></td>
                        <td class='col-5'>${receipt_date}</td>
                        <td class='col-3'>${receipt.club_id_id}</td>
                        <td class='hide'>${receipt.user_id_id}</td>
                        <td class='hide'>${receipt.payment_method}</td>
                        <td class='hide'>${receipt.payment_reference}</td>
                        <td class='hide'>${receipt.total_received}</td>
                        <td class='hide'>${receipt.remarks}</td>
                    </tr>`;
                });
                $('#table_modal > tbody').html(rows);

                $('#model_header_1').text('Receipt No');
                $('#model_header_2').text('Receipt Date');
                $('#model_header_3').text('Club ID');
            },
        });        
        // open popup
        $('#txt_modal_param').val('receipt_no');
        $('#modal_form').modal();        
    });
    $('#btnSave').click(function () {

        var club_id = $('#txt_CustomerName').val().trim();
        if (club_id == '') {
            alert('กรุณาระบุ Customer');
            $('#txt_CustomerCode').focus();
            return false;
        }
        var user_id = $('#txt_EmployeeName').val().trim();
        if (user_id == '') {
            alert('กรุณาระบุ Employee');
            $('#txt_EmployeeCode').focus();
            return false;
        }
        var receipt_date = $('#txt_ReceiptDate').val().trim();
        if (!dateRegex.test(receipt_date)) {
            alert('กรุณาระบุวันที่ ให้ถูกต้อง');
            $('#txt_ReceiptDate').focus();
            return false;
        }
        var payment_method = $('#txt_PaymentMethod').val().trim();
        if (payment_method == '') {
            alert('กรุณาระบุ Payment Method');
            $('#txt_PaymentMethod').focus();
            return false;
        }
        var total_received = $('#txt_TotalReceived').val().trim();
        if (total_received == '') {
            alert('กรุณาระบุ Total Received');
            $('#txt_TotalReceived').focus();
            return false;
        }
        var remarks = $('#txt_Remarks').val().trim();
        if (remarks == '') {
            alert('กรุณาระบุ Remarks');
            $('#txt_Remarks').focus();
            return false;
        }
        if ($('#txt_ReceiptNo').val() == '<new>') {
            var token = $('[name=csrfmiddlewaretoken]').val();
                  
            $.ajax({
                url:  '/receipt/create',
                type:  'post',
                data: $('#form_receipt').serialize() + "&lineitem=" +lineitem_to_json(),
                headers: { "X-CSRFToken": token },
                dataType:  'json',
                success: function  (data) {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        $('#txt_ReceiptNo').val(data.receipt.receipt_no)
                        alert('บันทึกสำเร็จ');
                    }                    
                },
            });  
        } else {
            var token = $('[name=csrfmiddlewaretoken]').val();
            console.log($('#form_receipt').serialize());
            console.log(lineitem_to_json());
            $.ajax({
                url:  '/receipt/update/' + $('#txt_ReceiptNo').val(),
                type:  'post',
                data: $('#form_receipt').serialize() + "&lineitem=" +lineitem_to_json(),
                headers: { "X-CSRFToken": token },
                dataType:  'json',
                success: function  (data) {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        alert('บันทึกสำเร็จ');
                    }
                },
            }); 
        }
        
    });

    $('#btnDelete').click(function () {
        if ($('#txt_ReceiptNo').val() == '<new>') {
            alert ('ไม่สามารถลบ Receipt ใหม่ได้');
            return false;
        }
        if (confirm ("คุณต้องการลบ Receipt No : '" + $('#txt_ReceiptNo').val() + "' ")) {
            console.log('Delete ' + $('#txt_ReceiptNo').val());
            var token = $('[name=csrfmiddlewaretoken]').val();
            $.ajax({
                url:  '/receipt/delete/' + $('#txt_ReceiptNo').val(),
                type:  'post',
                headers: { "X-CSRFToken": token },
                dataType:  'json',
                success: function  (data) {
                    reset_form();
                },
            });            
        }
    });
    $('#btnPdf').click(function () {
        if ($('#txt_ReceiptNo').val() == '<new>') {
            alert ('กรุณาระบุ Receipt No');
            return false;
        }
        window.open('/receipt/pdf/' + $('#txt_ReceiptNo').val());
    });
    $('#btnPrint').click(function () {
        window.open('/receipt/report');
    });

});

function lineitem_to_json () {
    var rows = [];
    var i = 0;
    $("#table_main tbody tr").each(function(index) {
        if ($(this).find('.invoice_no_1 > span').html() != '') {
            rows[i] = {};
            rows[i]["lineitem"] = (i+1);
            rows[i]["invoice_no"] = $(this).find('.invoice_no_1 > span').html();
            rows[i]["invoice_date"] = $(this).find('.invoice_date').html();
            rows[i]["invoice_full_amount"] = $(this).find('.invoice_full_amount').html();
            rows[i]["change"] = $(this).find('.change').html();
            rows[i]["amount_paid"] = $(this).find('.amount_paid').html();
            rows[i]["point"] = $(this).find('.point').html();
            i++;
        }
    });
    var obj = {};
    obj.lineitem = rows;
    //console.log(JSON.stringify(obj));

    return JSON.stringify(obj);
}

function get_receipt_detail (receipt_no) {
    $.ajax({
        url:  '/receipt/detail/' + encodeURIComponent(receipt_no),
        type:  'get',
        dataType:  'json',
        success: function  (data) {
            //console.log(data.receiptlineitem.length);

            reset_table();
            for(var i=ROW_NUMBER;i<data.receiptlineitem.length;i++) {
                $('.table-add').click();
            }
            var i = 0;
            $("#table_main tbody tr").each(function() {
                if (i < data.receiptlineitem.length) {
                    $(this).find('.invoice_no_1 > span').html(data.receiptlineitem[i].invoice_no);
                    $(this).find('.invoice_date').html(data.receiptlineitem[i].invoice_no__date);
                    $(this).find('.invoice_full_amount').html(data.receiptlineitem[i].invoice_no__amount_due);
                    $(this).find('.change').html(data.receiptlineitem[i].change);
                    $(this).find('.amount_paid').html(data.receiptlineitem[i].amount_paid);
                    $(this).find('.point').html(data.receiptlineitem[i].point);
                }
                i++;
            });
            re_calculate_total_received();
        },
    });
}

function re_calculate_total_received () {
    var total_received = 0;
    $("#table_main tbody tr").each(function() {

        var invoice_no = $(this).find('.invoice_no_1 > span').html();
        //console.log (invoice_no);
        var invoice_full_amount = $(this).find('.invoice_full_amount').html();
        $(this).find('.invoice_full_amount').html(((invoice_full_amount)));
        var amount_paid = $(this).find('.amount_paid').html();
        $(this).find('.amount_paid').html(((amount_paid)));

        if (invoice_no != '') {
            //     var change = amount_paid - invoice_full_amount
            // $(this).find('.change').html(formatNumber(change));
                var point = invoice_full_amount 
            $(this).find('.point').html(formatNumber(point));
            amount_paid = parseFloat(amount_paid);
            total_received += amount_paid;
        }
    });

    $('#lbl_TotalReceived').text(formatNumber(total_received));
    $('#txt_TotalReceived').val($('#lbl_TotalReceived').text());
    // $('#lbl_Change').text(formatNumber(change));
    // $('#txt_Change').val($('#lbl_Change').text());
}

function reset_form() {
    $('#txt_ReceiptNo').attr("disabled", "disabled");
    $('#txt_ReceiptNo').val('<new>');

    reset_table();
    
    $('#txt_ReceiptDate').val(new Date().toJSON().slice(0,10).split('-').reverse().join('/'));

    $('#txt_CustomerCode').val('');
    $('#txt_CustomerName').val('');

    $('#txt_PaymentMethod').val('');
    $('#txt_PaymentReference').val('');

    $('#txt_TotalReceived').val('');
    $('#txt_Remarks').val('');

    $('#lbl_TotalReceived').text('0.00');
    $('#lbl_Change').text('0.00');
    $('#lbl_PointReceived').text('0');
}

function reset_table() {
    $('#table_main > tbody').html('');
    for(var i=1; i<= ROW_NUMBER; i++) {
        $('.table-add').click();
    }    
}

function re_order_no () {
    var i = 1;
    $("#table_main tbody tr").each(function() {
        $(this).find('.order_no').html(i);
        i++;
    });
}


function disable_ui () {
    $('#txt_ReceiptDate').attr("disabled", "disabled");
    $('#btn_ReceiptDate').attr("disabled", "disabled");
}

function enable_ui () {
    $('#txt_ReceiptDate').removeAttr("disabled");
    $('#btn_ReceiptDate').removeAttr("disabled");
}



function formatNumber (num) {
    if (num === '') return '';
    num = parseFloat(num); 
    return num.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}

var dateRegex = /^(?=\d)(?:(?:31(?!.(?:0?[2469]|11))|(?:30|29)(?!.0?2)|29(?=.0?2.(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))(?:\x20|$))|(?:2[0-8]|1\d|0?[1-9]))([-.\/])(?:1[012]|0?[1-9])\1(?:1[6-9]|[2-9]\d)?\d\d(?:(?=\x20\d)\x20|$))?(((0?[1-9]|1[012])(:[0-5]\d){0,2}(\x20[AP]M))|([01]\d|2[0-3])(:[0-5]\d){1,2})?$/;
//var numberRegex = /^-?\d+\.?\d*$/;
var numberRegex = /^-?\d*\.?\d*$/


