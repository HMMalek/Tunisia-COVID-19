import topojson from 'topojson';
import d3 from 'd3';
import Datamap from 'datamaps/dist/datamaps.tun.min'
import React from 'react';
import ReactDOM from 'react-dom';
import statesDefaults from '../data/states-default';
import objectAssign from 'object-assign';

export default class DataMap extends React.Component {
  constructor(props){
    super(props);
    this.datamap = null;
  }

  linearPalleteScale(value){
    const dataValues = this.props.regionData.map(function(data) { return data.value });
    const minVal = Math.min(...dataValues);
    const maxVal = Math.max(...dataValues);
    return d3.scale.linear().domain([minVal, maxVal]).range(["#ffebe6","#ff3300"])(value);
  }
  redducedData(){
    const newData = this.props.regionData.reduce((object, data) => {
      object[data.code] = { value: data.value, fillColor: this.linearPalleteScale(data.value) };
      return object;
    }, {});
    return objectAssign({}, statesDefaults, newData);
  }
  renderMap(){

     var Themap = new Datamap({
      element: ReactDOM.findDOMNode(this),
      scope: 'tun',
      data: this.redducedData(),
      setProjection: function(element) {
      var projection = d3.geo.equirectangular()
      .center([10, 35])
      .scale(5500)
      .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
       var path = d3.geo.path()
      .projection(projection);
      return {path: path, projection: 'mercator'};
     },
      geographyConfig: {
        borderWidth: 0.5,
        highlightFillColor: '#FFCC80',
        popupTemplate: function(geography, data) {
          if (data && data.value) {
            return '<div class="hoverinfo"><strong>' + geography.properties.name + ', confirmed cases ' + data.value + '</strong></div>';
          } else {
            return '<div class="hoverinfo"><strong>' + geography.properties.name + '</strong></div>';
          }
        }
      }
    });

  return Themap;

  }
  currentScreenWidth(){
    return window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
  }
  componentDidMount(){
    const mapContainer = d3.select('#datamap-container');
    const initialScreenWidth = this.currentScreenWidth();
    const containerWidth = (initialScreenWidth < 600) ?
      { width: initialScreenWidth + 'px',  height: (initialScreenWidth * 0.5625) + 'px' } :
      { width: '120%', height: '100%' }
    mapContainer.style(containerWidth);
    this.datamap = this.renderMap();

  }
  componentDidUpdate(){
    this.datamap.updateChoropleth(this.redducedData());
  }
  componentWillUnmount(){
    d3.select('svg').remove();
  }
  render() {
    return (
      <div id="datamap-container"></div>
    );
  }
}

DataMap.propTypes = {
    regionData: React.PropTypes.array.isRequired
};
