const fs = require('fs');

// Example JSON cookies
const jsonCookies = [
    {
        "domain": ".youtube.com",
        "expirationDate": 1766896029.351519,
        "hostOnly": false,
        "httpOnly": false,
        "name": "__Secure-1PAPISID",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "ZSNN0lsZMm3JTIsM/AwHQ-KNOonXEOyoEp",
        "id": 1
    },
    {
        "domain": ".youtube.com",
        "expirationDate": 1766896029.351846,
        "hostOnly": false,
        "httpOnly": true,
        "name": "__Secure-1PSID",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "g.a000qghtyKsnZQQMReYlQeo5c22WxHMV4JepTRsBYRHz16bqo_ewS43SMKcyVkpWegtSz7vfagACgYKAV4SARUSFQHGX2MiE9Jb5U52mrXHysnMZWUaURoVAUF8yKre-QY_fmB-9v3IdpLlC8DU0076",
        "id": 2
    },
    {
        "domain": ".youtube.com",
        "expirationDate": 1764411709.093433,
        "hostOnly": false,
        "httpOnly": true,
        "name": "__Secure-1PSIDCC",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "AKEyXzUvHv88y7bMEOnS0bf2bMs7FMaoimqts23PsGp_z2XQJe-UqIRbWi4mv4WSnTAHekum9Q",
        "id": 3
    },
    {
        "domain": ".youtube.com",
        "expirationDate": 1764411362.601221,
        "hostOnly": false,
        "httpOnly": true,
        "name": "__Secure-1PSIDTS",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "sidts-CjIBQT4rXx62ET_VgtqpoBB2LWbzzajFSVq2ws87p-lGi_74vD98SK3v0BoC1RlItimdjhAA",
        "id": 4
    },
    {
        "domain": ".youtube.com",
        "expirationDate": 1766896029.351563,
        "hostOnly": false,
        "httpOnly": false,
        "name": "__Secure-3PAPISID",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "ZSNN0lsZMm3JTIsM/AwHQ-KNOonXEOyoEp",
        "id": 5
    },
    {
        "domain": ".youtube.com",
        "expirationDate": 1766896029.351917,
        "hostOnly": false,
        "httpOnly": true,
        "name": "__Secure-3PSID",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "g.a000qghtyKsnZQQMReYlQeo5c22WxHMV4JepTRsBYRHz16bqo_ewQke3Ghb7jpLQT-5TUuK74gACgYKAWwSARUSFQHGX2Mi8mqYT38HwSU3RoahVEdMPhoVAUF8yKrIrLu_nWw2Pwkpp1fP-Aka0076",
        "id": 6
    },
    {
        "domain": ".youtube.com",
        "expirationDate": 1764411709.093511,
        "hostOnly": false,
        "httpOnly": true,
        "name": "__Secure-3PSIDCC",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "AKEyXzXKNgl_-cVyJK9vu5FgRlGHHMuFmPTvV7RYE3kM9h6ZNerv-jALxT7nqUUd88rw3qGYZFc",
        "id": 7
    },
    {
        "domain": ".youtube.com",
        "expirationDate": 1764411362.601375,
        "hostOnly": false,
        "httpOnly": true,
        "name": "__Secure-3PSIDTS",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "sidts-CjIBQT4rXx62ET_VgtqpoBB2LWbzzajFSVq2ws87p-lGi_74vD98SK3v0BoC1RlItimdjhAA",
        "id": 8
    },
    {
        "domain": ".youtube.com",
        "expirationDate": 1766896029.351438,
        "hostOnly": false,
        "httpOnly": false,
        "name": "APISID",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "ExqwHkkQ87X0s5UH/A05fwhheZ5Gi5CkaM",
        "id": 9
    },
    {
        "domain": ".youtube.com",
        "expirationDate": 1766896029.35127,
        "hostOnly": false,
        "httpOnly": true,
        "name": "HSID",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "Ad69yUxUEdy_n8Nl6",
        "id": 10
    },
    {
        "domain": ".youtube.com",
        "expirationDate": 1764258211.561425,
        "hostOnly": false,
        "httpOnly": true,
        "name": "LOGIN_INFO",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "AFmmF2swRQIgS3TxhQx5KRFaGkHZGxu4KKL_rBGbI155ELNmvjIoO6YCIQCa1YPcpwmJMJ0yVgXXd2NThFp_h5IFzypP4RpKyFoYpg:QUQ3MjNmeF9Wbmo5OGxtSkQ5MzVJak1CNWgxREp1dE5EREcybDV3djZSRDA4UjUzRHZNTlNtZFJWRzNHM2FQVzNVYUZ5eHhVVk5Wc1RnQ2J0UWpUbkZLeXhOTzZMTkJ1cWFJOGc5N1l0SnZ6MWJFZU9EQkhoa0EwNThuM01xZktFY1lwbEZJMzBLZ3JFY1B0S2tFQXdQTFlEWTNQMWhjRzln",
        "id": 11
    },
    {
        "domain": ".youtube.com",
        "expirationDate": 1767434748.636789,
        "hostOnly": false,
        "httpOnly": false,
        "name": "PREF",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "f4=4000000&f6=40000000&tz=Asia.Calcutta&f7=100",
        "id": 12
    },
    {
        "domain": ".youtube.com",
        "expirationDate": 1766896029.351481,
        "hostOnly": false,
        "httpOnly": false,
        "name": "SAPISID",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "ZSNN0lsZMm3JTIsM/AwHQ-KNOonXEOyoEp",
        "id": 13
    },
    {
        "domain": ".youtube.com",
        "expirationDate": 1766896029.351808,
        "hostOnly": false,
        "httpOnly": false,
        "name": "SID",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "g.a000qghtyKsnZQQMReYlQeo5c22WxHMV4JepTRsBYRHz16bqo_ewCdLdXW3DMq3-td22ToiX9wACgYKAfYSARUSFQHGX2Mi9pfC05rwR-rX5Zypn2EuzBoVAUF8yKo6kTAKYeS1puyyXi4kqdq20076",
        "id": 14
    },
    {
        "domain": ".youtube.com",
        "expirationDate": 1764411709.093265,
        "hostOnly": false,
        "httpOnly": false,
        "name": "SIDCC",
        "path": "/",
        "sameSite": "unspecified",
        "secure": false,
        "session": false,
        "storeId": "0",
        "value": "AKEyXzWFcXgMnMsOzWxuF2eocIszco_uV8HmQyB09-WBTMMqyUSvI3i7Vw4Mhf1--YqnQIX-uQ",
        "id": 15
    },
    {
        "domain": ".youtube.com",
        "expirationDate": 1766896029.351388,
        "hostOnly": false,
        "httpOnly": true,
        "name": "SSID",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "AAuaQAHH8P1IHa9bw",
        "id": 16
    },
    {
        "domain": ".youtube.com",
        "expirationDate": 1748427709.085642,
        "hostOnly": false,
        "httpOnly": true,
        "name": "VISITOR_INFO1_LIVE",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "GODNPlM2uLc",
        "id": 17
    },
    {
        "domain": ".youtube.com",
        "expirationDate": 1748427709.085793,
        "hostOnly": false,
        "httpOnly": true,
        "name": "VISITOR_PRIVACY_METADATA",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "CgJJThIEGgAgHw%3D%3D",
        "id": 18
    },
    {
        "domain": ".youtube.com",
        "hostOnly": false,
        "httpOnly": true,
        "name": "YSC",
        "path": "/",
        "sameSite": "no_restriction",
        "secure": true,
        "session": true,
        "storeId": "0",
        "value": "JXBia-DLoCw",
        "id": 19
    }
    ];

// Function to convert JSON cookies to Netscape format
function convertCookiesToNetscapeFormat(cookies) {
    let cookieText = '# Netscape HTTP Cookie File\n';
    cookieText += '# This file was generated by yt-dlp\n';
    cookieText += '# https://github.com/yt-dlp/yt-dlp/wiki/FAQ#how-do-i-pass-cookies-to-yt-dlp\n\n';

    cookies.forEach(cookie => {
        const expiry = cookie.expirationDate ? Math.floor(cookie.expirationDate) : Math.floor(Date.now() / 1000); // Use expirationDate from JSON, or use the current time if not available
        const secure = cookie.secure ? 'TRUE' : 'FALSE';
        cookieText += `${cookie.domain}\tTRUE\t${cookie.path}\t${secure}\t${expiry}\t${cookie.name}\t${cookie.value}\n`;
    });

    return cookieText;
}

// Convert JSON cookies to Netscape format
const cookiesText = convertCookiesToNetscapeFormat(jsonCookies);

// Save the result to cookies.txt
fs.writeFileSync('cookies.txt', cookiesText, 'utf8');

console.log('Cookies saved to cookies.txt');