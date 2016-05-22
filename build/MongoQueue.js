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
      }, callback);
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

//# sourceMappingURL=data:application/json;base64,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LENBQUMsUUFBUixDQUFpQixTQUFBO2VBQUcsUUFBQSxDQUFTLElBQVQ7TUFBSCxDQUFqQjtJQUZNOzt5QkFLUixPQUFBLEdBQVMsU0FBQyxRQUFELEVBQVcsUUFBWDthQUVQLE9BQU8sQ0FBQyxRQUFSLENBQWlCLFNBQUE7ZUFBRyxRQUFBLENBQVMsSUFBVDtNQUFILENBQWpCO0lBRk87Ozs7O0FBakpYIiwiZmlsZSI6Ik1vbmdvUXVldWUuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyIjIFRPRE86IFdlIGFzc3VtZSB0aGF0IHRoZXJlIGlzIGEgY29ubmVjdGlvbiB0byBtb25nbyBlc3RhYmxpc2hlZCBieSBjcmF3bGVyIGFwcFxuXG5fICAgICAgICA9IHJlcXVpcmUgXCJsb2Rhc2hcIlxuZ2V0SXRlbSAgPSByZXF1aXJlIFwiLi9RdWV1ZUl0ZW1cIlxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIE1vbmdvUXVldWVcbiAgY29uc3RydWN0b3I6IChtb25nbywgQGNyYXdsZXIpIC0+XG4gICAgY29uc29sZS5sb2cgXCJJbml0aWFsaXppbmcgbW9uZ28gcXVldWUgZm9yICN7QGNyYXdsZXIubmFtZX1cIlxuICAgIEBJdGVtID0gZ2V0SXRlbSBtb25nbywgQGNyYXdsZXIubmFtZVxuXG4gICAgIyBVcGRhdGUgc3RhdHVzIG9mIGl0ZW1zIGluIGRiIG9uIGNyYXdsZXIgZXZlbnRzXG4gICAgQHVwZGF0ZVN0YXR1cyA9IChpdGVtLCBzdGF0dXMpIC0+XG4gICAgICBpdGVtLnNldCB7c3RhdHVzfVxuICAgICAgaXRlbS5zYXZlIChlcnJvcikgLT5cbiAgICAgICAgaWYgZXJyb3IgdGhlbiB0aHJvdyBlcnJvclxuXG4gICAgZXZlbnRzdGF0ZXMgPVxuICAgICAgIyBTRUU6IFF1ZXVlSXRlbSNzdGF0dXNcbiAgICAgIGZldGNoc3RhcnQgICA6ICdzcG9vbGVkJ1xuICAgICAgZmV0Y2hjb21wbGV0ZTogJ2ZldGNoZWQnXG4gICAgICBmZXRjaGVycm9yICAgOiAnZXJyb3InXG4gICAgICBmZXRjaHJlZGlyZWN0OiAncmVkaXJlY3RlZCdcblxuICAgIHNldEV2ZW50SGFuZGxlciA9IChldmVudCwgc3RhdHVzKSA9PlxuICAgICAgQGNyYXdsZXIub24gZXZlbnQsIChpdGVtKSA9PlxuICAgICAgICBAdXBkYXRlU3RhdHVzIGl0ZW0sIHN0YXR1c1xuXG4gICAgc2V0RXZlbnRIYW5kbGVyIGV2ZW50LCBzdGF0dXMgZm9yIGV2ZW50LCBzdGF0dXMgb2YgZXZlbnRzdGF0ZXNcblxuICAgICMgUmVzZXQgYWxsIHNwb29sZWQgaXRlbXMgdG8gcXVldWVkXG4gICAgIyBJZiB0aGUgcXVldWUgd2FzIGNsb3NlZCAoZS5nLiBhcHAgd2FzIHRlcm1pbmF0ZWQpIHdpdGggc29tZSBzcG9vbGVkIGl0ZW1zXG4gICAgIyB3ZSB3YW50IHRoZW0gdG8gYmUgcmVxdWV1ZWRcbiAgICBxdWVyeSA9XG4gICAgICBzdGF0dXMgOiAnc3Bvb2xlZCdcbiAgICAgIGNyYXdsZXI6IEBjcmF3bGVyLm5hbWVcbiAgICBASXRlbS51cGRhdGUgcXVlcnksXG4gICAgICB7c3RhdHVzIDogJ3F1ZXVlZCd9LFxuICAgICAge211bHRpICA6IHllc30sXG4gICAgICAoZXJyb3IpIC0+IGlmIGVycm9yIHRoZW4gdGhyb3cgZXJyb3JcblxuXG4gICMgQWRkIGl0ZW0gdG8gcXVldWVcbiAgYWRkOiAocHJvdG9jb2wsIGhvc3QsIHBvcnQsIHBhdGgsIGNhbGxiYWNrKSAtPlxuICAgIGRhdGEgPSB7XG4gICAgICBwcm90b2NvbFxuICAgICAgaG9zdFxuICAgICAgcG9ydFxuICAgICAgcGF0aFxuICAgICAgY3Jhd2xlcjogQGNyYXdsZXIubmFtZVxuICAgIH1cbiAgICBASXRlbS5maW5kT25lIGRhdGEsIChlcnJvciwgaXRlbSkgPT5cbiAgICAgIGlmIGl0ZW1cbiAgICAgICAgaXRlbS5zZXQgZGF0YVxuICAgICAgZWxzZVxuICAgICAgICBpdGVtID0gbmV3IEBJdGVtIGRhdGFcblxuICAgICAgaXRlbS5zYXZlIGNhbGxiYWNrXG5cbiAgIyBDbGVhbiB0aGUgcXVldWVcbiAgY2xlYW46IChjYWxsYmFjaykgLT5cbiAgICBASXRlbVxuICAgICAgLnJlbW92ZSBjcmF3bGVyOiBAY3Jhd2xlci5uYW1lLCBjYWxsYmFja1xuXG4gICMgQ2hlY2sgaWYgYW4gaXRlbSBhbHJlYWR5IGV4aXN0cyBpbiB0aGUgcXVldWUuLi5cbiAgZXhpc3RzOiAocHJvdG9jb2wsIGRvbWFpbiwgcG9ydCwgcGF0aCwgY2FsbGJhY2spIC0+XG4gICAgZGF0YSA9IHtcbiAgICAgIHByb3RvY29sXG4gICAgICBkb21haW5cbiAgICAgIHBvcnRcbiAgICAgIHBhdGhcbiAgICAgIGNyYXdsZXI6IEBjcmF3bGVyLm5hbWVcbiAgICB9XG4gICAgQEl0ZW0uY291bnQgZGF0YSwgY2FsbGJhY2tcblxuICBnZXRMZW5ndGg6IChjYWxsYmFjaykgLT5cbiAgICBASXRlbS5jb3VudCBjcmF3bGVyOiBAY3Jhd2xlci5uYW1lLCBjYWxsYmFja1xuXG4gICMgR2V0IGxhc3QgaXRlbSBpbiBxdWV1ZS4uLlxuICBsYXN0OiAoY2FsbGJhY2spIC0+XG4gICAgQEl0ZW1cbiAgICAgIC5maW5kT25lIGNyYXdsZXI6IEBjcmF3bGVyLm5hbWVcbiAgICAgIC5zb3J0IGlkOiAtMVxuICAgICAgLmV4ZWMgY2FsbGJhY2tcblxuICAjIEdldCBpdGVtIGZyb20gcXVldWVcbiAgZ2V0OiAoaWQsIGNhbGxiYWNrKSAtPlxuICAgIEBJdGVtLmZpbmRCeUlkIGlkLCBjYWxsYmFja1xuXG4gICMgR2V0IGZpcnN0IHVuZmV0Y2hlZCBpdGVtIGluIHRoZSBxdWV1ZSAoYW5kIHJldHVybiBpdHMgaW5kZXgpXG4gIG9sZGVzdFVuZmV0Y2hlZEl0ZW06IChjYWxsYmFjaykgLT5cbiAgICBxdWVyeSA9XG4gICAgICBjcmF3bGVyOiBAY3Jhd2xlci5uYW1lXG4gICAgICBzdGF0dXMgOiAncXVldWVkJ1xuXG4gICAgb3B0aW9ucyA9XG4gICAgICBzb3J0OlxuICAgICAgICBpZDogMVxuXG4gICAgQEl0ZW0uZmluZE9uZUFuZFVwZGF0ZSBxdWVyeSwgb3B0aW9ucywgc3RhdHVzOiAnc3Bvb2xlZCcsIGNhbGxiYWNrXG5cbiAgIyBHZXRzIHRoZSBtYXhpbXVtIHRvdGFsIHJlcXVlc3QgdGltZSwgcmVxdWVzdCBsYXRlbmN5LCBvciBkb3dubG9hZCB0aW1lXG4gIG1heDogKHN0YXRpc3RpY25hbWUsIGNhbGxiYWNrKSAtPlxuICAgICMgVE9ETzogTGF0ZXIuIFN0YXRpc3RpY3MgcmVxdWlyZSBhZGRpdGlvbmFsIGZpZWxkcyBpbiBtb2RlbC5cbiAgICBwcm9jZXNzLm5leHRUaWNrIC0+IGNhbGxiYWNrIG51bGwsIDBcblxuICAjIEdldHMgdGhlIG1pbmltdW0gdG90YWwgcmVxdWVzdCB0aW1lLCByZXF1ZXN0IGxhdGVuY3ksIG9yIGRvd25sb2FkIHRpbWVcbiAgbWluOiAoc3RhdGlzdGljbmFtZSwgY2FsbGJhY2spIC0+XG4gICAgIyBUT0RPOiBMYXRlci4gU3RhdGlzdGljcyByZXF1aXJlIGFkZGl0aW9uYWwgZmllbGRzIGluIG1vZGVsLlxuICAgIHByb2Nlc3MubmV4dFRpY2sgLT4gY2FsbGJhY2sgbnVsbCwgMFxuXG4gICMgR2V0cyB0aGUgbWluaW11bSB0b3RhbCByZXF1ZXN0IHRpbWUsIHJlcXVlc3QgbGF0ZW5jeSwgb3IgZG93bmxvYWQgdGltZVxuICBhdmc6IChzdGF0aXN0aWNuYW1lLCBjYWxsYmFjaykgLT5cbiAgICAjIFRPRE86IExhdGVyLiBTdGF0aXN0aWNzIHJlcXVpcmUgYWRkaXRpb25hbCBmaWVsZHMgaW4gbW9kZWwuXG4gICAgcHJvY2Vzcy5uZXh0VGljayAtPiBjYWxsYmFjayBudWxsLCAwXG5cbiAgIyBHZXRzIHRoZSBudW1iZXIgb2YgcmVxdWVzdHMgd2hpY2ggaGF2ZSBiZWVuIGNvbXBsZXRlZC5cbiAgY29tcGxldGU6IChjYWxsYmFjaykgLT5cbiAgICAjIFRPRE86IExhdGVyLiBTdGF0aXN0aWNzIHJlcXVpcmUgYWRkaXRpb25hbCBmaWVsZHMgaW4gbW9kZWwuXG4gICAgcHJvY2Vzcy5uZXh0VGljayAtPiBjYWxsYmFjayBudWxsLCAwXG5cbiAgIyBHZXRzIHRoZSBudW1iZXIgb2YgcXVldWUgaXRlbXMgd2l0aCB0aGUgZ2l2ZW4gc3RhdHVzXG4gIGNvdW50V2l0aFN0YXR1czogKHN0YXR1cywgY2FsbGJhY2spIC0+XG4gICAgQEl0ZW0uY291bnQge1xuICAgICAgc3RhdHVzXG4gICAgICBjcmF3bGVyOiBAY3Jhd2xlci5uYW1lXG4gICAgfVxuXG4gICMgR2V0cyB0aGUgbnVtYmVyIG9mIHF1ZXVlIGl0ZW1zIHdpdGggdGhlIGdpdmVuIHN0YXR1c1xuICBnZXRXaXRoU3RhdHVzOiAoc3RhdHVzLCBjYWxsYmFjaykgLT5cbiAgICBASXRlbS5maW5kIHtcbiAgICAgIHN0YXR1c1xuICAgICAgY3Jhd2xlcjogQGNyYXdsZXIubmFtZVxuICAgIH0sIGNhbGxiYWNrXG5cbiAgIyBHZXRzIHRoZSBudW1iZXIgb2YgcmVxdWVzdHMgd2hpY2ggaGF2ZSBmYWlsZWQgZm9yIHNvbWUgcmVhc29uXG4gIGVycm9yczogKGNhbGxiYWNrKSAtPlxuICAgIEBJdGVtLmNvdW50XG4gICAgICBzdGF0dXM6ICdlcnJvcidcbiAgICAgIGNyYXdsZXI6IEBjcmF3bGVyLm5hbWVcbiAgICAgIGNhbGxiYWNrXG5cbiAgIyBXcml0ZXMgdGhlIHF1ZXVlIHRvIGRpc2tcbiAgZnJlZXplOiAoZmlsZW5hbWUsIGNhbGxiYWNrKSAtPlxuICAgICMgVE9ETzogTGF0ZXIuIFRoZSBxdWV1ZSBpcyBiYWNrZWQgYnkgTW9uZ29EQiwgc28gZnJlZXplIGhhcyBsb3cgcHJpb3JpdHlcbiAgICBwcm9jZXNzLm5leHRUaWNrIC0+IGNhbGxiYWNrIG51bGxcblxuICAjIFJlYWRzIHRoZSBxdWV1ZSBmcm9tIGRpc2tcbiAgZGVmcm9zdDogKGZpbGVuYW1lLCBjYWxsYmFjaykgLT5cbiAgICAjIFRPRE86IExhdGVyLiBUaGUgcXVldWUgaXMgYmFja2VkIGJ5IE1vbmdvREIsIHNvIGRlZnJvc3QgaGFzIGxvdyBwcmlvcml0eVxuICAgIHByb2Nlc3MubmV4dFRpY2sgLT4gY2FsbGJhY2sgbnVsbFxuIl19
