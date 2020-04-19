"use strict";var sendFile=function(e){var a=new FormData;a.append("file",e),$.ajax({data:a,type:"POST",url:"/editorimageuploads",cache:!1,contentType:!1,processData:!1,success:function(e){var a=e.fileName,t=e.filePath;$(".summernote-editor").summernote("insertImage",t,a)}})},menuPositionUpdate=function(e){var a=$(".alert.menu-pos-alert");a&&a.fadeOut(),$(".page-body").before('<div class="alert alert-success alert-dismissible fade show menu-pos-alert" role="alert">\n        <strong>Success: </strong> '.concat(e,' position update.\n        <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n        <span aria-hidden="true">&times;</span>\n        </button>\n        </div>'))};$(function(){$(".summernote-editor").summernote({minHeight:500,callbacks:{onImageUpload:function(e,a,t){sendFile(e[0],a,t)}}})}),$(".datepicker").datepicker(),$("#media-select-search").keyup(function(){var e=$(this).val();if(e.length<4)return!1;$.ajax({type:"GET",url:"/api/media/search/".concat(e),success:function(e){if($(".analog-modal.media-select .media-grid").empty(),e.length)return e.forEach(function(e,a){$(".media-grid").append('<div id="media-'.concat(a,'" data-id="').concat(e._id,'" data-path="').concat(e.path,'" class="col-4 col-md-3 col-lg-2 media-grid-item"\n                        style="background-image: url(\'').concat(e.path,"')\"></div>"))}),$(".analog-modal").addClass("active");$(".media-grid").append('<div class="col-12"><h4>No media found.</h4></div>')},error:function(e){$(".custom-fields-notifications .alert").remove(),$(".custom-fields-notifications").append('<div class="alert alert-warning alert-dismissible fade show" role="alert">\n            <strong>Error: </strong> '.concat(e.message,'\n            <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n            <span aria-hidden="true">&times;</span>\n            </button>\n            </div>'))}})}),$(".cms-menu .nav-item.nav-has-submenu").hover(function(){var e=$(this);return!e.hasClass("current")&&e.addClass("expanded")},function(){var e=$(this);return!e.hasClass("current")&&e.removeClass("expanded")}),$("body").on("mouseup",".analog-modal.media-select.active button.select",function(){var e=$(".analog-modal.media-select.active .media-grid-item.selected");if(!e.length)return!1;var a=e.data("id"),t=e.data("path");$(".image-upload-thumb").removeClass("no-image").addClass("image-exists").css("background-image","url('".concat(t,"')")).empty(),$("input#_image").val(a),$(".analog-modal .media-grid").empty()}),$("body").on("mouseup",".analog-modal.media-select.active button.dismiss",function(){$(".analog-modal .media-grid").empty()}),$("body").on("click",".analog-modal.media-select.active .media-grid-item",function(){var e=$(this);return e.hasClass("selected")?e.removeClass("selected"):($(".media-grid-item").removeClass("selected"),e.addClass("selected")),!1}),$(".image-upload-thumb").click(function(){$.ajax({type:"GET",url:"/api/media/",success:function(e){if($(".analog-modal.media-select .media-grid").empty(),e.length)return e.forEach(function(e,a){$(".media-grid").append('<div id="media-'.concat(a,'" data-id="').concat(e._id,'" data-path="').concat(e.path,'" title="').concat(e.fileName,'" class="col-4 col-md-3 col-lg-2 media-grid-item"\n                        style="background-image: url(\'').concat(e.path,"')\"></div>"))}),$(".analog-modal").addClass("active");$(".analog-modal").addClass("active"),$(".media-grid").append('<div class="col-12"><h4>No media found.</h4></div>')},error:function(e){$(".custom-fields-notifications .alert").remove(),$(".custom-fields-notifications").append('<div class="alert alert-warning alert-dismissible fade show" role="alert">\n            <strong>Error: </strong> '.concat(e.message,'\n            <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n            <span aria-hidden="true">&times;</span>\n            </button>\n            </div>'))}})}),$(".analog-modal .modal-footer button").click(function(){var e=$(".analog-modal");$(this).hasClass("update")&&$("#updatemedia").submit(),e.removeClass("active")}),$("#image-upload-thumb-rm").click(function(){var a=$(this),e=a.data("id"),t=a.data("delajaxurl");if(!e||!t)return!1;$.ajax({type:"POST",url:t,data:{_id:e},success:function(e){a.remove(),$("input#_image").val(""),$(".image-upload-thumb.image-exists").css("background-image","none").addClass("no-image"),$(".image-upload-thumb.image-exists i").removeClass("d-none"),$(".custom-fields-notifications").append('<div class="alert alert-success alert-dismissible fade show" role="alert">\n            <strong>Success: </strong> '.concat(e.message,'\n            <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n            <span aria-hidden="true">&times;</span>\n            </button>\n            </div>'))},error:function(e){$(".custom-fields-notifications").append('<div class="alert alert-warning alert-dismissible fade show" role="alert">\n            <strong>Error: </strong> '.concat(e.responseJSON.message,'\n            <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n            <span aria-hidden="true">&times;</span>\n            </button>\n            </div>'))}}).always(function(){$(".custom-fields-notifications .alert").remove()})}),$(".page-link.directional").click(function(){event.preventDefault();var e=$(".page-item.active"),a=e.next(),t=e.prev();if($(this).hasClass("next"))return a.find("a.page-link")[0].click(),!1;t.find("a.page-link")[0].click()}),$("body").on("click",".editcustomfield",function(){var e=$(this),a=e.data("cf"),t=$(a).find(".updatecustomfield"),i=$(a).find("input"),s=$(a).find("button.btn-danger");i.prop("disabled",!1),t.show(),e.hide(),s.hide()}),$("body").on("click",".deletecustomfield",function(){var e=$(this),a=e.data("id"),t=e.data("row");$(".custom-fields-notifications .alert").remove(),$.ajax({type:"POST",url:"/deletecustomfield",data:{_id:a},success:function(e){$(".custom-fields-notifications").append('<div class="alert alert-success alert-dismissible fade show" role="alert">\n            <strong>Success: </strong> '.concat(e.message,'\n            <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n            <span aria-hidden="true">&times;</span>\n            </button>\n            </div>')),$(t).remove()},error:function(e){$(".custom-fields-notifications").append('<div class="alert alert-warning alert-dismissible fade show" role="alert">\n            <strong>Error: </strong> '.concat(e.responseJSON.message,'\n            <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n            <span aria-hidden="true">&times;</span>\n            </button>\n            </div>'))}})}),$("body").on("click",".updatecustomfield",function(){var e=$(this).data("cf"),a=$(e).find("input[name=slug]"),t=$(e).find("input[name=value]"),i=$(e).find("button.btn-danger"),s=$(e).find("button.editcustomfield"),n=$(e).find("button.updatecustomfield"),l=a.val().trim(),o=t.val().trim(),d=$(e).find("input[name=cf_id]").val();if(!l)return $("#new-custom-field").addClass("was-validated"),!1;$(".custom-fields-notifications .alert").remove(),$.ajax({type:"POST",url:"/updatecustomfield",data:{_id:d,slug:l,value:o},success:function(e){a.prop("disabled",!0),t.prop("disabled",!0),$(".custom-fields-notifications").append('<div class="alert alert-success alert-dismissible fade show" role="alert">\n            <strong>Success: </strong> '.concat(e.message,'\n            <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n            <span aria-hidden="true">&times;</span>\n            </button>\n            </div>'))},error:function(e){$(".custom-fields-notifications").append('<div class="alert alert-warning alert-dismissible fade show" role="alert">\n            <strong>Error: </strong> '.concat(e.responseJSON.message,'\n            <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n            <span aria-hidden="true">&times;</span>\n            </button>\n            </div>'))}}).always(function(){n.hide(),i.show(),s.show()})}),$("#addcustomfield").click(function(){var a=$("#new-custom-field-slug"),t=$("#new-custom-field-value"),e=a.val().trim(),i=t.val().trim(),s=$("#new-custom-field-ownerModel").val(),n=$("#new-custom-field-owner").val();if(!e)return a.addClass("is-invalid"),!1;$(".custom-fields-notifications .alert").remove(),$.ajax({type:"POST",url:"/addcustomfield",data:{slug:e,value:i,ownerModel:s,owner:n},success:function(e){$(".custom-fields-notifications").append('<div class="alert alert-success alert-dismissible fade show" role="alert">\n            <strong>Success: </strong> '.concat(e.message,'\n            <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n            <span aria-hidden="true">&times;</span>\n            </button>\n            </div>')),$("#custom-fields-list").append('\n                    <div id="cf-'.concat(e.created._id,'" class="row custom-field">\n                    <div class="col-6 col-md-4">\n                        <input id="new-custom-field-slug" name="slug" type="text" class="form-control"\n                            placeholder="Enter slug ..." value="').concat(e.created.slug,'" required disabled></input>\n                        <div class="invalid-feedback">Required.</div>\n                    </div>\n                    <div class="col-6 col-md-4">\n                        <input id="new-custom-field-value" name="value" type="text" class="form-control"\n                            placeholder="Enter value ..." value="').concat(e.created.value,'" disabled></input>\n                    </div>\n                    <div class="col-4">\n                        <input id="new-custom-field-id" type="hidden" name="_id" value="').concat(e.created._id,'">\n                        <button type="button" class="btn btn-success editcustomfield" data-cf="#cf-').concat(e.created._id,'"><i class="far fa-edit"></i></button>\n                        <button type="button" class="btn btn-info updatecustomfield" data-cf="#cf-').concat(e.created._id,'">Update</button>\n                        <button type="button" class="btn btn-danger deletecustomfield" data-row="#cf-').concat(e.created._id,'" data-id="').concat(e.created._id,'"><i class="far fa-trash-alt"></i></button>\n                    </div>\n                </div>')),$(".no-cf-alert").remove(),a.val("").removeClass("is-invalid"),t.val("")},error:function(e){$(".custom-fields-notifications").append('<div class="alert alert-warning alert-dismissible fade show" role="alert">\n            <strong>Error: </strong> '.concat(e.responseJSON.message,'\n            <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n            <span aria-hidden="true">&times;</span>\n            </button>\n            </div>'))}})}),$(".section-head").click(function(){var e=$(this).find(".section-toggle-controls");e.hasClass("expanded")?e.removeClass("expanded"):e.addClass("expanded")}),$(".add-item-overlay, .add-project-overlay").click(function(){return $(this).hasClass("active")?$(this).removeClass("active"):$(this).addClass("active"),!1}),$(".mobile-menu-toggle").click(function(){return $("body").hasClass("mobile-menu-active")?$("body").removeClass("mobile-menu-active"):$("body").addClass("mobile-menu-active"),!1}),$(".listCheckbox.selectAll").click(function(){if($(".listCheckbox.selectAll:checked").length)return $("#list .listCheckbox.selectSingle:enabled").prop("checked",!0);$(".multi-edit-select-hidden").hide(),$("#list .listCheckbox.selectSingle:checked").prop("checked",!1)}),$(".listCheckbox").click(function(){if($("#list .listCheckbox.selectSingle:checked").length)return $("#multi-edit-select, #submit_list_multi_edit").prop("disabled",!1);$(".multi-edit-select-hidden").hide(),$("#multi-edit-select, #submit_list_multi_edit").prop("disabled",!0)}),$("#submit_list_multi_edit").click(function(){var e=$(this),t=[],a=e.data("url"),i=$("#multi-edit-select option:selected"),s=$(i.data("target")),n=i.val(),l=s.val();e.prop("disabled",!0),$("#list .listCheckbox.selectSingle:checked").each(function(e,a){t.push($(a).val())}),$.ajax({type:"POST",url:a,data:{list_id_arr:t,update_criteria:n,update_value:l},success:function(){location.reload()}})}),$("#get_strong_pass").click(function(){var a=$(".password_target, .verify_password_target, .password_helper input");a.val(""),$.ajax({type:"GET",url:"/api/password",success:function(e){a.val(e),$(".password_helper").show()},error:function(e){console.error(e),alert("An error occurred while retrieving a strong password. Please try again later.")}})}),$("#multi-edit-select").change(function(){var e=$($(this).find(":selected").data("target"));$(".multi-edit-select-hidden").hide(),e.show()}),$("#paginationlimit").change(function(){var e=$(this).val(),a=window.location.href;if(0<=a.indexOf("limit="))return a=a.substring(0,a.indexOf("limit=")+"limit=".length),location.href="".concat(a).concat(e),!1;var t=-1!==a.indexOf("&")?"&limit=":"?limit=";location.href="".concat(a).concat(t).concat(e)}),$(".password_target, .verify_password_target").on("input",function(){$(".password_helper").hide()});