var collection = new Meteor.Collection(null);

if (Meteor.isServer) {
  collection.insert({ _id: 'testId', name: 'testName' });

  for (var i = 0; i < 100; i += 1) {
    collection.insert({ _id: 'testId' + i, sortField: i, name: 'name sup what' });
  }
}

var index = new EasySearch.Index({
  engine: new EasySearch.MongoDB({
    sort: function () {
      return ['sortField'];
    },
    selectorPerField: function (field, searchString) {
      if ('testName' === searchString) {
        var selector = {};

        selector[field] = 'name sup what';

        return selector;
      }

      return this.defaultConfiguration.selectorPerField(field, searchString);
    }
  }),
  collection: collection,
  fields: ['name']
});

function getExpectedDocs(count) {
  var docs = [];

  for (var i = 0; i < count; i += 1) {
    docs.push({ _id: 'testId' + i,  sortField: i, name: 'name sup what' });
  }

  return docs;
}

Tinytest.addAsync('EasySearch - Functional - MongoDB - prefix search', function (test, done) {
  Deps.autorun(function (c) {
    var docs = index.search('test').fetch();

    if (docs.length === 1) {
      test.equal(docs, [{ _id: 'testId', name: 'testName' }]);
      test.equal(index.search('test').count(), 1);
      done();
      c.stop();
    }
  });
});

Tinytest.addAsync('EasySearch - Functional - MongoDB - suffixed search', function (test, done) {
  Tracker.autorun(function (c) {
    var docs = index.search('what').fetch();

    if (docs.length === 10) {
      test.equal(docs, getExpectedDocs(10));
      test.equal(index.search('what').count(), 100);
      done();
      c.stop();
    }
  });
});

Tinytest.addAsync('EasySearch - Functional - MongoDB - custom selector', function (test, done) {

  Tracker.autorun(function (c) {
    var docs = index.search('testName', { limit: 20 }).fetch();

    if (docs.length === 20) {
      test.equal(docs, getExpectedDocs(20));
      test.equal(index.search('testName').count(), 100);
      done();
      c.stop();
    }
  });
});