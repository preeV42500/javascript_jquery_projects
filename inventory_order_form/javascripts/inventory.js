var inventory;

(function() {
  inventory = {
    last_id: 0,
    collection: [],
    writeDate: function() { // write current date and time to page
      var date = new Date().toUTCString();
      $("#date").text(date);
    },
    cacheTemplate: function() {
      this.template = $("#inventory_item").remove().html(); // reads HTML string from the template and stores it on object
    },
    add: function() { // increments id for each new object created, create new object, add object to collection
      this.last_id++;
      var item_obj = {
        id: this.last_id,
        name: "",
        stock_number: "",
        quantity: 1
      };
      this.collection.push(item_obj);
      return item_obj;
    },
    newItem: function(e) { // called when 'Add item' button is clicked
      e.preventDefault();
      var item = this.add(),
          $item = $(this.template.replace(/ID/g, item.id)); // replace id in template with id of object
      $("#inventory").append($item); // Append jQuery object to the inventory table
    },
    findParent: function(e) { // returns event target's parent table row
      return $(e.target).closest("tr");
    },
    findID: function($item) { // finds hidden input within table row that holds item ID
      return +$item.find("input[type=hidden]").val();
    },
    get: function(id) { // returns object in collection with matching id
      var found_item;
      this.collection.forEach(function(obj) {
        if (obj.id === id) {
          found_item = obj;
          return false;
        };
      });
      return found_item;
    },
    update: function($item) {
      var id = this.findID($item),
          item = this.get(id);
      // uses values of the three inputs in the table row to update corresponding properties on object
      item.name = $item.find("[name^=item_name]").val();
      item.stock_number = $item.find("[name^=item_stock_number]").val();
      item.quantity = +$item.find("[name^=item_quantity]").val();
    },
    updateItem: function(e) {
      var $item = this.findParent(e);
      this.update($item);
    },
    bindEvents: function() {
      $("#add_item").on("click", $.proxy(this.newItem, this));
      $("#inventory").on("click", "a.delete", $.proxy(this.deleteItem, this)); // delegate click event handler to parent table
      $("#inventory").on("blur", ":input", $.proxy(this.updateItem, this)); // delegate blur event handler to parent table
    },
    deleteItem: function(e) {
      e.preventDefault();
      var $row = this.findParent(e).remove();
      this.remove(this.findID($row));
    },
    remove: function(id) { // filter collection array based on passed in id
      this.collection = this.collection.filter(function(item) {
        return item.id !== id;
      });
    },
    init: function() {
      this.writeDate();
      this.cacheTemplate();
      this.bindEvents();
    },

  };
})();

$($.proxy(inventory.init, inventory));
