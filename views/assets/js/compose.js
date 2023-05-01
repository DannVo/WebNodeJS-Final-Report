$(document).on('click', '.to .icon-remove-sign', function() {
    $(this).parent().remove();
  })
  function addMail(val) {
         if (val) {
             var to = $('<div class="to"><span class="addr"></span><span class="pull-right icon-remove-sign"></span></div>');
             to.find('.addr').text(val);
             $('.modtagere').append(to);
         }
  }
  $('#mailadr').keydown(function(e)  {
     if (e.keyCode == 13) {
         var val = $('#mailadr').val();
         addMail(val);
     } 
  });
  
  
  var substringMatcher = function(strs) {
    return function findMatches(q, cb) {
      var matches, substrRegex;
   
      // an array that will be populated with substring matches
      matches = [];
   
      // regex used to determine if a string contains the substring `q`
      substrRegex = new RegExp(q, 'i');
   
      // iterate through the pool of strings and for any string that
      // contains the substring `q`, add it to the `matches` array
      $.each(strs, function(i, str) {
        if (substrRegex.test(str)) {
          // the typeahead jQuery plugin expects suggestions to a
          // JavaScript object, refer to typeahead docs for more info
          var div = $('<div></div>');
          div.text(str);
          matches.push({ display: div.text(), value: str});
        }
      });
      cb(matches);
    };
  };
   
  var data = [
      'Rasmus Fuglsang <rlf@logiva.dk>', 
      'Stark Århus <aarhus@stark.dk>', 
      'Jens Wulf <jeww@logiva.dk>', 
      'mtm@logiva.dk', 
      'Beta Cykler <beta@cykler.dk>',
      'Stark Kbh <kbh@stark.dk>',
      'Marianne Hünesen <mh@logiva.dk>'
  ];
   
  $('#mailadr').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    name: 'mails',
    displayKey: "value",
    source: substringMatcher(data),
    templates: {
        empty: '<i>Ingen adresser matcher</i>',
        suggestion: Handlebars.compile('<p>{{display}}</p>')
    }
  });
  $('#mailadr').on('typeahead:selected', function(e,item) {
      addMail(item.value);
      return item;
  });