// import { render, screen } from '@testing-library/react';
// import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

test('renders AWS 3-TIER WEB APP DEMO heading', () => {
  render(
    <Router>
      <App />
    </Router>
  );
  const headingElement = screen.getByText(/AWS 3-TIER WEB APP DEMO/i);
  expect(headingElement).toBeInTheDocument();
});
