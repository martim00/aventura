// Extracted from google closure library. Apache license 2.0
//
// Copyright 2006 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// create the root namespace and making sure we're not overwriting it
var ns = ns || {};
 
// create a general purpose namespace method
// this will allow us to create namespace a bit easier
ns.provide = function (namespace) {
    var nsparts = namespace.split(".");
    //var parent = ns;
 
    // we want to be able to include or exclude the root namespace 
    // So we strip it if it's in the namespace
    //if (nsparts[0] === "ns") {
      //  nsparts = nsparts.slice(1);
    //}

    var parent = window[nsparts[0]] || {};    
    window[nsparts[0]] = parent;

    // loop through the parts and create 
    // a nested namespace if necessary
    for (var i = 1; i < nsparts.length; i++) {
        var partname = nsparts[i];
        // check if the current parent already has 
        // the namespace declared, if not create it
        if (typeof parent[partname] === "undefined") {
            parent[partname] = {};
        }
        // get a reference to the deepest element 
        // in the hierarchy so far
        parent = parent[partname];
    }
    // the parent is now completely constructed 
    // with empty namespaces and can be used.
    return parent;
};