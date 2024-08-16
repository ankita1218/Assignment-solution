(function () {
'use strict';

angular.module('NarrowItDownApp',[])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://coursera-jhu-default-rtdb.firebaseio.com")
.directive('narrowedItems', NarrowedItemsDirective);

function NarrowedItemsDirective() {
    var ddo = {
        templateUrl: 'narrowed-items.html',
        scope: {
            foundItems: '<',
            onRemove: '&'
        },
        controller: NarrowItDownDirectiveController,
        controllerAs: 'list',
        bindToController: true
    };
    return ddo
}

function NarrowItDownDirectiveController() {
    var list = this;

}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
    var list = this;
    list.foundItems = [];
    list.searchTerm = "";


    list.logItems = function () {
        if (list.searchTerm) {
            var promise = MenuSearchService.getMatchedMenuItems();
            
            promise.then(function (response) {
                list.items = response.data;
                for (let category in list.items) {
                    for (let menuItem in list.items[category].menu_items) {

                        if(list.items[category].menu_items[menuItem].description.toLowerCase().indexOf(list.searchTerm) !== -1) {
                            list.foundItems.push(list.items[category].menu_items[menuItem]);
                        };
                    }
                };
            })
            .catch(function (error) {
                console.log(error)
            });
        };
        
        list.isEmptyList = function () {
            if(list.foundItems.length !== 0 ){
                return false;
            }
        return true;
        };
        console.log(list.isEmptyList)
    }
    list.removeItem = function (itemIndex) {
        list.foundItems.splice(itemIndex, 1);
    }
};

MenuSearchService.$inject = ['$http', 'ApiBasePath']
function MenuSearchService($http, ApiBasePath) {
    var service = this;
    service.getMatchedMenuItems = function () {
        var response = $http({
            method: "GET",
            url: (ApiBasePath + "/menu_items.json")
        });
    return response
    }

};




})();