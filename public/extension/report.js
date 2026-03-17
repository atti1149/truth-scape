//Cleaning function
const clean=(text="")=>
    text.replace(/\s+/g, " ").replace(/[\r\n]+/g, " ").trim();

//Base data
const title=document.title;
const rawText=document.body.innerText;
const text=clean(rawText);
const textLength=text.length;

const metaDescription=document.querySelector("meta[name='description']")?.content||"nonexistant"

const introText=text.slice(0, 1000);

const midTextStart  =Math.max(0, Math.floor(textLength / 2) - 500);
const midText=text.slice(midTextStart, midTextStart + 1000);

const endText=text.slice(Math.max(0, textLength - 750), textLength);

const headings=[...document.querySelectorAll('h1,h2')].map(h=>clean(h.innerText))
const url=window.location.href

//Summary object
const summary = {
  title: clean(title),
  description: clean(metaDescription),
  headings,
  introSampleText: introText,
  midSampleText: midText,
  endSampleText: endText,
  url,
};

//Fetch report
async function fetchReport(){
    try{
        const res=await fetch("http://localhost:3000/api/report",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(summary)
        });
        if (!res.ok) throw new Error("Server Error");

        return res.json()
    }catch(err){
        console.log("Fetch Failed", err)
        return { error: true, message: err.message };
    }
}


console.log("Content script loaded !!! ")
let panel,rateBtn,ratingElement,scoreElement,summaryElement,redFlagsElement

function createPanel(){
    if (panel) return

    panel=document.createElement("div")
    panel.id="main-panel"

    panel.innerHTML = `
    <h2><strong>Rate text</strong></h2>
    <button id="rate-btn">Rate</button>
    <div id="panel-content">
        <h3 id="rating"></h3>
        <h3 id="score"></h3>
        <h3 id="summary"></h3>
        <h3 id="red-flags"></h3>
    </div>
    `;

    document.body.appendChild(panel);
    rateBtn=document.getElementById('rate-btn');
    rateBtn.onclick=showData;
}
async function showData(){
    const report=await fetchReport();
    const classification=report.classification;
    const summary=report.summary
    const redFlags=report.redFlags
    const score=report.score
    ratingElement=document.getElementById('rating');
    scoreElement=document.getElementById('score')
    summaryElement=document.getElementById('summary');
    redFlagsElement=document.getElementById('red-flags')

    ratingElement.innerText=classification
    scoreElement.innerText=score
    summaryElement.innerText=summary
    redFlagsElement.innerText=redFlags

}
createPanel()