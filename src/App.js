
import Axios from 'axios';

import { useState } from 'react';
import constants from './constants'
import './globals.css'
import './index.css'


function App() {
  var [_url, setUrl] = useState('')
  var [shortenedLink, setShortenedLink] = useState('')

  function handleUrlChange(e) {
    setUrl(e.target.value)
  }

  function validateURL() {
    // You can do a regex instead, i'll be a little straight forward
    var regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(_url)) {
      return [true]
    }

    return [false, `Sorry, please enter a valid URL`]
  }

  async function generateURL() {
    var [success, errorMessage] = validateURL()

    if (!success) return alert(errorMessage);

    // Send the link to our backend...

    var response = await Axios.get(`${constants.API_ENDPOINT}/shorten?url=${_url}`);
    var { success, message, url } = response.data;

    if (!success) return alert(message)
    setShortenedLink(url);
  }

  function visitShortLink() {
    window.location.href = shortenedLink;
  }

  return (
    <div className='container'>
      <h1 className='heading'>URL Shortner</h1>
      <div className='input-container'>
        <input onChange={handleUrlChange} value={_url} className='input' placeholder='Paste your url to shorten it...' />
      </div>
      {shortenedLink && <p onClick={visitShortLink} className='short-url'>
        {shortenedLink}
      </p>}
      <div className='button-container'>
        <button className='button' onClick={generateURL}>
          {/* We'll add an icon here */}
          Shorten URL
        </button>
        { shortenedLink && <button className='button' onClick={visitShortLink}>
          {/* We'll add an icon here */}
          Visit URL
        </button> }
      </div>
    </div>
  );
}

export default App;
