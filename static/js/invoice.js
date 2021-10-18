
var ROW_NUMBER = 5;

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}


$(document).ready( function () {

    /* create datepicker */
    $("#txt_InvoiceDate").datepicker({ 
        dateFormat: 'dd/mm/yy' 
    });
    
    $('#btn_InvoiceDate').click(function() {
        $('#txt_InvoiceDate').datepicker('show');
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

        if ($('#table_main tr').length <= 15) {
            $('.table-add').click();
        }
        re_order_no();
        re_calculate_total_price();
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
                $('#txt_PointAmount').val(data.customers.point);
            },
            error: function (xhr, status, error) {
                $('#txt_CustomerName').val('');
                $('#txt_PointAmount').val('');
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


    /* search menu code  */
    $('.search_menu_code').click(function () {
        $p_code = $(this).parents('td').children('span').html();
        $(this).parents('tr').find('.order_no').html('*');

        $.ajax({
            url:  '/product/list',
            type:  'get',
            dataType:  'json',
            success: function  (data) {
                let rows =  '';
                var i = 1;
                data.menus.forEach(menu => {
                    rows += `
                    <tr class="d-flex">
                        <td class='col-1'>${i++}</td>
                        <td class='col-3'><a class='a_click' href='#'>${menu.code}</a></td>
                        <td class='col-5'>${menu.name}</td>
                        <td class='col-3'>${menu.types}</td>
                        <td class='hide'>${menu.price}</td>
                    </tr>`;
                });
                $('#table_modal > tbody').html(rows);

                $('#model_header_1').text('Menu Code');
                $('#model_header_2').text('Menu Name');
                $('#model_header_3').text('Types');
                //$('#model_header_4').text('Note');
            },
        });
        // open popup
        $('#txt_modal_param').val('menu_code');
        $('#modal_form').modal();
    });

    $('.search_club_id').click(function () {
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
                        <td class='col-3'>${customer.point}</td>
                        <td class='hide'></td>
                    </tr>`;
                });
                $('#table_modal > tbody').html(rows);

                $('#model_header_1').text('Club ID');
                $('#model_header_2').text('Customer Name');
                $('#model_header_3').text('Point');

            },
        });        
        // open popup
        $('#txt_modal_param').val('club_id');
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
        // re_calculate_total_price();
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
        re_calculate_total_price();
    });

    // return from modal (popup)
    $('body').on('click', 'a.a_click', function() {
        //console.log($(this).parents('tr').html());
        //console.log($(this).parents('tr').find('td:nth-child(1)').html());
        var code = $(this).parents('tr').find('td:nth-child(2)').children().html();
        var name = $(this).parents('tr').find('td:nth-child(3)').html();
        var note = $(this).parents('tr').find('td:nth-child(4)').html();
        var option = $(this).parents('tr').find('td:nth-child(5)').html();
        var method = $(this).parents('tr').find('td:nth-child(5)').html();
        var ref = $(this).parents('tr').find('td:nth-child(6)').html();

        if ($('#txt_modal_param').val() == 'menu_code') {
            $("#table_main tbody tr").each(function() {
                if ($(this).find('.order_no').html() == '*') {
                    $(this).find('.project_code_1 > span').html(code);
                    $(this).find('.menu_name').html(name);
                    $(this).find('.menu_types').html(note);
                    $(this).find('.unit_price').html(option);
                    $(this).find('.quantity').html("1");
                    $(this).find('.amount_paid').html('0.00');
                }
            });
            
            re_calculate_total_price();
        } else if ($('#txt_modal_param').val() == 'club_id') {
            $('#txt_CustomerCode').val(code);
            $('#txt_CustomerName').val(name);
            $('#txt_PointAmount').val(note);
        } else if ($('#txt_modal_param').val() == 'payment_method') {
            $('#txt_PaymentMethod').val(code);
            $('#txt_PaymentMethod').val(name);
            $('#txt_PaymentReference').val(note);
        } else if ($('#txt_modal_param').val() == 'invoice_no') {
            $('#txt_InvoiceNo').val(code);
            $('#txt_InvoiceDate').val(name);
            $('#txt_CustomerCode').val(note);
            $('#txt_CustomerCode').change();
            $('#txt_PaymentMethod').val(method);
            $('#txt_PaymentMethod').change();
            $('#txt_PaymentReference').val(ref);

            get_invoice_detail(code);
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
    re_calculate_total_price();

    $('#btnNew').click(function () {
        reset_form();

        re_order_no();
        re_calculate_total_price();
    });
    $('#btnEdit').click(function () {
        $.ajax({
            url:  '/invoice/list',
            type:  'get',
            dataType:  'json',
            success: function  (data) {
                let rows =  '';
                var i = 1;
                data.invoices.forEach(invoice => {
                    var invoice_date = invoice.invoice_date;
                    invoice_date = invoice_date.slice(0,10).split('-').reverse().join('/');
                    rows += `
                    <tr class="d-flex">
                        <td class='col-1'>${i++}</td>
                        <td class='col-3'><a class='a_click' href='#'>${invoice.invoice_no}</a></td>
                        <td class='col-5'>${invoice_date}</td>
                        <td class='col-3'>${invoice.club_id_id}</td>
                        <td class='hide'>${invoice.payment_method}</td>
                        <td class='hide'>${invoice.payment_reference}</td>
                        <td class='hide'>${invoice.amount_due}</td>
                        <td class='hide'>${invoice.point_use}</td>
                        <td class='hide'>${invoice.point_to_baht}</td>
                        
                        <td class='hide'></td>
                    </tr>`;
                });
                $('#table_modal > tbody').html(rows);

                $('#model_header_1').text('Invoice No');
                $('#model_header_2').text('Invoice Date');
                $('#model_header_3').text('Customer ID');
            },
        });        
        // open popup
        $('#txt_modal_param').val('invoice_no');
        $('#modal_form').modal();        
    });
    $('#btnSave').click(function () {

        var club_id = $('#txt_CustomerCode').val().trim();
        if (club_id == '') {
            alert('กรุณาระบุ Customer');
            $('#txt_CustomerCode').focus();
            return false;
        }
        var payment_method = $('#txt_PaymentMethod').val().trim();
        if (payment_method == '') {
            alert('กรุณาระบุ Payment Method');
            $('#txt_PaymentMethod').focus();
            return false;
        }
        var invoice_date = $('#txt_InvoiceDate').val().trim();
        if (!dateRegex.test(invoice_date)) {
            alert('กรุณาระบุวันที่ ให้ถูกต้อง');
            $('#txt_InvoiceDate').focus();
            return false;
        }
        if ($('#txt_InvoiceNo').val() == '<new>') {
            var token = $('[name=csrfmiddlewaretoken]').val();
            var point_update = $('#txt_PointReceived').val();
            $.ajax({
                url:  '/invoice/create',
                type:  'post',
                data: $('#form_invoice').serialize() + "&lineitem=" +lineitem_to_json(),
                headers: { "X-CSRFToken": token },
                dataType:  'json',
                success: function  (data) {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        $.ajax({
                            url:  '/update/point/' + club_id + "/" + point_update,
                            type:  'post',
                            data: $('#form_invoice').serialize(),
                            headers: { "X-CSRFToken": token },
                            dataType:  'json',
                            success: function  (data) {
                                if (data.error) {
                                    alert(data.error);
                                } else {
                                    $('#txt_PointAmount').val(data.customer.point)
                                    alert('บันทึกสำเร็จ');
                                }           
                            },
                        });  
                        $('#txt_InvoiceNo').val(data.invoice.invoice_no)
                        alert('บันทึกสำเร็จ');

                    }                    
                },
            });  
            
        } else {
            var token = $('[name=csrfmiddlewaretoken]').val();
            // console.log($('#form_invoice').serialize());
            // console.log(lineitem_to_json());
            $.ajax({
                url:  '/invoice/update/' + $('#txt_InvoiceNo').val(),
                type:  'post',
                data: $('#form_invoice').serialize() + "&lineitem=" +lineitem_to_json(),
                headers: { "X-CSRFToken": token },
                dataType:  'json',
                success: function  (data) {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        $.ajax({
                            url:  '/update/point/' + club_id + "/" + point_update,
                            type:  'post',
                            data: $('#form_invoice').serialize(),
                            headers: { "X-CSRFToken": token },
                            dataType:  'json',
                            success: function  (data) {
                                if (data.error) {
                                    alert(data.error);
                                } else {
                                    $('#txt_PointAmount').val(data.customer.point)
                                    alert('บันทึกสำเร็จ');
                                }           
                            },
                        });  
                        alert('บันทึกสำเร็จ');
                    }
                },
            });
        }
        
    });

    $('#btnDelete').click(function () {
        if ($('#txt_InvoiceNo').val() == '<new>') {
            alert ('ไม่สามารถลบ Invoice ใหม่ได้');
            return false;
        }
        if (confirm ("คุณต้องการลบ Invoice No : '" + $('#txt_InvoiceNo').val() + "' ")) {
            console.log('Delete ' + $('#txt_InvoiceNo').val());
            var token = $('[name=csrfmiddlewaretoken]').val();
            $.ajax({
                url:  '/invoice/delete/' + $('#txt_InvoiceNo').val(),
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
        if ($('#txt_InvoiceNo').val() == '<new>') {
            alert ('กรุณาระบุ Invoice No');
            return false;
        }
        window.open('/invoice/pdf/' + $('#txt_InvoiceNo').val());
    });
    $('#btnPrint').click(function () {
        window.open('/invoice/report');
    });

});

function lineitem_to_json () {
    var rows = [];
    var i = 0;
    $("#table_main tbody tr").each(function(index) {
        if ($(this).find('.project_code_1 > span').html() != '') {
            rows[i] = {};
            rows[i]["lineitem"] = (i+1);
            rows[i]["menu_code"] = $(this).find('.project_code_1 > span').html();
            rows[i]["menu_name"] = $(this).find('.menu_name').html();
            rows[i]["menu_types"] = $(this).find('.menu_types').html();
            rows[i]["unit_price"] = $(this).find('.unit_price').html();
            rows[i]["quantity"] = $(this).find('.quantity').html();
            rows[i]["extended_price"] = $(this).find('.extended_price').html();

            i++;
        }
    });
    var obj = {};
    obj.lineitem = rows;
    //console.log(JSON.stringify(obj));

    return JSON.stringify(obj);
}

function get_invoice_detail (invoice_no) {
    $.ajax({
        url:  '/invoice/detail/' + encodeURIComponent(invoice_no),
        type:  'get',
        dataType:  'json',
        success: function  (data) {
            //console.log(data.invoicelineitem.length);

            reset_table();
            for(var i=ROW_NUMBER;i<data.invoicelineitem.length;i++) {
                $('.table-add').click();
            }
            var i = 0;
            $("#table_main tbody tr").each(function() {
                if (i < data.invoicelineitem.length) {
                    $(this).find('.project_code_1 > span').html(data.invoicelineitem[i].menu_code);
                    $(this).find('.menu_name').html(data.invoicelineitem[i].menu_name);
                    $(this).find('.menu_types').html(data.invoicelineitem[i].menu_types);
                    $(this).find('.unit_price').html(data.invoicelineitem[i].unit_price);
                    $(this).find('.quantity').html(data.invoicelineitem[i].quantity);
                    $(this).find('.extended_price').html(data.invoicelineitem[i].extended_price);
                    // $(this).find('.amount_paid').html(data.invoicelineitem[i].amount_paid);
                    // $(this).find('.point_use').html(data.invoice[i].point_use);
                }
                i++;
            });
            re_calculate_total_price();
        },
    });
}

function re_calculate_total_price () {
    var total_price = 0;
    var change = 0;
    var point_baht = 0;
    var point = 0;
    var test = 0;
    var remain = 0;
    
    var amount_paid = $("#lbl_AmountPaid").html();
    $("#lbl_AmountPaid").text(amount_paid);
    var point_use = $("#lbl_PointUse").html();
    $("#lbl_PointUse").text(point_use);
    var point_amount = $("#txt_PointAmount").html();
    $("#txt_PointAmount").text(point_amount);
    
    $("#table_main tbody tr").each(function() {

        var menu_code = $(this).find('.project_code_1 > span').html();
        //console.log (product_code);
        var unit_price = $(this).find('.unit_price').html();
        $(this).find('.unit_price').html(((unit_price)));
        var quantity = $(this).find('.quantity').html();
        $(this).find('.quantity').html(parseInt(quantity));
        
        if (menu_code != '') {
                var extended_price = unit_price * quantity
            $(this).find('.extended_price').html(formatNumber(extended_price));
            total_price += extended_price;
            total_price = parseFloat(total_price);

            // console.log(total_price);
            // console.log(amount_paid);
            // console.log(change);

            // console.log('check',point_amount);
            // console.log(document.getElementById('txt_PointAmount').value);
            test = document.getElementById('txt_PointAmount').value;
            test = parseFloat(test);
            // test = test + total_price - point
            // console.log(typeof(test), test);
            

            point_baht = point_use / 20
            amount_paid = parseFloat(amount_paid)
            change = (amount_paid + point_baht) - total_price;
            point = total_price - point_baht

            remain = test + total_price - point_baht
            console.log(typeof(remain),remain)

            
            
        }
    });

    $('#lbl_TotalPrice').text(formatNumber(total_price / 1.07));
    $('#txt_TotalPrice').val($('#lbl_TotalPrice').text());
    $('#lbl_TAX').text(formatNumber(total_price - (total_price / 1.07)));
    $('#txt_TAX').val($('#lbl_TAX').text());
    $('#lbl_AmountDue').text(formatNumber(total_price));
    $('#txt_AmountDue').val($('#lbl_AmountDue').text());
    $('#lbl_Change').text(formatNumber(change));
    $('#txt_Change').val($('#lbl_Change').text());
    // $('#lbl_PointReceived').text(formatNumber(point));
    // $('#lbl_PointReceived').text(formatNumber(total_price / 1.07));
    $('#lbl_PointReceived').text(formatNumber(total_price));
    $('#txt_PointReceived').val($('#lbl_PointReceived').text());
    $('#lbl_baht_point').text(formatNumber(point_baht));
    $('#txt_BahtPoint').val($('#lbl_baht_point').text());
    $('#lbl_PointUse').text(formatNumber(point_use));
    $('#txt_PointUse').val($('#lbl_PointUse').text());
    $('#lbl_AmountPaid').text(formatNumber(amount_paid));
    $('#txt_AmountPaid').val($('#lbl_AmountPaid').text());
    $('#lbl_PointRemain').text(formatNumber(remain));
    $('#txt_PointRemain').val($('#lbl_PointRemain').text());
}

function reset_form() {
    $('#txt_InvoiceNo').attr("disabled", "disabled");
    $('#txt_InvoiceNo').val('<new>');

    reset_table();
    
    $('#txt_InvoiceDate').val(new Date().toJSON().slice(0,10).split('-').reverse().join('/'));

    $('#txt_CustomerCode').val('');
    $('#txt_CustomerName').val('');
    $('#txt_PointAmount').val('');

    $('#txt_PaymentMethod').val('');
    $('#txt_PaymentReference').val('');

    $('#lbl_TotalPrice').text('0.00');
    $('#lbl_TAX').text('0.00');
    $('#lbl_AmountDue').text('0.00');
    $('#lbl_Change').text('0.00');
    $('#lbl_AmountPaid').text('0.00');
    $('#lbl_Point').text('0.00');
    $('#lbl_PointUse').text('0.00');
    $('#lbl_baht_point').text('0.00');
    $('#lbl_PointRemain').text('0.00');
    $('#lbl_PointAmount').text('0.00');
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
    $('#txt_InvoiceDate').attr("disabled", "disabled");
    $('#btn_InvoiceDate').attr("disabled", "disabled");
}

function enable_ui () {
    $('#txt_InvoiceDate').removeAttr("disabled");
    $('#btn_InvoiceDate').removeAttr("disabled");
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


