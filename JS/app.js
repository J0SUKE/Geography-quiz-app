let quizChoices = document.querySelectorAll(".homepage .content ul li");
let quizSection = document.querySelector(".quiz-section");
let quizPropositions = quizSection.querySelectorAll(".propositions li");
let homepage = document.querySelector(".homepage");
let gameOver = document.querySelector(".game-over");
let currentQuiz; 
let progression=0;
let responseIndice;
let score = 0;
let maxQustions = 20;
let Allcountries; // tableau contenant 250 pays (apres la requete)
let max; // la longeur de Allcountries
let playing = false; 


  function setPropositions(quiz) // genere les propositions 
  {    
      quizSection.querySelector(".question img").src = "";
      document.querySelector(".quiz-section__content").classList.remove("disapear");      
      document.querySelector(".quiz-section__content").classList.add("apear");      

      let rand ;

      do {
          rand = Math.floor(Math.random() * max);
      } while (!Allcountries[rand].independent); // le pays choisi doit etre independant sinon problemes de drapeaux avec le pays qui le gère (exemple france et saint Martin)
      
      let currentCountry = Allcountries[rand]; // le pays sur lequel on pose la question 
      
      let sameRegionCoutry = Allcountries.filter(element=>element.subregion==currentCountry.subregion);
      let countriesProposed = [];
      countriesProposed.push(currentCountry);
      
    // on genere les propositions -----------------------------

      for (let i = 0; i <3; i++) // il me faut 3 pays dans la meme region que currenCountry
      {
        let otherCoutry;
        do {
          
          rand = Math.floor(Math.random() * sameRegionCoutry.length);
          otherCoutry=sameRegionCoutry[rand];
        } while (countriesProposed.includes(otherCoutry));

        countriesProposed.push(sameRegionCoutry[rand]);
      }

    // on genere les positions dans la liste de propositions -------------------------

      let positions = [];
      for (let i = 0; i < 4; i++) {
          do{
            rand = Math.floor(Math.random() * 4); // de 0 a 3
          }while(positions.includes(rand))
          positions.push(rand);
      }

      let propositions = {};

      if(currentQuiz=="drapeaux")
      {  
        quizSection.querySelector(".question img").src = currentCountry.flags.svg;
        
        for (let i = 0; i < 4; i++) {
          propositions[countriesProposed[i].translations.fra.common] = positions[i];
          quizPropositions[positions[i]].querySelector(".option") .textContent = countriesProposed[i].translations.fra.common;
        }
      }
      else // capitales 
      {
        quizSection.querySelector(".question span").textContent = currentCountry.translations.fra.common;
        
        for (let i = 0; i < 4; i++) {
          propositions[countriesProposed[i].capital[0]] = positions[i];
          quizPropositions[positions[i]].querySelector(".option") .textContent = countriesProposed[i].capital[0]
        }
      }

      // l'indice de la bonne reponse est dans positions[0] puisque currentCountry est ajoutéee en premier au tableau
      responseIndice=positions[0];
      playing=true;

  }

  function correction(correctRepIndice,userRepIndice) //applique les animations de correction aux propositions
  {
      playing=false; // le joueur ne paut pas jouer pendant la correction
    
      // l'ndice de la bonne reponse se trouve dans la variable globale responseIndice
      
      if(userRepIndice==correctRepIndice) // le joueur a entrer la bonne reponse
      {
          quizPropositions[userRepIndice].classList.add("correct");
          quizPropositions[userRepIndice].classList.add("true");
          
          score++;
      } 
      else // le joueur a faux 
      {
          quizPropositions[userRepIndice].classList.add("incorrect");
          quizPropositions[userRepIndice].classList.add("false");

          let props = [...quizPropositions];
          props.filter(element=>element==quizPropositions[correctRepIndice])[0].classList.add("correct");
      } 
      
      progression++;
    }
  
  function callGameOver() 
  {
    if(score>getBestScore(currentQuiz))
    {
      
      setBestScore(currentQuiz,score);
      document.querySelector(".game-over__best-score span").innerHTML = `${score} / 20`;
    }
    else
    {
      document.querySelector(".game-over__best-score span").innerHTML = `${getBestScore(currentQuiz)} / 20`;
    }
    
    
    quizSection.classList.add("section-disapear");
    document.querySelector(".game-over__score p span").innerHTML = `${score} / ${maxQustions}`;
    
    setTimeout(() => {

      quizSection.classList.remove("section-apear");

      setTimeout(() => {
        quizSection.classList.add("inactive");  
        gameOver.classList.remove("inactive");
        gameOver.classList.add("section-apear");
        
      }, 400);            
    }, 1500); // les timeout ont été définies de telle sorte à avoir les plus belles transitions entre les sections 
  }


  for (let i = 0; i < quizPropositions.length; i++) // on surveille sur quelle proposition le user a cliqué 
      {
        quizPropositions[i].addEventListener("click",()=>{
          if(playing)
          {
              correction(responseIndice,i); // l'element a l'indice i est celui sur lequel l'utlisateur a cliqué

              //-----------on rejoue ? ---------------

              if(progression<maxQustions) // oui
              {
                //--on fais disparaitre les propositions une fois que les animations ont été jouées 
                document.querySelector(".quiz-section__content").classList.remove("apear");
                document.querySelector(".quiz-section__content").classList.add("disapear");
                setTimeout(() => {
                  
                  //-------on gere la barre de progression-------------------

                  document.querySelector(".progression__bar").style.transform = `scaleX(${progression/maxQustions})`;
                  document.querySelector(".progression__status span").innerHTML = `${score}`;

                  resetPropositions(); // un timeout est necessaire avant de reset les propositions car entre temps les animations sont en cours 
                  setPropositions(currentQuiz);  
                }, 2200); // avec un timeout de 2200 les animations entre chaque questions s'enchainent parfaitement

            
              }
              else // non
              {
                
                callGameOver();
              }
          }
        })
        
      }


  function resetQuiz() // reinitialise le quiz (doit etre appelée apres chaque game over)
  {
        score = 0;
        progression=0;
        document.querySelector(".quiz-section__content").classList.remove("disapear");
        resetPropositions();
        document.querySelector(".progression__bar").style.transform = `scaleX(${0})`;
        document.querySelector(".progression__status span").innerHTML = `0`;
  }


  let gameOverBtns = document.querySelectorAll(".btns div"); // les boutons retry et home


  gameOverBtns.forEach(element => {
      element.addEventListener("click",()=>
      {        
        
        gameOver.classList.add("section-disapear");  
        gameOver.classList.remove("section-apear");
        
        setTimeout(() => {
              gameOver.classList.add("inactive");
              gameOver.classList.remove("section-disapear");
              resetQuiz();

              quizSection.classList.remove("section-disapear");

              if(element.className=="retry") // on rejoue 
              {
                quizSection.classList.add("section-apear");
                quizSection.classList.remove("inactive");  
                playing=true;
              }
              else // on retourne a l'acceuil 
              {
                setScoresInHomePage();
                homepage.classList.remove("inactive");  
                homepage.classList.add("section-apear");
                homepage.classList.remove("section-disapear");

                setTimeout(() => {
                  homepage.classList.remove("section-apear");
                }, 700);
              }
              
            }, 500);     
        
      })
  });
  

  function resetPropositions() {
    quizPropositions.forEach(element => {
        element.className = "";
    });
  }


  function quitGame() {
      resetQuiz();

      setScoresInHomePage();
      
      quizSection.classList.remove("section-apear");
      quizSection.classList.add("section-disapear");
      
    
      setTimeout(() => {
          quizSection.classList.add("inactive");  
          homepage.classList.remove("inactive");  
          homepage.classList.add("section-apear");
          homepage.classList.remove("section-disapear");
          
        }, 700);
  }

  document.querySelector(".quit").addEventListener("click",quitGame);

  function getBestScore(quiz)
  {
      let cookies = document.cookie.split("; ");

      if(quiz=="drapeaux")
      {
        let flagbest=cookies.find(row => row.includes("flagsBest")); 
        if(flagbest)
        {
            let elem = flagbest.split("=")[1];
            return parseInt(elem);  
        }
        else
        {
          return 0;
        }
      }
      else
      {
        let capitalbest = cookies.find(row => row.includes("capitalBest"));
        if(capitalbest)
        {
            let elem = capitalbest.split("=")[1];
            return parseInt(elem);
        }
        else
        {
          return 0;
        }
      }      
  }


  function setBestScore(quiz,bestScore)
  {
      if(quiz=="drapeaux")
      {
        document.cookie = `flagsBest=${bestScore}; expires=Tue, 19 Jan 2038 04:14:07 GMT`;
      }
      else
      {
        document.cookie = `capitalBest=${bestScore}; expires=Tue, 19 Jan 2038 04:14:07 GMT`;
      }
  }


  function setScoresInHomePage() {
    
    document.querySelector(".score[data-score=\"flags\"]").innerHTML = `${getBestScore("drapeaux")*5} %`;
    
    document.querySelector(".score[data-score=\"capitales\"]").innerHTML = `${getBestScore("capitales")*5} %`;
    
  }

  setScoresInHomePage();

  // on peut jouer une fois cette promesse terminée avec succes;

  fetch("https://restcountries.com/v3.1/all")
        .then((response)=>response.json())
        .then(data=>{
              Allcountries=data;
              max = Allcountries.length;
            })
        .then(()=>{
          document.querySelector(".loader-layer").classList.add("inactive");
          homepage.classList.remove("inactive");  
          
          homepage.classList.add("section-apear");  
          
          quizChoices.forEach(element => 
          {
              element.addEventListener("click",()=>
              {
                  homepage.classList.remove("section-apear");
                  homepage.classList.add("section-disapear");

                  setTimeout(() => 
                  {
                    homepage.classList.add("inactive");
                    homepage.classList.remove("section-disapear");
                    quizSection.classList.add("section-apear");
                    quizSection.classList.remove("inactive");                      
                      
                  }, 500);
                
                
                  if(element.dataset.quiz == "capitales")
                  {
                      currentQuiz="capitales";       
                      quizSection.querySelector(".question p").textContent = "Quelle est la capitale de ce pays";
                      quizSection.querySelector(".question img").classList.add("inactive");
                      quizSection.querySelector(".question span").classList.remove("inactive");
                  }
                  else
                  {
                      currentQuiz="drapeaux";
                      quizSection.querySelector(".question p").textContent = "A quel pays appartient ce drapeau";
                      quizSection.querySelector(".question img").classList.remove("inactive");
                      quizSection.querySelector(".question span").classList.add("inactive");
                  }

                  setPropositions(currentQuiz);
              })
          });
        });
