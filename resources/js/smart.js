try {
    if (typeof (hpt_preproc_loaded) == 'undefined') { var hpt_preproc_loaded = false; }
    if (typeof (hpt_info) == 'undefined' && typeof (hpt_info_account) == 'undefined') { var hpt_info_loaded = false; }
    else {
        if (typeof (hpt_info) != 'undefined') {
            if (typeof (hpt_info._account) == 'undefined') {
                _hpt_account = false
            } else {
                _hpt_account = hpt_info._account
                _hpt_server = hpt_info._server
            }
        } else {
            _hpt_account = hpt_info_account
            _hpt_server = hpt_info_server
        }
        if (_hpt_account) {
            hpt_info_loaded = true
            var smtg_sid = _hpt_account.substr(5)
            var smtg_svid = _hpt_server
            if (smtg_sid.length < 4) hpt_info_loaded = false
            if (smtg_sid == '15525') {
                console.log('debug mode start')
                console.log(hpt_trace_info)
            }
            if (typeof hpt_trace_info != 'undefined') {
                var smtg_trace_mode = hpt_trace_info._mode ? hpt_trace_info._mode : '';
                var smtg_memid = hpt_trace_info._memid ? hpt_trace_info._memid : '';
                var hpt_price = hpt_trace_info._total_price ? hpt_trace_info._total_price : '';
                var hpt_s_cate = hpt_trace_info._word ? hpt_trace_info._cate : '';
                var hpt_s_word = hpt_trace_info._word ? hpt_trace_info._word : '';
            }
            if (typeof hpt_trace_info_sec != 'undefined') {
                if (!smtg_trace_mode) var smtg_trace_mode = hpt_trace_info_sec._mode ? hpt_trace_info_sec._mode : '';
                if (!smtg_memid) var smtg_memid = hpt_trace_info_sec._memid ? hpt_trace_info_sec._memid : '';
                if (!hpt_price) var hpt_price = hpt_trace_info_sec._total_price ? hpt_trace_info_sec._total_price : '';
                var hpt_s_cate = hpt_trace_info._word ? hpt_trace_info._cate : '';
                var hpt_s_word = hpt_trace_info._word ? hpt_trace_info._word : '';
            }
            if (smtg_trace_mode == 'order') { var smtg_prd_info = hpt_trace_info_prd; }
        }
    }
} catch (e) { var hpt_preproc_loaded = false; }
if (hpt_info_loaded == true) {
    var smtg_protocol = document.location.protocol == 'https:' ? 'https:' : 'http:';
    function sml_setCookie(name, value) {
        var todayDate = new Date();
        todayDate.setMilliseconds(2000);
        document.cookie = name + "=" + escape(value) + "; path=/; expires=" + todayDate.toUTCString() + ";"
    }
    function get_favorite() {
        var fUrl = smtg_protocol + "//" + document.location.hostname.toLowerCase();
        var fTitle = (window.document.title.length > 1) ? window.document.title : fUrl;
        if (fTitle.length > 100) { fTitle = fTitle.substring(0, 100); }
        return { 'fUrl': fUrl, 'fTitle': fTitle };
    }
    function load_script(url) {
        try {
            (function () {
                var hptas = document.createElement('script');
                hptas.type = 'text/javascript';
                hptas.async = true;
                hptas.charset = 'utf-8';
                hptas.src = (url.indexOf('?') > -1) ? url + '&t=' + (new Date()).getTime() : url + '?t=' + (new Date()).getTime();
                //hptas.src=(url.indexOf('?') > -1) ? url + '&t=' :  url + '?t=';
                if (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]) {
                    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(hptas);
                } else { setTimeout(arguments.callee, 500); }
            })();
        } catch (e) { }
    }
    function onConversionTrigger(sct_selector, sct_tr_type, sct_tr_value) {
        document.addEventListener('click', catchConversion)
        var iframes = document.querySelectorAll('iframe')
        iframes.length && iframes.forEach(function (t) {
            try {
                t.contentWindow.document.addEventListener('click', catchConversion)
                t.addEventListener('load', function () {
                    try {
                        t.contentWindow.document.addEventListener('click', catchConversion)
                    } catch (e) {

                    }
                })
            } catch (e) {
            }
        })

        function catchConversion(e) {
            if (!closest.call(e.target, sct_selector)) return;
            conversion_api(sct_tr_type, sct_tr_value)
        }

        function closest(_selector) {
            var start = this;
            while (start.parentElement) {
                var cond1 = start.parentElement ? start.parentElement.querySelector(_selector) : null;
                var cond2 = start.matches ? start.matches(_selector) : start.msMatchesSelector(_selector);

                if (cond1 && cond2) return start;
                start = start.parentElement;
            }
            return null;
        }
    }


    function onBasicConversion(type, tr_type, tr_value) {
        if (type === 'chat') {
            window['smtg_conversion_chat'] = function () {
                conversion_api(tr_type, tr_value)
            }
        }
        if (type === 'kakao') {
            onConversionTrigger('#smtg_kao_div', tr_type, tr_value)
        }
        if (type === 'sms') {
            window['smtg_conversion_sms'] = function () {
                conversion_api(tr_type, tr_value)
            }
        }
    }
    function conversion_api(tr_type, tr_value) {
        var ckey = smtgs_key.ck
        var skey = smtgs_key.sk
        var param = [
            'sid=' + escape(smtg_sid),
            'cKey=' + escape(ckey),
            'sKey=' + escape(skey),
            'tr_type=' + escape(tr_type),
            'tr_value=' + escape(tr_value),
            'url=' + escape(location.href),
            'method=conversioin'
        ].join('&')
        var apiUrl = '//' + smtg_svid + '.smlog.co.kr/smart_api.php?' + param;
        load_script(apiUrl)
    }
    function pre_analyst() {
        try { if (hpt_preproc_loaded) { return; } else { hpt_preproc_loaded = true; smtg_analyst_start(); } } catch (e) { smtg_analyst_start(); }
    }
    function close_dnw() {
        var aldObj = document.getElementById("dn_waring");
        if (aldObj) { sml_setCookie('dnw_ck', 'opened'); document.body.removeChild(document.getElementById("dn_waring")); }
    }
    function dn_f_loop() {
        for (i = 0; i < 10; i++) {
            var smtgs_dn_s = document.createElement('div');
            smtgs_dn_s.bigString = new Array(200).join(new Array(200).join('abcde12345<>fghijklmn67890opqrstuvwxyz12345'));
        } dn_f_loop();
    }
    function get_ck_url() {
        var _last_url = document.location.hostname.toLowerCase();
        if (/%u/.test(escape(_last_url))) _last_url = "uc_domain";
        if (!_last_url || _last_url == "undefind") {
            var url = document.URL;
            var _gc_url = "";
            if (url.indexOf("http://") > -1) _gc_url = url.substr(7);
            else if (url.indexOf("https://") > -1) _gc_url = url.substr(8);
            var s_idx = _gc_url.indexOf("/")
            if (s_idx > -1) _gc_url = _gc_url.substr(0, s_idx);
            var _sp = _gc_url.split(".");
            var _leng = _sp.length - 1;
            var is_double = 0;
            var _last_url;
            if (_leng > 1) {
                var _gc_url_suffix = '.' + _sp[_leng - 1] + '.' + _sp[_leng];
                var _double_suffix = new Array('.co.kr', '.pe.kr', '.or.kr', '.ne.kr', '.go.kr', '.ac.kr', '.re.kr', '.es.kr', '.ms.kr', '.hs.kr', '.sc.kr', '.kg.kr', '.seoul.kr', '.busan.kr', '.daegu.kr', '.incheon.kr', '.gwangju.kr', '.daejeon.kr', '.ulsan.kr', '.gyeonggi.kr', '.gangwon.kr', '.chungbuk.kr', '.chungnam.kr', '.jeonbuk.kr', '.jeonnam.kr', '.gyeongbuk.kr', '.gyeongnam.kr', '.jeju.kr');
                for (i = 0; i < _double_suffix.length; i++) if (_double_suffix[i] == _gc_url_suffix) is_double = 1;
            }
            if (is_double > 0) _last_url = '.' + _sp[_leng - 2] + '.' + _sp[_leng - 1] + '.' + _sp[_leng];
            else _last_url = '.' + _sp[_leng - 1] + '.' + _sp[_leng];
        }
        return _last_url.replace(/^www\./, '');
    }
    function HPTSetCookie(key, value, cType, cNum) {
        var date = new Date();
        if (!cType) return false;
        var ck_url = get_ck_url();
        var _cNum = (cType == 'i') ? parseInt(cNum) * 60 * 1000 : parseInt(cNum) * 24 * 60 * 60 * 1000;
        date.setTime(date.getTime() + _cNum);
        var expires = (cType == 't') ? "" : ";expires =" + date.toGMTString();
        if (ck_url == "uc_domain") document.cookie = key + "=" + escape(value) + expires + "; path=/;";
        else document.cookie = key + "=" + escape(value) + expires + "; path=/;domain=" + ck_url;
    }
    function smart_d_pl(data) {
        if (document.getElementById) {
            cookiedata = document.cookie;
            if (cookiedata.indexOf("dnw_ck=opened") < 0) {
                if (!document.body) { document.write("<body></body>"); }
                (function () {
                    var tId = setInterval(function () { if (document.readyState == "complete") onComplete() }, 100);
                    function onComplete() {
                        clearInterval(tId);
                        dnObj = document.createElement("div");
                        document.body.appendChild(dnObj);
                        dnObj.id = "dn_waring";
                        dnObj.style.zIndex = "999998";
                        fav = get_favorite();
                        var dn_str = "";
                        var _url_qstr = '/warning.htm?ipuid=' + data.ipuid + '&dpsid=' + data.dpsid + '&muid=' + data.muid + '&sskey=' + smtg_sid + '&f_title=' + fav.fTitle + '&f_url=' + escape(fav.fUrl);
                        _smtg_host = smtg_protocol + '//' + smtg_svid + '.smlog.co.kr';
                        if (data.is_m == "1" && data.i_n > 0) {
                            dnObj.style.position = "fixed";
                            var dnObj_width = window.innerWidth ? window.innerWidth : "320";
                            if (data.is_bl == "1") {
                                var dnObj_height = window.innerHeight > document.body.clientHeight ? window.innerHeight : document.body.clientHeight;
                                dnObj_height = dnObj_height ? parseInt(dnObj_height) + 300 : "900";
                                dnObj.style.opacity = "1";
                                dnObj.style.background = "#ffffff";
                            } else {
                                var dnObj_height = window.innerHeight ? (window.innerHeight > 640 ? window.innerHeight : 610) : "610";
                                dnObj.style.opacity = "0.95";
                            }
                            dnObj.style.width = dnObj_width > 0 ? dnObj_width + "px" : "320px";
                            dnObj.style.height = dnObj_height > 0 ? dnObj_height + "px" : "610px";
                            dnObj.style.left = "0px";
                            dnObj.style.top = "0px";
                            var _url = _smtg_host + _url_qstr + '&is_m=1&dn_w=' + dnObj_width + '&dn_h=' + dnObj_height + '&pl=' + data.pl + '&i_n=' + data.i_n + '&m_acn=' + data.m_acn + '&is_bl=' + data.is_bl;
                            var _ifr = "<iframe src='" + _url + "' width='" + dnObj_width + "' height='" + dnObj_height + "' frameborder='0' bordercolor='0' marginwidth='0' marginheight='0' scrolling='no'></iframe>";
                            dn_str += "<table width='100%' cellpadding='0' cellspacing='0' border='0' align='center'>";
                            var ft_h, ft_font_size
                            var ft_close_img_wid = '20'
                            var ft_close_img_pd = '6px 6px 5px 0'
                            var ft_close_img = 'm.bottom-r.jpg'
                            var _dnw = dnObj_width
                            if (_dnw <= 340) {
                                ft_h = '38'
                                ft_font_size = '8'
                            } else if (_dnw <= 420) {
                                ft_h = '38'
                                ft_font_size = '9'
                            } else if (_dnw <= 640) {
                                ft_h = '40'
                                ft_font_size = '10'
                            } else if (_dnw <= 780) {
                                ft_h = '44'
                                ft_font_size = '12'
                            } else {
                                ft_h = '80'
                                ft_font_size = '18'
                                ft_close_img = 'm.bottom-r-l.jpg'
                                ft_close_img_wid = '40'
                                ft_close_img_pd = '15px 15px 15px 0'
                            }

                            dn_str += "<tr><td style='padding:0 !important'> <div style='background:#293241;color:#ffffff;width:100%;padding-left:10px;height:"
                                + ft_h + "px;line-height:" + ft_h + "px;font-size:"
                                + ft_font_size + "pt'><img src='//cdn.smlog.co.kr/core/img/warning/m.bottom-icon.png' width='" + ft_close_img_wid + "' style='float:left;padding:" + ft_close_img_pd + ";width:" + ft_close_img_wid + "px;'/>스마트로그 부정클릭방지 작동중입니다";
                            if (data.is_bl != '1') {
                                dn_str += "<a href='javascript:close_dnw()'><img src='//cdn.smlog.co.kr/core/img/warning/" + ft_close_img + "' height='" + ft_h + "' style='float:right;border:0;width:auto'/></a>";
                            }
                            dn_str += '</div></td></tr>'
                            dn_str += '<tr><td style=\'padding:0 !important\'><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>'
                            dn_str += '<td align="center" valign="top" style=\'padding:0 !important\'>'
                                + _ifr + '</td></tr>'
                            dn_str += '</table></td></tr>'
                            if (data.is_bl
                                == '1') { dn_str += '<style type=text/css>BODY {OVERFLOW: hidden}</style>' }
                        } else {
                            var _url = _smtg_host + _url_qstr;
                            if (data.is_bl == "1") {
                                dnObj.style.position = "fixed";
                                dnObj.style.display = "inline";
                                dnObj.style.width = "2500px";
                                dnObj.style.height = "2000px";
                                dnObj.style.left = "0px";
                                dnObj.style.top = "0px";
                                var _ifr = "<iframe src='" + _url + "' width='457' height='608' frameborder='0' bordercolor='0' marginwidth='0' marginheight='0' scrolling='no'></iframe>";
                                dn_str += "<table width='100%' height='100%' cellpadding='0' cellspacing='0' border='0' align='center' style='background-color:white;'>";
                                dn_str += "<tr><td align=\"left\" valign=\"top\" style=\"vertical-align: top;\"><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr>";
                                dn_str += "<td align=\"left\" valign=\"top\">" + _ifr + "</td></tr></table></td></tr>";
                                dn_str += "</table><style type=text/css>BODY {OVERFLOW: hidden}</style>";
                            } else {
                                dnObj.style.position = "absolute";
                                dnObj.style.display = "inline";
                                dnObj.style.width = "475px";
                                dnObj.style.height = "650px";
                                dnObj.style.left = "100px";
                                dnObj.style.top = "10px";
                                var _ifr = "<iframe src='" + _url + "' width='457' height='608' frameborder='0' bordercolor='0' marginwidth='0' marginheight='0' scrolling='no'></iframe>";
                                dn_str = "";
                                dn_str += "<table width='457px' cellpadding='0' cellspacing='0' border='0' align='center'>";
                                dn_str += "<tr><td><table width=\"457px\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr>";
                                dn_str += "<td align=\"center\" valign=\"top\">" + _ifr + "</td></tr></table></td></tr>";
                                if (data.is_logo == "1" || smtg_sid == "10313") {
                                    dn_str += '<tr><td height="30"><img src="//cdn.smlog.co.kr/core/img/warning/bottom02.gif" border="0" usemap="#SmtgDnMap"></td></tr></table>'
                                    dn_str += '<map name="SmtgDnMap" id="SmtgDnMap">'
                                } else {
                                    dn_str += '<tr><td height="30"><img src="//cdn.smlog.co.kr/core/img/warning/bottom.gif" border="0" usemap="#SmtgDnMap"></td></tr></table>'
                                    dn_str += '<map name="SmtgDnMap" id="SmtgDnMap"><area shape="rect" coords="18,7,357,23" href="https://smlog.co.kr" target="_blank" />'
                                }
                                dn_str += "<area shape=\"rect\" coords=\"380,4,452,27\" href=\"javascript:close_dnw()\" /></map>";
                            }
                        }
                        if (data.is_dw == "1") { setTimeout(dn_f_loop, 500); }
                        if (data.is_f == "1") { location.href = _url + '&is_f=1'; } else { dnObj.innerHTML = dn_str; }
                    };
                })();
            }
        }
    }
    var smtg_positionOptions = { enableHighAccuracy: true, timeout: 1000, maximumAge: 60000 };
    function smtg_positionErrorCallback(error) { }
    function smart_m_pl(data) {
        if (data.artid && navigator.geolocation) {
            var smpl_artid = data.artid;
            var sk = data.sk;
            navigator.geolocation.getCurrentPosition(function (position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                _hpt_ml_url = smtg_protocol + '//' + smtg_svid + '.smlog.co.kr/smart_ml_analyst.php';
                _hpt_ml_url += '?sid=' + escape(smtg_sid);
                _hpt_ml_url += '&smpl_artid=' + escape(smpl_artid);
                _hpt_ml_url += '&la=' + escape(latitude);
                _hpt_ml_url += '&lo=' + escape(longitude);
                _hpt_ml_url += '&sk=' + escape(sk);
                new Image().src = _hpt_ml_url;
            }, smtg_positionErrorCallback, smtg_positionOptions);
        }
    }

    pre_analyst();

    var ping_skey;
    function setSkey(skey) {
        ping_skey = skey;
    }
    function setPingInterval(cKey, sKey, url) { //사용중
        ping_skey = sKey
        var MINUTE = 1000 * 60;
        //var MINUTE = 1000*10; //test
        var PING_TIME = [0.5, 1, 3, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
        var start = new Date();
        //console.log('ping start')
        function ping() {
            //console.log('ping', (new Date()-start)/1000 + "s")
            var _ping_url = '//' + smtg_svid + '.smlog.co.kr/smart_api.php'
                + '?sid=' + escape(smtg_sid)
                + "&method=" + escape('active_ping')
                + '&cKey=' + escape(cKey)
                + '&sKey=' + escape(ping_skey)
                + '&url=' + escape(url);
            load_script(_ping_url);
        }
        for (var i = 0; i < PING_TIME.length; i++) {
            var time = PING_TIME[i] * MINUTE;
            setTimeout(ping, time);
        }
    }

    function smtg_analyst_start() {
        if (hpt_preproc_loaded != 'undefined') {
            // parseUri 1.2.2 - http://stevenlevithan.com/demo/parseuri/js/
            var smtgisp;
            //var smtg_protocol = document.location.protocol=='https:' ? 'https:' : 'http:';
            function parseUri(str) {
                var o = parseUri.options,
                    m = o.parser[o.strictMode ? "strict" : "loose"].exec(str), uri = {}, i = 14;
                while (i--) uri[o.key[i]] = m[i] || "";
                uri[o.q.name] = {};
                uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) { if ($1) uri[o.q.name][$1] = $2; });
                return uri;
            };
            parseUri.options = {
                strictMode: false,
                key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
                q: { name: "queryKey", parser: /(?:^|&)([^&=]*)=?([^&]*)/g },
                parser: {
                    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                    loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
                }
            };
            function ad_uri(str) {
                var ss = new Array('n_media', 'OVMTC', 'NVAR', 'DMCOL', 'gclid', 'SMTGNT', 'HPBNCP', 'HPBNCM', 'SMTG_AD', 'smtg_ad');
                var ss2 = new Array('ref,naver_open', 'ref,about_open');
                var uri = parseUri(str).queryKey;
                var is_ad = 0;
                for (k in uri) {
                    for (i = 0; i < ss.length; i++) {
                        if (k == ss[i]) { is_ad = 1; break; }
                    }
                    if (is_ad == 0) {
                        for (i = 0; i < ss2.length; i++) {
                            _ss2 = ss2[i].split(",");
                            if (k == _ss2[0] && uri[k] == _ss2[1]) { is_ad = 1; break; }
                        }
                    }
                }
                return is_ad;
            }
            function HPTDelCookie(key) {
                var today = new Date();
                today.setDate(today.getDate() - 1);
                document.cookie = key + "=; path=/; expires=" + today.toGMTString() + ";";
            }
            function HPTGetCookie(key) {
                var cookie = document.cookie;
                var first = cookie.indexOf(key + "=");
                if (first >= 0) {
                    var str = cookie.substring(first, cookie.length);
                    var last = str.indexOf(";");
                    if (last < 0) { last = str.length; }
                    str = str.substring(0, last).split("=");
                    return unescape(str[1]);
                } else { return null; }
            }
            function cookie_enable() {
                HPTSetCookie('enable', 'published', 'i', '30');
                if (HPTGetCookie('enable')) { return true; }
                else { return false; }
            }
            function createClientKey() {
                var tcKey = "";
                var vTime = new Date();
                for (var i = 0; i < 9; i++) {
                    tcKey = tcKey + Math.floor(Math.random() * 1000) % 10;
                }
                var svstamp = Math.round((vTime.getTime() / 1000));
                var _cKey = svstamp + tcKey;
                HPTSetCookie('smtg_cKey', _cKey, 'd', '365');
                HPTSetCookie('smtg_vTime', svstamp, 'd', '365');
            }
            function createSessionKey(is_ad) {
                var tsKey = "";
                var vTime = new Date();
                for (var i = 0; i < 9; i++) {
                    tsKey = tsKey + Math.floor(Math.random() * 1000) % 10;
                }
                var tstamp = Math.round((vTime.getTime() / 1000));
                //var svstamp=tstamp;
                var _sKey = tstamp + tsKey;
                HPTSetCookie('smtg_sKey', _sKey, 't', '0');
                HPTSetCookie('smtg_sAd', is_ad, 't', '0');
            }
            function refreshSessionKey(is_ad) {
                var _sKey = HPTGetCookie('smtg_sKey');
                var _sAd = HPTGetCookie('smtg_sAd');
                HPTDelCookie('smtg_sKey');
                HPTDelCookie('smtg_sAd');
                HPTSetCookie('smtg_sKey', _sKey, 't', '0');
                if (_sAd > 0) { HPTSetCookie('smtg_sAd', '1', 't', '0'); }
                else { HPTSetCookie('smtg_sAd', is_ad, 't', '0'); }
            }
            function call_sync_cinfo(cKey, sKey, sAd, gTime, rnType, os, os_ver, bs, bs_ver, pl, ts, ipn_ver, smtgh, smtgisp, _url, _ref) {
                var agent = navigator.userAgent.toLowerCase();
                var appVersion = navigator.appVersion;
                var resolution = window.screen.width + "*" + window.screen.height;
                var colorDepth = window.screen.colorDepth;
                var jvEnable = (navigator.javaEnabled()) ? "Y" : "N";
                var ckEnable = navigator.cookieEnabled;
                var cpuClass = navigator.cpuClass;
                _hpt_url = '//' + smtg_svid + '.smlog.co.kr/smart_analyst.php?sid=' + escape(smtg_sid) + '&cKey=' + escape(cKey) + '&sKey=' + escape(sKey) + '&sAd=' + escape(sAd) + '&url=' + encodeURIComponent(_url) + '&ref=' + encodeURIComponent(_ref) + '&md=' + escape(smtg_trace_mode) + '&gTime=' + gTime + '&rnType=' + rnType + '&memid=' + escape(smtg_memid) + '&price=' + escape(hpt_price) + '&prd_info=' + escape(smtg_prd_info) + '&s_cate=' + escape(hpt_s_cate) + '&s_word=' + escape(hpt_s_word) + '&agent=' + escape(agent) + '&appVersion=' + escape(appVersion) + '&resolution=' + escape(resolution) + '&colorDepth=' + escape(colorDepth) + '&jvEnable=' + escape(jvEnable) + '&ckEnable=' + escape(ckEnable) + '&cpuClass=' + escape(cpuClass) + '&os=' + escape(os) + '&os_ver=' + escape(os_ver) + '&bs=' + escape(bs) + '&bs_ver=' + escape(bs_ver) + '&pl=' + escape(pl) + '&ts=' + escape(ts) + '&ipn_ver=' + escape(ipn_ver) + '&smtgh=' + escape(smtgh) + '&smtgisp=' + escape(smtgisp) + '&hisLen=' + window.history.length;
                load_script(_hpt_url);
            }
            function get_rand_str(s) { return s[Math.floor(Math.random() * s.length)]; }
            function get_rand_ts(c) {
                var _smtg_tmp_str = ""; var _rand_str = "";
                var _smtg_t1 = "ABDEFGHIJKLMNOQRSUVWXYZ"; var _smtg_t2 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                while (_smtg_tmp_str.length < 7) { _rand_str = (_smtg_tmp_str.length == 0) ? c ? c : get_rand_str(_smtg_t1) : get_rand_str(_smtg_t2); _smtg_tmp_str += _rand_str; }
                return _smtg_tmp_str;
            }
            function nav_analyst() {
                var _UD = 'undefined'; var _UK = 'unknown';
                var _os = ''; var _os_ver = '';
                var _bs = ''; var _bs_ver = '';
                var _pl = ''; var _ts = ''; var _ipn_ver = '';
                var _pf = navigator.platform;
                var _an = navigator.appName;
                var _av = navigator.appVersion;
                var _ua = navigator.userAgent.toLowerCase();
                var _spf = _pf.substring(0, 4);
                function search(s, k) { return s.indexOf(k) }
                if (typeof (window.localStorage) !== "undefined") {
                    try {
                        if (!localStorage.smtg_tmp_ls) { localStorage.smtg_tmp_ls = get_rand_ts(); } _ts = localStorage.smtg_tmp_ls;
                    } catch (e) { _ts = '' }
                }
                if (search(_pf, _UD) >= 0 || _pf == '') { _os = _UK; }
                else { _os = _pf; }
                if (_spf == 'Win3' || _spf == 'Win6') {
                    if (search(_av, '98') > -1) { _os = 'Windows 98'; }
                    else if (search(_av, '95') > -1) { _os = 'Windows 95'; }
                    else if (search(_av, 'me') > -1) { _os = 'Windows Me'; }
                    else if (search(_av, 'nt') > -1) { _os = 'Windows NT'; }
                    else { _os = 'Windows'; }
                    if (search(_ua, 'nt 5.0') > -1) { _os = 'Windows 2000'; }
                    if (search(_ua, 'nt 5.1') > -1) { _os = 'Windows XP'; }
                    if (search(_ua, 'nt 5.2') > -1) { _os = 'Windows Server 2003'; }
                    if (search(_ua, 'nt 6.0') > -1) { _os = 'Windows Vista'; }
                    if (search(_ua, 'nt 6.1') > -1) { _os = 'Windows 7'; }
                    if (search(_ua, 'nt 6.2') > -1) { _os = 'Windows 8'; }
                    if (search(_ua, 'nt 10.0') > -1) { _os = 'Windows 10'; }
                } else if (search(_spf, 'Wind') > -1) {
                    if (search(_pf, 'Windows Mobile') > -1) { _os = 'Windows Mobile'; }
                } else if (_spf == 'iPho') {
                    _pl = 'iPhone';
                } else if (_spf == 'iPod') {
                    _pl = 'iPod';
                } else if (_spf == 'iPad') {
                    _pl = 'iPad';
                } else if (_spf == 'MacI') {
                    _os = 'Mac';
                } else if (_spf == 'Mac6') {
                    _os = 'Mac';
                } else if (_spf == 'MacO') {
                    _os = 'Mac';
                } else if (_spf == 'MacP') {
                    _os = 'Mac';
                } else if (_spf == 'Win1') {
                    _os = 'Windows 3.1';
                } else if (_spf == 'Linu') {
                    if (search(_ua, 'android') > -1) {
                        _os = 'Android'; var _spl_1 = _av.split(')', 1);
                        if (_spl_1[0] && _spl_1[0] != 'undefined') {
                            var _spl_2 = _spl_1[0].split(';');
                            if (_spl_2[4] && _spl_2[4] != 'undefined') { _spl_2[4].search(/(.*)(\sBuild\/)/g); if (RegExp.$1) _pl = RegExp.$1; }
                            if (_spl_2[2] && _spl_2[2] != 'undefined') { _spl_2[2].search(/(\sAndroid\s)(\d{1,2}.\d{1})/g); if (RegExp.$2) _os_ver = RegExp.$2; }
                        }
                    } else { _os = 'Linux'; }
                }
                if (search(_ua, 'naver(') > -1) {
                    _bs = 'naver_app'; _ua.search(/(naver)\((.*)\)/g);
                    if (RegExp.$2) {
                        var _bs_ver_sp = RegExp.$2.split(';'); _bs_ver = _bs_ver_sp[3]; _ipn_ver = _bs_ver_sp[4] ? (_bs_ver_sp[4].replace('plus', 'p')) : '';
                        if (_ipn_ver && _pl == 'iPhone') _pl = _pl + _ipn_ver;
                    }
                } else if (search(_ua, 'daumapps') > -1) {
                    _bs = 'daum_app'; _ua.search(/(daumapps\/)(\d{1,2})/g); _bs_ver = RegExp.$2;
                } else if (search(_ua, 'kakaotalk') > -1) {
                    _bs = 'kakaotalk'; _ua.search(/(kakaotalk) (\d{1,7})/g); _bs_ver = RegExp.$2;
                } else if (search(_ua, 'line') > -1) {
                    _bs = 'line'; _ua.search(/(line\/)(\d{1,2})/g); _bs_ver = RegExp.$2;
                } else if (search(_ua, 'samsungbrowser') > -1) {
                    _bs = 'samsungbrowser'; _ua.search(/(samsungbrowser\/)(\d{1,2})/g); _bs_ver = RegExp.$2;
                } else if (search(_ua, 'firefox') > -1) {
                    _bs = 'firefox'; _ua.search(/(firefox\/)(\d{1,2})/g); _bs_ver = RegExp.$2;
                } else if (search(_ua, ' edge') > -1) {
                    _bs = 'edge'; _ua.search(/(edge\/)(\d{1,2})/g); _bs_ver = RegExp.$2;
                } else if (search(_ua, ' edg/') > -1) {
                    _bs = 'edge'; _ua.search(/(edg\/)(\d{1,2})/g); _bs_ver = RegExp.$2;
                } else if (search(_ua, 'whale') > -1) {
                    _bs = 'whale'; _ua.search(/(whale\/)(\d{1,2})/g); _bs_ver = RegExp.$2;
                } else if (search(_ua, 'crios') > -1) {
                    _bs = 'chrome'; _ua.search(/(crios\/)(\d{1,2})/g); _bs_ver = RegExp.$2;
                } else if (search(_ua, 'opera') > -1) {
                    _bs = 'opera'; _ua.search(/(opera\/)(\d{1,2})/g); _bs_ver = RegExp.$2;
                } else if (search(_ua, 'chrome') > -1) {
                    _bs = 'chrome'; _ua.search(/(chrome\/)(\d{1,2})/g); _bs_ver = RegExp.$2;
                } else if (search(_ua, 'safari') > -1) {
                    _bs = 'safari'; _ua.search(/(version\/)(\d{1,2})/g); _bs_ver = RegExp.$2;
                }
                if (_bs == '') {
                    if (search(_ua, 'msie 6') >= 0) {
                        _bs_ver = '6';
                    } else if (search(_ua, 'msie 7') >= 0) {
                        _bs_ver = '7';
                    } else if (search(_ua, 'trident/4.0') >= 0) {
                        _bs_ver = '8';
                    } else if (search(_ua, 'trident/5.0') >= 0) {
                        _bs_ver = '9';
                    } else if (search(_ua, 'trident/6.0') >= 0) {
                        _bs_ver = '10';
                    } else if (search(_ua, 'trident/7.0') >= 0) {
                        _bs_ver = '11';
                    } else if (search(_ua, 'trident') >= 0) { _bs_ver = '8'; }
                    if (_bs_ver) _bs = 'msie';
                    if (_bs == '') {
                        if (search(_ua, 'mozilla') > -1) {
                            _bs = 'mozilla'; _ua.search(/(mozilla\/)(\d{1,2})/g); _bs_ver = RegExp.$2;
                        } else { _bs = _UK; }
                    }
                }
                if (_os == 'iPhone' || _os == 'iPod' || _os == 'iPad') {
                    var _sosv_1 = _av.split(')', 1);
                    if (_sosv_1[0] && _sosv_1[0] != 'undefined') {
                        var _sosv_2 = _sosv_1[0].split(';');
                        if (_sosv_2[2] && _sosv_2[2] != 'undefined') {
                            _sosv_2[2].search(/(\siPhone OS\s)(\d{1,2}_\d{1})/g);
                            if (RegExp.$2) _os_ver = RegExp.$2;
                        }
                    }
                }
                if (_os_ver) { _os_ver = _os_ver.replace('_', '.'); }
                var ret = { os: _os, os_ver: _os_ver, bs: _bs, bs_ver: _bs_ver, pl: _pl, ts: _ts, ipn_ver: _ipn_ver }
                return ret;
            }

            function analyst_init() {
                hpt_preproc_loaded = true;
                var _url = "";
                var _ref = "";
                var _cur_time = new Date();
                var _cur_stamp = Math.round((_cur_time.getTime() / 1000));
                var rnType = 0; //0:re,1:new
                var nav = nav_analyst();
                var smtgh = 0;
                var smtg_cKey = HPTGetCookie('smtg_cKey');
                var smtg_sKey = HPTGetCookie('smtg_sKey');
                if (!smtg_cKey) { createClientKey(); smtg_cKey = HPTGetCookie('smtg_cKey'); rnType = 1; }
                var inflow = 0;
                if (nav.bs == 'msie' || nav.bs == 'opera') var iHistory = parseInt(history.length) + 1;
                else var iHistory = parseInt(history.length);
                if (navigator.cookieEnabled) {
                    var fsID = HPTGetCookie('smtg_fsID') ? parseInt(HPTGetCookie('smtg_fsID')) : 0;
                    if (nav.bs == 'msie') {
                        var uqID = parseInt((document.uniqueID) ? document.uniqueID.replace(/ms__id/gi, '') : 0);
                        if (fsID == 0) {
                            HPTSetCookie('smtg_fsID', uqID, 't', '0'); inflow = 1;
                        } else { if (uqID <= fsID) { inflow = 1; } else { inflow = 0; } }
                    } else {
                        if (fsID == 0) {
                            HPTSetCookie('smtg_fsID', '1', 't', '0'); inflow = 1;
                        } else { if (iHistory == 1) { inflow = 1; } else { inflow = 0; } }
                    }
                } else { if (iHistory == 1) { inflow = 1; } else { inflow = 0; } }
                if (inflow == "1") {
                    try { _url = top.document.URL; } catch (E) { try { _url = parent.document.URL; } catch (E) { _url = document.URL; } }
                    try { _ref = top.document.referrer; } catch (E) { try { _ref = parent.document.referrer; } catch (E) { _ref = document.referrer; } }
                } else { _url = document.URL; _ref = document.referrer; }
                if (_url.indexOf("SMTG_REFER=") != -1) { _smt_ref = _url.substring(_url.indexOf("SMTG_REFER") + "SMTG_REFER".length + 1); if (_smt_ref) { _url = _smt_ref; } }
                smtgh = get_perf_nav();
                var is_ad = ad_uri(_url);
                if (!smtg_sKey) {
                    createSessionKey(is_ad);
                } else { refreshSessionKey(is_ad); }
                var smtg_sAd = HPTGetCookie('smtg_sAd');
                function f_Cookie(smtg_cKey, smtg_sKey, smtg_vTime, smtg_memid) { return { smtg_cKey: smtg_cKey, smtg_sKey: smtg_sKey, smtg_vTime: smtg_vTime, smtg_memid: smtg_memid }; }
                var smtgCookies = f_Cookie(HPTGetCookie('smtg_cKey'), HPTGetCookie('smtg_sKey'), HPTGetCookie('smtg_vTime'), HPTGetCookie('smtg_memid'));
                var smtg_memid = smtgCookies.smtg_memid;
                var smtg_sKey = smtgCookies.smtg_sKey;
                var gTime = (_cur_stamp - smtgCookies.smtg_vTime) < 0 ? 0 : (_cur_stamp - smtgCookies.smtg_vTime);
                var re_vTime = new Date();
                var re_tstamp = Math.round((re_vTime.getTime() / 1000));
                var re_svstamp = re_tstamp;
                HPTSetCookie('smtg_vTime', re_svstamp, 'd', '90');
                call_sync_cinfo(smtg_cKey, smtg_sKey, smtg_sAd, gTime, rnType, nav.os, nav.os_ver, nav.bs, nav.bs_ver, nav.pl, nav.ts, nav.ipn_ver, smtgh, smtgisp, _url, _ref);
            }
            function get_perf_nav() {
                try {
                    var perfEnt = performance.getEntriesByType("navigation");
                    var perf_type = '';
                    if (typeof perfEnt != 'undefined') {
                        for (var i = 0; i < perfEnt.length; i++) { if (typeof perfEnt[i].type != 'undefined') { perf_type = perfEnt[i].type; } }
                    } else { throw new Error("perfEnt not found"); }
                    if (!perf_type) {
                        perf_type = window.performance.navigation.type; //0:navigate, 1:reload,2:back_forward
                        if (perf_type == "undefined") {
                            throw new Error("perf_type undefined");
                        } else { if (perf_type == 0) perf_type = "navigate"; }
                    }
                    if (perf_type == "navigate") {
                        perf_type = 0;
                    } else { perf_type = 1; } //reload,back_forward
                } catch (e) { perf_type = -2; } //error
                return perf_type;
            }

            function smtg_dynamic_conversion() {
                if (typeof smtg_dynamic_info != 'undefined') {
                    smtg_trace_mode = smtg_dynamic_info._mode ? 'd_' + smtg_dynamic_info._mode : '';
                    smtg_memid = smtg_dynamic_info._memid ? smtg_dynamic_info._memid : '';
                    hpt_price = smtg_dynamic_info._total_price ? smtg_dynamic_info._total_price : '';
                    hpt_s_cate = smtg_dynamic_info._word ? smtg_dynamic_info._cate : '';
                    hpt_s_word = smtg_dynamic_info._word ? smtg_dynamic_info._word : '';
                    analyst();
                }
            }

            analyst_init();
        }
    }
}