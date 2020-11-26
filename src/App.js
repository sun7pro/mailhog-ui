import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import EmailContent from './EmailContent';
import EmailSummary from './EmailSummary';
import { HashRouter as Router, Switch, Route, useParams } from 'react-router-dom';

function EmailApp() {
  const [data, setData] = useState({});
  const [currentEmail, setCurrentEmail] = useState(null);

  useEffect(() => {
    fetch('/api/v2/messages?limit=2')
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  const onEmailClick = (email) => () => {
    setCurrentEmail(email);
  };

  const { emailId } = useParams();
  useEffect(() => {
    if (emailId && data.total) {
      const email = data.items.find((item) => item.ID === emailId);
      if (email) {
        setCurrentEmail(email);
      }
    }
  }, [data, emailId]);

  return (
    <div className="grid-container">
      <header>
        <a href="/">
          <img src={logo} alt="logo" />
          Mailhog Inbox
        </a>
      </header>
      <aside>
        <ul>
          {data.total > 0 &&
            data.items.map((email) => (
              <li key={email.ID}>
                <EmailSummary email={email} onEmailClick={onEmailClick} />
              </li>
            ))}
        </ul>
      </aside>
      <main className="content">
        <EmailContent email={currentEmail} />
      </main>
    </div>
  );
}
function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/:emailId">
          <EmailApp />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
