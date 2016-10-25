    
    function ConvertFormToJSON(form){
      var array = jQuery(form).serializeArray();
      var json = {};
      
      jQuery.each(array, function() {
        json[this.name] = this.value || '';
      });
      
      return json;
    }
    
    jQuery(document).on('ready', function() {
      jQuery('form#add-new').bind('submit', function(event){
        event.preventDefault();
        
        var form = this;
        var json = ConvertFormToJSON(form);
        var tbody = jQuery('#to-do-list > tbody');

        $.ajax({
          type: "POST",
          url: "submission.php",
          data: json,
          dataType: "json"
        }).always(function() { 
          tbody.append(
            '<tr>
              <td>' + form['new-number'].value + '</td>
              <td>' + form['new-title'].value + '</td>
              <td>' + form['new-desc'].value + '</td>
              <td>' + form['new-name'].value + '</td>
              <td>' + form['new-data'].value + '</td>
              <td>' + form['new-view'].value + '</td>
              <td>' + form['new-like'].value + '</td>
            </tr>');

        }).fail(function() { 
          alert("Failed to add to-do"); 
        });

        return false;
      });
    });