var AbstractComponent = require('kevoree-entities').AbstractComponent;

/**
 * Kevoree component
 * @type {GolViz}
 */
var GolViz = AbstractComponent.extend({
    toString: 'GolViz',
            
    construct: function () {
        this.onModelUpdate = function () { /* noop */ };
    },

    /**
     * this method will be called by the Kevoree platform when your component has to start
     * @param {Function} done
     */
    start: function (done) {
        this.core = this.getKevoreeCore();
        this.log.debug(this.toString(), 'START 1');
        this.log.debug("CORE >> ", this.core);
        var that = this;
        this.core.on('deployed', function () {
           that.onModelUpdate();
        });
        this.log.debug(this.toString(), 'START 2');
        done();
    },

    /**
     * this method is called by the Browser Runtime in order to retrieve
     * this component AngularJS UI controller
     */
    uiController: function () {
        var updateGrid = initCanvas(require('d3'), require('underscore'));
        return ['$scope', '$timeout', 'instance', function ($scope, $timeout, instance) {
            instance.onModelUpdate = function () {
                /* Scan the model*/
                var model = instance.core.getCurrentModel();

                var nodes = model.nodes.array;

                cells = [];
                nodes.forEach(function (node) {
                    var components = node.components.array;
                    components.forEach(function(component) {
                        if("GameOfLifeCell" === component.typeDefinition.name) {
                            var values = component.dictionary.values.array;
                            var dico = {};
                            values.forEach(function(value) {
                                dico[value.name] = value.value;
                            });

                            cells.push(dico);
                        }
                    });
                });

                // apply to the view
                updateGrid(cells);


            };

            instance.onModelUpdate();
        }];
    },

    getKevoreeCore: function () {
        return this.kCore;
    }
});

module.exports = GolViz;
