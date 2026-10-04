"use strict";
var boolCheck=true;
$(document).ready(function() {
    $(".side_access").click(function() {
        drawerCheck(boolCheck);
    });
});
function drawerCheck(bool){
boolCheck=bool;
    if (boolCheck) {
            $("#sideDrawer").addClass("sideOpen")
            $("#op_one").addClass("additional1");
            $("#op_two").addClass("additional2");
            $("#op_three").addClass("additional3");
            boolCheck = false;
        } else {
            $("#sideDrawer").removeClass("sideOpen")
            $("#op_one").removeClass("additional1");
            $("#op_two").removeClass("additional2");
            $("#op_three").removeClass("additional3");
           
            boolCheck = true;
        }
}