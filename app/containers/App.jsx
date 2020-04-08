import React from 'react';
import { connect } from 'react-redux'
import { editRow, deleteRow, addRow, toggleDirection } from '../actions';
import statesData from '../data/states-pop';

import DataMap from '../components/DataMap';
import DataTableBox from '../components/DataTableBox';
import Navbar from '../components/Navbar';

class App extends React.Component {
  constructor(props){
    super(props);
     var today = new Date(),
           date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
       this.state = {
           date: date
       };
    this.handleEditRow = this.handleEditRow.bind(this);
    this.handleDeleteRow = this.handleDeleteRow.bind(this);
    this.handleAddRow = this.handleAddRow.bind(this);
    this.handleToggleDirection = this.handleToggleDirection.bind(this);
  }
  handleDeleteRow(regionName, code){
    this.props.dispatch(deleteRow(regionName, code));
  }
  handleEditRow(regionName, newValue){
    this.props.dispatch(editRow(regionName, newValue));
  }
  handleAddRow(regionName, code, value){
    this.props.dispatch(addRow(regionName, code, value));
  }
  handleToggleDirection(newSortKey){
    this.props.dispatch(toggleDirection(newSortKey));
  }
  render() {
    var totalNumber = statesData[0].value;
    return (
      <div>
        <Navbar />
        <div id="datediv">First case: 2020/3/1 <br/> Today is: {this.state.date} </div>
        <table id="mainLayout">
         <th>
         <table id="TotConfirmedTable">
           <tr><th id="cases">Total Confirmed</th><td>{totalNumber}</td></tr>
         </table>
         <table id="TotDeathsTable">
            <tr> <th>Total Deaths</th><td>{totalNumber}</td></tr>
         </table>
         <table id="TotRecoveriesTable">
            <tr> <th>Total Recoveries</th><td>{totalNumber}</td></tr>
        </table>
         </th>
          <th id="MapColumn">
           <DataMap regionData={this.props.regionData} /> </th>
          <th id="TableColumn">
            <DataTableBox
              regionData={this.props.regionData}
              emptyRegions={this.props.emptyRegions}
              sortState={this.props.sortState}
              onEditRow={this.handleEditRow}
              onDeleteRow={this.handleDeleteRow}
              onAddRow={this.handleAddRow}
              toggleDirection={this.handleToggleDirection}
              />
            </th>
            <th>  </th>
        </table>
      </div>
    );
  }
}

App.propTypes = {
  regionData: React.PropTypes.array.isRequired,
  emptyRegions: React.PropTypes.array.isRequired,
  sortState: React.PropTypes.object.isRequired
};

function sortCollection(collection, sortState) {
  switch (sortState.direction) {
    case 'ASC':
      return collection.sort(function(a, b) {
        if (a[sortState.key] > b[sortState.key]) return 1;
        if (a[sortState.key] < b[sortState.key]) return -1;
        return 0;
      });

    case 'DESC':
      return collection.sort(function(a, b) {
        if (a[sortState.key] > b[sortState.key]) return -1;
        if (a[sortState.key] < b[sortState.key]) return 1;
        return 0;
      });

    default:
      return collection;
  }
}

function alphabeticOrder(collection) {
  return collection.sort(function(a, b) {
    if (a.regionName > b.regionName) return 1;
    if (a.regionName < b.regionName) return -1;
    return 0;
  });
}

function mapStateToProps(state) {
  return {
    regionData: sortCollection(state.regionData, state.sortState),
    emptyRegions: alphabeticOrder(state.emptyRegions),
    sortState: state.sortState
  }
}

export default connect(mapStateToProps)(App);
