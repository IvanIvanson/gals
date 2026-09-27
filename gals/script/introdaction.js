const introdactionHTML = `
<div class="content-between align-center">
    <h1>Get started with GALS</h1>
    <button>Viev on GitHub</button>
</div>

<div><p>GALS is a powerful, feature-packed frontend toolkit. Build anything—from prototype to production—in minutes.</p>
</div>
<div class="inthisPage">
<h4>On this page</h4>
<hr>
<ul>
<li><a href="#start">Quick start</a></li>
<li><a href="#css">CSS</a></li>
<li><a href="#js">JS</a></li>
</ul>
</div>
<div class="quick-start">
    <h3><a name="start"></a>Quick start</h3>
    <p>Get started by including GALS’s production-ready CSS and JavaScript  without the need for any build steps.
    See it in practice with this <a href="#">GALS CodePen demo</a>.</p>
    <p>1. <strong>Create a new <span style="color:rgb(212, 38, 38);font-size:16px;">index.html</span> </strong> <strong>file in your project root</strong>. Include the
    <code style="color:rgb(212, 38, 38);">&#60;meta name="viewport"&#62;</code> tag as well for proper responsive behavior in mobile devices. Place the<span style="color:rgb(212, 38, 38);font-size:18px;"> &#60;link&#62; </span>  tag in the <span style="color:rgb(212, 38, 38);font-size:18px;">&#60;head&#62; </span>  for our CSS, and the <span style="color:rgb(212, 38, 38);font-size:18px;">&#60;script&#62; </span>  tag for our JavaScript bundle before the closing <span style="color:rgb(212, 38, 38);font-size:18px;">&#60;/body&#62;</span>.</p>
 
 <!-- copyblock -->   
    
     <div class="copy-block copy-block1">
        <textarea class="textarea" id="text1" rows="12" cols="35"></textarea>
    
        <code id="code1"> <pre>
    &#60;<span style="color:rgb(212, 38, 38);">!doctype html</span>&#62; 
    &#60;<span style="color:rgb(212, 38, 38);">html</span><span style="color:rgb(87, 68,225);"> lang="en"</span> &#62;
            
    &#60;<span style="color:rgb(212, 38, 38);">head</span>&#62;
&#60;<span style="color:rgb(212, 38, 38);">meta </span><span style="color:rgb(87, 68,225);">charset="utf-8"</span> &#62;
&#60;<span style="color:rgb(212, 38, 38);">meta </span><span style="color:rgb(87, 68,225);">name="viewport" content="width=device-width,initial-scale=1"</span>&#62;
    &#60;<span style="color:rgb(212, 38, 38);">title</span>&#62;Galsdemo&#60;/<span style="color:rgb(212, 38, 38);">title</span>&#62;
                    <!--  -->
        &#60;<span style="color:rgb(212, 38, 38);">link </span><span style="color:rgb(87, 68, 225);">href="./gals/gals.css"</span>&#62;
                    <!--  -->
    &#60;<span style="color:rgb(212, 38, 38);">/head</span>&#62;
                
        &#60;<span style="color:rgb(212, 38, 38);">body</span>&#62;
            &#60;<span style="color:rgb(212, 38, 38);">h1</span>&#62;Hello, world!&#60;<span style="color:rgb(212, 38, 38);">/h1</span> &#62;
                    <!--  -->
            &#60;<span style="color:rgb(212, 38, 38);">script </span><span
            style="color:rgb(87, 68, 225);">src="./gals/gals.js"</span>&#62;&#60;<span style="color:rgb(212, 38, 38);">/script</span>&#62;
        &#60;<span style="color:rgb(212, 38, 38);">/body</span>&#62;
                
    &#60;<span style="color:rgb(212, 38, 38);">/html</span>&#62;
        </pre>   
    </code>
        

        <button class="copy" id="copyBtn1" data-tooltip="Copy to clipboard"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard"
            viewBox="0 0 16 16">
            <path
                d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
            <path
                d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
        </svg></button>
       
    </div>
    <!--  -->
 <p>2.<a name="css"></a> <strong>CSS</strong>.</p>
                            <p>Copy-paste the stylesheet
                            <span style="color:rgb(212, 38, 38);font-size:18px;"><code>&#60;link&#62;</code></span> into your <span style="color:rgb(212, 38, 38);font-size:18px;"><code>&#60;head&#62;</code> 
                            </span> before all other stylesheets to load our CSS. To ensure that the GALS styles do not interrupt the styles thet you will define.
                        </p>
<div class="copy-block copy-block2">
        <textarea class="textarea" id="text2" rows="12" cols="35"></textarea>

    <code id="code2"><pre>
                                    <!--  -->
&#60;<span style="color:rgb(212, 38, 38);">link </span><span style="color:rgb(87, 68, 225);">href="./gals/gals.css"</span>&#62;
                                    <!--  -->
                       </pre>
                            </code>

    <button class="copy" id="copyBtn2" data-tooltip="Copy to clipboard"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
            fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
            <path
                d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
            <path
                d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
        </svg></button>
</div>
<!--  -->

 <!--  -->
 <p>3.<a name="js"></a> <strong>JS</strong>.</p>
                            <p>Place one of the following
                            <span style="color:rgb(212, 38, 38);font-size:18px;"><code >&#60;script&#62;</code></span>near the end of your pages, right before the closing<span style="color:rgb(212, 38, 38);font-size:18px;"><code>&#60;body&#62;</code> 
                            </span> tag, to enable them.
                        </p>
<div class="copy-block copy-block3">
        <textarea class="textarea" id="text3" rows="12" cols="35"></textarea>
    <code id="code3"><pre>
                                    <!--  -->
&#60;<span style="color:rgb(212, 38, 38);">script </span><span style="color:rgb(87, 68, 225);">src="./gals/gals.js"</span>&#62;
                                    <!--  -->
                       </pre>
                            </code>

    <button class="copy" id="copyBtn3" data-tooltip="Copy to clipboard"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
            fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
            <path
                d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
            <path
                d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
        </svg></button>
</div>
<!--  -->
</div>
`;

export default introdactionHTML;