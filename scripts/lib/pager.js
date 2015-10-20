define('pager', [
  'knockout',
  'container'
], function (ko, container) {
  var Pager = function Pager() {
    var self = this;
    self.viewModel = function (params) {
      var logger = debug('pager');
      var self = this;
      //observable array
      self.entries = ko.observableArray([]);
      self.currentPageNumber = ko.observable(0);
      self.entryPerPage = 3;
      self.totalPages = ko.computed(function () {
        logger('function totalPages is called');
        var noOfPage = Math.floor(self.entries().length / self.entryPerPage);
        noOfPage += self.entries().length % self.entryPerPage > 0 ? 1 : 0;
        return noOfPage - 1;
      });
      self.hasNext = ko.computed(function () {
        logger('function hasNext is called');
        return self.currentPageNumber() !== self.totalPages();
      });
      self.hasPrevious = ko.computed(function () {
        logger('function hasPrevious is called');
        return self.currentPageNumber() !== 0;
      });
      self.next = function () {
        logger('function next is called');
        if (self.hasNext()) {
          self.currentPageNumber(self.currentPageNumber() + 1);
        }
      };
      self.previous = function () {
        logger('function previous is called');
        if (self.hasPrevious())
          self.currentPageNumber(self.currentPageNumber() - 1);
      };
      self.updateEntries = function (en) {
        logger('function updateEntries is called');
        self.entries(en);
      };
      self.showEntries = ko.computed(function () {
        logger('function showEntries is called');
        var index = self.entryPerPage * self.currentPageNumber();
        return self.entries.slice(index, index + self.entryPerPage);
      });
    };

    self.template = '<div id="pager">';
    self.template += '<a href="#" class="previous" data-bind="click: previous, visible: hasPrevious">&lt;</a>';
    self.template += '<span class="current" data-bind="text: currentPageNumber"></span>';
    self.template += '<a href="#" class="next" data-bind="click: next, visible: hasNext">&gt;</a>';
    self.template += '</div>';
  };
  container.addComponentClass(Pager);
});
