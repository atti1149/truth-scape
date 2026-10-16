(() => {

  // Prevent running in iframes
  if (window.top !== window.self) {
    console.log("Skipping iframe");
    return;
  }

  // Prevent duplicate panel injection
  if (document.getElementById("main-panel")) {
    console.log("Panel already exists, skipping");
    return;
  }

  //Cleaning function
  const clean=(text="")=>text.replace(/\s+/g, " ").replace(/[\r\n]+/g, " ").trim();

  //Base data
  const title="Essay about Solar System";
  const rawText=`The Solar System consists of the Sun and the objects that orbit it. The Sun is a star located at the center of the Solar System and contains more than 99% of its total mass. Earth is the third planet from the Sun and completes one orbit in about 365 days. Mars is often called the Red Planet because of iron oxide on its surface. Jupiter is the largest planet in the Solar System, while Saturn is famous for its extensive ring system. Mercury is the closest planet to the Sun and has no substantial atmosphere. Neptune is the farthest recognized planet from the Sun.

The Moon is Earth's only natural satellite and influences ocean tides through its gravitational pull. Astronauts first landed on the Moon during the Apollo 11 mission in 1969. The International Space Station continuously orbits Earth and serves as a laboratory for scientific research. Space telescopes, such as the Hubble Space Telescope, have helped scientists observe distant galaxies.

Venus is the coldest planet in the Solar System because it is farthest from the Sun. Pluto is currently classified as the largest planet in the Solar System. The Sun revolves around Earth once every 24 hours. Mars has three natural moons named Phobos, Deimos, and Atlas. Jupiter is smaller than Earth but appears larger because it is brighter. The asteroid belt lies beyond Neptune. Mercury has thick clouds made mostly of water vapor. Saturn is the only planet with rings. Uranus rotates on its side because it is perfectly spherical. Comets are made entirely of liquid metal. The Moon produces its own light instead of reflecting sunlight. Every planet in the Solar System has exactly two moons. The Hubble Space Telescope is located on the surface of Mars. Earth has two natural moons that orbit together. Neptune is the hottest planet because it is blue.

The first humans to land on the Moon did so in the year 1869. The Sun is a planet composed mainly of solid rock. Earth is the center of the entire universe.`; //document.body.innerText
  const text=clean(rawText); 
  const textLength=text.length;

  const metaDescription=document.querySelector("meta[name='description']")?.content||"nonexistant";

  const introText=text.slice(0, 1000);

  const midTextStart =Math.max(0, Math.floor(textLength / 2) - 500);
  const midText=text.slice(midTextStart, midTextStart + 1000);

  const endText=text.slice(Math.max(0, textLength - 750), textLength);

  const headings=[...document.querySelectorAll('h1,h2')].map(h=>clean(h.innerText));
  const url="en.wikipedia.org/wiki/Solar_System_and_Earth_facts";

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
  function getToken(){
      if (!localStorage.getItem('ssk')){
          const ssk=crypto.randomUUID()
          localStorage.setItem('ssk',ssk)
          return ssk
      }
      else{
          const ssk=localStorage.getItem('ssk')
          return ssk
      }
  }

  async function fetchReport(){
      const ssk=getToken()
      try{
          const res=await fetch("http://localhost:3000/api/wiki/report",{
              method:"POST",
              headers:{
                  "Content-Type":"application/json",
                  "X-AUTH-TOKEN":ssk
              },
              body:JSON.stringify(summary)
          });
          if (!res.ok) throw new Error("Server Error");

          return res.json();
      }catch(err){
          console.log("Fetch Failed", err);
          return { error: true, message: err.message };
      }
  }

  console.log("Content script loaded");
  let panel,rateBtn,ratingElement,scoreElement,summaryElement,redFlagsElement;

  function createPanel(){
      if (panel) return

      panel=document.createElement("div");
      panel.id="main-panel";

      panel.innerHTML = `
        <div id="header" spellcheck="false">
            <div class="grip" aria-hidden="true">
                <svg viewBox="0 0 16 16">
                    <circle cx="4" cy="4" r="1.2" />
                    <circle cx="12" cy="4" r="1.2" />
                    <circle cx="4" cy="12" r="1.2" />
                    <circle cx="12" cy="12" r="1.2" />
                </svg>
                <button id="minimize-btn" aria-label="Minimize">—</button>
            </div>
        </div>
        <button id="rate-btn">Rate</button>
        <div id="panel-content">
            <h3>Score: <span id="score"></span></h3>
            <h3>Rating: <span id="rating"></span></h3>
            <h3>Summary: <span id="summary"></span></h3>
            <h3>Red Flags: <span id="red-flags"></span></h3>
        </div>
      `;

      document.body.appendChild(panel);
      rateBtn=document.getElementById('rate-btn');
      rateBtn.onclick=showData;
  }

  let classification,summaryAI,redFlags,score
  let rateBtnStyle="block"
  async function showData(){
    rateBtnStyle="none"
    rateBtn.style.display=rateBtnStyle
    if (classification==null||summaryAI==null||redFlags==null||score==null){
        const report=await fetchReport();
        classification=report.classification;
        summaryAI=report.summary;
        redFlags=report.redFlags;
        score=report.score;
      }

    ratingElement=document.getElementById('rating');
    scoreElement=document.getElementById('score');
    summaryElement=document.getElementById('summary');
    redFlagsElement=document.getElementById('red-flags');

    if (score<51){
        ratingElement.style.color="red";
        scoreElement.style.color="red";
    }
    else if(score<80){
        ratingElement.style.color="yellow";
        scoreElement.style.color="yellow";
    }
    else if (score>=80){
        ratingElement.style.color="green";
        scoreElement.style.color="green";
    }
      summaryElement.innerText=summaryAI;
      redFlagsElement.innerText=redFlags;
      ratingElement.innerText=classification;

      summaryElement.classList.add("fade-in")
      redFlagsElement.classList.add("fade-in")
      ratingElement.classList.add("fade-in")
      for (let i=0; i<=score;i++){
        scoreElement.innerText=i;
        await new Promise(resolve => setTimeout(resolve, 1));
      }
  }

  createPanel();
  const minimizeBtn=document.getElementById("minimize-btn");
  const panelContent=document.getElementById("panel-content")
  minimizeBtn.onclick=()=>{
    const isHidden=panelContent.style.display==="none";
    if (isHidden){
        panelContent.style.display = "block";
        rateBtn.style.display = rateBtnStyle;
        minimizeBtn.innerText = "—";
    }
    else{
        panelContent.style.display="none"
        rateBtn.style.display="none";
        minimizeBtn.innerText="+"
    }
  }

  function makeDraggable(element,draggable) {
    let offsetX = 0;
    let offsetY = 0;
    let isDown = false;

    draggable.addEventListener("mousedown", (e) => {
      isDown = true;
      offsetX = e.clientX - element.offsetLeft;
      offsetY = e.clientY - element.offsetTop;
    });

    document.addEventListener("mouseup", () => {
      isDown = false;
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDown) return;

      element.style.left = (e.clientX - offsetX) + "px";
      element.style.top = (e.clientY - offsetY) + "px";
    });
  }
    makeDraggable(document.getElementById('main-panel'),document.getElementById('header'));

})();
