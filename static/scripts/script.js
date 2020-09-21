// Override defaiult behavior for input prediction submission using jquery and AJAX
$("#input-form").submit(function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.

    var form = $(this);
    var url = form.attr('action');

    $.ajax({
        type: "POST",
        url: url,
        data: form.serialize(), // serializes the form's elements.
        success: function (data) {
            var pred_image = $("#pred_image");
            var slide_div = $("#slide-div");

            // Path to image to display as output
            var img_path = ""
            if (data == 'n') {
                img_path = "static/img/frowning-face.png"
            } else if (data == 'p') {
                img_path = "static/img/smiling-face.png"
            } else {
                console.log("SOMETHING BROKE")
            }

            // First run, edge case of sliding div
            if (slide_div.is(":hidden")) {
                pred_image.attr("src", img_path);
            };

            // Toggle div showing for every subsequent run
            slide_div.slideToggle('slow', function () {
                if ($(this).is(":hidden")) {
                    $(this).slideToggle('slow')
                    pred_image.attr("src", img_path);
                };
            });
        }
    });
});

// Manually attach attribute to feedback buttons to capture which one user clicked
$("#save-form button[type=submit]").click(function () {
    $("button[type=submit]", $(this).parents("#save-form")).removeAttr("clicked");
    $(this).attr("clicked", "true");
});
