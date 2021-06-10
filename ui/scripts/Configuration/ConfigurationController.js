var configurationController = (function() {

    //config parameters
    let controllerConfig = {
        antipattern: false,
    };

	function initialize(setupConfig){
        application.transferConfigParams(setupConfig, controllerConfig);
    }
	
	function activate(rootDiv){
        rootDiv.setAttribute("style","height:100%");
        if(controllerConfig.antipattern) {
            prepareVisibilityLevelMenu(rootDiv);
            prepareBundledEdgesCheckbox(rootDiv);
        }
    }

    function prepareVisibilityLevelMenu(rootDiv){
        let a = document.createElement('a');
        const text = document.createTextNode("Visibility Level of Circular Dependencies");
        a.appendChild(text);
        a.href ="javascript: window.open(\"./glossary.html#level\",'glossary');";
        rootDiv.appendChild(a);
        prepareRadioButton(rootDiv, "showall", "Show all dependencies", 0);
        prepareRadioButton(rootDiv, "showcritical", "Only show critical dependencies", 0.25);
        prepareRadioButton(rootDiv, "showverycritical", "Only show very critical dependencies", 0.5);
        $('#showverycritical').jqxRadioButton('check');
    }

    function prepareRadioButton(rootDiv, id, text, value){
        const jqxId = "#" + id;
        let divElement = document.createElement("DIV");
        const textNode = document.createTextNode(text);
        divElement.appendChild(textNode);
        divElement.id = id;
        rootDiv.appendChild(divElement);
        $(jqxId).jqxRadioButton({ theme: "metro"});
        $(jqxId).bind('checked', function (event) {
            const applicationEvent = {
                sender: configurationController,
                entities: [value]
            };
            events.config.weight.publish(applicationEvent);
        });
    }

    function prepareBundledEdgesCheckbox(rootDiv) {
        const bundledEdgesCheckboxID = "#bundleCheckbox";
        let divElement = document.createElement("DIV");
        const textNode = document.createTextNode("Bundle dependencies");
        divElement.id = "bundleCheckbox";
        divElement.appendChild(textNode);
        rootDiv.appendChild(divElement);
        $(bundledEdgesCheckboxID).jqxCheckBox({theme: "metro", checked: false});
        $(bundledEdgesCheckboxID).on('checked', function () {
            const applicationEvent = {
                sender: configurationController,
                entities: [true]
            };
            events.config.bundledEdges.publish(applicationEvent);
        });
        $(bundledEdgesCheckboxID).on('unchecked', function () {
            const applicationEvent = {
                sender: configurationController,
                entities: [false]
            };
            events.config.bundledEdges.publish(applicationEvent);
        });
    }

	function reset(){
	}
    
    return {
        initialize: initialize,
		activate: activate,
		reset: reset
    };
})();
