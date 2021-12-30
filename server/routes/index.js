var express = require('express');
var { nanoid } = require('nanoid')

var router = express.Router();

router.get('/shorten', async function (req, res, next) {

  var { db } = res.app.locals;
  var { url } = req.query;

  if (typeof url != 'string') {
    return res.json({
      success: false,
      message: 'Sorry wrong types sent to the api'
    });
  }

  if (!db) return res.json({ success: false, message: 'Something went wrong while connecting to the DB' });

  try {
    var result = await db.collection('urls').findOne({ original_url: url });
    if (result && result.shorten_url) {
      return res.json({
        success: true,
        message: 'Found the previously shortened url',
        url: result.shorten_url,
      })
    }

    /** If not found -- proceed to create one */
    var shorten_url = nanoid(4);
    var newUrl = await db.collection('urls').insertOne({
      original_url: url,
      shorten_url: `http://localhost:8080/api/${shorten_url}`,
      created_on: new Date().getTime(),
      code: shorten_url
    })

    return res.json({
      success: true,
      message: `shortened a link successfully!`,
      shorten_url: `http://localhost:8080/api/${shorten_url}`,
    })
  } catch (e) {
    return res.json({
      success: false,
      message: e.message,
    })
  }
});

router.get('/:code', async function(req, res, next) {
  var { code } = req.params

  if (typeof code != 'string') {
    return res.json({
      success: false,
      message: 'Invalid params sent to the API'
    })
  }

  var { db } = res.app.locals;

  if (!db) {
    return res.json({
      success: false,
      messase: 'Issue connecting to the Database'
    })
  }

  var result = await db.collection('urls').findOne({ code })
  if (!result || !result.code || typeof result.code != 'string') {
    return res.json({
      success: false,
      message: 'link invalid'
    })
  }
  var { original_url: _url } = result;

  var needReSlug = false;
  if (!_url.includes('https://') && !_url.includes('http://')) {
    needReSlug = true;
  }
  res.redirect(needReSlug ? `https://${_url}` : _url);
})

module.exports = router;
