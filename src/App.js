import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import EmailContent from './EmailContent';
import EmailSummary from './EmailSummary';
import { HashRouter as Router, Switch, Route, useParams } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';

const PER_PAGE = 5;

function EmailApp() {
  const [data, setData] = useState({});
  const [currentEmail, setCurrentEmail] = useState(null);
  const [dataStartIndex, setDataStartIndex] = useState(0);

  useEffect(() => {
    fetch(`/api/v2/messages?limit=${PER_PAGE}&start=${dataStartIndex}`)
      .then((res) => res.json())
      .then((data) =>
        setData((prevData) => {
          if (!prevData.items) {
            return data;
          }
          const newData = { ...prevData };
          newData.items = newData.items.concat(data.items);
          return newData;
        })
      );
  }, [dataStartIndex]);

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
        {data.total > 0 && (
          <AutoSizer>
            {({ width, height }) => (
              <InfiniteLoader
                itemCount={data.total}
                isItemLoaded={(index) => {
                  return !!data.items[index];
                }}
                loadMoreItems={(startIndex) => {
                  setDataStartIndex(startIndex);
                }}
              >
                {({ onItemsRendered, ref }) => (
                  <List
                    onItemsRendered={onItemsRendered}
                    ref={ref}
                    height={height}
                    itemData={data.items}
                    itemCount={data.total}
                    itemSize={50}
                    width={width}
                  >
                    {({ index, style, data: items }) => {
                      return (
                        <div style={style}>
                          {items[index] && <EmailSummary email={items[index]} onEmailClick={onEmailClick} />}
                        </div>
                      );
                    }}
                  </List>
                )}
              </InfiniteLoader>
            )}
          </AutoSizer>
        )}
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
        <Route exact path="/:emailId?">
          <EmailApp />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
