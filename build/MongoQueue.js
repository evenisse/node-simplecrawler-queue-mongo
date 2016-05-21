(function() {
  var MongoQueue, _, getItem;

  _ = require("lodash");

  getItem = require("./QueueItem");

  module.exports = MongoQueue = (function() {
    function MongoQueue(mongo, crawler) {
      var event, eventstates, query, setEventHandler, status;
      this.crawler = crawler;
      console.log("Initializing mongo queue for " + this.crawler.name);
      this.Item = getItem(mongo, this.crawler.name);
      this.updateStatus = function(item, status) {
        console.log(status + " \t " + item.url);
        item.set({
          status: status
        });
        return item.save(function(error) {
          if (error) {
            throw error;
          }
        });
      };
      eventstates = {
        fetchstart: 'spooled',
        fetchcomplete: 'fetched',
        fetcherror: 'error',
        fetchredirect: 'redirected'
      };
      setEventHandler = (function(_this) {
        return function(event, status) {
          return _this.crawler.on(event, function(item) {
            return _this.updateStatus(item, status);
          });
        };
      })(this);
      for (event in eventstates) {
        status = eventstates[event];
        setEventHandler(event, status);
      }
      query = {
        status: 'spooled',
        crawler: this.crawler.name
      };
      this.Item.update(query, {
        status: 'queued'
      }, {
        multi: true
      }, function(error) {
        if (error) {
          throw error;
        }
      });
    }

    MongoQueue.prototype.add = function(protocol, host, port, path, callback) {
      var data;
      data = {
        protocol: protocol,
        host: host,
        port: port,
        path: path,
        crawler: this.crawler.name
      };
      return this.Item.findOne(data, (function(_this) {
        return function(error, item) {
          if (item) {
            item.set(data);
          } else {
            item = new _this.Item(data);
          }
          return item.save(callback);
        };
      })(this));
    };

    MongoQueue.prototype.clean = function(callback) {
      return this.Item.remove({
        crawler: this.crawler.name
      });
    };

    MongoQueue.prototype.exists = function(protocol, domain, port, path, callback) {
      var data;
      data = {
        protocol: protocol,
        domain: domain,
        port: port,
        path: path,
        crawler: this.crawler.name
      };
      return this.Item.count(data, callback);
    };

    MongoQueue.prototype.getLength = function(callback) {
      return this.Item.count({
        crawler: this.crawler.name
      }, callback);
    };

    MongoQueue.prototype.last = function(callback) {
      return this.Item.findOne({
        crawler: this.crawler.name
      }).sort({
        id: -1
      }).exec(callback);
    };

    MongoQueue.prototype.get = function(id, callback) {
      return this.Item.findById(id, callback);
    };

    MongoQueue.prototype.oldestUnfetchedItem = function(callback) {
      var options, query;
      query = {
        crawler: this.crawler.name,
        status: 'queued'
      };
      options = {
        sort: {
          id: 1
        }
      };
      return this.Item.findOneAndUpdate(query, options, {
        status: 'spooled'
      }, callback);
    };

    MongoQueue.prototype.max = function(statisticname, callback) {
      return process.nextTick(function() {
        return callback(null, 0);
      });
    };

    MongoQueue.prototype.min = function(statisticname, callback) {
      return process.nextTick(function() {
        return callback(null, 0);
      });
    };

    MongoQueue.prototype.avg = function(statisticname, callback) {
      return process.nextTick(function() {
        return callback(null, 0);
      });
    };

    MongoQueue.prototype.complete = function(callback) {
      return process.nextTick(function() {
        return callback(null, 0);
      });
    };

    MongoQueue.prototype.countWithStatus = function(status, callback) {
      return this.Item.count({
        status: status,
        crawler: this.crawler.name
      });
    };

    MongoQueue.prototype.getWithStatus = function(status, callback) {
      return this.Item.find({
        status: status,
        crawler: this.crawler.name
      }, callback);
    };

    MongoQueue.prototype.errors = function(callback) {
      return this.Item.count({
        status: 'error',
        crawler: this.crawler.name
      }, callback);
    };

    MongoQueue.prototype.freeze = function(filename, callback) {
      return process.nextTick(function() {
        return callback(null);
      });
    };

    MongoQueue.prototype.defrost = function(filename, callback) {
      return process.nextTick(function() {
        return callback(null);
      });
    };

    return MongoQueue;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,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RE07O3lCQU9SLE1BQUEsR0FBUSxTQUFDLFFBQUQsRUFBVyxRQUFYO2FBRU4sT0FBTyxDQUFDLFFBQVIsQ0FBaUIsU0FBQTtlQUFHLFFBQUEsQ0FBUyxJQUFUO01BQUgsQ0FBakI7SUFGTTs7eUJBS1IsT0FBQSxHQUFTLFNBQUMsUUFBRCxFQUFXLFFBQVg7YUFFUCxPQUFPLENBQUMsUUFBUixDQUFpQixTQUFBO2VBQUcsUUFBQSxDQUFTLElBQVQ7TUFBSCxDQUFqQjtJQUZPOzs7OztBQWxKWCIsImZpbGUiOiJNb25nb1F1ZXVlLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiIyBUT0RPOiBXZSBhc3N1bWUgdGhhdCB0aGVyZSBpcyBhIGNvbm5lY3Rpb24gdG8gbW9uZ28gZXN0YWJsaXNoZWQgYnkgY3Jhd2xlciBhcHBcblxuXyAgICAgICAgPSByZXF1aXJlIFwibG9kYXNoXCJcbmdldEl0ZW0gID0gcmVxdWlyZSBcIi4vUXVldWVJdGVtXCJcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBNb25nb1F1ZXVlXG4gIGNvbnN0cnVjdG9yOiAobW9uZ28sIEBjcmF3bGVyKSAtPlxuICAgIGNvbnNvbGUubG9nIFwiSW5pdGlhbGl6aW5nIG1vbmdvIHF1ZXVlIGZvciAje0BjcmF3bGVyLm5hbWV9XCJcbiAgICBASXRlbSA9IGdldEl0ZW0gbW9uZ28sIEBjcmF3bGVyLm5hbWVcblxuICAgICMgVXBkYXRlIHN0YXR1cyBvZiBpdGVtcyBpbiBkYiBvbiBjcmF3bGVyIGV2ZW50c1xuICAgIEB1cGRhdGVTdGF0dXMgPSAoaXRlbSwgc3RhdHVzKSAtPlxuICAgICAgY29uc29sZS5sb2cgXCIje3N0YXR1c30gXFx0ICN7aXRlbS51cmx9XCJcbiAgICAgIGl0ZW0uc2V0IHtzdGF0dXN9XG4gICAgICBpdGVtLnNhdmUgKGVycm9yKSAtPlxuICAgICAgICBpZiBlcnJvciB0aGVuIHRocm93IGVycm9yXG5cbiAgICBldmVudHN0YXRlcyA9XG4gICAgICAjIFNFRTogUXVldWVJdGVtI3N0YXR1c1xuICAgICAgZmV0Y2hzdGFydCAgIDogJ3Nwb29sZWQnXG4gICAgICBmZXRjaGNvbXBsZXRlOiAnZmV0Y2hlZCdcbiAgICAgIGZldGNoZXJyb3IgICA6ICdlcnJvcidcbiAgICAgIGZldGNocmVkaXJlY3Q6ICdyZWRpcmVjdGVkJ1xuXG4gICAgc2V0RXZlbnRIYW5kbGVyID0gKGV2ZW50LCBzdGF0dXMpID0+XG4gICAgICBAY3Jhd2xlci5vbiBldmVudCwgKGl0ZW0pID0+XG4gICAgICAgIEB1cGRhdGVTdGF0dXMgaXRlbSwgc3RhdHVzXG5cbiAgICBzZXRFdmVudEhhbmRsZXIgZXZlbnQsIHN0YXR1cyBmb3IgZXZlbnQsIHN0YXR1cyBvZiBldmVudHN0YXRlc1xuXG4gICAgIyBSZXNldCBhbGwgc3Bvb2xlZCBpdGVtcyB0byBxdWV1ZWRcbiAgICAjIElmIHRoZSBxdWV1ZSB3YXMgY2xvc2VkIChlLmcuIGFwcCB3YXMgdGVybWluYXRlZCkgd2l0aCBzb21lIHNwb29sZWQgaXRlbXNcbiAgICAjIHdlIHdhbnQgdGhlbSB0byBiZSByZXF1ZXVlZFxuICAgIHF1ZXJ5ID1cbiAgICAgIHN0YXR1cyA6ICdzcG9vbGVkJ1xuICAgICAgY3Jhd2xlcjogQGNyYXdsZXIubmFtZVxuICAgIEBJdGVtLnVwZGF0ZSBxdWVyeSxcbiAgICAgIHtzdGF0dXMgOiAncXVldWVkJ30sXG4gICAgICB7bXVsdGkgIDogeWVzfSxcbiAgICAgIChlcnJvcikgLT4gaWYgZXJyb3IgdGhlbiB0aHJvdyBlcnJvclxuXG5cbiAgIyBBZGQgaXRlbSB0byBxdWV1ZVxuICBhZGQ6IChwcm90b2NvbCwgaG9zdCwgcG9ydCwgcGF0aCwgY2FsbGJhY2spIC0+XG4gICAgZGF0YSA9IHtcbiAgICAgIHByb3RvY29sXG4gICAgICBob3N0XG4gICAgICBwb3J0XG4gICAgICBwYXRoXG4gICAgICBjcmF3bGVyOiBAY3Jhd2xlci5uYW1lXG4gICAgfVxuICAgIEBJdGVtLmZpbmRPbmUgZGF0YSwgKGVycm9yLCBpdGVtKSA9PlxuICAgICAgaWYgaXRlbVxuICAgICAgICBpdGVtLnNldCBkYXRhXG4gICAgICBlbHNlXG4gICAgICAgIGl0ZW0gPSBuZXcgQEl0ZW0gZGF0YVxuXG4gICAgICBpdGVtLnNhdmUgY2FsbGJhY2tcblxuICAjIENsZWFuIHRoZSBxdWV1ZVxuICBjbGVhbjogKGNhbGxiYWNrKSAtPlxuICAgIEBJdGVtXG4gICAgICAucmVtb3ZlIGNyYXdsZXI6IEBjcmF3bGVyLm5hbWVcblxuICAjIENoZWNrIGlmIGFuIGl0ZW0gYWxyZWFkeSBleGlzdHMgaW4gdGhlIHF1ZXVlLi4uXG4gIGV4aXN0czogKHByb3RvY29sLCBkb21haW4sIHBvcnQsIHBhdGgsIGNhbGxiYWNrKSAtPlxuICAgIGRhdGEgPSB7XG4gICAgICBwcm90b2NvbFxuICAgICAgZG9tYWluXG4gICAgICBwb3J0XG4gICAgICBwYXRoXG4gICAgICBjcmF3bGVyOiBAY3Jhd2xlci5uYW1lXG4gICAgfVxuICAgIEBJdGVtLmNvdW50IGRhdGEsIGNhbGxiYWNrXG5cbiAgZ2V0TGVuZ3RoOiAoY2FsbGJhY2spIC0+XG4gICAgQEl0ZW0uY291bnQgY3Jhd2xlcjogQGNyYXdsZXIubmFtZSwgY2FsbGJhY2tcblxuICAjIEdldCBsYXN0IGl0ZW0gaW4gcXVldWUuLi5cbiAgbGFzdDogKGNhbGxiYWNrKSAtPlxuICAgIEBJdGVtXG4gICAgICAuZmluZE9uZSBjcmF3bGVyOiBAY3Jhd2xlci5uYW1lXG4gICAgICAuc29ydCBpZDogLTFcbiAgICAgIC5leGVjIGNhbGxiYWNrXG5cbiAgIyBHZXQgaXRlbSBmcm9tIHF1ZXVlXG4gIGdldDogKGlkLCBjYWxsYmFjaykgLT5cbiAgICBASXRlbS5maW5kQnlJZCBpZCwgY2FsbGJhY2tcblxuICAjIEdldCBmaXJzdCB1bmZldGNoZWQgaXRlbSBpbiB0aGUgcXVldWUgKGFuZCByZXR1cm4gaXRzIGluZGV4KVxuICBvbGRlc3RVbmZldGNoZWRJdGVtOiAoY2FsbGJhY2spIC0+XG4gICAgcXVlcnkgPVxuICAgICAgY3Jhd2xlcjogQGNyYXdsZXIubmFtZVxuICAgICAgc3RhdHVzIDogJ3F1ZXVlZCdcblxuICAgIG9wdGlvbnMgPVxuICAgICAgc29ydDpcbiAgICAgICAgaWQ6IDFcblxuICAgIEBJdGVtLmZpbmRPbmVBbmRVcGRhdGUgcXVlcnksIG9wdGlvbnMsIHN0YXR1czogJ3Nwb29sZWQnLCBjYWxsYmFja1xuXG4gICMgR2V0cyB0aGUgbWF4aW11bSB0b3RhbCByZXF1ZXN0IHRpbWUsIHJlcXVlc3QgbGF0ZW5jeSwgb3IgZG93bmxvYWQgdGltZVxuICBtYXg6IChzdGF0aXN0aWNuYW1lLCBjYWxsYmFjaykgLT5cbiAgICAjIFRPRE86IExhdGVyLiBTdGF0aXN0aWNzIHJlcXVpcmUgYWRkaXRpb25hbCBmaWVsZHMgaW4gbW9kZWwuXG4gICAgcHJvY2Vzcy5uZXh0VGljayAtPiBjYWxsYmFjayBudWxsLCAwXG5cbiAgIyBHZXRzIHRoZSBtaW5pbXVtIHRvdGFsIHJlcXVlc3QgdGltZSwgcmVxdWVzdCBsYXRlbmN5LCBvciBkb3dubG9hZCB0aW1lXG4gIG1pbjogKHN0YXRpc3RpY25hbWUsIGNhbGxiYWNrKSAtPlxuICAgICMgVE9ETzogTGF0ZXIuIFN0YXRpc3RpY3MgcmVxdWlyZSBhZGRpdGlvbmFsIGZpZWxkcyBpbiBtb2RlbC5cbiAgICBwcm9jZXNzLm5leHRUaWNrIC0+IGNhbGxiYWNrIG51bGwsIDBcblxuICAjIEdldHMgdGhlIG1pbmltdW0gdG90YWwgcmVxdWVzdCB0aW1lLCByZXF1ZXN0IGxhdGVuY3ksIG9yIGRvd25sb2FkIHRpbWVcbiAgYXZnOiAoc3RhdGlzdGljbmFtZSwgY2FsbGJhY2spIC0+XG4gICAgIyBUT0RPOiBMYXRlci4gU3RhdGlzdGljcyByZXF1aXJlIGFkZGl0aW9uYWwgZmllbGRzIGluIG1vZGVsLlxuICAgIHByb2Nlc3MubmV4dFRpY2sgLT4gY2FsbGJhY2sgbnVsbCwgMFxuXG4gICMgR2V0cyB0aGUgbnVtYmVyIG9mIHJlcXVlc3RzIHdoaWNoIGhhdmUgYmVlbiBjb21wbGV0ZWQuXG4gIGNvbXBsZXRlOiAoY2FsbGJhY2spIC0+XG4gICAgIyBUT0RPOiBMYXRlci4gU3RhdGlzdGljcyByZXF1aXJlIGFkZGl0aW9uYWwgZmllbGRzIGluIG1vZGVsLlxuICAgIHByb2Nlc3MubmV4dFRpY2sgLT4gY2FsbGJhY2sgbnVsbCwgMFxuXG4gICMgR2V0cyB0aGUgbnVtYmVyIG9mIHF1ZXVlIGl0ZW1zIHdpdGggdGhlIGdpdmVuIHN0YXR1c1xuICBjb3VudFdpdGhTdGF0dXM6IChzdGF0dXMsIGNhbGxiYWNrKSAtPlxuICAgIEBJdGVtLmNvdW50IHtcbiAgICAgIHN0YXR1c1xuICAgICAgY3Jhd2xlcjogQGNyYXdsZXIubmFtZVxuICAgIH1cblxuICAjIEdldHMgdGhlIG51bWJlciBvZiBxdWV1ZSBpdGVtcyB3aXRoIHRoZSBnaXZlbiBzdGF0dXNcbiAgZ2V0V2l0aFN0YXR1czogKHN0YXR1cywgY2FsbGJhY2spIC0+XG4gICAgQEl0ZW0uZmluZCB7XG4gICAgICBzdGF0dXNcbiAgICAgIGNyYXdsZXI6IEBjcmF3bGVyLm5hbWVcbiAgICB9LCBjYWxsYmFja1xuXG4gICMgR2V0cyB0aGUgbnVtYmVyIG9mIHJlcXVlc3RzIHdoaWNoIGhhdmUgZmFpbGVkIGZvciBzb21lIHJlYXNvblxuICBlcnJvcnM6IChjYWxsYmFjaykgLT5cbiAgICBASXRlbS5jb3VudFxuICAgICAgc3RhdHVzOiAnZXJyb3InXG4gICAgICBjcmF3bGVyOiBAY3Jhd2xlci5uYW1lXG4gICAgICBjYWxsYmFja1xuXG4gICMgV3JpdGVzIHRoZSBxdWV1ZSB0byBkaXNrXG4gIGZyZWV6ZTogKGZpbGVuYW1lLCBjYWxsYmFjaykgLT5cbiAgICAjIFRPRE86IExhdGVyLiBUaGUgcXVldWUgaXMgYmFja2VkIGJ5IE1vbmdvREIsIHNvIGZyZWV6ZSBoYXMgbG93IHByaW9yaXR5XG4gICAgcHJvY2Vzcy5uZXh0VGljayAtPiBjYWxsYmFjayBudWxsXG5cbiAgIyBSZWFkcyB0aGUgcXVldWUgZnJvbSBkaXNrXG4gIGRlZnJvc3Q6IChmaWxlbmFtZSwgY2FsbGJhY2spIC0+XG4gICAgIyBUT0RPOiBMYXRlci4gVGhlIHF1ZXVlIGlzIGJhY2tlZCBieSBNb25nb0RCLCBzbyBkZWZyb3N0IGhhcyBsb3cgcHJpb3JpdHlcbiAgICBwcm9jZXNzLm5leHRUaWNrIC0+IGNhbGxiYWNrIG51bGxcbiJdfQ==
