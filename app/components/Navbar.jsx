import React from 'react';

export default class Navbar extends React.Component {
  constructor(props){
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
    this.state = { visibleNav: true };
    this.prevPosition = false;
  }
  componentDidMount() {
    this.prevPosition = window.scrollY;
    window.addEventListener('scroll', this.handleScroll);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
  handleScroll(){
    const newPosition = window.scrollY;
    if (this.prevPosition === newPosition) return;
    const visibleNav = (this.prevPosition < newPosition) ? false : true;
    this.setState({ visibleNav: visibleNav });
    this.prevPosition = newPosition;
  }
  render() {
    const navStyle = {
      top: (this.state.visibleNav) ? 0 : -(this.refs.navbar.offsetHeight),
      WebkitTransition: "all .25s ease-in-out",
      MozTransition: "all .25s ease-in-out",
      OTransition: "all .25s ease-in-out",
      transition: "all .25s ease-in-out"
    };

    return (
      <nav ref="navbar" className="navbar navbar-default navbar-fixed-top" style={navStyle}>
        <div className="container-fluid">
          <h2>TUNISIA - COVID 19 STATS</h2>
        </div>
      </nav>
    );
  }
}
