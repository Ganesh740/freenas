// Service Item Template
// =====================


"use strict";

var _      = require("lodash");
var React  = require("react");
var TWBS   = require("react-bootstrap");

var routerShim   = require("../../components/mixins/routerShim");
var clientStatus = require("../../components/mixins/clientStatus");

var viewerUtil = require("../../components/Viewer/viewerUtil");

var ServicesMiddleware = require("../../middleware/ServicesMiddleware");
var ServicesStore      = require("../../stores/ServicesStore");

var ServiceView = React.createClass({

    propTypes: {
      item: React.PropTypes.object.isRequired
    }

  , render: function() {

    var pid = null;

    if ( this.props.item["pid"] && typeof this.props.item["pid"] === "number" ) {
      pid = <h4 className="text-muted">{ viewerUtil.writeString( "PID: " + this.props.item["pid"], "\u200B" ) }</h4>;
    }

    return (
      <div className="viewer-item-info">
        <TWBS.Grid fluid>

        {/* General information */}
        <TWBS.Row>
          <TWBS.Col xs={3}
                    className="text-center">
            <viewerUtil.ItemIcon primaryString   = { this.props.item["name"] }
                                 fallbackString  = { this.props.item["name"] } />
          </TWBS.Col>
          <TWBS.Col xs={9}>
            <h3>{ this.props.item["name"] }</h3>
            <h4 className="text-muted">{ viewerUtil.writeString( this.props.item["state"], "\u200B" ) }</h4>
            { pid }
            <hr />
          </TWBS.Col>
        </TWBS.Row>

        </TWBS.Grid>
      </div>
    );
  }

});

var ServiceItem = React.createClass({

    propTypes: {
        viewData : React.PropTypes.object.isRequired
    }

  , mixins: [ routerShim, clientStatus ]

  , getInitialState: function() {
      return {
          targetService : this.getServiceFromStore()
        , currentMode   : "view"
        , activeRoute   : this.getDynamicRoute()
      };
    }

  , componentDidUpdate: function( prevProps, prevState ) {
      var activeRoute = this.getDynamicRoute();

      if ( activeRoute !== prevState.activeRoute ) {
        this.setState({
            targetService : this.getServiceFromStore()
          , currentMode   : "view"
          , activeRoute   : activeRoute
        });
      }
    }

  , componentDidMount: function() {
      ServicesStore.addChangeListener( this.updateServiceTarget );
    }

  , componentWillUnmount: function() {
      ServicesStore.removeChangeListener( this.updateServiceTarget );
    }

  , getServiceFromStore: function() {
      return ServicesStore.findServiceByKeyValue( this.props.viewData.format["selectionKey"], this.getDynamicRoute() );
    }

  , updateServiceTarget: function() {
      this.setState({ targetService: this.getServiceFromStore() });
    }

  , render: function() {
      var DisplayComponent = null;

      if ( this.state.SESSION_AUTHENTICATED && this.state.targetService ) {

        // DISPLAY COMPONENT
        var childProps = {
            handleViewChange : this.handleViewChange
          , item             : this.state.targetService
          , viewData         : this.props.viewData
        };

        switch ( this.state.currentMode ) {
          default:
          case "view":
            DisplayComponent = <ServiceView { ...childProps } />;
            break;

          case "edit":
            // TODO
            break;
        }

      }

      return (
        <div className="viewer-item-info">

          { DisplayComponent }

        </div>
      );
    }

});

module.exports = ServiceItem;