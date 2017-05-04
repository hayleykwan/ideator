import React from 'react';

class NavBar extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <nav class='navbar'>
        <div class='container'>
          <div class='navbar-centre'>
            <div class='navbar-brand'>
              The Ideator
              {/* link to home page */}
            </div>
          </div>
          <div class='navbar-about'>
            About
          </div>
          <div id='navbar-user' class='navbar-user'>
            <ul>
              <li class='navbar-user-create'><a href="">Create</a></li>
              <li class='navbar-user-member'><a href="">Member</a></li>
              <li class='navbar-user-boards'><a href="">Boards</a></li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}

export default NavBar;
