const countryData={
IN:{currency:"₹",locale:"en-IN"},US:{currency:"$",locale:"en-US"},GB:{currency:"£",locale:"en-GB"},
AE:{currency:"AED ",locale:"en-AE"},CA:{currency:"CA$",locale:"en-CA"},AU:{currency:"A$",locale:"en-AU"},
DE:{currency:"€",locale:"de-DE"},FR:{currency:"€",locale:"fr-FR"}
};
const translations={
en:{title:"All Your Daily Tools<br><span>In One Place</span>",text:"Fast, free and private — tools run directly in your browser.",search:"Search tools..."},
hi:{title:"आपके सभी Daily Tools<br><span>एक ही जगह</span>",text:"तेज़, मुफ़्त और निजी — tools आपके browser में चलते हैं।",search:"Tools खोजें..."}
};
let selectedCountry=localStorage.getItem("dt_country")||"IN", selectedLang=localStorage.getItem("dt_lang")||"en";
const $=id=>document.getElementById(id);
$("country").value=selectedCountry;$("language").value=selectedLang;$("year").textContent=new Date().getFullYear();
function applySettings(){const t=translations[selectedLang];$("heroTitle").innerHTML=t.title;$("heroText").textContent=t.text;$("search").placeholder=t.search;document.documentElement.lang=selectedLang;}
$("country").onchange=e=>{selectedCountry=e.target.value;localStorage.setItem("dt_country",selectedCountry);};
$("language").onchange=e=>{selectedLang=e.target.value;localStorage.setItem("dt_lang",selectedLang);applySettings();};
applySettings();
$("search").addEventListener("input",e=>{let v=e.target.value.toLowerCase();document.querySelectorAll(".tool-card").forEach(c=>c.style.display=c.dataset.name.includes(v)?"block":"none")});
function openTool(id){$("toolGrid").classList.add("hidden");$("workspace").classList.remove("hidden");document.querySelectorAll(".panel").forEach(p=>p.classList.add("hidden"));$("tool-"+id).classList.remove("hidden");window.scrollTo({top:0,behavior:"smooth"})}
function closeTool(){$("workspace").classList.add("hidden");$("toolGrid").classList.remove("hidden")}
let rImg=new Image();
$("resizeInput").addEventListener("change",e=>{let f=e.target.files[0];if(!f)return;rImg.src=URL.createObjectURL(f);rImg.onload=()=>{$("rw").value=rImg.width;$("rh").value=rImg.height;$("rPreview").src=rImg.src;$("rPreview").classList.remove("hidden")}});
$("rw").addEventListener("input",()=>{if($("keepRatio").checked&&rImg.width)$("rh").value=Math.round($("rw").value*rImg.height/rImg.width)});
$("rh").addEventListener("input",()=>{if($("keepRatio").checked&&rImg.height)$("rw").value=Math.round($("rh").value*rImg.width/rImg.height)});
function doResize(){let w=+$("rw").value,h=+$("rh").value;if(!rImg.src||w<1||h<1)return alert("Choose an image and enter valid dimensions.");let c=$("rCanvas");c.width=w;c.height=h;c.getContext("2d").drawImage(rImg,0,0,w,h);c.toBlob(b=>downloadBlob(b,"resized.png"),"image/png")}
let cImg=new Image(),cFile;
$("cQuality").addEventListener("input",e=>$("qVal").textContent=e.target.value);
$("cInput").addEventListener("change",e=>{cFile=e.target.files[0];if(!cFile)return;cImg.src=URL.createObjectURL(cFile);cImg.onload=()=>{$("cPreview").src=cImg.src;$("cPreview").classList.remove("hidden");$("cStats").textContent=`Original: ${(cFile.size/1024).toFixed(1)} KB`}});
function doCompress(){if(!cFile)return alert("Choose an image first.");let q=+$("cQuality").value/100,c=document.createElement("canvas");c.width=cImg.width;c.height=cImg.height;c.getContext("2d").drawImage(cImg,0,0);c.toBlob(b=>{$("cStats").textContent+=` → Compressed: ${(b.size/1024).toFixed(1)} KB`;downloadBlob(b,"compressed.jpg")},"image/jpeg",q)}
function downloadBlob(blob,name){let a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function calcAge(){let s=$("dob").value;if(!s)return;let dob=new Date(s+"T00:00:00"),now=new Date();if(dob>now)return $("ageResult").textContent="Date of birth cannot be in the future.";let y=now.getFullYear()-dob.getFullYear(),m=now.getMonth()-dob.getMonth(),d=now.getDate()-dob.getDate();if(d<0){m--;d+=new Date(now.getFullYear(),now.getMonth(),0).getDate()}if(m<0){y--;m+=12}$("ageResult").innerHTML=`You are <b>${y} Years, ${m} Months, ${d} Days</b> old.`}
function calcEMI(){let P=+$("loan").value,annual=+$("rate").value,n=+$("tenure").value;if(P<=0||n<=0)return $("emiResult").textContent="Enter a valid loan amount and tenure.";let cur=countryData[selectedCountry].currency;if(annual===0){let emi=P/n,total=P;$("emiResult").innerHTML=`Monthly EMI: <b>${cur}${emi.toFixed(2)}</b><br>Total Interest: ${cur}0.00<br>Total Payable: ${cur}${total.toFixed(2)}`;return}let r=annual/1200,emi=P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1),total=emi*n,interest=total-P;$("emiResult").innerHTML=`Monthly EMI: <b>${cur}${emi.toFixed(2)}</b><br>Total Interest: ${cur}${interest.toFixed(2)}<br>Total Payable: ${cur}${total.toFixed(2)}`}
