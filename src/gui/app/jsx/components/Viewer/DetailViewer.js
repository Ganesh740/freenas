/** @jsx React.DOM */

"use strict";

var React = require("react");
var TWBS  = require("react-bootstrap");

var Router = require("react-router");
var Link   = Router.Link;

var viewerUtil = require("./viewerUtil");

// Detail Viewer
var DetailViewer = React.createClass({
   propTypes: {
      defaultMode  : React.PropTypes.string
    , allowedModes : React.PropTypes.array
    , itemData     : React.PropTypes.object.isRequired
    , inputData    : React.PropTypes.array.isRequired
    , formatData   : React.PropTypes.object.isRequired
  }
  , handleChangeItem: function( key ) {
      // Pass selected key back to controller for global use
      this.props.handleItemSelect( key );
    }
  , render: function() {
    // Sidebar navigation for collection
    var createItem = function( rawItem, index ) {
      var params = {};
      params[ this.props.itemData.param ] = rawItem[ this.props.formatData["selectionKey"] ];
      return (
        <li role = "presentation"
            key  = { index } >
          <Link to     = { this.props.itemData.route }
                params = { params } >
            <viewerUtil.ItemIcon primaryString   = { rawItem[ this.props.formatData["secondaryKey"] ] }
                                 fallbackString  = { rawItem[ this.props.formatData["primaryKey"] ] }
                                 seedNumber      = { rawItem[ this.props.formatData["uniqueKey"] ] }
                                 fontSize        = { 1 } />
            <div className="text-container">
              <strong className="primary-text">{ rawItem[ this.props.formatData["primaryKey"] ] }</strong>
              <small className="secondary-text">{ rawItem[ this.props.formatData["secondaryKey"] ] }</small>
            </div>
          </Link>
        </li>
      );
    }.bind(this);

    return (
      <div className = "viewer-detail">
        <TWBS.Nav bsStyle   = "pills"
                  className = "viewer-detail-nav well"
                  stacked
                  activeKey = { this.props.selectedKey } >
          { this.props.inputData.map( createItem ) }
        </TWBS.Nav>

        <this.props.Editor inputData  = { this.props.inputData }
                           itemData   = { this.props.itemData }
                           formatData = { this.props.formatData }
                           ItemView   = { this.props.ItemView } />
      </div>
    );
  }
});

module.exports = DetailViewer;