const __env__= 'prod';
// const __dev_website_url__=' http://192.168.1.36/';
const __dev_website_url__='http://localhost/mifi-backend/api/';
const __prod_webside_url__='https://templates.mifi.bf/api/';

export default{
    timeout:5000,
    webside_url: __env__=='dev'? __dev_website_url__ : __prod_webside_url__ ,
}