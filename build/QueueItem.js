(function() {
  var QueueItem;

  QueueItem = void 0;

  module.exports = function(connection, crawler) {
    var schema;
    schema = new connection.base.Schema({
      protocol: {
        type: String,
        required: true,
        index: true
      },
      host: {
        type: String,
        required: true,
        index: true
      },
      port: {
        type: Number,
        index: true
      },
      path: {
        type: String,
        required: true,
        index: true
      },
      referrer: {
        type: String,
        required: false
      },
      depth: {
        type: Number,
        required: false
      },
      status: {
        type: String,
        "default": 'queued',
        index: true,
        "enum": ['queued', 'spooled', 'fetched', 'redirected', 'error']
      },
      fetched: {
        type: Boolean,
        "default": false
      },
      stateData: {
        type: Object,
        "default": {}
      },
      crawler: {
        type: String,
        index: true,
        "default": 'default'
      }
    });
    schema.index({
      crawler: 1,
      status: 1
    });
    schema.virtual('url').get(function() {
      return this.protocol + '://' + this.host + (this.port ? ':' + this.port : void 0) + this.path;
    });
    if (QueueItem == null) {
      QueueItem = connection.model("QueueItem", schema);
    }
    return module.exports = QueueItem;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlF1ZXVlSXRlbS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLFNBQUEsR0FBWTs7RUFFWixNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLFVBQUQsRUFBYSxPQUFiO0FBQ2YsUUFBQTtJQUFBLE1BQUEsR0FBYSxJQUFBLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBaEIsQ0FDWDtNQUFBLFFBQUEsRUFDRTtRQUFBLElBQUEsRUFBVSxNQUFWO1FBQ0EsUUFBQSxFQUFVLElBRFY7UUFFQSxLQUFBLEVBQVUsSUFGVjtPQURGO01BS0EsSUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFVLE1BQVY7UUFDQSxRQUFBLEVBQVUsSUFEVjtRQUVBLEtBQUEsRUFBVSxJQUZWO09BTkY7TUFVQSxJQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQVUsTUFBVjtRQUNBLEtBQUEsRUFBVSxJQURWO09BWEY7TUFjQSxJQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQVUsTUFBVjtRQUNBLFFBQUEsRUFBVSxJQURWO1FBRUEsS0FBQSxFQUFVLElBRlY7T0FmRjtNQW1CQSxRQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQVUsTUFBVjtRQUNBLFFBQUEsRUFBVSxLQURWO09BcEJGO01BdUJBLEtBQUEsRUFDRTtRQUFBLElBQUEsRUFBVSxNQUFWO1FBQ0EsUUFBQSxFQUFVLEtBRFY7T0F4QkY7TUEyQkEsTUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFVLE1BQVY7UUFDQSxTQUFBLEVBQVUsUUFEVjtRQUVBLEtBQUEsRUFBVSxJQUZWO1FBR0EsTUFBQSxFQUFVLENBQ1IsUUFEUSxFQUVSLFNBRlEsRUFHUixTQUhRLEVBSVIsWUFKUSxFQUtSLE9BTFEsQ0FIVjtPQTVCRjtNQXVDQSxPQUFBLEVBRUU7UUFBQSxJQUFBLEVBQVUsT0FBVjtRQUNBLFNBQUEsRUFBVSxLQURWO09BekNGO01BNENBLFNBQUEsRUFFRTtRQUFBLElBQUEsRUFBVSxNQUFWO1FBQ0EsU0FBQSxFQUFVLEVBRFY7T0E5Q0Y7TUFpREEsT0FBQSxFQUtFO1FBQUEsSUFBQSxFQUFVLE1BQVY7UUFDQSxLQUFBLEVBQVUsSUFEVjtRQUVBLFNBQUEsRUFBVSxTQUZWO09BdERGO0tBRFc7SUE2RGIsTUFBTSxDQUFDLEtBQVAsQ0FDRTtNQUFBLE9BQUEsRUFBUyxDQUFUO01BQ0EsTUFBQSxFQUFTLENBRFQ7S0FERjtJQUlBLE1BQU0sQ0FBQyxPQUFQLENBQWUsS0FBZixDQUNFLENBQUMsR0FESCxDQUNPLFNBQUE7YUFBRyxJQUFDLENBQUEsUUFBRCxHQUFZLEtBQVosR0FBb0IsSUFBQyxDQUFBLElBQXJCLEdBQTRCLENBQUksSUFBQyxDQUFBLElBQUosR0FBYyxHQUFBLEdBQU0sSUFBQyxDQUFBLElBQXJCLEdBQUEsTUFBRCxDQUE1QixHQUEwRCxJQUFDLENBQUE7SUFBOUQsQ0FEUDs7TUFHQSxZQUFhLFVBQVUsQ0FBQyxLQUFYLENBQWlCLFdBQWpCLEVBQThCLE1BQTlCOztXQUNiLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0VBdEVGO0FBRmpCIiwiZmlsZSI6IlF1ZXVlSXRlbS5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIlF1ZXVlSXRlbSA9IHVuZGVmaW5lZFxuXG5tb2R1bGUuZXhwb3J0cyA9IChjb25uZWN0aW9uLCBjcmF3bGVyKSAtPlxuICBzY2hlbWEgPSBuZXcgY29ubmVjdGlvbi5iYXNlLlNjaGVtYVxuICAgIHByb3RvY29sOlxuICAgICAgdHlwZSAgICA6IFN0cmluZ1xuICAgICAgcmVxdWlyZWQ6IHllc1xuICAgICAgaW5kZXggICA6IHllc1xuXG4gICAgaG9zdCAgICA6XG4gICAgICB0eXBlICAgIDogU3RyaW5nXG4gICAgICByZXF1aXJlZDogeWVzXG4gICAgICBpbmRleCAgIDogeWVzXG5cbiAgICBwb3J0ICAgIDpcbiAgICAgIHR5cGUgICAgOiBOdW1iZXJcbiAgICAgIGluZGV4ICAgOiB5ZXNcblxuICAgIHBhdGggICAgOlxuICAgICAgdHlwZSAgICA6IFN0cmluZ1xuICAgICAgcmVxdWlyZWQ6IHllc1xuICAgICAgaW5kZXggICA6IHllc1xuXG4gICAgcmVmZXJyZXIgIDpcbiAgICAgIHR5cGUgICAgOiBTdHJpbmdcbiAgICAgIHJlcXVpcmVkOiBub1xuXG4gICAgZGVwdGggICAgIDpcbiAgICAgIHR5cGUgICAgOiBOdW1iZXJcbiAgICAgIHJlcXVpcmVkOiBub1xuXG4gICAgc3RhdHVzICA6XG4gICAgICB0eXBlICAgIDogU3RyaW5nXG4gICAgICBkZWZhdWx0IDogJ3F1ZXVlZCdcbiAgICAgIGluZGV4ICAgOiB5ZXNcbiAgICAgIGVudW0gICAgOiBbXG4gICAgICAgICdxdWV1ZWQnICAgICAgIyBBZGRlZCB0byBxdWV1ZVxuICAgICAgICAnc3Bvb2xlZCcgICAgICMgUmVxdWVzdGVkLCBidXQgbm8gcmVzcG9uc2UgeWV0XG4gICAgICAgICdmZXRjaGVkJyAgICAgIyBOb3JtYWwgcmVzcG9uc2UgKE9LKSByZWNlaXZlZC4gVGhpcyBpdGVtIGlzIGRvbmUuXG4gICAgICAgICdyZWRpcmVjdGVkJyAgIyAzMHggUmVkaXJlY3QgcmVjZWl2ZWQuIFRhcmdldCBzaG91bGQgcHJvYmFiaWx5IGJlIGFkZGVkIHRvIHF1ZXVlLCBidXQgaXQncyB1cCB0byBhcHBsaWNhdGlvbiBsb2dpYyB0byBoYW5kbGUgdGhpcy5cbiAgICAgICAgJ2Vycm9yJyAgICAgICAjIFNvbWUga2luZCBvZiBlcnJvci4gRGV0YWlscyBzaG91bGQgZ28gdG8gc3RhdGVEYXRhXG4gICAgICBdXG5cbiAgICBmZXRjaGVkIDpcbiAgICAgICMgVE9ETzogSXNuJ3QgaXQgcmVkdW5kYW50PyBXZSBoYXZlIHN0YXR1cyBmaWVsZCBmb3IgdGhhdC5cbiAgICAgIHR5cGUgICAgOiBCb29sZWFuXG4gICAgICBkZWZhdWx0IDogbm9cblxuICAgIHN0YXRlRGF0YTpcbiAgICAgICMgT3RoZXIgcHJvcGVydGllcyBvZiBJdGVtIChsaWtlIHN0YXRzLCBlcnJvciBkZXNjcmlwdGlvbilcbiAgICAgIHR5cGUgICAgOiBPYmplY3RcbiAgICAgIGRlZmF1bHQgOiB7fVxuXG4gICAgY3Jhd2xlciA6XG4gICAgICAjIElkZW50aWZpZXMgY3Jhd2xlciwgZm9yIHdoaWNoIHRoaXMgcXVldWUgaXMgaGVsZFxuICAgICAgIyBUT0RPOiBJdCB3b3VsZCBiZSBuaWNlIHRvIHVzZSBkaXNjcmltaW5hdG9ycyBpbnN0ZWFkLlxuICAgICAgIyBJdCB0aHJvd3MgRGlzY3JpbWluYXRvciBcIiN7bmFtZX1cIiBjYW4gb25seSBiZSBhIGRpc2NyaW1pbmF0b3Igb2YgdGhlIHJvb3QgbW9kZWxcbiAgICAgICMgV1RGP1xuICAgICAgdHlwZSAgICA6IFN0cmluZ1xuICAgICAgaW5kZXggICA6IHllc1xuICAgICAgZGVmYXVsdCA6ICdkZWZhdWx0J1xuXG4gICMgQ29tcG91bmQgaW5kZXggZm9yIGZpbmRBbmRNb2RpZnkgcXVlcnkgcnVuIGluIE1vbmdvUXVldWUjb2xkZXN0VW5mZXRjaGVkSXRlbVxuICAjIFdpdGhvdXQgaXQgbW9uZ29kIHByb2R1Y2VzIGdpZ2FieXRlcyBvZiBsb2dzIHdpdGggd2FybmluZ3NcbiAgc2NoZW1hLmluZGV4XG4gICAgY3Jhd2xlcjogMVxuICAgIHN0YXR1cyA6IDFcblxuICBzY2hlbWEudmlydHVhbCAndXJsJ1xuICAgIC5nZXQgLT4gQHByb3RvY29sICsgJzovLycgKyBAaG9zdCArIChpZiBAcG9ydCB0aGVuICc6JyArIEBwb3J0KSArIEBwYXRoXG5cbiAgUXVldWVJdGVtID89IGNvbm5lY3Rpb24ubW9kZWwgXCJRdWV1ZUl0ZW1cIiwgc2NoZW1hXG4gIG1vZHVsZS5leHBvcnRzID0gUXVldWVJdGVtXG4iXX0=
