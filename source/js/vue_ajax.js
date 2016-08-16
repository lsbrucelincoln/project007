$(document).ready(function() {
    var vm = new Vue({
        el: "#admin_body",
        data: {
            records: [],
            userInfo: {},
            tasks: {},
            region: {},
            safeRule: {}
        },
        methods: {
            taskGetDetail: function(data) {

            }
        },
        created: function() {
            var self = this;
            var id = localStorage.getItem("id");
            $.post('/model', { name: 'User', start: "-1", "rows": id }, function(data, textStatus, xhr) {
                // console.log(data);
                if (data.state == 0) {
                    console.log(data);
                    vm.userInfo = data;
                    vm.userInfo.username = data.data.username;
                    vm.userInfo.RegionName = data.data.region.name;
                }
            });
            $.post('/model', { name: "Task", rows: 0 }, function(data, textStatus, xhr) {
                console.log(data);
                if (data.state == 0) {
                    // vm.taskGetDetail(data.data)
                    vm.tasks = data.data;
                }
            });
            $.post('/model', { name: "Region", rows: 0 }, function(data, textStatus, xhr) {
                console.log(data);
                vm.region = data;
            });
            $.post('/model', { name: "SafeRule", rows: 0 }, function(data, textStatus, xhr) {
                console.log(data);
                vm.safeRule = data;
            });
            
        },
        ready: function() {

        }
    })
});
