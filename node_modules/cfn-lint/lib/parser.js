'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _cloudformationJsYamlSchema = require('cloudformation-js-yaml-schema');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.openFile = function openFile(path) {

    // Check the file path is valid
    if (!_fs2.default.existsSync(path)) {
        throw Error('Could not find file ' + path + '. Check the input path.');
    }

    // Try JSON loading
    try {
        return openJson(path);
    } catch (e) {}

    // Try YAML loading
    try {
        return openYaml(path);
    } catch (e) {
        throw Error('Could not determine file type. Check your template is not malformed. ' + e.message);
    }
};

function openYaml(path) {

    // Try and load the Yaml
    var yamlParse = _jsYaml2.default.safeLoad(_fs2.default.readFileSync(path, 'utf8'), {
        filename: path,
        schema: _cloudformationJsYamlSchema.CLOUDFORMATION_SCHEMA,
        onWarning: function onWarning(warning) {
            console.error(warning);
        }
    });

    lastPlaceInTemplate = yamlParse;
    cleanupYaml(yamlParse);

    if ((typeof yamlParse === 'undefined' ? 'undefined' : _typeof(yamlParse)) == 'object') {
        return yamlParse;
    }

    // Yaml Parsing error
    throw new Error("YAML could not be parsed.");
}

function openJson(path) {

    return JSON.parse(_fs2.default.readFileSync(path, 'utf8'));
}

var lastPlaceInTemplate = null;
var lastKeyInTemplate = null;
function cleanupYaml(ref) {

    // Step into next attribute
    for (var i = 0; i < Object.keys(ref).length; i++) {
        var key = Object.keys(ref)[i];

        // Resolve the function
        if (ref[key].hasOwnProperty('class') && ref[key].hasOwnProperty('data')) {

            // We have a Yaml generated object

            // Define the name of the intrinsic function
            var outputKeyName = "Ref";
            if (ref[key]["class"] != "Ref") {
                outputKeyName = "Fn::" + ref[key]["class"];
            }

            // Convert the object to expected object type
            var outputData = null;
            var data = ref[key]['data'];
            // Specify the data of the key outputKeyName: {}
            if (typeof data == 'string') {
                // Split . into array if Fn::GetAtt
                if (outputKeyName == "Fn::GetAtt") {
                    outputData = data.split('.');
                } else {
                    outputData = data;
                }
            } else {
                // If Data is a yaml resolution object, check it doesn't need resolving
                lastPlaceInTemplate = ref[key];
                lastKeyInTemplate = 'data';
                cleanupYaml(data);
                // Set the resolved object
                outputData = data;
            }

            ref[key] = {};
            ref[key][outputKeyName] = outputData;
        } else if (key != 'Attributes' && _typeof(ref[key]) == "object") {
            lastPlaceInTemplate = ref;
            lastKeyInTemplate = key;
            cleanupYaml(ref[key]);
        }
    }
}