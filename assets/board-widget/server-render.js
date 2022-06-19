const fs = require("fs");

module.exports = function serverRenderBoardWidgets(document, assets) {
    var widgets = document.getElementsByClassName("exclaim-type-pr");

    for (const widget of widgets) renderWidget(widget, assets, document);

    if (widgets.length > 0) addScripts(document, assets);
}

function addScripts(document, assets) {
    var head = document.getElementsByTagName("head")[0];

    var style = document.createElement("link");
    style.setAttribute("rel", "stylesheet");
    style.setAttribute("href", assets.get("/board-widget/style.css"));
    head.appendChild(style);
}

function renderWidget(widget, assets, document) {
    widget.nodeName = widget.tagName = "div";
    widget.setAttribute("class", "board-widget");

    const spec = parseWidgetSpec(widget.textContent);
    widget.childNodes = [];

    enactWidget(widget, spec, assets, document);
}

function enactWidget(widget, spec, assets, document) {
    const boardScenario = spec.boardScenario;
    if (!boardScenario) throw "boardScenario must be specified in `board-widget`s!";

    const scenarioData = loadJSON(__dirname + "/scenarios/" + boardScenario + "/data.json");
    if (!spec.setup) throw "setup must be specified in `board-widget`s!";
    const setup = spec.setup.split(",");

    if (setup.includes("field")) {
        const board = buildBoardSvg(scenarioData, document);
        widget.appendChild(board);
        
        if (setup.includes("robot")) addRobot(board, scenarioData, spec, assets, document);

        if(typeof spec.drawLine === "string") addDrawnLine(board, spec, assets, document);
    }
}

function addDrawnLine(board, spec, assets, document) {
    const p = document.createElement("path");
    p.setAttribute("d", spec.drawLine + "");

    p.setAttribute("stroke", "limegreen");
    p.setAttribute("stroke-width", "0.1");
    p.setAttribute("fill", "none");

    board.appendChild(p);
}

function addRobot(widget, scenarioData, spec, assets, document) {
    const rbtSrc = `
    <rect x=".3375" y="5.7983e-7" width="1.125" height="1.8" rx=".1875" ry=".225" fill="#69482d" />
    <rect x="1.4625" y=".225" width=".225" height=".45" rx=".225" ry=".1125" fill="#4e4b48" />
    <rect x="1.4625" y="1.123" width=".225" height=".45" rx=".225" ry=".1125" fill="#4e4b48" />
    <rect x=".1125" y=".235" width=".225" height=".45" rx=".225" ry=".1125" fill="#4e4b48" />
    <rect x=".1125" y="1.133" width=".225" height=".45" rx=".225" ry=".1125" fill="#4e4b48" />
    <path d="m1.5283 0.226c-0.013977 0.0063-0.026252 0.01557-0.036431 0.0268l0.19564 0.09782v-0.0225c0-0.0081-9.889e-4 -0.01613-0.00264-0.02382zm-1.2842 0.01044-0.11861 0.05932c-0.007998 0.01548-0.012963 0.03278-0.012963 0.05147l0.17969-0.08987c-0.013938-0.01044-0.030191-0.01788-0.048121-0.02092zm1.2264 0.05076c-0.00496 0.01275-0.00796 0.02648-0.00796 0.04101l0.225 0.11251v-0.045zm-1.15 1e-3 -0.20799 0.10398v0.045l0.22289-0.11145c-0.002613-0.01367-0.007881-0.02616-0.014897-0.03752zm0.017007 0.08148-0.225 0.11251v0.045l0.225-0.11251zm1.125 0.0035v0.045l0.225 0.11251v-0.045zm-1.125 0.08653-0.225 0.11251c0 0.01459 0.00298 0.02828 0.007953 0.04099l0.21705-0.1085zm1.125 0.0035v0.045l0.20799 0.10398c0.00702-0.01137 0.012287-0.02392 0.014898-0.03752zm-1.125 0.08653-0.19564 0.09782c0.010179 0.01121 0.022449 0.02041 0.03643 0.0268l0.15658-0.07832c0.00165-0.0077 0.002639-0.01562 0.002639-0.02382zm1.125 0.0035c0 0.01868 0.00498 0.03599 0.012963 0.05145l0.11861 0.05933c0.017929-0.0031 0.034181-0.01045 0.048121-0.02092zm0.065787 0.57116c-0.013977 0.0063-0.026252 0.01557-0.036431 0.0268l0.19564 0.09782v-0.0225c0-0.0081-9.888e-4 -0.01613-0.00264-0.02382zm-1.35 0.01044c-0.013982 0.0063-0.026252 0.01557-0.03643 0.0268l0.19564 0.09782v-0.0225c0-0.0081-9.8877e-4 -0.01613-0.002639-0.02382zm1.2922 0.05075c-0.00496 0.01275-0.00796 0.02646-0.00796 0.04101l0.225 0.11214v-0.045zm-1.35 0.01044c-0.004969 0.01275-0.007953 0.02646-0.007953 0.04101l0.225 0.11251v-0.045zm1.342 0.07563v0.045l0.225 0.11251v-0.045zm-1.35 0.01044v0.045l0.225 0.11251v-0.045zm1.35 0.07962v0.045l0.20799 0.10397c0.00702-0.01137 0.012288-0.02392 0.014898-0.03752zm-1.35 0.01044v0.045l0.20799 0.10398c0.007016-0.01137 0.012287-0.02391 0.014897-0.03752zm1.35 0.07962c0 0.01868 0.00496 0.03599 0.012963 0.05145l0.11861 0.05933c0.017929-0.0031 0.03418-0.01044 0.048121-0.02092zm-1.35 0.01044c0 0.01868 0.00497 0.03599 0.012963 0.05145l0.11861 0.05932c0.017929-0.0031 0.034181-0.01044 0.04812-0.02092z" fill="#bbac93" />
    <rect x=".5625" y="5.7983e-7" width=".675" height="1.8" rx="0" ry="2.3244e-7" fill="#b09363" />
    <rect x=".675" y="1.462" width=".45" height=".3375" ry="2.3244e-7" fill="#3a434d" />
    <rect x=".7875" y="1.507" width=".1125" height=".1125" rx=".05625" ry=".05625" fill="#67e75f" />
    <text x="0.5625" textLength=".675" lengthAdjust="spacingAndGlyphs" font-size="0.35" dominant-baseline="hanging" fill="#69482d" style="user-select:none">o^o</text>
    `;
    
    const team = spec.team || "blue";

    const teamStartingPlace = findScenarioElementWithSpecialType(team + "-start", scenarioData);

    const robot = document.createElement("g");
    robot.setAttribute("class", "board-widget-robot");
    robot.setAttribute("transform", `translate(${teamStartingPlace.position.left} ${teamStartingPlace.position.top})`)

    robot.innerHTML = rbtSrc;

    widget.appendChild(robot);
}

function findScenarioElementWithSpecialType(type, scenarioData) {
    for(const elm of scenarioData.elements) {
        if(elm.specialType == type) return elm;
    }
}

function loadJSON(file) {
    return JSON.parse(fs.readFileSync(file));
}

function buildBoardSvg(scenarioData, document) {
    const svg = document.createElement("svg");
    svg.setAttribute("width", "8");
    svg.setAttribute("height", "8");
    svg.setAttribute("viewBox", "0 0 8 8");

    for (const element of scenarioData.elements) addScenarioElement(svg, element, document);

    return svg;
}

function addScenarioElement(svg, element, document) {

    if(element.specialType != undefined) return;


    const rect = document.createElement("rect");
    svg.appendChild(rect);

    rect.setAttribute("x", element.box.left + "");
    rect.setAttribute("y", element.box.top + "");
    rect.setAttribute("width", element.box.width + "");
    rect.setAttribute("height", element.box.height + "");

    if (element.colorType == "stroke") {
        rect.style.stroke = element.color;
        rect.style.strokeWidth = element.strokeWidth || "0.1";
        rect.style.fill = "none";
    } else {
        rect.style.fill = element.color;
    }

    if (element.rounded > 0) {
        rect.setAttribute("rx", element.rounded + "");
        rect.setAttribute("ry", element.rounded + "");
    }

    if (element.collides) {
        rect.style.filter = "drop-shadow(0px 0.1px 0px #333)"
        rect.style.transform = "translateY(-0.1px)";
    }
}

function parseWidgetSpec(spec) {
    const parsed = {};
    const directives = spec.split(";");

    for (const directive of directives) {
        const directiveTerms = directive.split(":");
        if (directiveTerms.length == 2) {
            const label = directiveTerms[0].trim();
            const value = directiveTerms[1].trim();

            parsed[label] = value;
        }
    }

    return parsed;
}