import React from 'react';
import { bool } from 'prop-types';
import { StyledMenu } from './Menu.styled';
import { Link } from "react-router-dom";

const Menu = ({ open, ...props }) => {
  return (
    <StyledMenu
      open={open}
      aria-hidden={!open}               // true when menu is closed, false when open
      data-testid="main-menu"            // <-- Add this so tests can find it
      {...props}
    >
      <div>
        <nav>
          <ul>
            <li>
              <Link
                to="/"
                tabIndex={open ? 0 : -1}  // focusable only when open
                style={{ outline: "none", border: "none" }}
              >
                <div style={{ paddingBottom: "2em", float: "left" }}>
                  <span aria-hidden="true">🏠</span> Home
                </div>
              </Link>
            </li>
            <li>
              <Link
                to="/db"
                tabIndex={open ? 0 : -1}
                style={{ outline: "none", border: "none" }}
              >
                <div style={{ paddingBottom: "2em", float: "left" }}>
                  <span aria-hidden="true">📋</span> DB Demo
                </div>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </StyledMenu>
  );
};

Menu.propTypes = {
  open: bool.isRequired,
};

export default Menu;
