// 发布与订阅模式
var pubsub = {}
pubsub.list = []

pubsub.listen = function(key, fn) {
    if (!this.list[key]) {
        this.list[key] = [];
    }
    this.list[key].push(fn);
}

pubsub.trigger = function() {
    var key = Array.prototype.shift.call(arguments)
    var fns = this.list[key]
    if (!fns || fns.length === 0) { return }
    for (var i = 0, fn; fn = fns[i++];) {
        fn.apply(this, arguments)
    }
}

pubsub.listen('listen1', function(key) {
    console.log(`1.1:${key}`)
})
pubsub.listen('listen1', function(key) {
    console.log(`1.2:${key}`)
})
pubsub.trigger('listen1', 111)