// Script written by Mochuan X from freelancer.com
// https://www.freelancer.com/u/valor312?ref_project_id=20667800&w=f

// TODO: re-write package in axios
// See: https://github.com/request/request/issues/3143
let request = require('request');

const baseUrl = "https://www.hotschedules.com";
const loginUrl = baseUrl + "/hs/login.jsp";

// TODO: include a timeout so that the credentials (csrf) can be refreshed, especially in the cloud environment
var _loggedIn = false;
export function login(username: string, password: string) {
  return new Promise<any>((resolve, reject) => {
    if(!username || !password){
      reject(new Error('Missing login credentials'));
      return;
    }

    startSession();

    var j = request.jar();
    request({url: loginUrl, jar: j}, function (error, response, body) {
      if (error) {
        reject(new Error(error));
        return;
      }
      if (response.statusCode != 200) {
        reject("Server bad response: status code not 200");
        return;
      }

      //these are apparently not necessary
      // var cookie_string = j.getCookieString(loginUrl); // "key1=value1; key2=value2; ..."
      // var cookies = j.getCookies(loginUrl);

      let arr = body.match(/document[.]forms[.]loginForm[.]action.*['](.+prelogin.+)[']/);
      if (arr.length < 2) {
        reject(new Error("Server bad response: missing prelogin url"));
        return;
      }

      const preloginUrl = arr[1];

      arr = body.match(/name=["]_csrf["] value=["](.+)["]/);
      if (arr.length < 2) {
        reject(new Error("Server bad response: missing prelogin csrf value"));
        return;
      }

      const _csrf = arr[1];
      const fake_pass = "Password";

      // I don't want these logs anymore
      // console.log("PreLogin Url => " + preloginUrl);
      // console.log("Csrf Token => " + _csrf);

      request.post({url: preloginUrl, form: {
        _csrf, username, password, fake_pass
      }}, function(err, httpResponse, body) {
        if(err){
          reject(new Error(err));
          return;
        }

        const location = httpResponse.headers.location;
        if(!location){
          reject(new Error('Failed to login: wrong username/password'));
          return;

          // console.log(httpResponse.headers);
          // reject(new Error('Server bad response: Missing location header'));
          // return;
        }
        let arr = location.match(/;jsessionid=[0-9a-zA-Z]+/);

        if (!arr || arr.length < 1) {
          reject(new Error("Server bad response: missing prelogin jsessionid header"));
          return;
        }

        arr = location.split(arr[0]);

        const reLoginUrl = baseUrl + arr[0] + arr[1];
        // console.log("ReLogin Url => " + reLoginUrl);

        request(reLoginUrl, function (error, response, body) {
          if(error){
            reject(new Error(error));
            return;
          }

          _loggedIn = true;
          resolve();
        });
      });
    });
  });
}

export function hsget(_url) {
  return new Promise<any>((resolve, reject) => {
    if(!loggedIn())
      return reject('[login.js] Error: not yet logged in');

    request(_url, function (error, response, body) {
      if(error)
        return reject(new Error(error));

      const data = JSON.parse(body);
      resolve(data);
    });
  });
}

function loggedIn(){
  return _loggedIn;
}
function startSession(){
  const j = request.jar();
  request = request.defaults({jar: j});
}
