import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [title, setTitle] = useState<Person | null>(peopleFromServer[0]);
  const { name, born, died } = title ?? {};
  const [appliedValue, setAppliedValue] = useState('');
  const timerId = useRef(0);
  const delay = 300;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    window.clearTimeout(timerId.current);

    timerId.current = window.setTimeout(() => {
      setAppliedValue(e.target.value);
    }, delay);
  };

  useEffect(() => {
    if (title && inputValue !== title.name) {
      setTitle(null);
    }
  }, [inputValue, title]);

  const filteredPeople = useMemo(() => {
    if (appliedValue.trim() === '' && isFocused === true) {
      return peopleFromServer;
    }

    return [...peopleFromServer].filter(person =>
      person.name.toLowerCase().includes(appliedValue.toLowerCase().trim()),
    );
  }, [appliedValue, isFocused]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {title ? `${name} (${born} - ${died})` : 'No selected person'}
        </h1>

        <div className={`dropdown ${isFocused ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={inputValue}
              onChange={e => handleInputChange(e)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <button
                  key={person.name}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onMouseDown={() => {
                    setTitle(person);
                    setInputValue(person.name);
                    setAppliedValue(person.name);
                    setIsFocused(false);
                  }}
                >
                  <p className="has-text-link">{person.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {inputValue && filteredPeople.length === 0 && (
          <div
            className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </main>
    </div>
  );
};
