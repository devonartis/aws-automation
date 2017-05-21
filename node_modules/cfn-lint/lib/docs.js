'use strict';

var awsResources = require('../data/aws_resources_specification.json');
var awsExtraDocs = require('../data/aws_extra_docs.json');
var opn = require('opn');

exports.getDoc = function getDoc(search) {
    var browse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;


    var formattedSearch = search;

    // TODO: Make the searching case insensitive

    var docs = exports.getUrls(search);

    if (browse) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = docs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var u = _step.value;

                opn(u);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }

    var j = docs.join(", ");
    return 'Opening ' + j + ' in your browser...';
};

exports.getUrls = function getUrls() {
    var search = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';


    if (search == null) search = '';

    var docs = searchExtraDocs(search);

    if (docs.length == 0) {
        docs = searchInResources(search);
    }

    if (docs.length == 0) {
        var urlencoded = encodeURI(search);
        docs = ['http://docs.aws.amazon.com/search/doc-search.html?searchPath=documentation-guide&searchQuery=' + urlencoded + '&x=0&y=0&this_doc_product=AWS+CloudFormation&this_doc_guide=User+Guide&doc_locale=en_us#facet_doc_product=AWS%20CloudFormation&facet_doc_guide=User%20Guide'];
    }

    return docs;
};

function searchInResources(search) {
    var dotCount = (search.match(/\./g) || []).length;

    if (dotCount == 0) {

        // Resource Type
        if (awsResources['ResourceTypes'].hasOwnProperty(search)) {
            return [awsResources['ResourceTypes'][search]['Documentation']];
        }
    } else if (dotCount == 1) {

        var urls = new Array();

        // Check PropertyTypes
        if (awsResources['PropertyTypes'].hasOwnProperty(search)) {
            urls.push(awsResources['PropertyTypes'][search]['Documentation']);
        }

        // Split and check Resource, then a property of that resource
        var split = search.split('.');
        if (awsResources['ResourceTypes'].hasOwnProperty(split[0])) {
            if (awsResources['ResourceTypes'][split[0]]['Properties'].hasOwnProperty(split[1])) {
                urls.push(awsResources['ResourceTypes'][split[0]]['Properties'][split[1]]['Documentation']);
            }
        }

        if (urls.length > 0) {
            return urls;
        }
    } else if (dotCount == 2) {

        // Split and find a property of a PropertyType
        var _split = search.split('.');
        var propertyType = _split[0] + '.' + _split[1];

        if (awsResources['PropertyTypes'].hasOwnProperty(propertyType)) {
            if (awsResources['PropertyTypes'][propertyType]['Properties'].hasOwnProperty(_split[2])) {
                return [awsResources['PropertyTypes'][propertyType]['Properties'][_split[2]]['Documentation']];
            }
        }
    }

    return [];
}

function searchExtraDocs(search) {
    if (awsExtraDocs.hasOwnProperty(search)) {
        return [awsExtraDocs[search]];
    } else {
        return [];
    }
}